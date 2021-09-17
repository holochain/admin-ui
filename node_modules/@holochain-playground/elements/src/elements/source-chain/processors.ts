import {
  Create,
  Entry,
  NewEntryHeader,
  SignedHeaderHashed,
} from '@holochain-open-dev/core-types';
import { Cell, getEntryTypeString } from '@holochain-playground/core';

export function sourceChainNodes(cell: Cell) {
  if (!cell) return [];

  const nodes = [];
  const state = cell._state;

  const headersHashes = state.sourceChain;
  for (const headerHash of headersHashes) {
    const header: SignedHeaderHashed = state.CAS[headerHash];

    nodes.push({
      data: {
        id: headerHash,
        data: header,
        label: header.header.content.type,
      },
      classes: ['header', header.header.content.type],
    });

    if ((header.header.content as Create).prev_header) {
      const previousHeaderHash = (header.header.content as Create).prev_header;
      nodes.push({
        data: {
          id: `${headerHash}->${previousHeaderHash}`,
          source: headerHash,
          target: previousHeaderHash,
        },
        classes: ['embedded-reference'],
      });
    }
  }

  for (const headerHash of headersHashes) {
    const strHeaderHash = headerHash;
    const header: SignedHeaderHashed = state.CAS[strHeaderHash];

    if ((header.header.content as NewEntryHeader).entry_hash) {
      const newEntryHeader = header.header.content as NewEntryHeader;
      const entryHash = newEntryHeader.entry_hash;
      const entryNodeId = `${strHeaderHash}:${entryHash}`;

      const entry: Entry = state.CAS[entryHash];

      const entryType: string = getEntryTypeString(
        cell,
        newEntryHeader.entry_type
      );

      nodes.push({
        data: {
          id: entryNodeId,
          data: entry,
          label: entryType,
        },
        classes: [entryType, 'entry'],
      });
      nodes.push({
        data: {
          id: `${strHeaderHash}->${entryNodeId}`,
          source: strHeaderHash,
          target: entryNodeId,
        },
        classes: ['embedded-reference'],
      });
    }
  }

  return nodes;
}
