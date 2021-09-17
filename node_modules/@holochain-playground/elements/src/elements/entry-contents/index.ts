import { html, css } from 'lit';
import { JsonViewer } from '@power-elements/json-viewer';

import { sharedStyles } from '../utils/shared-styles';
import { selectAllCells, selectFromCAS } from '../../base/selectors';
import { Card } from '@scoped-elements/material-web';
import { shortenStrRec } from '../utils/hash';
import { CopyableHash } from '../helpers/copyable-hash';
import { PlaygroundElement } from '../../base/playground-element';

/**
 * @element entry-contents
 */
export class EntryContents extends PlaygroundElement {
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

  get activeHashedContent() {
    const allCells = selectAllCells(this.activeDna, this.conductors);
    return selectFromCAS(this.activeHash, allCells);
  }

  render() {
    return html`
      <mwc-card style="width: auto; min-height: 200px;" class="fill">
        <div class="column fill" style="padding: 16px;">
          <span class="title row" style="margin-bottom: 8px;">
            ${this.activeHashedContent && this.activeHashedContent.header
              ? 'Header'
              : 'Entry'}
            Contents${this.activeHash
              ? html`<span class="row placeholder">
                  , with hash
                  <copyable-hash
                    .hash=${this.activeHash}
                    style="margin-left: 8px;"
                  ></copyable-hash
                ></span>`
              : html``}</span
          >
          ${this.activeHashedContent
            ? html`
                <div class="column fill">
                  <div class="fill flex-scrollable-parent">
                    <div class="flex-scrollable-container">
                      <div class="flex-scrollable-y" style="height: 100%;">
                        <json-viewer
                          .object=${shortenStrRec(this.activeHashedContent)}
                          class="fill"
                        ></json-viewer>
                      </div>
                    </div>
                  </div>
                </div>
              `
            : html`
                <div class="column fill center-content">
                  <span class="placeholder">Select entry to inspect</span>
                </div>
              `}
        </div>
      </mwc-card>
    `;
  }

  static get scopedElements() {
    return {
      'json-viewer': JsonViewer,
      'mwc-card': Card,
      'copyable-hash': CopyableHash,
    };
  }
}
