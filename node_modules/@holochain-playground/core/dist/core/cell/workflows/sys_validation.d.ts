import { Workflow, WorkflowReturn, Workspace } from './workflows';
import { AnyDhtHashB64, Element, Entry, Header, NewEntryHeader, Signature } from '@holochain-open-dev/core-types';
import { P2pCell } from '../../network/p2p-cell';
export declare const sys_validation: (worskpace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type SysValidationWorkflow = Workflow<void, void>;
export declare function sys_validation_task(): SysValidationWorkflow;
export declare function sys_validate_element(element: Element, workspace: Workspace, network: P2pCell): Promise<void | DepsMissing>;
export declare function counterfeit_check(signature: Signature, header: Header): Promise<Boolean>;
export interface DepsMissing {
    depsHashes: Array<AnyDhtHashB64>;
}
export declare function store_element(header: Header, workspace: Workspace, network: P2pCell): Promise<void | DepsMissing>;
export declare function store_entry(header: NewEntryHeader, entry: Entry, workspace: Workspace, network: P2pCell): Promise<void | DepsMissing>;
