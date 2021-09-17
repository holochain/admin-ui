import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  AppEntryType,
  CellId,
  DHTOp,
  DHTOpType,
  Entry,
  EntryHashB64,
  EntryType,
  NewEntryHeader,
} from '@holochain-open-dev/core-types';
import { hash, HashType } from '../../processors/hash';
import { Cell } from './cell';

export function hashEntry(entry: Entry): EntryHashB64 {
  if (entry.entry_type === 'Agent') return entry.content;
  return hash(entry.content, HashType.ENTRY);
}

export function getAppEntryType(
  entryType: EntryType
): AppEntryType | undefined {
  if ((entryType as { App: AppEntryType }).App)
    return (entryType as { App: AppEntryType }).App;
  return undefined;
}

export function getEntryTypeString(cell: Cell, entryType: EntryType): string {
  const appEntryType = getAppEntryType(entryType);

  if (appEntryType) {
    const dna = cell.getSimulatedDna();
    return dna.zomes[appEntryType.zome_id].entry_defs[appEntryType.id].id;
  }

  return entryType as string;
}

export function getDHTOpBasis(dhtOp: DHTOp): AnyDhtHashB64 {
  switch (dhtOp.type) {
    case DHTOpType.StoreElement:
      return dhtOp.header.header.hash;
    case DHTOpType.StoreEntry:
      return dhtOp.header.header.content.entry_hash;
    case DHTOpType.RegisterUpdatedContent:
      return dhtOp.header.header.content.original_entry_address;
    case DHTOpType.RegisterUpdatedElement:
      return dhtOp.header.header.content.original_header_address;
    case DHTOpType.RegisterAgentActivity:
      return dhtOp.header.header.content.author;
    case DHTOpType.RegisterAddLink:
      return dhtOp.header.header.content.base_address;
    case DHTOpType.RegisterRemoveLink:
      return dhtOp.header.header.content.base_address;
    case DHTOpType.RegisterDeletedBy:
      return dhtOp.header.header.content.deletes_address;
    case DHTOpType.RegisterDeletedEntryHeader:
      return dhtOp.header.header.content.deletes_entry_address;
    default:
      return (undefined as unknown) as AnyDhtHashB64;
  }
}
