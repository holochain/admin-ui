import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';
import { Workflow, Workspace } from './workflows';
/**
 * Calls the zome function of the cell DNA
 * This can only be called in the simulated mode: we can assume that cell.simulatedDna exists
 */
export declare const callZomeFn: (zomeName: string, fnName: string, payload: any, provenance: AgentPubKeyB64, cap: string) => (workspace: Workspace) => Promise<{
    result: any;
    triggers: Array<Workflow<any, any>>;
}>;
export declare type CallZomeFnWorkflow = Workflow<{
    zome: string;
    fnName: string;
    payload: any;
}, any>;
export declare function call_zome_fn_workflow(zome: string, fnName: string, payload: any, provenance: AgentPubKeyB64): CallZomeFnWorkflow;
