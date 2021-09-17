import { IconButton, Snackbar, CircularProgress } from '@scoped-elements/material-web';
import { LitElement, PropertyValues } from 'lit';
import { Conductor, SimulatedDna, SimulatedHappBundle } from '@holochain-playground/core';
import { AgentPubKeyB64, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
import { LightHappBundle } from './context';
declare const HolochainPlaygroundContainer_base: (new () => LitElement) & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class HolochainPlaygroundContainer extends HolochainPlaygroundContainer_base {
    numberOfSimulatedConductors: number;
    simulatedHapp: SimulatedHappBundle;
    private snackbar;
    private message;
    /** Context variables */
    activeDna: DnaHashB64 | undefined;
    activeAgentPubKey: AgentPubKeyB64 | undefined;
    activeHash: DnaHashB64 | undefined;
    conductors: Conductor[];
    happs: Dictionary<LightHappBundle>;
    dnas: Dictionary<SimulatedDna>;
    conductorsUrls: string[] | undefined;
    static get provide(): string[];
    static get styles(): import("lit").CSSResult;
    update(changedValues: PropertyValues): void;
    firstUpdated(): Promise<void>;
    showMessage(message: string): void;
    renderSnackbar(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-snackbar': typeof Snackbar;
        'mwc-icon-button': typeof IconButton;
    };
}
export {};
