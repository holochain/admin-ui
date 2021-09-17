import { html, css } from 'lit';
import { state, property } from 'lit/decorators.js';

import { Dictionary } from '@holochain-open-dev/core-types';
import {
  SimulatedZome,
  SimulatedZomeFunction,
  Cell,
} from '@holochain-playground/core';
import { sharedStyles } from '../utils/shared-styles';
import { TextField } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { CircularProgress } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { selectCell } from '../../base/selectors';
import { Tab } from '@scoped-elements/material-web';
import { TabBar } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { List } from '@scoped-elements/material-web';
import { Drawer } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { PlaygroundElement } from '../../base/playground-element';
import { CellsController } from '../../base/cells-controller';
import { CellObserver } from '../../base/cell-observer';
import {
  CallableFn,
  CallableFnArgument,
  CallFns,
} from '../helpers/call-functions';

/**
 * @element call-zome-fns
 */
export class CallZomeFns extends PlaygroundElement implements CellObserver {
  @property({ type: Boolean, attribute: 'hide-zome-selector' })
  hideZomeSelector = false;
  @property({ type: Boolean, attribute: 'hide-agent-pub-key' })
  hideAgentPubKey = false;
  @property({ type: String })
  selectedZomeFnName: string | undefined = undefined;

  @state()
  private _selectedZomeIndex: number = 0;

  // Arguments segmented by dnaHash/agentPubKey/zome/fn_name/arg_name
  _arguments: Dictionary<
    Dictionary<Dictionary<Dictionary<Dictionary<any>>>>
  > = {};

  _cellsController = new CellsController(this);

  get activeCell(): Cell {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors);
  }

  get activeZome(): SimulatedZome {
    return this.activeCell.getSimulatedDna().zomes[this._selectedZomeIndex];
  }

  observedCells() {
    return [this.activeCell];
  }

  async callZomeFunction(fnName: string, args: Dictionary<any>) {
    const zome = this.activeZome;

    this.requestUpdate();

    this.activeCell.conductor.callZomeFn({
      cellId: this.activeCell.cellId,
      zome: zome.name,
      payload: args,
      fnName,
      cap: null,
    });
  }

  renderActiveZomeFns() {
    const zome = this.activeCell.getSimulatedDna().zomes[
      this._selectedZomeIndex
    ];
    const zomeFns = Object.entries(zome.zome_functions);

    if (zomeFns.length === 0)
      return html`<div class="fill center-content">
        <span class="placeholder" style="padding: 24px;"
          >This zome has no functions</span
        >
      </div> `;

    const fns: Array<CallableFn> = zomeFns.map((zomeFn) => ({
      name: zomeFn[0],
      args: zomeFn[1].arguments.map((arg) => ({ ...arg, field: 'textfield' })),
      call: (args) => this.callZomeFunction(zomeFn[0], args),
    }));

    return html` <call-functions .callableFns=${fns}></call-functions> `;
  }

  render() {
    return html`
      <mwc-card style="width: auto; flex: 1;">
        ${this.activeCell
          ? html`
              <div class="column" style="flex: 1">
                <span class="title row" style="margin: 16px; margin-bottom: 0;"
                  >Call Zome
                  Fns${this.hideAgentPubKey
                    ? html``
                    : html`<span class="placeholder row"
                        >, for agent
                        <copyable-hash
                          .hash=${this.activeAgentPubKey}
                          style="margin-left: 8px;"
                        ></copyable-hash
                      ></span> `}</span
                >
                ${this.hideZomeSelector
                  ? html` <span class="horizontal-divider"></span> `
                  : html``}
                <div class="row" style="flex: 1;">
                  <div class="column" style="flex: 1">
                    ${this.hideZomeSelector
                      ? html``
                      : html`
                          <mwc-tab-bar
                            .activeIndex=${this._selectedZomeIndex}
                            @MDCTabBar:activated=${(e: CustomEvent) => {
                              this.selectedZomeFnName = undefined;
                              this._selectedZomeIndex = e.detail.index;
                            }}
                          >
                            ${this.activeCell
                              .getSimulatedDna()
                              .zomes.map(
                                (zome) =>
                                  html`
                                    <mwc-tab .label=${zome.name}></mwc-tab>
                                  `
                              )}
                          </mwc-tab-bar>
                        `}
                    ${this.renderActiveZomeFns()}
                  </div>
                </div>
              </div>
            `
          : html`<div class="fill center-content placeholder">
              <span style="padding: 24px;"
                >Select a cell to call its zome functions</span
              >
            </div>`}
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'mwc-icon': Icon,
      'mwc-tab': Tab,
      'mwc-tab-bar': TabBar,
      'mwc-card': Card,
      'copyable-hash': CopyableHash,
      'call-functions': CallFns,
    };
  }
}
