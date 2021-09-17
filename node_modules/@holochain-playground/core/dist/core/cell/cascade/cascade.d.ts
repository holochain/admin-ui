import { AnyDhtHashB64, Details, Element, ElementDetails, Entry, EntryDetails, EntryHashB64, HeaderHashB64, SignedHeaderHashed } from '@holochain-open-dev/core-types';
import { GetLinksOptions, GetOptions } from '../../../types';
import { P2pCell } from '../../network/p2p-cell';
import { CellState } from '../state';
import { Link } from './types';
export declare class Cascade {
    protected state: CellState;
    protected p2p: P2pCell;
    constructor(state: CellState, p2p: P2pCell);
    retrieve_header(hash: HeaderHashB64, options: GetOptions): Promise<SignedHeaderHashed | undefined>;
    retrieve_entry(hash: EntryHashB64, options: GetOptions): Promise<Entry | undefined>;
    dht_get(hash: AnyDhtHashB64, options: GetOptions): Promise<Element | undefined>;
    dht_get_details(hash: AnyDhtHashB64, options: GetOptions): Promise<Details | undefined>;
    dht_get_links(base_address: EntryHashB64, options: GetLinksOptions): Promise<Link[]>;
    getEntryDetails(entryHash: EntryHashB64, options: GetOptions): Promise<EntryDetails | undefined>;
    getHeaderDetails(headerHash: HeaderHashB64, options: GetOptions): Promise<ElementDetails | undefined>;
}
