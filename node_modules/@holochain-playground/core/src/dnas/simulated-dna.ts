import {
  AgentPubKeyB64,
  CellId,
  Dictionary,
  EntryVisibility,
  Element,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { ValidationOutcome } from '../core/cell/sys_validate/types';
import {
  SimulatedValidateFunctionContext,
  SimulatedZomeFunctionContext,
} from '../core/hdk';

export interface SimulatedZomeFunctionArgument {
  name: string;
  type: string;
}

export interface SimulatedZomeFunction {
  call: (
    context: SimulatedZomeFunctionContext
  ) => (payload: any) => Promise<any>;
  arguments: SimulatedZomeFunctionArgument[];
}

export type SimulatedValidateFunction = (
  context: SimulatedValidateFunctionContext
) => (payload: any) => Promise<ValidationOutcome>;

export interface SimulatedZome {
  name: string;
  entry_defs: Array<EntryDef>;
  zome_functions: Dictionary<SimulatedZomeFunction>;
  validation_functions: {
    validate_create_agent?: (
      context: SimulatedValidateFunctionContext
    ) => (args: {
      element: Element;
      agent_pub_key: AgentPubKeyB64;
      membrane_proof: any;
    }) => Promise<ValidationOutcome>;
  } & Dictionary<SimulatedValidateFunction>;
  blocklyCode?: string;
}

export interface SimulatedDna {
  zomes: Array<SimulatedZome>;
  properties: Dictionary<any>;
  uid: string;
}

export interface SimulatedDnaSlot {
  dna: SimulatedDna | DnaHashB64;
  deferred: boolean;
}
export interface SimulatedHappBundle {
  name: string;
  description: string;
  slots: Dictionary<SimulatedDnaSlot>;
}

export interface AppSlot {
  base_cell_id: CellId;
  is_provisioned: boolean;
  clones: CellId[];
}

export interface InstalledHapps {
  app_id: string;
  agent_pub_key: AgentPubKeyB64;
  slots: Dictionary<AppSlot>;
}


export interface EntryDef {
  id: string;
  visibility: EntryVisibility;
}
