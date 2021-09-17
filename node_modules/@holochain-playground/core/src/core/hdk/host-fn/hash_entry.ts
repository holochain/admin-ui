import { Entry, EntryHashB64 } from '@holochain-open-dev/core-types';
import { hashEntry } from '../../cell/utils';
import { HostFn, HostFnWorkspace } from '../host-fn';

export type HashEntryFn = (args: { content: any }) => Promise<EntryHashB64>;

// Creates a new Create header and its entry in the source chain
export const hash_entry: HostFn<HashEntryFn> = (
  worskpace: HostFnWorkspace
): HashEntryFn => async (args): Promise<EntryHashB64> => {
  const entry: Entry = { entry_type: 'App', content: args.content };
  return hashEntry(entry);
};
