import { Entry, EntryType, SignedHeaderHashed, Create, Delete, Update, CreateLink, DeleteLink, EntryHashB64 } from '@holochain-open-dev/core-types';
import { ValidationStatus } from '..';
export interface GetEntryResponse {
    entry: Entry;
    entry_type: EntryType;
    live_headers: SignedHeaderHashed<Create>[];
    deletes: SignedHeaderHashed<Delete>[];
    updates: SignedHeaderHashed<Update>[];
}
export interface GetElementResponse {
    signed_header: SignedHeaderHashed;
    maybe_entry: Entry | undefined;
    validation_status: ValidationStatus;
    deletes: SignedHeaderHashed<Delete>[];
    updates: SignedHeaderHashed<Update>[];
}
export declare type GetResult = GetElementResponse | GetEntryResponse;
export interface GetLinksResponse {
    link_adds: SignedHeaderHashed<CreateLink>[];
    link_removes: SignedHeaderHashed<DeleteLink>[];
}
export interface Link {
    base: EntryHashB64;
    target: EntryHashB64;
    tag: any;
}
