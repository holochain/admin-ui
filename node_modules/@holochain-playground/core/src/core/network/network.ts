import {
  AgentPubKeyB64,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { BootstrapService } from '../../bootstrap/bootstrap-service';
import { Cell } from '../cell/cell';
import { Conductor } from '../conductor';
import { P2pCell, P2pCellState } from '../network/p2p-cell';
import { KitsuneP2p } from './kitsune_p2p';
import { NetworkRequest } from './network-request';

export interface NetworkState {
  // P2pCellState by dna hash / agentPubKey
  p2pCellsState: Dictionary<Dictionary<P2pCellState>>;
}

export class Network {
  // P2pCells contained in this conductor
  p2pCells: Dictionary<Dictionary<P2pCell>>;
  kitsune: KitsuneP2p;

  constructor(
    state: NetworkState,
    public conductor: Conductor,
    public bootstrapService: BootstrapService
  ) {
    this.p2pCells = {};
    for (const [dnaHash, p2pState] of Object.entries(state.p2pCellsState)) {
      if (!this.p2pCells[dnaHash]) this.p2pCells[dnaHash];
      for (const [agentPubKey, p2pCellState] of Object.entries(p2pState)) {
        this.p2pCells[dnaHash][agentPubKey] = new P2pCell(
          p2pCellState,
          conductor.getCell(dnaHash, agentPubKey) as Cell,
          this
        );
      }
    }

    this.kitsune = new KitsuneP2p(this);
  }

  getState(): NetworkState {
    const p2pCellsState: Dictionary<Dictionary<P2pCellState>> = {};

    for (const [dnaHash, dnaP2pCells] of Object.entries(this.p2pCells)) {
      if (!p2pCellsState[dnaHash]) p2pCellsState[dnaHash] = {};

      for (const [agentPubKey, p2pCell] of Object.entries(dnaP2pCells)) {
        p2pCellsState[dnaHash][agentPubKey] = p2pCell.getState();
      }
    }

    return {
      p2pCellsState,
    };
  }

  getAllP2pCells(): P2pCell[] {
    const nestedCells = Object.values(this.p2pCells).map(dnaCells =>
      Object.values(dnaCells)
    );
    return ([] as P2pCell[]).concat(...nestedCells);
  }

  createP2pCell(cell: Cell): P2pCell {
    const cellId = cell.cellId;
    const dnaHash = cellId[0];

    const state: P2pCellState = {
      neighbors: [],
      farKnownPeers: [],
      redundancyFactor: 3,
      neighborNumber: 5,
      badAgents: [],
    };

    const p2pCell = new P2pCell(state, cell, this);

    if (!this.p2pCells[dnaHash]) this.p2pCells[dnaHash] = {};
    this.p2pCells[dnaHash][cellId[1]] = p2pCell;

    return p2pCell;
  }

  public sendRequest<T>(
    dna: DnaHashB64,
    fromAgent: AgentPubKeyB64,
    toAgent: AgentPubKeyB64,
    request: NetworkRequest<T>
  ): Promise<T> {
    const localCell =
      this.conductor.cells[dna] && this.conductor.cells[dna][toAgent];

    if (localCell) return request(localCell);

    return request(this.bootstrapService.cells[dna][toAgent]);
  }
}
