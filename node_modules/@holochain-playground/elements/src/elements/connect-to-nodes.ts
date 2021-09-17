import { html, css } from 'lit';
import { state } from 'lit/decorators.js';

import {
  TextField,
  IconButton,
  Button,
  Dialog,
} from '@scoped-elements/material-web';
import { PlaygroundElement } from '../base/playground-element';
//import { checkConnection } from '../processors/connect-to-conductors';

export class ConnectToNodes extends PlaygroundElement {
  @state()
  private open: Boolean = false;

  private urlsState = {};

  static get styles() {
    return css`
      mwc-dialog {
        --mdc-theme-primary: black;
      }
    `;
  }

  getUrlFields(): TextField[] {
    return Array.apply(null, this.shadowRoot.querySelectorAll('.url-field'));
  }

  setConnectionValidity(element) {
    element.validityTransform = (newValue, nativeValidity) => {
      let valid = false;

      switch (this.urlsState[newValue]) {
        case 'resolved':
          element.setCustomValidity('');
          valid = true;
          break;
        case 'rejected':
          element.setCustomValidity(
            'Could not connect to node, check admin interface'
          );
          break;
        default:
          element.setCustomValidity('Checking connection...');
          break;
      }

      this.requestUpdate();
      return { valid };
    };
  }

  updateFields() {
    const fields = this.getUrlFields();
    this.conductorsUrls = fields.map((f) => f.value);
    for (const field of fields) {
      this.setConnectionValidity(field);

      if (!this.urlsState[field.value]) {
        try {
          /*  checkConnection(field.value)
            .then(() => (this.urlsState[field.value] = 'resolved'))
            .catch(() => (this.urlsState[field.value] = 'rejected'))
            .finally(() => {
              field.reportValidity();
            }); */
        } catch (e) {
          this.urlsState[field.value] = 'rejected';
          field.reportValidity();
        }
      }
      field.reportValidity();
    }
  }

  renderDialog() {
    return html`<mwc-dialog
      id="connect-to-nodes"
      .open="${!!this.open}"
      @closed=${() => (this.open = false)}
    >
      <div class="column">
        <span class="title">
          ${this.conductorsUrls ? 'Connected Nodes' : 'Connect to nodes'}
        </span>
        ${this.conductorsUrls.map(
          (url, index) => html`
            <div class="row" style="margin-bottom: 16px;">
              <mwc-textfield
                style="width: 20em;"
                class="url-field"
                outlined
                label="Conductor url"
                value=${url}
                @input=${() => this.updateFields()}
              ></mwc-textfield>
              <mwc-icon-button
                icon="clear"
                .disabled=${this.conductorsUrls.length === 1}
                style="padding-top: 4px;"
                @click=${() => {
                  this.conductorsUrls.splice(index, 1);
                  this.conductorsUrls = [...this.conductorsUrls];
                  setTimeout(() => this.updateFields());
                }}
              ></mwc-icon-button>
            </div>
          `
        )}
        <mwc-button
          label="Add node"
          icon="add"
          @click=${() => {
            this.conductorsUrls = [...this.conductorsUrls, ''];
            setTimeout(() => this.updateFields());
          }}
        >
        </mwc-button>
      </div>

      <mwc-button
        slot="primaryAction"
        dialogAction="confirm"
        label=${this.conductorsUrls
          ? 'Ok'
          : this.conductorsUrls
          ? 'Update connections'
          : 'Connect to nodes'}
        .disabled=${this.getUrlFields().length === 0 ||
        !this.getUrlFields().every((field) => field.validity.valid)}
        @click=${() =>
          this.updatePlayground({
            conductorsUrls: this.conductorsUrls,
          })}
      >
      </mwc-button>
    </mwc-dialog> `;
  }

  render() {
    return html`
      ${this.renderDialog()}
      <mwc-button
        style="margin-right: 18px;"
        label=${this.conductorsUrls ? 'CONNECTED NODES' : 'CONNECT TO NODES'}
        icon=${this.conductorsUrls ? 'sync' : 'sync_disabled'}
        @click=${() => {
          (this.shadowRoot.getElementById(
            'connect-to-nodes'
          ) as any).open = true;
        }}
      ></mwc-button>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-button': Button,
      'mwc-dialog': Dialog,
      'mwc-textfield': TextField,
      'mwc-icon-button': IconButton,
    };
  }
}
