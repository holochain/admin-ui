import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const produce_dht_ops: (worskpace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type ProduceDhtOpsWorkflow = Workflow<void, void>;
export declare function produce_dht_ops_task(): ProduceDhtOpsWorkflow;
