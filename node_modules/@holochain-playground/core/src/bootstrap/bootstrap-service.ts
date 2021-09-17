import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  CellId,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { Cell } from '../core/cell';
import {
  getClosestNeighbors,
  getFarthestNeighbors,
} from '../core/network/utils';

export class BootstrapService {
  cells: Dictionary<Dictionary<Cell>> = {};

  announceCell(cellId: CellId, cell: Cell) {
    const dnaHash = cellId[0];
    const agentPubKey = cellId[1];
    if (!this.cells[dnaHash]) this.cells[dnaHash] = {};
    this.cells[dnaHash][agentPubKey] = cell;
  }

  getNeighborhood(
    dnaHash: DnaHashB64,
    basis_dht_hash: AnyDhtHashB64,
    numNeighbors: number,
    filteredAgents: AgentPubKeyB64[] = []
  ): Cell[] {
    const cells = Object.keys(this.cells[dnaHash]).filter(
      cellPubKey => !filteredAgents.includes(cellPubKey)
    );

    const neighborsKeys = getClosestNeighbors(
      cells,
      basis_dht_hash,
      numNeighbors
    );

    return neighborsKeys.map(pubKey => this.cells[dnaHash][pubKey]);
  }

  getFarKnownPeers(
    dnaHash: DnaHashB64,
    agentPubKey: AgentPubKeyB64,
    filteredAgents: AgentPubKeyB64[] = []
  ): Cell[] {
    const cells = Object.keys(this.cells[dnaHash]).filter(
      peerPubKey =>
        peerPubKey !== agentPubKey && !filteredAgents.includes(peerPubKey)
    );

    const farthestKeys = getFarthestNeighbors(cells, agentPubKey);

    return farthestKeys.map(pubKey => this.cells[dnaHash][pubKey]);
  }
}
