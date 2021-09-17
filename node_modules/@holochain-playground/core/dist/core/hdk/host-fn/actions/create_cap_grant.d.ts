import { ZomeCallCapGrant, HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type CreateCapGrantFn = (cap_grant: ZomeCallCapGrant) => Promise<HeaderHashB64>;
export declare const create_cap_grant: HostFn<CreateCapGrantFn>;
