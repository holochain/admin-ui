import { html, css } from 'lit';
import { state, property, query } from 'lit/decorators.js';

import cytoscape from 'cytoscape';

import { Checkbox } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { Formfield } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';

import { allEntries } from './processors';
import { selectAllCells, selectCell } from '../../base/selectors';
import { sharedStyles } from '../utils/shared-styles';
import { isEqual } from 'lodash-es';
import { HelpButton } from '../helpers/help-button';
import { Menu } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import cola from 'cytoscape-cola';
import { graphStyles } from './graph';
import { PlaygroundElement } from '../../base/playground-element';
import { CellObserver } from '../../base/cell-observer';
import { CellsController } from '../../base/cells-controller';
import { CopyableHash } from '../helpers/copyable-hash';

cytoscape.use(cola);

const layoutConfig = {
  name: 'cola',
  animate: true,
  /*   flow: {
    axis: 'x',
    minSeparation: 40,
  },
 */ ready: (e) => {
    e.cy.fit();
    e.cy.center();
  },
  nodeSpacing: function (node) {
    return 20;
  },
  edgeLength: (edge) => {
    return edge.data().headerReference ? 50 : undefined;
  },
};

/**
 * @element entry-graph
 */
export class EntryGraph extends PlaygroundElement implements CellObserver {
  @property({ type: Boolean, attribute: 'hide-filter' })
  hideFilter: boolean = false;

  @property({ type: Boolean, attribute: 'show-entry-contents' })
  showEntryContents: boolean = false;
  @property({ type: Boolean, attribute: 'show-headers' })
  showHeaders: boolean = false;
  @property({ type: Boolean, attribute: 'show-only-active-agents-shard' })
  showOnlyActiveAgentsShard: boolean = false;

  @property({ type: Array })
  excludedEntryTypes: string[] = [];

  @query('#entry-graph')
  private entryGraph: HTMLElement;

  private lastEntriesIds: string[] = [];
  private cy;
  private layout;
  private ready = false;

  @state()
  private _entryTypes = [];

  @query('#visible-entries-button')
  private _visibleEntriesButton: Button;
  @query('#visible-entries-menu')
  private _visibleEntriesMenu: Menu;

  _cellsController = new CellsController(this);

  observedCells() {
    return selectAllCells(this.activeDna, this.conductors);
  }

  firstUpdated() {
    window.addEventListener('scroll', () => {
      this.cy.resize();
    });
    this.cy = cytoscape({
      container: this.entryGraph,
      boxSelectionEnabled: false,
      autoungrabify: false,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      layout: layoutConfig,
      style: graphStyles,
    });

    this.cy.on('tap', 'node', (event) => {
      const selectedEntryId = event.target.id();
      this.updatePlayground({
        activeHash: selectedEntryId,
      });
    });

    this.cy.ready((e) => {
      setTimeout(() => {
        this.ready = true;
        this.updatedGraph();
      }, 500);
    });
  }

  updated(changedValues) {
    super.updated(changedValues);
    this.updatedGraph();
  }

  updatedGraph() {
    if (this.entryGraph.getBoundingClientRect().width === 0 || !this.ready) {
      return null;
    }

    const cells =
      this.showOnlyActiveAgentsShard && this.activeAgentPubKey
        ? [selectCell(this.activeDna, this.activeAgentPubKey, this.conductors)]
        : selectAllCells(this.activeDna, this.conductors);

    const { entries, entryTypes } = allEntries(
      cells,
      this.showEntryContents,
      this.showHeaders,
      this.excludedEntryTypes
    );

    if (
      !isEqual(
        this.lastEntriesIds,
        entries.map((e) => e.data.id)
      )
    ) {
      if (this.layout) this.layout.stop();
      this.cy.remove('node');
      this.cy.add(entries);

      this.layout = this.cy.elements().makeLayout(layoutConfig);
      this.layout.run();

      this._entryTypes = entryTypes;
    }

    this.lastEntriesIds = entries.map((e) => e.data.id);

    this.cy.filter('node').removeClass('selected');

    const activeHashElement = this.cy.getElementById(this.activeHash);
    if (activeHashElement) activeHashElement.addClass('selected');
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  renderHelp() {
    return html` <holochain-playground-help-button
      heading="Entry Graph"
      class="block-help"
    >
      <span>
        This graph contains a
        <strong>high-level view of all the entries</strong> that are present in
        the DHT. Every object you see represents an entry, and the relationships
        between them are links.
        <br />
        <br />
        Dashed relationships are embedded references, and solid relationships
        are normal holochain links. The tag of the holochain links appears as
        the label.
      </span>
    </holochain-playground-help-button>`;
  }

  renderFilter() {
    return html` <div
      class="row"
      style="align-items: center; justify-content: start; position: relative;"
    >
      <mwc-formfield label="Show Entry Contents" style="margin-right: 16px">
        <mwc-checkbox
          .checked=${this.showEntryContents}
          @change=${(e) => (this.showEntryContents = e.target.checked)}
        ></mwc-checkbox
      ></mwc-formfield>

      <mwc-formfield label="Show Headers" style="margin-right: 16px">
        <mwc-checkbox
          .checked=${this.showHeaders}
          @change=${(e) => (this.showHeaders = e.target.checked)}
        ></mwc-checkbox
      ></mwc-formfield>
      <!-- 
  Uncomment when update bug is fixed
      <mwc-formfield
        label="Show Only Active Agent's Shard"
        style="margin-right: 16px"
      >
        <mwc-checkbox
          .checked=${this.showOnlyActiveAgentsShard}
          @change=${(e) => (this.showOnlyActiveAgentsShard = e.target.checked)}
        ></mwc-checkbox
      ></mwc-formfield> -->

      <span class="vertical-divider"></span>

      <mwc-button
        label="Visible entries"
        style="--mdc-theme-primary: rgba(0,0,0,0.7); margin-left: 16px;"
        icon="arrow_drop_down"
        id="visible-entries-button"
        trailingIcon
        @click=${() => this._visibleEntriesMenu.show()}
      ></mwc-button>
      <mwc-menu
        corner="BOTTOM_END"
        multi
        activatable
        id="visible-entries-menu"
        .anchor=${this._visibleEntriesButton}
        @selected=${(e) => {
          const includedEntryTypes = [...e.detail.index];
          this.excludedEntryTypes = this._entryTypes.filter(
            (type, index) => !includedEntryTypes.includes(index)
          );
        }}
      >
        ${this._entryTypes.map(
          (type) => html`
            <mwc-list-item
              graphic="icon"
              .selected=${!this.excludedEntryTypes.includes(type)}
              .activated=${!this.excludedEntryTypes.includes(type)}
            >
              ${!this.excludedEntryTypes.includes(type)
                ? html` <mwc-icon slot="graphic">check</mwc-icon> `
                : html``}
              ${type}
            </mwc-list-item>
          `
        )}
      </mwc-menu>
    </div>`;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column fill" style="margin: 16px;">
          <span class="block-title row"
            >Entry
            Graph${this.activeDna
              ? html`
                  <span class="placeholder row">
                    , for Dna
                    <copyable-hash
                      .hash=${this.activeDna}
                      style="margin-left: 8px;"
                    ></copyable-hash>
                  </span>
                `
              : html``}</span
          >

          <div id="entry-graph" class="fill"></div>

          ${this.renderHelp()}
          ${!this.hideFilter ? this.renderFilter() : html``}
        </div>
      </mwc-card>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-checkbox': Checkbox,
      'mwc-formfield': Formfield,
      'mwc-icon-button': IconButton,
      'copyable-hash': CopyableHash,
      'mwc-card': Card,
      'mwc-menu': Menu,
      'mwc-icon': Icon,
      'mwc-list-item': ListItem,
      'mwc-button': Button,
      'holochain-playground-help-button': HelpButton,
    };
  }
}
