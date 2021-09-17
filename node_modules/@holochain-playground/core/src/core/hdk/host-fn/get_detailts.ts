import { Details, AnyDhtHashB64 } from '@holochain-open-dev/core-types';
import { GetOptions, GetStrategy } from '../../../types';
import { Cell } from '../../cell';
import { HostFn, HostFnWorkspace } from '../host-fn';

export type GetDetailsFn = (
  args: AnyDhtHashB64,
  options?: GetOptions
) => Promise<Details | undefined>;

// Creates a new Create header and its entry in the source chain
export const get_details: HostFn<GetDetailsFn> = (
  workspace: HostFnWorkspace
): GetDetailsFn => async (hash, options): Promise<Details | undefined> => {
  if (!hash) throw new Error(`Cannot get with undefined hash`);

  options = options || { strategy: GetStrategy.Contents };

  return workspace.cascade.dht_get_details(hash, options);
};
