import {
  IconButton,
  Snackbar,
  CircularProgress,
} from '@scoped-elements/material-web';
import { ProviderMixin } from 'lit-element-context';

import { LitElement, html, css, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import {
  Conductor,
  createConductors,
  demoHapp,
  hash,
  HashType,
  SimulatedDna,
  SimulatedHappBundle,
} from '@holochain-playground/core';
import {
  AgentPubKeyB64,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import {
  selectAllCells,
  selectCell,
  selectCells,
  selectHoldingCells,
} from './selectors';
import { LightDnaSlot, LightHappBundle } from './context';

export class HolochainPlaygroundContainer extends ScopedElementsMixin(
  ProviderMixin(LitElement) as new () => LitElement
) {
  @property({ type: Number })
  numberOfSimulatedConductors: number = 10;

  @property({ type: Object })
  simulatedHapp: SimulatedHappBundle = demoHapp();

  @query('#snackbar')
  private snackbar: Snackbar;

  @property({ type: String })
  private message: string | undefined;

  /** Context variables */
  @property({ type: String })
  activeDna: DnaHashB64 | undefined;
  @property({ type: String })
  activeAgentPubKey: AgentPubKeyB64 | undefined;
  @property({ type: String })
  activeHash: DnaHashB64 | undefined;
  @property({ type: Array })
  conductors: Conductor[] = [];
  @property({ type: Array })
  happs: Dictionary<LightHappBundle> = {};
  @property({ type: Array })
  dnas: Dictionary<SimulatedDna> = {};

  @property({ type: Array })
  conductorsUrls: string[] | undefined;

  static get provide() {
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

  static get styles() {
    return css`
      :host {
        display: contents;
      }
    `;
  }

  update(changedValues: PropertyValues) {
    super.update(changedValues);

    if (changedValues.has('activeDna') && this.activeDna) {
      if (this.activeHash) {
        this.activeHash = undefined;
      }
      if (
        !selectCell(this.activeDna, this.activeAgentPubKey, this.conductors)
      ) {
        this.activeAgentPubKey = undefined;
      }
    }
  }

  async firstUpdated() {
    if (!this.conductorsUrls) {
      this.conductors = await createConductors(
        this.numberOfSimulatedConductors,
        [],
        this.simulatedHapp
      );

      const slots: Dictionary<LightDnaSlot> = {};

      for (const [slotNick, dnaSlot] of Object.entries(
        this.simulatedHapp.slots
      )) {
        if (typeof dnaSlot.dna === 'string') {
          throw new Error(
            'Initial happ bundle must come with its dnas already builtin'
          );
        }

        const dnaHash = hash(dnaSlot.dna, HashType.DNA);

        slots[slotNick] = {
          deferred: dnaSlot.deferred,
          dnaHash,
        };

        this.dnas[dnaHash] = dnaSlot.dna;
      }

      this.happs[this.simulatedHapp.name] = {
        ...this.simulatedHapp,
        slots,
      };

      this.activeDna = this.conductors[0].getAllCells()[0].dnaHash;

      this.dispatchEvent(
        new CustomEvent('ready', {
          bubbles: true,
          composed: true,
          detail: {
            activeDna: this.activeDna,
            activeAgentPubKey: this.activeAgentPubKey,
            activeHash: this.activeHash,
            conductors: this.conductors,
            conductorsUrls: this.conductorsUrls,
            happs: this.happs,
          },
        })
      );
    }

    this.addEventListener('update-context', (e: CustomEvent) => {
      const keys = Object.keys(e.detail);
      for (const key of keys) {
        this[key] = e.detail[key];
      }
    });

    this.addEventListener('show-message', (e: CustomEvent) => {
      this.showMessage(e.detail.message);
    });
  }

  showMessage(message: string) {
    this.message = message;
    this.snackbar.show();
  }

  renderSnackbar() {
    return html`
      <mwc-snackbar id="snackbar" .labelText=${this.message}>
        <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
      </mwc-snackbar>
    `;
  }

  render() {
    return html`
      ${this.renderSnackbar()}
      ${this.conductors
        ? html` <slot></slot> `
        : html` <mwc-circular-progress></mwc-circular-progress>`}
    `;
  }

  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'mwc-snackbar': Snackbar,
      'mwc-icon-button': IconButton,
    };
  }
}
