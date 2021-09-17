import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type CreateEntryFn = (args: {
    content: any;
    entry_def_id: string;
}) => Promise<HeaderHashB64>;
export declare const create_entry: HostFn<CreateEntryFn>;
