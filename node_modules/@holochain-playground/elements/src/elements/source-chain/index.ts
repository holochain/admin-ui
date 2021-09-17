import { html, PropertyValues, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { query } from 'lit/decorators.js';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { isEqual } from 'lodash-es';
import { Cell } from '@holochain-playground/core';

import { sourceChainNodes } from './processors';
import { sharedStyles } from '../utils/shared-styles';

import { HelpButton } from '../helpers/help-button';
import { selectCell } from '../../base/selectors';
import { PlaygroundElement } from '../../base/playground-element';
import { Card } from '@scoped-elements/material-web';
import { graphStyles } from './graph';
import { CellObserver } from '../../base/cell-observer';
import { CellsController } from '../../base/cells-controller';
import { CopyableHash } from '../helpers/copyable-hash';

cytoscape.use(dagre); // register extension

/**
 * @element source-chain
 */
export class SourceChain extends PlaygroundElement implements CellObserver {
  @query('#source-chain-graph')
  private graph: HTMLElement;

  private cy: cytoscape.Core;

  private nodes: any[] = [];

  _cellsController = new CellsController(this);

  get activeCell(): Cell | undefined {
    return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors);
  }

  observedCells() {
    return [this.activeCell];
  }

  firstUpdated() {
    window.addEventListener('scroll', () => {
      this.cy.resize();
    });

    this.cy = cytoscape({
      container: this.graph,
      layout: {
        name: 'dagre',
      },
      autoungrabify: true,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      style: graphStyles,
    });
    this.cy.on('tap', 'node', (event) => {
      // Node id is <HEADER_HASH>:<ENTRY_HASH>
      let activeHash = event.target.id();
      if (activeHash.includes(':')) {
        activeHash = activeHash.split(':')[1];
      }
      this.updatePlayground({
        activeHash,
      });
    });

    let rendered = false;
    this.cy.on('render', () => {
      if (this.cy.width() !== 0) {
        if (!rendered) {
          rendered = true;
          // This is needed to render the nodes after the graph itself
          // has resized properly so it computes the positions appriopriately
          setTimeout(() => {
            this.setupGraph();
          });
        }
      }
    });

    this.requestUpdate();
  }

  setupGraph() {
    this.cy.remove('node');
    this.cy.add(this.nodes);

    const tipNodes = this.nodes.slice(0, 7);

    this.cy.fit(tipNodes);
    this.cy.center(tipNodes);
    this.cy.resize();

    this.cy.layout({ name: 'dagre' }).run();
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    const nodes = sourceChainNodes(this.activeCell);

    if (!isEqual(nodes, this.nodes)) {
      this.nodes = nodes;
      this.setupGraph();
    }

    if (changedValues.has('activeHash')) {
      this.cy.filter('node').removeClass('selected');

      const nodeElements = this.cy.nodes();

      for (const nodeElement of nodeElements) {
        const nodeId = nodeElement.id();
        if (
          nodeId === this.activeHash ||
          nodeId.includes(`:${this.activeHash}`)
        ) {
          nodeElement.addClass('selected');
        }
      }
    }
  }

  renderHelp() {
    return html` <help-button heading="Source-Chain" class="block-help">
      <span>
        This graph displays the source chain of the selected cell. On the
        top-left sequence, you can see the hash-chain of headers. On the
        bottom-right sequence, you can see the entries associated with each
        header. Links between headers
        <br />
        <br />
        Dashed relationships are embedded references: the headers contain the
        hash of the last header, and also the entry hash if they have an entry.
      </span>
    </help-button>`;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column fill">
          <span class="block-title row" style="margin: 16px;"
            >Source-Chain${this.activeAgentPubKey
              ? html`
                  <span class="placeholder row">
                    , for Agent
                    <copyable-hash
                      .hash=${this.activeAgentPubKey}
                      style="margin-left: 8px;"
                    ></copyable-hash>
                  </span>
                `
              : html``}</span
          >
          ${this.renderHelp()}
          ${this.activeCell
            ? html``
            : html`
                <div style="flex: 1;" class="center-content placeholder">
                  <span>Select a cell to display its source chain</span>
                </div>
              `}

          <div
            style=${styleMap({
              display: this.activeCell ? '' : 'none',
            })}
            class="fill"
            id="source-chain-graph"
          ></div>
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
        #source-chain-graph {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'copyable-hash': CopyableHash,
      'help-button': HelpButton,
    };
  }
}
