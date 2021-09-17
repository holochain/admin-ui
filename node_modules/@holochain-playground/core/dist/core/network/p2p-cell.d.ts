import { AgentPubKeyB64, AnyDhtHashB64, CapSecret, CellId, DHTOp, Dictionary, EntryHashB64 } from '@holochain-open-dev/core-types';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { GetLinksOptions, GetOptions } from '../../types';
import { Cell } from '../cell';
import { GetElementResponse, GetEntryResponse, GetLinksResponse } from '../cell/cascade/types';
import { Connection } from './connection';
import { DhtArc } from './dht_arc';
import { SimpleBloomMod } from './gossip/bloom';
import { GossipData } from './gossip/types';
import { Network } from './network';
import { NetworkRequestInfo } from './network-request';
export declare type P2pCellState = {
    neighbors: AgentPubKeyB64[];
    farKnownPeers: AgentPubKeyB64[];
    badAgents: AgentPubKeyB64[];
    redundancyFactor: number;
    neighborNumber: number;
};
export declare class P2pCell {
    cell: Cell;
    protected network: Network;
    farKnownPeers: AgentPubKeyB64[];
    storageArc: DhtArc;
    neighborNumber: number;
    redundancyFactor: number;
    _gossipLoop: SimpleBloomMod;
    networkRequestsExecutor: MiddlewareExecutor<NetworkRequestInfo<any, any>>;
    neighborConnections: Dictionary<Connection | undefined>;
    constructor(state: P2pCellState, cell: Cell, network: Network);
    getState(): P2pCellState;
    get cellId(): CellId;
    get badAgents(): string[];
    /** P2p actions */
    join(containerCell: Cell): Promise<void>;
    leave(): Promise<void>;
    publish(dht_hash: AnyDhtHashB64, ops: Dictionary<DHTOp>): Promise<void>;
    get(dht_hash: AnyDhtHashB64, options: GetOptions): Promise<GetElementResponse | GetEntryResponse | undefined>;
    get_links(base_address: EntryHashB64, options: GetLinksOptions): Promise<GetLinksResponse[]>;
    call_remote(agent: AgentPubKeyB64, zome: string, fnName: string, cap: CapSecret | undefined, payload: any): Promise<any>;
    /** Neighbor handling */
    get neighbors(): Array<AgentPubKeyB64>;
    connectWith(peer: Cell): Promise<Connection>;
    check_agent_valid(peer: Cell): Promise<void>;
    handleOpenNeighborConnection(from: Cell, connection: Connection): void;
    handleCloseNeighborConnection(from: Cell): void;
    openNeighborConnection(withPeer: Cell): Promise<Connection>;
    closeNeighborConnection(withPeer: AgentPubKeyB64): void;
    syncNeighbors(): Promise<void>;
    shouldWeHold(dhtOpBasis: AnyDhtHashB64): boolean;
    /** Gossip */
    outgoing_gossip(to_agent: AgentPubKeyB64, gossips: GossipData, warrant?: boolean): Promise<void>;
    /** Executors */
    private _executeNetworkRequest;
}
