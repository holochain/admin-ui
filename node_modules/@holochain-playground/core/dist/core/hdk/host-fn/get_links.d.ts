import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { GetLinksOptions } from '../../../types';
import { Link } from '../../cell/cascade/types';
import { HostFn } from '../host-fn';
export declare type GetLinksFn = (base_address: EntryHashB64, options?: GetLinksOptions) => Promise<Link[] | undefined>;
export declare const get_links: HostFn<GetLinksFn>;
