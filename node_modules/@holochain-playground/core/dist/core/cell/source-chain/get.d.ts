import { Element, HeaderHashB64, SignedHeaderHashed } from '@holochain-open-dev/core-types';
import { CellState } from '../state';
/**
 * Returns the header hashes which don't have their DHTOps in the authoredDHTOps DB
 */
export declare function getNewHeaders(state: CellState): Array<HeaderHashB64>;
export declare function getAllAuthoredHeaders(state: CellState): Array<SignedHeaderHashed>;
export declare function getSourceChainElements(state: CellState, fromIndex: number, toIndex: number): Element[];
export declare function getSourceChainElement(state: CellState, index: number): Element | undefined;
