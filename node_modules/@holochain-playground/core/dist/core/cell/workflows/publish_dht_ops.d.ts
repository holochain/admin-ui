import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const publish_dht_ops: (workspace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type PublishDhtOpsWorkflow = Workflow<void, void>;
export declare function publish_dht_ops_task(): PublishDhtOpsWorkflow;
