import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const validation_receipt: (workspace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type ValidationReceiptWorkflow = Workflow<void, void>;
export declare function validation_receipt_task(): ValidationReceiptWorkflow;
