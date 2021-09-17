import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { sharedStyles } from '../utils/shared-styles';
import { Button } from '@scoped-elements/material-web';
import { ZomeFunctionResult } from './types';
import { selectAllCells, selectCell } from '../../base/selectors';
import {
  CallZomeFnWorkflow,
  Cell,
  Workflow,
  WorkflowType,
} from '@holochain-playground/core';
import { AgentPubKeyB64, Dictionary } from '@holochain-open-dev/core-types';
import { CircularProgress } from '@scoped-elements/material-web';
import { ExpandableLine } from '../helpers/expandable-line';
import { JsonViewer } from '@power-elements/json-viewer';
import { Icon } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { CellObserver } from '../../base/cell-observer';
import { PlaygroundElement } from '../../base/playground-element';
import { CellsController } from '../../base/cells-controller';

export class ZomeFnsResults extends PlaygroundElement implements CellObserver {
  @property({ type: Boolean, attribute: 'hide-agent-pub-key' })
  hideAgentPubKey = false;

  @property({ type: String, attribute: 'for-agent' })
  forAgent: AgentPubKeyB64 | undefined = undefined;

  // Results segmented by dnaHash/agentPubKey/timestamp
  private _results: Dictionary<Dictionary<Dictionary<ZomeFunctionResult>>> = {};

  _cellsController = new CellsController(this);

  get activeCell(): Cell {
    return selectCell(
      this.activeDna,
      this.forAgent ? this.forAgent : this.activeAgentPubKey,
      this.conductors
    );
  }

  observedCells() {
    if (this.forAgent)
      return [selectCell(this.activeDna, this.forAgent, this.conductors)];
    return selectAllCells(this.activeDna, this.conductors);
  }

  async beforeWorkflow(cell: Cell, workflowInfo: Workflow<any, any>) {
    if (workflowInfo.type === WorkflowType.CALL_ZOME) {
      const timestamp = Date.now().toString();
      const callZomeWorkflow = workflowInfo as CallZomeFnWorkflow;

      if (!this._results[cell.dnaHash]) this._results[cell.dnaHash] = {};
      if (!this._results[cell.dnaHash][cell.agentPubKey])
        this._results[cell.dnaHash][cell.agentPubKey] = {};

      this._results[cell.dnaHash][cell.agentPubKey][timestamp] = {
        cellId: cell.cellId,
        fnName: callZomeWorkflow.details.fnName,
        payload: callZomeWorkflow.details.payload,
        zome: callZomeWorkflow.details.zome,
        result: undefined,
      };
      (workflowInfo as any).timestamp = timestamp;
      this.requestUpdate();
    }
  }

  async workflowSuccess(
    cell: Cell,
    workflowInfo: Workflow<any, any>,
    result: any
  ) {
    if (
      workflowInfo.type === WorkflowType.CALL_ZOME &&
      (workflowInfo as any).timestamp
    ) {
      this._results[cell.dnaHash][cell.agentPubKey][
        (workflowInfo as any).timestamp
      ].result = { success: true, payload: result.result };
      this.requestUpdate();
    }
  }

  async workflowError(
    cell: Cell,
    workflowInfo: Workflow<any, any>,
    error: any
  ) {
    if (
      workflowInfo.type === WorkflowType.CALL_ZOME &&
      (workflowInfo as any).timestamp
    ) {
      this._results[cell.dnaHash][cell.agentPubKey][
        (workflowInfo as any).timestamp
      ].result = { success: false, payload: error.message };
      this.requestUpdate();
    }
  }

  getActiveResults(): Array<[string, ZomeFunctionResult]> {
    if (!this.activeCell) return [];
    const dnaHash = this.activeCell.dnaHash;
    const agentPubKey = this.activeCell.agentPubKey;

    if (!(this._results[dnaHash] && this._results[dnaHash][agentPubKey]))
      return [];
    const results = this._results[dnaHash][agentPubKey];
    const sortedTimestamps = Object.keys(results).sort();
    const sortedResults = sortedTimestamps.map(
      (timestamp) =>
        [timestamp, results[timestamp]] as [string, ZomeFunctionResult]
    );

    return sortedResults;
  }
  renderResult(result: ZomeFunctionResult) {
    if (!result.result)
      return html`<span class="placeholder">Executing...</span>`;
    if (!result.result.payload || typeof result.result.payload === 'string')
      return html`<span>${result.result.payload}</span>`;
    else
      return html`
        <expandable-line>
          <json-viewer
            .object=${result.result.payload}
            class="fill"
          ></json-viewer>
        </expandable-line>
      `;
  }

  renderAgent() {
    if (!this.hideAgentPubKey && this.activeCell)
      return html`, for agent
        <copyable-hash
          .hash=${this.activeCell.agentPubKey}
          style="margin-left: 8px;"
        ></copyable-hash>`;
  }

  render() {
    const results = this.getActiveResults();
    return html`
      <mwc-card class="block-card">
        <div class="column" style="flex: 1; margin: 16px">
          <span class="title row"
            >Zome Fns Results<span class="placeholder row"
              >${this.renderAgent()}</span
            >
          </span>
          ${results.length === 0
            ? html`
                <div class="row fill center-content">
                  <span class="placeholder" style="margin: 0 24px;"
                    >Call a ZomeFn to see its results</span
                  >
                </div>
              `
            : html` <div class="flex-scrollable-parent">
                <div class="flex-scrollable-container">
                  <div class="flex-scrollable-y">
                    <div style="margin: 0 16px;">
                      ${results.map(
                        ([timestamp, result], index) =>
                          html`
                            <div class="column" style="flex: 1;">
                              <div class="row" style="margin: 8px 0;">
                                ${result.result
                                  ? html`
                                      <mwc-icon
                                        style=${styleMap({
                                          color: result.result.success
                                            ? 'green'
                                            : 'red',
                                          'align-self': 'start',
                                          'margin-top': '16px',
                                          '--mdc-icon-size': '36px',
                                        })}
                                        >${result.result.success
                                          ? 'check_circle_outline'
                                          : 'error_outline'}</mwc-icon
                                      >
                                    `
                                  : html`
                                      <mwc-circular-progress
                                        indeterminate
                                        density="-2"
                                        style="align-self: center;"
                                      ></mwc-circular-progress>
                                    `}
                                <div
                                  class="column"
                                  style="flex: 1; margin: 12px; margin-right: 0;"
                                >
                                  <div class="row" style="flex: 1;">
                                    <span style="flex: 1; margin-bottom: 8px;">
                                      ${result.fnName}
                                      <span class="placeholder">
                                        in ${result.zome}
                                        zome${result.result
                                          ? result.result.success
                                            ? ', result:'
                                            : ', error:'
                                          : ''}
                                      </span>
                                    </span>
                                    <span class="placeholder">
                                      ${new Date(
                                        parseInt(timestamp)
                                      ).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  ${this.renderResult(result)}
                                </div>
                              </div>
                              ${index < results.length - 1
                                ? html`
                                    <span
                                      class="horizontal-divider"
                                      style="align-self: center;"
                                    ></span>
                                  `
                                : html``}
                            </div>
                          `
                      )}
                    </div>
                  </div>
                </div>
              </div>`}
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
          opacity: 0.6;
        }
      `,
      sharedStyles,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-list-item': ListItem,
      'mwc-icon': Icon,
      'mwc-circular-progress': CircularProgress,
      'mwc-button': Button,
      'mwc-card': Card,
      'json-viewer': JsonViewer,
      'expandable-line': ExpandableLine,
      'copyable-hash': CopyableHash,
    };
  }
}
