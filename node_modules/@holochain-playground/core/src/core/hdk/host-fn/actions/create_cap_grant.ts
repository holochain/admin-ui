import {
  Entry,
  ZomeCallCapGrant,
  AgentPubKeyB64,
  CapSecret,
  HeaderHashB64,
} from '@holochain-open-dev/core-types';
import { HostFn, HostFnWorkspace } from '../../host-fn';
import { common_create } from './common/create';

export type CreateCapGrantFn = (cap_grant: ZomeCallCapGrant) => Promise<HeaderHashB64>;

// Creates a new Create header and its entry in the source chain
export const create_cap_grant: HostFn<CreateCapGrantFn> = (
  worskpace: HostFnWorkspace
): CreateCapGrantFn => async (cap_grant: ZomeCallCapGrant): Promise<HeaderHashB64> => {
  if (
    (cap_grant.access as {
      Assigned: {
        secret: CapSecret;
        assignees: AgentPubKeyB64[];
      };
    }).Assigned.assignees.find(a => !!a && typeof a !== 'string')
  ) {
    throw new Error('Tried to assign a capability to an invalid agent');
  }

  const entry: Entry = { entry_type: 'CapGrant', content: cap_grant };

  return common_create(worskpace, entry, 'CapGrant');
};
