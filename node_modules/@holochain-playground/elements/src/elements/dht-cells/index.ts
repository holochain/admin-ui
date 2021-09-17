import { html, css } from 'lit';
import { state, query, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

import cytoscape from 'cytoscape';
import { MenuSurface } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { DHTOp, Dictionary } from '@holochain-open-dev/core-types';
import {
  sleep,
  NetworkRequestType,
  WorkflowType,
  PublishRequestInfo,
  NetworkRequestInfo,
} from '@holochain-playground/core';
import { Card } from '@scoped-elements/material-web';
import { Slider } from '@scoped-elements/material-web';
import { Switch } from '@scoped-elements/material-web';
import { CellTasks } from '../helpers/cell-tasks';
import { HelpButton } from '../helpers/help-button';
import { CellsController } from '../../base/cells-controller';
import { selectAllCells, selectHoldingCells } from '../../base/selectors';
import { sharedStyles } from '../utils/shared-styles';
import { dhtCellsNodes, neighborsEdges } from './processors';
import { graphStyles, layoutConfig } from './graph';
import { IconButton } from '@scoped-elements/material-web';
import { Formfield } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { Subject } from 'rxjs';
import { Menu } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { uniq } from 'lodash-es';
import { PlaygroundElement } from '../../base/playground-element';
import { CellObserver } from '../../base/cell-observer';
import { CopyableHash } from '../helpers/copyable-hash';

const MIN_ANIMATION_DELAY = 1000;
const MAX_ANIMATION_DELAY = 7000;

/**
 * @element dht-cells
 */
export class DhtCells extends PlaygroundElement implements CellObserver {
  @property({ type: Number })
  animationDelay: number = 2000;

  @property({ type: Array })
  workflowsToDisplay: WorkflowType[] = [
    WorkflowType.CALL_ZOME,
    WorkflowType.APP_VALIDATION,
  ];

  @property({ type: Array })
  networkRequestsToDisplay: NetworkRequestType[] = [
    NetworkRequestType.PUBLISH_REQUEST,
    NetworkRequestType.CALL_REMOTE,
    NetworkRequestType.WARRANT,
  ];

  @property({ type: Boolean, attribute: 'hide-time-controller' })
  hideTimeController: boolean = false;

  @property({ type: Boolean, attribute: 'hide-filter' })
  hideFilter: boolean = false;

  @property({ type: Boolean, attribute: 'step-by-step' })
  stepByStep = false;

  @property({ type: Boolean, attribute: 'show-zome-fn-success' })
  showZomeFnSuccess = false;

  @query('#graph')
  private _graph: any;

  @query('#active-workflows-button')
  private _activeWorkflowsButton: Button;
  @query('#active-workflows-menu')
  private _activeWorkflowsMenu: Menu;

  @query('#network-requests-button')
  private _networkRequestsButton: Button;
  @query('#network-requests-menu')
  private _networkRequestsMenu: Menu;

  private _cy;
  private _layout;
  private _resumeObservable = new Subject();

  @state()
  private _onPause = false;

  private cellsController = new CellsController(this);

  observedCells() {
    return selectAllCells(this.activeDna, this.conductors);
  }

  async firstUpdated() {
    window.addEventListener('scroll', () => {
      this._cy.resize();
      this.requestUpdate();
    });

    new ResizeObserver(() => {
      setTimeout(() => {
        this._cy.resize();
        if (this._layout) this._layout.run();
        this.requestUpdate();
      });
    }).observe(this);

    this._cy = cytoscape({
      container: this._graph,
      boxSelectionEnabled: false,
      autoungrabify: true,
      userPanningEnabled: false,
      userZoomingEnabled: false,
      layout: layoutConfig,
      style: graphStyles,
    });

    this._cy.on('tap', 'node', (evt) => {
      this.updatePlayground({
        activeAgentPubKey: evt.target.id(),
      });
    });

    let rendered = false;
    this._cy.on('render', () => {
      if (this._cy.width() !== 0) {
        if (!rendered) {
          rendered = true;
          // This is needed to render the nodes after the graph itself
          // has resized properly so it computes the positions appriopriately
          setTimeout(() => {
            this.setupGraphNodes();
          });
        }
      }
    });
  }

  highlightNodesWithEntry() {
    const allCells = selectAllCells(this.activeDna, this.conductors);

    allCells.forEach((cell) =>
      this._cy.getElementById(cell.agentPubKey).removeClass('highlighted')
    );

    if (this.activeHash) {
      const holdingCells = selectHoldingCells(this.activeHash, allCells);

      for (const cell of holdingCells) {
        this._cy.getElementById(cell.agentPubKey).addClass('highlighted');
      }
    }
  }

  async beforeNetworkRequest(networkRequest: NetworkRequestInfo<any, any>) {
    this.requestUpdate();

    if (!this.networkRequestsToDisplay.includes(networkRequest.type)) return;
    if (networkRequest.toAgent === networkRequest.fromAgent) return;

    const fromNode = this._cy.getElementById(networkRequest.fromAgent);
    if (!fromNode.position()) return;
    const toNode = this._cy.getElementById(networkRequest.toAgent);

    const fromPosition = fromNode.position();
    const toPosition = toNode.position();

    let label = networkRequest.type;
    if (networkRequest.type === NetworkRequestType.PUBLISH_REQUEST) {
      const dhtOps: Dictionary<DHTOp> = (networkRequest as PublishRequestInfo)
        .details.dhtOps;

      const types = Object.values(dhtOps).map((dhtOp) => dhtOp.type);

      label = `Publish: ${uniq(types).join(', ')}`;
    }

    const el = this._cy.add([
      {
        group: 'nodes',
        data: {
          networkRequest,
          label,
        },
        position: { x: fromPosition.x + 1, y: fromPosition.y + 1 },
        classes: ['network-request'],
      },
    ]);

    if (this.stepByStep) {
      const halfPosition = {
        x: (toPosition.x - fromPosition.x) / 2 + fromPosition.x,
        y: (toPosition.y - fromPosition.y) / 2 + fromPosition.y,
      };
      el.animate({
        position: halfPosition,
        duration: this.animationDelay / 2,
      });

      await sleep(this.animationDelay / 2);

      this._onPause = true;
      await new Promise((resolve) =>
        this._resumeObservable.subscribe(() => resolve(null))
      );
      this._onPause = false;

      el.animate({
        position: toPosition,
        duration: this.animationDelay / 2,
      });

      await sleep(this.animationDelay / 2);
    } else {
      el.animate({
        position: toNode.position(),
        duration: this.animationDelay,
      });

      await sleep(this.animationDelay);
    }
    this._cy.remove(el);
  }

  onCellsChanged() {
    this.setupGraphNodes();
  }

  setupGraphNodes() {
    if (!this._cy) return;

    const observedCells = this.cellsController.observedCells

    const nodes = dhtCellsNodes(observedCells);

    if (this._layout) this._layout.stop();
    this._cy.remove('node');
    this._cy.remove('edge');

    this._cy.add(nodes);
    const neighbors = neighborsEdges(observedCells);
    this._cy.add(neighbors);

    this._layout = this._cy.elements().makeLayout(layoutConfig);
    this._layout.run();

    this._cy.fit(nodes, nodes.length < 3 ? 170 : 0);
    this._cy.center();
  }

  _neighborEdges = [];

  updated(changedValues) {
    super.updated(changedValues);

    const neighbors = neighborsEdges(this.cellsController.observedCells);
    if (this._neighborEdges.length != neighbors.length && this._cy.nodes().length > 0) {
      this._neighborEdges = neighbors;
      this._cy.remove('edge');
      this._cy.add(neighbors);
    }

    this.cellsController.observedCells.forEach((cell) =>
      this._cy.getElementById(cell.agentPubKey).removeClass('selected')
    );
    this._cy.getElementById(this.activeAgentPubKey).addClass('selected');

    this.highlightNodesWithEntry();

    if (changedValues.has('_onPause')) {
      this._cy
        .style()
        .selector('.cell')
        .style({
          opacity: this._onPause ? 0.4 : 1,
        });
    }
  }

  renderTimeController() {
    if (this.hideTimeController) return html``;

    return html`
      <div class="row center-content">
        ${this.stepByStep
          ? html`
              <mwc-icon-button
                .disabled=${!this._onPause}
                icon="play_arrow"
                style=${styleMap({
                  'background-color': this._onPause ? '#dbdbdb' : 'white',
                  'border-radius': '50%',
                })}
                @click=${() => this._resumeObservable.next()}
              ></mwc-icon-button>
            `
          : html`
              <mwc-slider
                style="margin-right: 16px;"
                .value=${MAX_ANIMATION_DELAY - this.animationDelay}
                pin
                .min=${MIN_ANIMATION_DELAY}
                .max=${MAX_ANIMATION_DELAY}
                @change=${(e) =>
                  (this.animationDelay = MAX_ANIMATION_DELAY - e.target.value)}
              ></mwc-slider>
              <mwc-icon style="margin: 0 8px;">speed</mwc-icon>
            `}

        <span
          class="vertical-divider"
          style="margin: 0 16px; margin-right: 24px;"
        ></span>

        <mwc-formfield label="Step By Step" style="margin-right: 16px;">
          <mwc-switch
            id="step-by-step-switch"
            .checked=${this.stepByStep}
            @change=${(e) => {
              this.stepByStep = e.target.checked;
              if (this._onPause) this._resumeObservable.next();
            }}
          ></mwc-switch>
        </mwc-formfield>
      </div>
    `;
  }

  renderHelp() {
    return html`
      <holochain-playground-help-button heading="DHT Cells" class="block-help">
        <span>
          This is a visual interactive representation of a holochain
          <a
            href="https://developer.holochain.org/docs/concepts/4_public_data_on_the_dht/"
            target="_blank"
            >DHT</a
          >, with ${this.conductors.length} nodes.
          <br />
          <br />
          In the DHT, all nodes have a <strong>public and private key</strong>.
          The public key is visible and shared througout the network, but
          private keys never leave their nodes. This public key is of 256 bits
          an it's actually the node's ID, which you can see labeled besides the
          nodes (encoded in base58 strings).
          <br />
          <br />
          If you pay attention, you will see that
          <strong>all nodes in the DHT are ordered alphabetically</strong>. This
          is because the nodes organize themselves in neighborhoods: they are
          more connected with the nodes that are closest to their ID, and less
          connected with the nodes that are far.
        </span>
      </holochain-playground-help-button>
    `;
  }

  renderTasksTooltips() {
    if (!this._cy || !this.cellsController.observedCells) return html``;

    const nodes = this._cy.nodes();
    const cellsWithPosition = nodes.map((node) => {
      const agentPubKey = node.id();
      const cell = this.cellsController.observedCells.find(
        (cell) => cell.agentPubKey === agentPubKey
      );

      return { cell, position: node.renderedPosition() };
    });

    return html`${cellsWithPosition.map(({ cell, position }) => {
      const leftSide = this._cy.width() / 2 > position.x;
      const upSide = this._cy.height() / 2 > position.y;

      const finalX = position.x + (leftSide ? -250 : 50);
      const finalY = position.y + (upSide ? -50 : 50);

      return html`<holochain-playground-cell-tasks
        .workflowsToDisplay=${this.workflowsToDisplay}
        .workflowDelay=${this.animationDelay}
        .cell=${cell}
        style=${styleMap({
          top: `${finalY}px`,
          left: `${finalX}px`,
          position: 'absolute',
          'z-index': '3',
        })}
        .stepByStep=${this.stepByStep}
        .showZomeFnSuccess=${this.showZomeFnSuccess}
        ._onPause=${this._onPause}
        ._resumeObservable=${this._resumeObservable}
        @execution-paused=${(e) => (this._onPause = e.detail.paused)}
      >
      </holochain-playground-cell-tasks>`;
    })}`;
  }

  renderBottomToolbar() {
    const workflowsNames = Object.values(WorkflowType);
    const networkRequestNames = Object.values(NetworkRequestType);
    return html`
      <div class="row center-content" style="margin: 16px; position: relative;">
        ${this.hideFilter
          ? html``
          : html`
              <mwc-button
                label="Visible Worfklows"
                style="--mdc-theme-primary: rgba(0,0,0,0.7);"
                icon="arrow_drop_down"
                id="active-workflows-button"
                trailingIcon
                @click=${() => this._activeWorkflowsMenu.show()}
              ></mwc-button>
              <mwc-menu
                corner="BOTTOM_END"
                multi
                activatable
                id="active-workflows-menu"
                .anchor=${this._activeWorkflowsButton}
                @selected=${(e) =>
                  (this.workflowsToDisplay = [...e.detail.index].map(
                    (index) => workflowsNames[index]
                  ))}
              >
                ${workflowsNames.map(
                  (type) => html`
                    <mwc-list-item
                      graphic="icon"
                      .selected=${this.workflowsToDisplay.includes(
                        type as WorkflowType
                      )}
                      .activated=${this.workflowsToDisplay.includes(
                        type as WorkflowType
                      )}
                    >
                      ${this.workflowsToDisplay.includes(type as WorkflowType)
                        ? html` <mwc-icon slot="graphic">check</mwc-icon> `
                        : html``}
                      ${type}
                    </mwc-list-item>
                  `
                )}
              </mwc-menu>

              <mwc-button
                label="Visible Network Requests"
                style="--mdc-theme-primary: rgba(0,0,0,0.7);"
                icon="arrow_drop_down"
                id="network-requests-button"
                trailingIcon
                @click=${() => this._networkRequestsMenu.show()}
              ></mwc-button>
              <mwc-menu
                corner="BOTTOM_END"
                multi
                activatable
                id="network-requests-menu"
                .anchor=${this._networkRequestsButton}
                @selected=${(e) =>
                  (this.networkRequestsToDisplay = [...e.detail.index].map(
                    (index) => networkRequestNames[index]
                  ))}
              >
                ${networkRequestNames.map(
                  (type) => html`
                    <mwc-list-item
                      graphic="icon"
                      .selected=${this.networkRequestsToDisplay.includes(
                        type as NetworkRequestType
                      )}
                      .activated=${this.networkRequestsToDisplay.includes(
                        type as NetworkRequestType
                      )}
                    >
                      ${this.networkRequestsToDisplay.includes(
                        type as NetworkRequestType
                      )
                        ? html` <mwc-icon slot="graphic">check</mwc-icon> `
                        : html``}
                      ${type}
                    </mwc-list-item>
                  `
                )}
              </mwc-menu>
            `}

        <span style="flex: 1;"></span>

        ${this.renderTimeController()}
      </div>
    `;
  }

  render() {
    return html`
      <mwc-card class="block-card" style="position: relative;">
        ${this.renderHelp()} ${this.renderTasksTooltips()}
        <div class="column fill">
          <span class="block-title row" style="margin: 16px;"
            >DHT Cells
            ${this.activeDna
              ? html`
                  <span class="placeholder row">
                    , for Dna
                    <copyable-hash
                      .hash=${this.activeDna}
                      style="margin-left: 8px;"
                    ></copyable-hash>
                  </span>
                `
              : html``}
          </span>
          <div
            id="graph"
            class="fill ${classMap({
              paused: this._onPause,
            })}"
          ></div>
          ${this.renderBottomToolbar()}
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

        .paused {
          background-color: #dbdbdba0;
        }
      `,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-card': Card,
      'mwc-menu-surface': MenuSurface,
      'mwc-button': Button,
      'mwc-icon': Icon,
      'mwc-menu': Menu,
      'mwc-list-item': ListItem,
      'mwc-slider': Slider,
      'mwc-switch': Switch,
      'mwc-formfield': Formfield,
      'mwc-icon-button': IconButton,
      'copyable-hash': CopyableHash,
      'holochain-playground-help-button': HelpButton,
      'holochain-playground-cell-tasks': CellTasks,
    };
  }
}
