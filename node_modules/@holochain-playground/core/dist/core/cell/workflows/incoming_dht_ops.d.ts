import { Dictionary, DHTOp, AgentPubKeyB64 } from '@holochain-open-dev/core-types';
import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const incoming_dht_ops: (dhtOps: Dictionary<DHTOp>, request_validation_receipt: boolean, from_agent: AgentPubKeyB64 | undefined) => (workspace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type IncomingDhtOpsWorkflow = Workflow<{
    from_agent: AgentPubKeyB64;
    ops: Dictionary<DHTOp>;
}, void>;
export declare function incoming_dht_ops_task(from_agent: AgentPubKeyB64, request_validation_receipt: boolean, ops: Dictionary<DHTOp>): IncomingDhtOpsWorkflow;
