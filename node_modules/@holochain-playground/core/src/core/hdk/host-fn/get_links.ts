import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { GetLinksOptions, GetOptions, GetStrategy } from '../../../types';
import { Link } from '../../cell/cascade/types';
import { HostFn, HostFnWorkspace } from '../host-fn';

export type GetLinksFn = (
  base_address: EntryHashB64,
  options?: GetLinksOptions
) => Promise<Link[] | undefined>;

// Creates a new Create header and its entry in the source chain
export const get_links: HostFn<GetLinksFn> = (
  workspace: HostFnWorkspace
): GetLinksFn => async (base_address, options): Promise<Link[]> => {
  if (!base_address) throw new Error(`Cannot get with undefined hash`);

  options = options || { strategy: GetStrategy.Contents };

  return workspace.cascade.dht_get_links(base_address, options);
};
