import { EntryHashB64, HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../../host-fn';
export declare type CreateLinkFn = (args: {
    base: EntryHashB64;
    target: EntryHashB64;
    tag: any;
}) => Promise<HeaderHashB64>;
export declare const create_link: HostFn<CreateLinkFn>;
