import { EntryHashB64, HeaderHashB64 } from '@holochain-open-dev/core-types';
import { P2pCell } from '../../..';
import { GetLinksOptions, GetOptions } from '../../../types';
import { CellState } from '../state';
import { GetEntryResponse, GetElementResponse, GetLinksResponse } from './types';
export declare class Authority {
    protected state: CellState;
    protected p2p: P2pCell;
    constructor(state: CellState, p2p: P2pCell);
    handle_get_entry(entry_hash: EntryHashB64, options: GetOptions): Promise<GetEntryResponse | undefined>;
    handle_get_element(header_hash: HeaderHashB64, options: GetOptions): Promise<GetElementResponse | undefined>;
    handle_get_links(base_address: EntryHashB64, options: GetLinksOptions): Promise<GetLinksResponse>;
}
