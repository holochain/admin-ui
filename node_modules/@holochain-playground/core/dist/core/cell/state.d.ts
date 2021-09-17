import { AgentPubKeyB64, DHTOp, Dictionary, DnaHashB64, HeaderHashB64, DhtOpHashB64, Metadata, ValidationReceipt, AnyDhtHashB64 } from '@holochain-open-dev/core-types';
import { DhtArc } from '../network/dht_arc';
export interface CellState {
    dnaHash: DnaHashB64;
    agentPubKey: AgentPubKeyB64;
    sourceChain: Array<HeaderHashB64>;
    CAS: Dictionary<any>;
    metadata: Metadata;
    integratedDHTOps: Dictionary<IntegratedDhtOpsValue>;
    authoredDHTOps: Dictionary<AuthoredDhtOpsValue>;
    integrationLimbo: Dictionary<IntegrationLimboValue>;
    validationLimbo: Dictionary<ValidationLimboValue>;
    validationReceipts: Dictionary<Dictionary<ValidationReceipt>>;
    badAgents: AgentPubKeyB64[];
}
export interface IntegratedDhtOpsValue {
    op: DHTOp;
    validation_status: ValidationStatus;
    when_integrated: number;
    send_receipt: Boolean;
}
export interface IntegrationLimboValue {
    op: DHTOp;
    validation_status: ValidationStatus;
    send_receipt: Boolean;
}
export declare enum ValidationStatus {
    Valid = 0,
    Rejected = 1,
    Abandoned = 2
}
export interface AuthoredDhtOpsValue {
    op: DHTOp;
    receipt_count: number;
    last_publish_time: number | undefined;
}
export declare enum ValidationLimboStatus {
    Pending = 0,
    AwaitingSysDeps = 1,
    SysValidated = 2,
    AwaitingAppDeps = 3
}
export interface ValidationLimboValue {
    status: ValidationLimboStatus;
    op: DHTOp;
    basis: AnyDhtHashB64;
    time_added: number;
    last_try: number | undefined;
    num_tries: number;
    from_agent: AgentPubKeyB64 | undefined;
    send_receipt: Boolean;
}
export declare function query_dht_ops(integratedDHTOps: Dictionary<IntegratedDhtOpsValue>, from: number | undefined, to: number | undefined, dht_arc: DhtArc): Array<DhtOpHashB64>;
