import { html, css } from 'lit';
import { PlaygroundElement } from '../../base/playground-element';
import { selectAllDNAs } from '../../base/selectors';
import { Select } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { sharedStyles } from '../utils/shared-styles';

export class SelectActiveDna extends PlaygroundElement {
  selectDNA(dna: string) {
    this.updatePlayground({
      activeDna: dna,
    });
  }

  render() {
    const dnas = selectAllDNAs(this.conductors);
    return html`
      <mwc-card class="block-card">
        <div class="column" style="margin: 16px;">
          <span class="block-title" style="margin-bottom: 16px;"
            >Select Active Dna</span
          >
          <mwc-select
            outlined
            fullwidth
            @selected=${(e) => this.selectDNA(dnas[e.detail.index])}
          >
            ${dnas.map(
              (dna) =>
                html`
                  <mwc-list-item
                    ?selected=${this.activeDna === dna}
                    .value=${dna}
                    >${dna}</mwc-list-item
                  >
                `
            )}
          </mwc-select>
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
      `,
      sharedStyles,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-list-item': ListItem,
      'mwc-select': Select,
      'mwc-card': Card,
    };
  }
}
