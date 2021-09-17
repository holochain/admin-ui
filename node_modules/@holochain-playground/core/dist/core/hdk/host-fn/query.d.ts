import { Element } from '@holochain-open-dev/core-types';
import { QueryFilter } from '../../../types';
import { HostFn } from '../host-fn';
export declare type QueryFn = (filter: QueryFilter) => Promise<Array<Element>>;
export declare const query: HostFn<QueryFn>;
