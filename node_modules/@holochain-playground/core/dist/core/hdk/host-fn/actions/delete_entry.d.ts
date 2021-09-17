import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type DeleteEntryFn = (deletes_address: HeaderHashB64) => Promise<HeaderHashB64>;
export declare const delete_entry: HostFn<DeleteEntryFn>;
