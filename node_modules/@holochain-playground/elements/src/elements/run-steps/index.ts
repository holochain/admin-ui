import { html, css } from 'lit';
import { state, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { PlaygroundElement } from '../../base/playground-element';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { sharedStyles } from '../utils/shared-styles';
import { List } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { CircularProgress } from '@scoped-elements/material-web';
import { selectAllCells } from '../../base/selectors';

export interface Step {
  title: (context: PlaygroundElement) => string;
  run: (context: PlaygroundElement) => Promise<void>;
}

export class RunSteps extends PlaygroundElement {
  @property({ type: Array })
  steps!: Array<Step>;

  @state()
  _runningStepIndex: number | undefined = undefined;

  @state()
  _running = false;

  async runSteps() {
    this._running = true;

    await this.awaitNetworkConsistency();

    for (let i = 0; i < this.steps.length; i++) {
      this._runningStepIndex = i;
      await this.steps[i].run(this);
      await this.awaitNetworkConsistency();
    }
    this._running = false;
  }

  async awaitNetworkConsistency() {
    return new Promise((resolve) => {
      const cells = selectAllCells(this.activeDna, this.conductors);

      const checkConsistency = (consistencyCheckCount = 0) => {
        for (const cell of cells) {
          for (const triggers of Object.values(cell._triggers)) {
            if (triggers.running || triggers.triggered) return;
          }
        }
        if (consistencyCheckCount === 3) resolve(null);
        else setTimeout(() => checkConsistency(consistencyCheckCount + 1), 200);
      };

      for (const cell of cells) {
        cell.workflowExecutor.success(async () => checkConsistency());
        cell.workflowExecutor.error(async () => checkConsistency());
      }
    });
  }

  renderContent() {
    if (!this.conductors || this.conductors.length === 0)
      return html`<div class="fill center-content">
        <mwc-circular-progress></mwc-circular-progress>
      </div>`;
    if (!this.steps)
      return html`<div class="center-content" style="flex: 1;">
        <span class="placeholder">There are no steps to run</span>
      </div>`;
    return html`
      <mwc-list activatable>
        ${this.steps.map(
          (step, index) =>
            html`<mwc-list-item
              noninteractive
              class=${classMap({
                future: this._runningStepIndex < index,
              })}
              .activated=${this._running && this._runningStepIndex === index}
              >${index + 1}. ${step.title(this)}</mwc-list-item
            >`
        )}
      </mwc-list>
    `;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column" style="margin: 16px; flex: 1;">
          <div class="row">
            <span class="block-title" style="flex: 1;">Run Steps</span>
            <mwc-button
              .label=${this._running ? 'RUNNING...' : 'RUN'}
              raised
              .disabled=${this._running || !this.conductors}
              @click=${() => this.runSteps()}
            ></mwc-button>
          </div>
          ${this.renderContent()}
        </div>
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex: 1;
        }
        .future {
          opacity: 0.7;
        }
      `,
      sharedStyles,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'mwc-list-item': ListItem,
      'mwc-list': List,
      'mwc-button': Button,
      'mwc-card': Card,
    };
  }
}
