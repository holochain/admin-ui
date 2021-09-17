import { AgentPubKeyB64, AnyDhtHashB64, DHTOp, ValidationReceipt } from '@holochain-open-dev/core-types';
import { CellState } from '../cell';
export declare function getClosestNeighbors(peers: AgentPubKeyB64[], targetHash: AnyDhtHashB64, numNeighbors: number): AgentPubKeyB64[];
export declare function getFarthestNeighbors(peers: AgentPubKeyB64[], targetHash: AnyDhtHashB64): AgentPubKeyB64[];
export interface BadAction {
    badAgents: AgentPubKeyB64[];
    op: DHTOp;
    receipts: ValidationReceipt[];
}
export declare function getBadActions(state: CellState): Array<BadAction>;
export declare function getBadAgents(state: CellState): AgentPubKeyB64[];
