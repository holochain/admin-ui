import { Conductor, SimulatedDna, SimulatedHappBundle } from '@holochain-playground/core';
import { AgentPubKeyB64, AnyDhtHashB64, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
export interface PlaygroundContext {
    activeDna: DnaHashB64;
    activeAgentPubKey: AgentPubKeyB64 | undefined;
    activeHash: AnyDhtHashB64 | undefined;
    conductors: Conductor[];
    conductorsUrls: string[] | undefined;
    happs: Dictionary<LightHappBundle>;
    dnas: Dictionary<SimulatedDna>;
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
export declare function buildHappBundle(context: PlaygroundContext, happId: string): SimulatedHappBundle;
