import {
  DHTOp,
  getEntry,
  DHTOpType,
  HeaderType,
  ChainStatus,
  LinkMetaKey,
  LinkMetaVal,
  SysMetaVal,
  EntryDhtStatus,
  Header,
  SignedHeaderHashed,
  NewEntryHeader,
  ValidationReceipt,
  DhtOpHashB64,
  HeaderHashB64,
  EntryHashB64,
  AnyDhtHashB64,
} from '@holochain-open-dev/core-types';
import { isEqual } from 'lodash-es';
import {
  ValidationLimboValue,
  CellState,
  IntegrationLimboValue,
  IntegratedDhtOpsValue,
} from '../state';

import { getHeadersForEntry } from './get';

export const putValidationLimboValue = (
  dhtOpHash: DhtOpHashB64,
  validationLimboValue: ValidationLimboValue
) => (state: CellState) => {
  state.validationLimbo[dhtOpHash] = validationLimboValue;
};

export const putValidationReceipt = (
  dhtOpHash: DhtOpHashB64,
  validationReceipt: ValidationReceipt
) => (state: CellState) => {
  if (!state.validationReceipts[dhtOpHash])
    state.validationReceipts[dhtOpHash] = {};

  state.validationReceipts[dhtOpHash][
    validationReceipt.validator
  ] = validationReceipt;
};

export const deleteValidationLimboValue = (dhtOpHash: DhtOpHashB64) => (
  state: CellState
) => {
  delete state.validationLimbo[dhtOpHash];
};

export const putIntegrationLimboValue = (
  dhtOpHash: DhtOpHashB64,
  integrationLimboValue: IntegrationLimboValue
) => (state: CellState) => {
  state.integrationLimbo[dhtOpHash] = integrationLimboValue;
};

export const putDhtOpData = (dhtOp: DHTOp) => (state: CellState) => {
  const headerHash = dhtOp.header.header.hash;
  state.CAS[headerHash] = dhtOp.header;

  const entry = getEntry(dhtOp);

  if (entry) {
    state.CAS[
      (dhtOp.header.header.content as NewEntryHeader).entry_hash
    ] = entry;
  }
};

export const putDhtOpMetadata = (dhtOp: DHTOp) => (state: CellState) => {
  const headerHash = dhtOp.header.header.hash;

  if (dhtOp.type === DHTOpType.StoreElement) {
    state.metadata.misc_meta[headerHash] = 'StoreElement';
  } else if (dhtOp.type === DHTOpType.StoreEntry) {
    const entryHash = dhtOp.header.header.content.entry_hash;

    if (dhtOp.header.header.content.type === HeaderType.Update) {
      register_header_on_basis(headerHash, dhtOp.header)(state);
      register_header_on_basis(entryHash, dhtOp.header)(state);
    }

    register_header_on_basis(entryHash, dhtOp.header)(state);
    update_entry_dht_status(entryHash)(state);
  } else if (dhtOp.type === DHTOpType.RegisterAgentActivity) {
    state.metadata.misc_meta[headerHash] = {
      ChainItem: dhtOp.header.header.content.timestamp,
    };

    state.metadata.misc_meta[dhtOp.header.header.content.author] = {
      ChainStatus: ChainStatus.Valid,
    };
  } else if (
    dhtOp.type === DHTOpType.RegisterUpdatedContent ||
    dhtOp.type === DHTOpType.RegisterUpdatedElement
  ) {
    register_header_on_basis(
      dhtOp.header.header.content.original_header_address,
      dhtOp.header
    )(state);
    register_header_on_basis(
      dhtOp.header.header.content.original_entry_address,
      dhtOp.header
    )(state);
    update_entry_dht_status(dhtOp.header.header.content.original_entry_address)(
      state
    );
  } else if (
    dhtOp.type === DHTOpType.RegisterDeletedBy ||
    dhtOp.type === DHTOpType.RegisterDeletedEntryHeader
  ) {
    register_header_on_basis(
      dhtOp.header.header.content.deletes_address,
      dhtOp.header
    )(state);
    register_header_on_basis(
      dhtOp.header.header.content.deletes_entry_address,
      dhtOp.header
    )(state);

    update_entry_dht_status(dhtOp.header.header.content.deletes_entry_address)(
      state
    );
  } else if (dhtOp.type === DHTOpType.RegisterAddLink) {
    const key: LinkMetaKey = {
      base: dhtOp.header.header.content.base_address,
      header_hash: headerHash,
      tag: dhtOp.header.header.content.tag,
      zome_id: dhtOp.header.header.content.zome_id,
    };
    const value: LinkMetaVal = {
      link_add_hash: headerHash,
      tag: dhtOp.header.header.content.tag,
      target: dhtOp.header.header.content.target_address,
      timestamp: dhtOp.header.header.content.timestamp,
      zome_id: dhtOp.header.header.content.zome_id,
    };
    state.metadata.link_meta.push({ key, value });
  } else if (dhtOp.type === DHTOpType.RegisterRemoveLink) {
    const val: SysMetaVal = {
      DeleteLink: headerHash,
    };

    putSystemMetadata(dhtOp.header.header.content.link_add_address, val)(state);
  }
};

function is_header_alive(state: CellState, headerHash: HeaderHashB64): boolean {
  const dhtHeaders = state.metadata.system_meta[headerHash];
  if (dhtHeaders) {
    const isHeaderDeleted = !!dhtHeaders.find(
      metaVal =>
        (metaVal as {
          Delete: HeaderHashB64;
        }).Delete
    );
    return !isHeaderDeleted;
  }
  return true;
}

const update_entry_dht_status = (entryHash: EntryHashB64) => (
  state: CellState
) => {
  const headers = getHeadersForEntry(state, entryHash);

  const entryIsAlive = headers.some(header =>
    is_header_alive(state, header.header.hash)
  );

  state.metadata.misc_meta[entryHash] = {
    EntryStatus: entryIsAlive ? EntryDhtStatus.Live : EntryDhtStatus.Dead,
  };
};

export const register_header_on_basis = (
  basis: AnyDhtHashB64,
  header: SignedHeaderHashed
) => (state: CellState) => {
  let value: SysMetaVal | undefined;
  const headerType = header.header.content.type;
  if (headerType === HeaderType.Create) {
    value = { NewEntry: header.header.hash };
  } else if (headerType === HeaderType.Update) {
    value = { Update: header.header.hash };
  } else if (headerType === HeaderType.Delete) {
    value = { Delete: header.header.hash };
  }

  if (value) {
    putSystemMetadata(basis, value)(state);
  }
};

export const putSystemMetadata = (basis: AnyDhtHashB64, value: SysMetaVal) => (
  state: CellState
) => {
  if (!state.metadata.system_meta[basis]) {
    state.metadata.system_meta[basis] = [];
  }

  if (!state.metadata.system_meta[basis].find(v => isEqual(v, value))) {
    state.metadata.system_meta[basis].push(value);
  }
};

export const putDhtOpToIntegrated = (
  dhtOpHash: DhtOpHashB64,
  integratedValue: IntegratedDhtOpsValue
) => (state: CellState) => {
  state.integratedDHTOps[dhtOpHash] = integratedValue;
};
