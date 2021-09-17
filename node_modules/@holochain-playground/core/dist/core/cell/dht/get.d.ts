import { Dictionary, DhtOpHashB64, LinkMetaVal, EntryDhtStatus, EntryDetails, SignedHeaderHashed, Update, Delete, ValidationReceipt, EntryHashB64, HeaderHashB64 } from '@holochain-open-dev/core-types';
import { GetLinksResponse, Link } from '../cascade/types';
import { CellState, ValidationLimboStatus, ValidationLimboValue, IntegrationLimboValue, IntegratedDhtOpsValue } from '../state';
export declare function getValidationLimboDhtOps(state: CellState, statuses: ValidationLimboStatus[]): Dictionary<ValidationLimboValue>;
export declare const getValidationReceipts: (dhtOpHash: DhtOpHashB64) => (state: CellState) => ValidationReceipt[];
export declare function pullAllIntegrationLimboDhtOps(state: CellState): Dictionary<IntegrationLimboValue>;
export declare function getHeadersForEntry(state: CellState, entryHash: EntryHashB64): SignedHeaderHashed[];
export declare function getEntryDhtStatus(state: CellState, entryHash: EntryHashB64): EntryDhtStatus | undefined;
export declare function getEntryDetails(state: CellState, entry_hash: EntryHashB64): EntryDetails;
export declare function getHeaderModifiers(state: CellState, headerHash: HeaderHashB64): {
    updates: SignedHeaderHashed<Update>[];
    deletes: SignedHeaderHashed<Delete>[];
};
export declare function getAllHeldEntries(state: CellState): EntryHashB64[];
export declare function getAllHeldHeaders(state: CellState): HeaderHashB64[];
export declare function getAllAuthoredEntries(state: CellState): EntryHashB64[];
export declare function isHoldingEntry(state: CellState, entryHash: EntryHashB64): boolean;
export declare function isHoldingElement(state: CellState, headerHash: HeaderHashB64): boolean;
export declare function isHoldingDhtOp(state: CellState, dhtOpHash: DhtOpHashB64): boolean;
export interface EntryDHTInfo {
    details: EntryDetails;
    links: LinkMetaVal[];
}
export declare function getDhtShard(state: CellState): Dictionary<EntryDHTInfo>;
export declare function getLinksForEntry(state: CellState, entryHash: EntryHashB64): GetLinksResponse;
export declare function getCreateLinksForEntry(state: CellState, entryHash: EntryHashB64): LinkMetaVal[];
export declare function getRemovesOnLinkAdd(state: CellState, link_add_hash: HeaderHashB64): HeaderHashB64[];
export declare function getLiveLinks(getLinksResponses: Array<GetLinksResponse>): Array<Link>;
export declare function computeDhtStatus(allHeadersForEntry: SignedHeaderHashed[]): {
    entry_dht_status: EntryDhtStatus;
    rejected_headers: SignedHeaderHashed[];
};
export declare function hasDhtOpBeenProcessed(state: CellState, dhtOpHash: DhtOpHashB64): boolean;
export declare function getIntegratedDhtOpsWithoutReceipt(state: CellState): Dictionary<IntegratedDhtOpsValue>;
