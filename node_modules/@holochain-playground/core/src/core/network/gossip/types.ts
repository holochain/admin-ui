import {
  AgentPubKeyB64,
  DHTOp,
  Dictionary,
  ValidationReceipt,
} from '@holochain-open-dev/core-types';
import { DhtArc } from '../dht_arc';
import { BadAction } from '../utils';

// From https://github.com/holochain/holochain/blob/develop/crates/kitsune_p2p/kitsune_p2p/src/types/gossip.rs

export interface GossipData {
  validated_dht_ops: Dictionary<GossipDhtOpData>;
  neighbors: Array<AgentPubKeyB64>;
  badActions: Array<BadAction>;
}

export interface GossipDhtOpData {
  op: DHTOp;
  validation_receipts: ValidationReceipt[];
}
