import { HeaderHashB64, Entry, EntryType } from '@holochain-open-dev/core-types';
import { HostFnWorkspace } from '../../../host-fn';
export declare function common_update(worskpace: HostFnWorkspace, original_header_hash: HeaderHashB64, entry: Entry, entry_type: EntryType): Promise<HeaderHashB64>;
