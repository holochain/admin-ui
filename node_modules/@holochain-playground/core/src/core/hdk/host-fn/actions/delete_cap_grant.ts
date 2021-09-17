import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { HostFn, HostFnWorkspace } from '../../host-fn';
import { common_delete } from './common/delete';

export type DeleteCapGrantFn = (
  deletes_address: HeaderHashB64
) => Promise<HeaderHashB64>;

// Creates a new Create header and its entry in the source chain
export const delete_cap_grant: HostFn<DeleteCapGrantFn> = (
  worskpace: HostFnWorkspace
): DeleteCapGrantFn => async (deletes_address): Promise<HeaderHashB64> => {
  return common_delete(worskpace, deletes_address);
};
