import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type UpdateEntryFn = (original_header_address: HeaderHashB64, newEntry: {
    content: any;
    entry_def_id: string;
}) => Promise<HeaderHashB64>;
export declare const update_entry: HostFn<UpdateEntryFn>;
