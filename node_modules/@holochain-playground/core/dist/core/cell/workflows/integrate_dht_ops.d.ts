import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const integrate_dht_ops: (worskpace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type IntegrateDhtOpsWorkflow = Workflow<void, void>;
export declare function integrate_dht_ops_task(): IntegrateDhtOpsWorkflow;
