import {
  Entry,
  EntryType,
  HeaderHashB64,
  Element,
} from '@holochain-open-dev/core-types';
import {
  buildCreate,
  buildShh,
} from '../../../../cell/source-chain/builder-headers';
import { putElement } from '../../../../cell/source-chain/put';
import { HostFnWorkspace } from '../../../host-fn';

export function common_create(
  worskpace: HostFnWorkspace,
  entry: Entry,
  entry_type: EntryType
): HeaderHashB64 {
  const create = buildCreate(worskpace.state, entry, entry_type);

  const element: Element = {
    signed_header: buildShh(create),
    entry,
  };
  putElement(element)(worskpace.state);
  
  return element.signed_header.header.hash;
}
