import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  CapSecret,
  CellId,
  DHTOp,
  Dictionary,
  Element,
  EntryHashB64,
  ValidationReceipt,
  ValidationStatus,
} from '@holochain-open-dev/core-types';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { hash, HashType, location } from '../../processors/hash';
import { GetLinksOptions, GetOptions } from '../../types';
import { Cell, getSourceChainElements, isHoldingDhtOp } from '../cell';
import {
  GetElementResponse,
  GetEntryResponse,
  GetLinksResponse,
} from '../cell/cascade/types';
import { Connection } from './connection';
import { DhtArc } from './dht_arc';
import { SimpleBloomMod } from './gossip/bloom';
import { GossipData } from './gossip/types';
import { Network } from './network';
import {
  NetworkRequestInfo,
  NetworkRequest,
  NetworkRequestType,
} from './network-request';
import { getBadAgents } from './utils';

export type P2pCellState = {
  neighbors: AgentPubKeyB64[];
  farKnownPeers: AgentPubKeyB64[];
  badAgents: AgentPubKeyB64[];
  redundancyFactor: number;
  neighborNumber: number;
};

// From: https://github.com/holochain/holochain/blob/develop/crates/holochain_p2p/src/lib.rs
export class P2pCell {
  farKnownPeers: AgentPubKeyB64[];

  storageArc: DhtArc;
  neighborNumber: number;
  redundancyFactor = 3;

  _gossipLoop!: SimpleBloomMod;

  networkRequestsExecutor = new MiddlewareExecutor<
    NetworkRequestInfo<any, any>
  >();

  neighborConnections: Dictionary<Connection | undefined> = {};

  constructor(
    state: P2pCellState,
    public cell: Cell,
    protected network: Network
  ) {
    this.farKnownPeers = state.farKnownPeers;
    this.redundancyFactor = state.redundancyFactor;
    this.neighborNumber = state.neighborNumber;

    // TODO: try to connect with already known neighbors

    this.storageArc = {
      center_loc: location(this.cellId[1]),
      half_length: Math.pow(2, 33),
    };
  }

  getState(): P2pCellState {
    return {
      badAgents: this.badAgents,
      neighbors: this.neighbors,
      farKnownPeers: this.farKnownPeers,
      redundancyFactor: this.redundancyFactor,
      neighborNumber: this.neighborNumber,
    };
  }

  get cellId(): CellId {
    return this.cell.cellId;
  }

  get badAgents() {
    if (
      this.cell.conductor.badAgent &&
      this.cell.conductor.badAgent.config.pretend_invalid_elements_are_valid
    )
      return [];

    return this.cell._state.badAgents;
  }

  /** P2p actions */

  async join(containerCell: Cell): Promise<void> {
    this.network.bootstrapService.announceCell(this.cellId, containerCell);
    this._gossipLoop = new SimpleBloomMod(this);

    await this.syncNeighbors();
  }

  async leave(): Promise<void> {}

  async publish(dht_hash: AnyDhtHashB64, ops: Dictionary<DHTOp>): Promise<void> {
    await this.network.kitsune.rpc_multi(
      this.cellId[0],
      this.cellId[1],
      dht_hash,
      this.redundancyFactor,
      this.badAgents,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.PUBLISH_REQUEST,
          { dhtOps: ops },
          (cell: Cell) => cell.handle_publish(this.cellId[1], true, ops)
        )
    );
  }

  async get(
    dht_hash: AnyDhtHashB64,
    options: GetOptions
  ): Promise<GetElementResponse | GetEntryResponse | undefined> {
    const gets = await this.network.kitsune.rpc_multi(
      this.cellId[0],
      this.cellId[1],
      dht_hash,
      1, // TODO: what about this?
      this.badAgents,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.GET_REQUEST,
          { hash: dht_hash, options },
          (cell: Cell) => cell.handle_get(dht_hash, options)
        )
    );

    return gets.find(get => !!get);
  }

  async get_links(
    base_address: EntryHashB64,
    options: GetLinksOptions
  ): Promise<GetLinksResponse[]> {
    return this.network.kitsune.rpc_multi(
      this.cellId[0],
      this.cellId[1],
      base_address,
      1, // TODO: what about this?
      this.badAgents,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.GET_REQUEST,
          { hash: base_address, options },
          (cell: Cell) => cell.handle_get_links(base_address, options)
        )
    );
  }

  async call_remote(
    agent: AgentPubKeyB64,
    zome: string,
    fnName: string,
    cap: CapSecret | undefined,
    payload: any
  ): Promise<any> {
    return this.network.kitsune.rpc_single(
      this.cellId[0],
      this.cellId[1],
      agent,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          NetworkRequestType.CALL_REMOTE,
          {},
          (cell: Cell) =>
            cell.handle_call_remote(this.cellId[1], zome, fnName, cap, payload)
        )
    );
  }

  /** Neighbor handling */

  public get neighbors(): Array<AgentPubKeyB64> {
    return Object.keys(this.neighborConnections);
  }

  async connectWith(peer: Cell): Promise<Connection> {
    if (this.neighborConnections[peer.agentPubKey])
      return this.neighborConnections[peer.agentPubKey] as Connection;

    return new Connection(this.cell, peer);
  }

  async check_agent_valid(peer: Cell): Promise<void> {
    const peerFirst3Elements = getSourceChainElements(peer._state, 0, 3);

    try {
      await this.cell.handle_check_agent(peerFirst3Elements);
    } catch (e) {
      if (!this.cell._state.badAgents.includes(peer.agentPubKey))
        this.cell._state.badAgents.push(peer.agentPubKey);

      throw new Error('Invalid agent');
    }
  }

  handleOpenNeighborConnection(from: Cell, connection: Connection) {
    this.neighborConnections[from.agentPubKey] = connection;
  }

  handleCloseNeighborConnection(from: Cell) {
    this.neighborConnections[from.agentPubKey] = undefined;
    delete this.neighborConnections[from.agentPubKey];
    this.syncNeighbors();
  }

  async openNeighborConnection(withPeer: Cell): Promise<Connection> {
    if (!this.neighborConnections[withPeer.agentPubKey]) {
      // Try to connect: can fail due to validation
      // TODO: uncomment
      /*       await this._executeNetworkRequest(
        withPeer,
        NetworkRequestType.CONNECT,
        {},
        peer =>
          Promise.all([
            this.check_agent_valid(withPeer),
            withPeer.p2p.check_agent_valid(this.cell),
          ])
      );
 */
      const connection = await this.connectWith(withPeer);
      this.neighborConnections[withPeer.agentPubKey] = connection;

      withPeer.p2p.handleOpenNeighborConnection(this.cell, connection);
    }
    return this.neighborConnections[withPeer.agentPubKey] as Connection;
  }

  closeNeighborConnection(withPeer: AgentPubKeyB64) {
    if (this.neighborConnections[withPeer]) {
      const connection = this.neighborConnections[withPeer] as Connection;
      connection.close();
      this.neighborConnections[withPeer] = undefined;
      delete this.neighborConnections[withPeer];

      connection
        .getPeer(this.cellId[1])
        .p2p.handleCloseNeighborConnection(this.cell);
    }
  }

  async syncNeighbors() {
    const dnaHash = this.cellId[0];
    const agentPubKey = this.cellId[1];

    const badAgents = this.badAgents;

    for (const badAgent of badAgents) {
      if (this.neighborConnections[badAgent]) {
        this.closeNeighborConnection(badAgent);
      }
    }

    this.farKnownPeers = this.network.bootstrapService
      .getFarKnownPeers(dnaHash, agentPubKey, badAgents)
      .map(p => p.agentPubKey);

    const neighbors = this.network.bootstrapService
      .getNeighborhood(dnaHash, agentPubKey, this.neighborNumber, badAgents)
      .filter(cell => cell.agentPubKey != agentPubKey);

    const newNeighbors = neighbors.filter(
      cell => !this.neighbors.includes(cell.agentPubKey)
    );

    const neighborsToForget = this.neighbors.filter(
      n => !neighbors.find(c => c.agentPubKey === n)
    );

    neighborsToForget.forEach(n => this.closeNeighborConnection(n));

    const promises = newNeighbors.map(async neighbor => {
      try {
        await this.openNeighborConnection(neighbor);
      } catch (e) {
        // Couldn't open connection
      }
    });

    await Promise.all(promises);

    if (Object.keys(this.neighborConnections).length < this.neighborNumber) {
      setTimeout(() => this.syncNeighbors(), 400);
    }
  }

  // TODO: fix when sharding is implemented
  shouldWeHold(dhtOpBasis: AnyDhtHashB64): boolean {
    const neighbors = this.network.bootstrapService.getNeighborhood(
      this.cellId[0],
      dhtOpBasis,
      this.redundancyFactor + 1,
      this.badAgents
    );

    const index = neighbors.findIndex(
      cell => cell.agentPubKey === this.cellId[1]
    );
    return index >= 0 && index < this.redundancyFactor;
  }

  /** Gossip */

  public async outgoing_gossip(
    to_agent: AgentPubKeyB64,
    gossips: GossipData,
    warrant: boolean = false
  ): Promise<void> {
    // TODO: remove peer discovery?
    await this.network.kitsune.rpc_single(
      this.cellId[0],
      this.cellId[1],
      to_agent,
      (cell: Cell) =>
        this._executeNetworkRequest(
          cell,
          warrant ? NetworkRequestType.WARRANT : NetworkRequestType.GOSSIP,
          {},
          (cell: Cell) => cell.handle_gossip(this.cellId[1], gossips)
        )
    );
  }

  /** Executors */

  private async _executeNetworkRequest<R, T extends NetworkRequestType, D>(
    toCell: Cell,
    type: T,
    details: D,
    request: NetworkRequest<R>
  ): Promise<R> {
    const networkRequest: NetworkRequestInfo<T, D> = {
      fromAgent: this.cellId[1],
      toAgent: toCell.agentPubKey,
      dnaHash: this.cellId[0],
      type,
      details,
    };

    const connection = await this.connectWith(toCell);

    const result = await this.networkRequestsExecutor.execute(
      () => connection.sendRequest(this.cellId[1], request),
      networkRequest
    );

    return result;
  }
}
