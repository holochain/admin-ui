import { AgentPubKeyB64, CellId, DnaHashB64 } from '@holochain-open-dev/core-types';
import { Workflow, WorkflowReturn, Workspace } from './workflows';
export declare const genesis: (agentId: AgentPubKeyB64, dnaHash: DnaHashB64, membrane_proof: any) => (worskpace: Workspace) => Promise<WorkflowReturn<void>>;
export declare type GenesisWorkflow = Workflow<{
    cellId: CellId;
    membrane_proof: any;
}, void>;
export declare function genesis_task(cellId: CellId, membrane_proof: any): GenesisWorkflow;
