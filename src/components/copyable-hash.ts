import { html, LitElement, css } from "lit";
import { property, query } from "lit/decorators.js";
import "@material/mwc-icon-button";
import { Snackbar } from "@material/mwc-snackbar";
import "@material/mwc-snackbar";

export class CopyableHash extends LitElement {
  @property({ type: String })
  hash!: string;
  @property({ type: Number })
  sliceLength: number = 8;

  @query("#copy-notification")
  _copyNotification!: Snackbar;

  async copyHash() {
    await navigator.clipboard.writeText(this.hash);
    this._copyNotification.show();
  }

  render() {
    return html`
      <mwc-snackbar
        id="copy-notification"
        labelText="Hash copied to clipboard"
      ></mwc-snackbar>
      <div class="row center-content">
        <span style="font-family: monospace;"
          >${this.hash.substring(0, this.sliceLength)}...</span
        >
        <mwc-icon-button
          style="--mdc-icon-button-size	: 24px; --mdc-icon-size: 20px;"
          icon="content_copy"
          @click=${() => this.copyHash()}
        ></mwc-icon-button>
      </div>
    `;
  }

  static get styles() {
    return css`
      .row {
        display: flex;
        flex-direction: row;
      }
      .column {
        display: flex;
        flex-direction: column;
      }
      .fill {
        flex: 1;
      }
      .center-content {
        align-items: center;
        justify-content: center;
        display: flex;
      }
    `;
  }
}
