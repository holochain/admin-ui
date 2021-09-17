import { property, query } from 'lit/decorators.js';
import { html } from 'lit';
import { Button } from '@scoped-elements/material-web';
import { Dialog } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../../base/playground-element';

export class HelpButton extends PlaygroundElement {
  @property({ type: String })
  heading: string;

  @query('#help-dialog')
  _helpDialog: Dialog;

  renderHelpDialog() {
    return html`
      <mwc-dialog id="help-dialog" .heading=${this.heading}>
        <slot></slot>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
  }

  render() {
    return html`
      ${this.renderHelpDialog()}
      <mwc-icon-button
        icon="help_outline"
        @click=${() => this._helpDialog.show()}
      ></mwc-icon-button>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-icon-button': IconButton,
      'mwc-button': Button,
      'mwc-dialog': Dialog,
    };
  }
}
