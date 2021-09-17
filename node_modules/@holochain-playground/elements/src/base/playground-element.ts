import { LightHappBundle, PlaygroundContext } from './context';
import { ConsumerMixin } from 'lit-element-context';
import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { Conductor, SimulatedDna } from '@holochain-playground/core';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

export class PlaygroundElement extends ScopedElementsMixin(
  ConsumerMixin(LitElement) as new () => LitElement
) {
  /** Context variables */
  @property({ type: String })
  activeDna: DnaHashB64 | undefined;
  @property({ type: String })
  activeAgentPubKey: AgentPubKeyB64 | undefined;
  @property({ type: String })
  activeHash: AnyDhtHashB64 | undefined;
  @state()
  conductors: Conductor[] = [];
  @state()
  happs: Dictionary<LightHappBundle> = {};

  @state()
  dnas: Dictionary<SimulatedDna> = {};

  @property({ type: Array })
  conductorsUrls: string[] | undefined;

  static get inject() {
    return [
      'activeDna',
      'activeAgentPubKey',
      'activeHash',
      'conductors',
      'conductorsUrls',
      'happs',
      'dnas',
    ];
  }

  updatePlayground(context: Partial<PlaygroundContext>) {
    this.dispatchEvent(
      new CustomEvent('update-context', {
        bubbles: true,
        composed: true,
        detail: context,
      })
    );
  }

  showMessage(message: string) {
    this.dispatchEvent(
      new CustomEvent('show-message', {
        bubbles: true,
        composed: true,
        detail: { message },
      })
    );
  }
}
