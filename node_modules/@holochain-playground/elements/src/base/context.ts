import {
  Conductor,
  SimulatedDna,
  SimulatedDnaSlot,
  SimulatedHappBundle,
} from '@holochain-playground/core';
import { AgentPubKeyB64, AnyDhtHashB64, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';

export interface PlaygroundContext {
  activeDna: DnaHashB64;
  activeAgentPubKey: AgentPubKeyB64 | undefined;
  activeHash: AnyDhtHashB64 | undefined;
  conductors: Conductor[];
  conductorsUrls: string[] | undefined;
  happs: Dictionary<LightHappBundle>; // Indexed by happId
  dnas: Dictionary<SimulatedDna>; // Indexed by dna hash
}

export interface LightDnaSlot {
  dnaHash: DnaHashB64;
  deferred: boolean;
}
export interface LightHappBundle {
  name: string;
  description: string;
  slots: Dictionary<LightDnaSlot>;
}

export function buildHappBundle(
  context: PlaygroundContext,
  happId: string
): SimulatedHappBundle {
  const slots: Dictionary<SimulatedDnaSlot> = {};
  const ligthHapp = context.happs[happId];

  if (!ligthHapp) throw new Error('There is no happ with the given id');

  for (const [slotNick, dnaSlot] of Object.entries(ligthHapp.slots)) {
    slots[slotNick] = {
      deferred: dnaSlot.deferred,
      dna: context.dnas[dnaSlot.dnaHash],
    };
  }

  const happBundle: SimulatedHappBundle = {
    ...ligthHapp,
    slots,
  };
  return happBundle;
}
