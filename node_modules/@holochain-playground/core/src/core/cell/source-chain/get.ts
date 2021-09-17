import {
  Element,
  HeaderHashB64,
  NewEntryHeader,
  SignedHeaderHashed,
} from '@holochain-open-dev/core-types';
import { CellState } from '../state';

/**
 * Returns the header hashes which don't have their DHTOps in the authoredDHTOps DB
 */
export function getNewHeaders(state: CellState): Array<HeaderHashB64> {
  const dhtOps = Object.values(state.authoredDHTOps);
  const headerHashesAlreadyPublished = dhtOps.map(
    dhtOp => dhtOp.op.header.header.hash
  );
  return state.sourceChain.filter(
    headerHash => !headerHashesAlreadyPublished.includes(headerHash)
  );
}

export function getAllAuthoredHeaders(
  state: CellState
): Array<SignedHeaderHashed> {
  return state.sourceChain.map(headerHash => state.CAS[headerHash]);
}

export function getSourceChainElements(
  state: CellState,
  fromIndex: number,
  toIndex: number
): Element[] {
  const elements: Element[] = [];

  for (let i = fromIndex; i < toIndex; i++) {
    const element = getSourceChainElement(state, i);
    if (element) elements.push(element);
  }

  return elements;
}

export function getSourceChainElement(
  state: CellState,
  index: number
): Element | undefined {
  const headerHash = state.sourceChain[index];
  const signed_header: SignedHeaderHashed = state.CAS[headerHash];

  let entry = undefined;
  const entryHash = (signed_header.header.content as NewEntryHeader).entry_hash;
  if (entryHash) {
    entry = state.CAS[entryHash];
  }

  return {
    entry,
    signed_header,
  };
}
