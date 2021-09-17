import { AgentPubKeyB64, AnyDhtHashB64, CellId, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
import { Cell } from '../core/cell';
export declare class BootstrapService {
    cells: Dictionary<Dictionary<Cell>>;
    announceCell(cellId: CellId, cell: Cell): void;
    getNeighborhood(dnaHash: DnaHashB64, basis_dht_hash: AnyDhtHashB64, numNeighbors: number, filteredAgents?: AgentPubKeyB64[]): Cell[];
    getFarKnownPeers(dnaHash: DnaHashB64, agentPubKey: AgentPubKeyB64, filteredAgents?: AgentPubKeyB64[]): Cell[];
}
