import { html, css, PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref.js';

import { sharedStyles } from '../utils/shared-styles';

import { Card } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { Tab } from '@scoped-elements/material-web';
import { TabBar } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../../base/playground-element';
import { Cell, Conductor } from '@holochain-playground/core';
import { selectCell } from '../../base/selectors';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { Button } from '@scoped-elements/material-web';
import { HelpButton } from '../helpers/help-button';
import { adminApi } from './admin-api';
import { CallFns } from '../helpers/call-functions';
import { GridElement } from '@vaadin/vaadin-grid';
import { GridColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-column';
import { JsonViewer } from '@power-elements/json-viewer';

export class ConductorAdmin extends PlaygroundElement {
  @state()
  private _selectedTabIndex: number = 0;

  private _grid = createRef<GridElement>();

  get activeConductor(): Conductor | undefined {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors)
      ?.conductor;
  }

  renderHelp() {
    return html`
      <help-button
        heading="Conductor Admin Help"
        style="--mdc-dialog-max-width: 700px"
        class="block-help"
      >
        <span>
          You've selected the node or conductor with Agent ID
          ${this.activeAgentPubKey}. Here you can see its internal state:
          <ul>
            <li>
              <strong>Source Chain</strong>: entries that this node has
              committed. Here you can see in grey the
              <a
                href="https://developer.holochain.org/docs/concepts/3_private_data/"
                target="_blank"
                >headers
              </a>
              of the entries, and in colors the entries themselves. When you
              select an entry, the other nodes that are holding the entry DHT
              will be hightlighted in the DHT.
            </li>
            <br />
            <li>
              <strong>DHT Shard</strong>: slice of the DHT that this node is
              holding. You can see the list of all the entries that this node is
              holding indexed by their hash, and metadata associated to those
              entries.
            </li>
            <br />
            <li>
              <strong>Commit Entries</strong>: here you can actually create
              entries yourself. They will be created on behalf of this node. Try
              it! You can create an entry and see where it lands on the DHT, and
              go to the DHT Shard of those nodes and check it's there.
            </li>
          </ul>
        </span>
      </help-button>
    `;
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);
    if (this._grid.value) {
      this._grid.value.render();
    }
  }

  setupGrid(grid: GridElement, conductor: Conductor) {
    if (!grid) return;

    setTimeout(() => {
      grid.rowDetailsRenderer = function (root, grid, model) {
        if (!root.firstElementChild) {
          const cell = (model.item as any) as Cell;
          root.innerHTML = `
          <div class="column" style="padding: 8px; padding-top: 0">
            <span>uid: "${cell.getSimulatedDna().uid}"</span>
            <div class="row">
              <span>Properties:</span>
              <json-viewer style="margin-left: 8px">  
                <script type="application/json">
                  ${JSON.stringify(cell.getSimulatedDna().properties)}
                </script> 
              </json-viewer>
            </div>
          </div>
          `;
        }
      };
      const dnaColumn = this.shadowRoot.querySelector(
        '#dna-column'
      ) as GridColumnElement;
      dnaColumn.renderer = (root: any, column, model) => {
        const cell = (model.item as any) as Cell;
        root.innerHTML = `<copyable-hash hash="${cell.dnaHash}"></copyable-hash>`;
        root.item = model.item;
      };
      const agentPubKeyColumn = this.shadowRoot.querySelector(
        '#agent-pub-key-column'
      ) as GridColumnElement;
      agentPubKeyColumn.renderer = (root: any, column, model) => {
        const cell = (model.item as any) as Cell;
        root.innerHTML = `<copyable-hash hash="${cell.agentPubKey}"></copyable-hash>`;
        root.item = model.item;
      };

      const detailsToggleColumn = this.shadowRoot.querySelector(
        '#details'
      ) as GridColumnElement;
      detailsToggleColumn.renderer = function (root: any, column, model) {
        if (!root.firstElementChild) {
          root.innerHTML = '<mwc-button label="Details"></mwc-button>';
          let opened = false;
          root.firstElementChild.addEventListener('click', function (e: any) {
            if (!opened) {
              grid.openItemDetails(root.item);
            } else {
              grid.closeItemDetails(root.item);
            }
            opened = !opened;
          });
        }
        root.item = model.item;
      };
      const selectColumn = this.shadowRoot.querySelector(
        '#select'
      ) as GridColumnElement;
      selectColumn.renderer = (root: any, column, model) => {
        const cell = (model.item as any) as Cell;

        const isSelected =
          this.activeDna === cell.dnaHash &&
          this.activeAgentPubKey === cell.agentPubKey;
        root.innerHTML = `<mwc-button label="Select" ${
          isSelected ? 'disabled' : ''
        }></mwc-button>`;
        root.firstElementChild.addEventListener('click', (e: any) => {
          const cell = (model.item as any) as Cell;
          this.updatePlayground({
            activeAgentPubKey: cell.agentPubKey,
            activeDna: cell.dnaHash,
          });
        });

        root.item = model.item;
      };
    });
  }

  renderCells(conductor: Conductor) {
    const items = conductor.getAllCells();

    return html`
      <vaadin-grid
        .items=${items}
        ${ref(this._grid)}
        ${ref((el) => this.setupGrid(el as GridElement, conductor))}
      >
        <vaadin-grid-column
          path="dna"
          header="Dna"
          id="dna-column"
        ></vaadin-grid-column>
        <vaadin-grid-column
          id="agent-pub-key-column"
          path="agentPubKey"
          header="Agent Pub Key"
        ></vaadin-grid-column>
        <vaadin-grid-column flex-grow="0" id="details"></vaadin-grid-column>
        <vaadin-grid-column flex-grow="0" id="select"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  renderAdminAPI(conductor: Conductor) {
    const adminApiFns = adminApi(this, conductor);

    return html`<call-functions .callableFns=${adminApiFns}></call-functions>`;
  }

  renderContent() {
    if (!this.activeConductor)
      return html`
        <div class="column fill center-content">
          <span class="placeholder"
            >Select a cell to inspect its conductor</span
          >
        </div>
      `;
    return html`
      <div class="column fill">
        <mwc-tab-bar
          @MDCTabBar:activated=${(e) =>
            (this._selectedTabIndex = e.detail.index)}
          .activeIndex=${this._selectedTabIndex}
        >
          <mwc-tab label="Cells"></mwc-tab>
          <mwc-tab label="Admin API"></mwc-tab>
        </mwc-tab-bar>
        <div class="column fill">
          ${this._selectedTabIndex === 0
            ? this.renderCells(this.activeConductor)
            : this.renderAdminAPI(this.activeConductor)}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        ${this.renderHelp()}
        <div class="column fill">
          <div class="row" style="padding: 16px">
            <div class="column" style="flex: 1;">
              <span class="title"
                >Conductor
                Admin${this.activeConductor
                  ? html`<span class="placeholder"
                      >, for ${this.activeConductor.name}</span
                    >`
                  : html``}</span
              >
            </div>
          </div>
          <div class="column fill">${this.renderContent()}</div>
        </div>
      </mwc-card>
    `;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
        .bottom-border {
          border-bottom: 1px solid lightgrey;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'copyable-hash': CopyableHash,
      'call-functions': CallFns,
      'mwc-tab': Tab,
      'vaadin-grid': GridElement,
      'vaadin-grid-column': GridColumnElement,
      'mwc-tab-bar': TabBar,
      'mwc-list': List,
      'json-viewer': JsonViewer,
      'mwc-list-item': ListItem,
      'mwc-card': Card,
      'mwc-button': Button,
      'mwc-icon-button': IconButton,
      'help-button': HelpButton,
    };
  }
}
