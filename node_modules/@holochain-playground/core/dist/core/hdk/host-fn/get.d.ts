import { AnyDhtHashB64, Element } from '@holochain-open-dev/core-types';
import { GetOptions } from '../../../types';
import { HostFn } from '../host-fn';
export declare type GetFn = (args: AnyDhtHashB64, options?: GetOptions) => Promise<Element | undefined>;
export declare const get: HostFn<GetFn>;
