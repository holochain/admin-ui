import { Dictionary } from '@holochain-open-dev/core-types';
import { SimulatedDna } from '../dnas/simulated-dna';

export interface BadAgentConfig {
  disable_validation_before_publish: boolean;
  pretend_invalid_elements_are_valid: boolean;
}

export interface BadAgent {
  config: BadAgentConfig;

  counterfeitDnas: Dictionary<Dictionary<SimulatedDna>>; // Segmented by DnaHash / AgentPubKeyB64
}
