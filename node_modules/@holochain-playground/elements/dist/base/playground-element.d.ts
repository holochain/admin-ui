import { LightHappBundle, PlaygroundContext } from './context';
import { AgentPubKeyB64, AnyDhtHashB64, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
import { Conductor, SimulatedDna } from '@holochain-playground/core';
import { LitElement } from 'lit';
declare const PlaygroundElement_base: (new () => LitElement) & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class PlaygroundElement extends PlaygroundElement_base {
    /** Context variables */
    activeDna: DnaHashB64 | undefined;
    activeAgentPubKey: AgentPubKeyB64 | undefined;
    activeHash: AnyDhtHashB64 | undefined;
    conductors: Conductor[];
    happs: Dictionary<LightHappBundle>;
    dnas: Dictionary<SimulatedDna>;
    conductorsUrls: string[] | undefined;
    static get inject(): string[];
    updatePlayground(context: Partial<PlaygroundContext>): void;
    showMessage(message: string): void;
}
export {};
