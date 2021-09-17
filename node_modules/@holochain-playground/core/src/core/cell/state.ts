import {
  AgentPubKeyB64,
  DHTOp,
  Dictionary,
  DnaHashB64,
  HeaderHashB64,
  DhtOpHashB64,
  Metadata,
  ValidationReceipt,
  AnyDhtHashB64,
} from '@holochain-open-dev/core-types';
import { location } from '../../processors/hash';
import { contains, DhtArc } from '../network/dht_arc';

export interface CellState {
  dnaHash: DnaHashB64;
  agentPubKey: AgentPubKeyB64;
  sourceChain: Array<HeaderHashB64>;
  CAS: Dictionary<any>;
  metadata: Metadata; // For the moment only DHT shard
  integratedDHTOps: Dictionary<IntegratedDhtOpsValue>; // Key is the hash of the DHT op
  authoredDHTOps: Dictionary<AuthoredDhtOpsValue>; // Key is the hash of the DHT op
  integrationLimbo: Dictionary<IntegrationLimboValue>; // Key is the hash of the DHT op
  validationLimbo: Dictionary<ValidationLimboValue>; // Key is the hash of the DHT op
  validationReceipts: Dictionary<Dictionary<ValidationReceipt>>; // Segmented by dhtOpHash/authorOfReceipt
  badAgents: AgentPubKeyB64[];
}

export interface IntegratedDhtOpsValue {
  op: DHTOp;
  validation_status: ValidationStatus;
  when_integrated: number;
  /// Send a receipt to this author.
  send_receipt: Boolean;
}

export interface IntegrationLimboValue {
  op: DHTOp;
  validation_status: ValidationStatus;
  /// Send a receipt to this author.
  send_receipt: Boolean;
}

export enum ValidationStatus {
  Valid,
  Rejected,
  Abandoned,
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/state/dht_op_integration.rs
export interface AuthoredDhtOpsValue {
  op: DHTOp;
  receipt_count: number;
  last_publish_time: number | undefined;
}

export enum ValidationLimboStatus {
  Pending,
  AwaitingSysDeps,
  SysValidated,
  AwaitingAppDeps,
}

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/state/validation_db.rs#L24
export interface ValidationLimboValue {
  status: ValidationLimboStatus;
  op: DHTOp;
  basis: AnyDhtHashB64;
  time_added: number;
  last_try: number | undefined;
  num_tries: number;
  from_agent: AgentPubKeyB64 | undefined;
  /// Send a receipt to this author.
  send_receipt: Boolean;
}

export function query_dht_ops(
  integratedDHTOps: Dictionary<IntegratedDhtOpsValue>,
  from: number | undefined,
  to: number | undefined,
  dht_arc: DhtArc
): Array<DhtOpHashB64> {
  const isDhtOpsInFilter = ([dhtOpHash, dhtOpValue]: [
    DhtOpHashB64,
    IntegratedDhtOpsValue
  ]) => {
    if (from && dhtOpValue.when_integrated < from) return false;
    if (to && dhtOpValue.when_integrated > to) return false;
    if (dht_arc && !contains(dht_arc, location(dhtOpHash))) return false;
  };

  const ops = Object.entries(integratedDHTOps).filter(isDhtOpsInFilter);
  return ops.map(op => op[0]);
}
