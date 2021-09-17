import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type DeleteCapGrantFn = (deletes_address: HeaderHashB64) => Promise<HeaderHashB64>;
export declare const delete_cap_grant: HostFn<DeleteCapGrantFn>;
