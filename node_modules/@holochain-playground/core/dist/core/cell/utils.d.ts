import { AnyDhtHashB64, AppEntryType, DHTOp, Entry, EntryHashB64, EntryType } from '@holochain-open-dev/core-types';
import { Cell } from './cell';
export declare function hashEntry(entry: Entry): EntryHashB64;
export declare function getAppEntryType(entryType: EntryType): AppEntryType | undefined;
export declare function getEntryTypeString(cell: Cell, entryType: EntryType): string;
export declare function getDHTOpBasis(dhtOp: DHTOp): AnyDhtHashB64;
