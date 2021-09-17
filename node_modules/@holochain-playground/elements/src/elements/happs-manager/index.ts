import { html, css, PropertyValues } from 'lit';
import { PlaygroundElement } from '../../base/playground-element';
import { Select } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { sharedStyles } from '../utils/shared-styles';
import { Drawer } from '@scoped-elements/material-web';
import { state } from 'lit/decorators.js';
import { List } from '@scoped-elements/material-web';
import { LightDnaSlot, LightHappBundle } from '../../base/context';
import { TextField } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { ref } from 'lit/directives/ref.js';
import { CopyableHash } from '../helpers/copyable-hash';
import { IconButton } from '@scoped-elements/material-web';
import { cloneDeep, uniq } from 'lodash-es';
import { classMap } from 'lit/directives/class-map.js';

export interface EditingHappBundle {
  name: string;
  description: string;
  slots: Array<[string, LightDnaSlot]>;
}

function unwrapEditable(happ: EditingHappBundle): LightHappBundle {
  const slots = happ.slots.reduce(
    (acc, next) => ({ ...acc, [next[0]]: next[1] }),
    {}
  );
  return {
    name: happ.name,
    description: happ.description,
    slots,
  };
}

function wrapEditable(happ: LightHappBundle): EditingHappBundle {
  const slots = Object.entries(happ.slots);
  return {
    name: happ.name,
    description: happ.description,
    slots: cloneDeep(slots),
  };
}

export class HappsManager extends PlaygroundElement {
  @state()
  _selectedHappId: string;
  @state()
  _editingHapp: EditingHappBundle | undefined = undefined;

  _lastSelectedDna: string | undefined = undefined;
  _newDnaCount = 0;
  _newHappCount = 0;

  get _activeHapp(): LightHappBundle {
    return this.happs[this._selectedHappId];
  }

  get _editingHappValid(): boolean {
    const textfields = this.shadowRoot.querySelectorAll('mwc-textfield');

    for (let i = 0; i < textfields.length; i++) {
      if (!(textfields.item(i) as HTMLInputElement).validity.valid)
        return false;
    }

    const names = this._editingHapp.slots.map(([name, _]) => name);
    if (uniq(names).length !== names.length) return false;

    return true;
  }

  firstUpdated() {
    this._selectedHappId = Object.keys(this.happs)[0];
  }

  update(changedValues: PropertyValues) {
    super.update(changedValues);

    if (
      this._editingHapp &&
      changedValues.has('activeDna') &&
      this.activeDna !== changedValues.get('activeDna')
    ) {
      // If there is a newly compiled dna and the last dna was the _lastSelectedDna, update it
      for (const slot of this._editingHapp.slots) {
        if (slot[1].dnaHash === this._lastSelectedDna) {
          slot[1].dnaHash = changedValues.get('activeDna') as string;
        }
      }
    }
  }

  renderDnaSlot(index: number, slotNick: string, dnaSlot: LightDnaSlot) {
    const knownDnas = Object.keys(this.dnas);

    return html`<div class="row center-content" style="margin-top: 12px;">
      ${this._editingHapp
        ? html` <mwc-icon-button
              style="align-self: start; margin-top: 4px;"
              icon="delete"
              .disabled=${Object.keys(this._editingHapp.slots).length === 1}
              @click=${() => {
                this._editingHapp.slots.splice(index, 1);
                this.requestUpdate();
              }}
            ></mwc-icon-button>
            <mwc-textfield
              style="width: 8em; margin-left: 16px;"
              outlined
              label="Nick"
              autoValidate
              .value=${slotNick}
              validationMessage="Already exists"
              @input=${(e) => {
                this._editingHapp.slots[index][0] = e.target.value;
                this.requestUpdate();
              }}
              ${ref((f: TextField) => this.setupNickField(f, slotNick))}
            ></mwc-textfield>`
        : html` <span style="width: 8em;">${slotNick}</span> `}
      ${this._editingHapp
        ? html`<mwc-select
            outlined
            label="Dna"
            style="flex: 1; margin-left: 16px;"
            validationMessage="STUB"
            @selected=${(e) => {
              this._editingHapp.slots[index][1].dnaHash =
                knownDnas[e.detail.index];
              this.requestUpdate();
            }}
            .value=${dnaSlot.dnaHash}
          >
            ${knownDnas.map(
              (dnaHash) => html`
                <mwc-list-item
                  ?selected=${dnaSlot.dnaHash === dnaHash}
                  .value=${dnaSlot.dnaHash}
                  >${dnaHash}</mwc-list-item
                >
              `
            )}
          </mwc-select>`
        : html`
            <copyable-hash
              style="margin-left: 16px; flex: 1;"
              .hash=${dnaSlot.dnaHash}
            ></copyable-hash>
          `}
      <mwc-button
        .disabled=${this.activeDna === dnaSlot.dnaHash}
        @click=${() => {
          this._lastSelectedDna = dnaSlot.dnaHash;
          this.updatePlayground({ activeDna: dnaSlot.dnaHash });
        }}
        style="margin-left: 16px; align-self: start; margin-top: 10px;"
        label="Show Dna"
      ></mwc-button>
    </div>`;
  }

  setupHappNameTextfield(field: TextField) {
    if (!field) return;

    field.validityTransform = (newValue, nativeValidity) => {
      if (!nativeValidity.valid) return nativeValidity;
      if (this.happs[newValue] && this._activeHapp.name !== newValue) {
        return {
          valid: false,
          customError: true,
        };
      }
      return {
        valid: true,
      };
    };
  }
  setupNickField(field: TextField, oldValue: string) {
    if (!field) return;

    field.validityTransform = (newValue, nativeValidity) => {
      const isDifferent = oldValue !== newValue;
      if (!nativeValidity.valid) {
        return nativeValidity;
      }
      if (this._editingHapp.slots[newValue] && isDifferent) {
        return {
          valid: false,
          customError: true,
        };
      }
      return {
        valid: true,
      };
    };
  }

  saveHapp() {
    const oldHapp = this._activeHapp;
    const oldname = oldHapp.name;
    this.happs[oldname] = undefined;
    delete this.happs[oldname];

    const newName = this._editingHapp.name;
    this.happs[newName] = unwrapEditable(this._editingHapp);
    this._editingHapp = undefined;
    this._selectedHappId = newName;
  }

  renderBottomBar() {
    return html`<div class="row" style="margin-top: 8px;">
      <div style="flex: 1;">
        ${this._editingHapp
          ? html`
              <mwc-button
                label="Add Slot"
                @click=${() => {
                  this._editingHapp.slots.push([
                    `New Slot ${this._newDnaCount++}`,
                    {
                      deferred: false,
                      dnaHash: Object.keys(this.dnas)[0],
                    },
                  ]);
                  this.requestUpdate();
                }}
              ></mwc-button>
            `
          : html``}
      </div>

      ${this._editingHapp
        ? html` <mwc-button
              label="Delete"
              raised
              style="--mdc-theme-primary: red; margin-right: 12px;"
              @click=${() => {
                const name = this._activeHapp.name;
                this.happs[name] = undefined;
                delete this.happs[name];

                this._selectedHappId = undefined;
                this._editingHapp = undefined;
              }}
            ></mwc-button>
            <mwc-button
              label="Cancel"
              @click=${() => (this._editingHapp = undefined)}
              style="margin-right: 12px;"
            ></mwc-button
            ><mwc-button
              label="Save"
              raised
              .disabled=${!this._editingHappValid}
              @click=${() => this.saveHapp()}
            ></mwc-button>`
        : html`
            <mwc-button
              label="Edit"
              @click=${() =>
                (this._editingHapp = wrapEditable(this._activeHapp))}
            ></mwc-button>
          `}
    </div>`;
  }

  renderHappDetail() {
    const happ = this._editingHapp || this._activeHapp;
    if (!happ)
      return html`<div class="column center-content" style="flex: 1;">
        <span class="placeholder">Selected a hApp to see its details</span>
      </div>`;
    const slots = this._editingHapp
      ? this._editingHapp.slots
      : Object.entries(this._activeHapp.slots);

    return html`<div class="column" style="padding: 16px; flex: 1;">
      <div class="column" style="flex: 1;">
        <div class="row">
          <div class="column" style="flex: 1;">
            ${this._editingHapp
              ? html`
                  <mwc-textfield
                    .value=${happ.name}
                    outlined
                    label="Name"
                    autoValidate
                    validationMessage="hApp name already exists"
                    ${ref(this.setupHappNameTextfield)}
                    @input=${(e) => {
                      this._editingHapp.name = e.target.value;
                      this.requestUpdate();
                    }}
                    style="margin-bottom: 4px;"
                  ></mwc-textfield>
                  <mwc-textfield
                    outlined
                    .value=${happ.description}
                    @input=${(e) =>
                      (this._editingHapp.description = e.target.value)}
                    label="Description"
                  ></mwc-textfield>
                `
              : html`
                  <span style="font-size: 22px;">${happ.name}</span>
                  <span style="color: grey; margin-top: 12px;"
                    >${happ.description || 'No description'}</span
                  >
                `}
          </div>
        </div>

        <span style="margin-top: 24px; margin-bottom: 16px;">Dna Slots</span>
        <hr style="width: 100%; margin: 0; opacity: 0.4;" />
        ${slots.length === 0
          ? html`<div class="column center-content" style="flex: 1;">
              <span class="placeholder" style="margin-top: 42px;"
                >There are no Dna Slots yet</span
              >
            </div>`
          : html`
              <div class="flex-scrollable-parent">
                <div class="flex-scrollable-container">
                  <div class="flex-scrollable-y" style="height: 100%">
                    ${slots.map(([nick, slot], i) =>
                      this.renderDnaSlot(i, nick, slot)
                    )}
                  </div>
                </div>
              </div>
            `}
      </div>
      ${this.renderBottomBar()}
    </div> `;
  }

  render() {
    const happs = Object.entries(this.happs);
    return html`
      <mwc-card class="block-card">
        <div class="column" style="flex: 1;">
          <span class="block-title" style="margin: 16px;">hApps</span>
          <div class="flex-scrollable-parent">
            <div class="flex-scrollable-container">
              <div class="flex-scrollable-y" style="height: 100%">
                <mwc-drawer style="--mdc-drawer-width: auto;">
                  <div class="column" style="height: 100%">
                    ${happs.length === 0
                      ? html`<div
                          class="column center-content"
                          style="flex: 1;"
                        >
                          <span class="placeholder" style="margin: 12px;"
                            >Create a hApp to start</span
                          >
                        </div>`
                      : html`
                          <mwc-list
                            style="flex: 1;"
                            class=${classMap({
                              disabled: !!this._editingHapp,
                            })}
                            activatable
                            .disabled=${this._editingHapp}
                            @selected=${(e) =>
                              (this._selectedHappId =
                                happs.length > 0
                                  ? happs[e.detail.index][1].name
                                  : undefined)}
                          >
                            ${Object.keys(this.happs).map(
                              (happId) => html`
                                <mwc-list-item
                                  .activated=${this._selectedHappId === happId}
                                  >${happId}
                                </mwc-list-item>
                              `
                            )}
                          </mwc-list>
                        `}
                    <mwc-button
                      class=${classMap({
                        disabled: !!this._editingHapp,
                      })}
                      raised
                      label="New happ"
                      @click=${() => {
                        const name = `New hApp ${this._newHappCount++}`;
                        const happ = {
                          name,
                          description: '',
                          slots: {},
                        };
                        this.happs[name] = happ;
                        this._selectedHappId = name;
                        this.requestUpdate();
                      }}
                    ></mwc-button>
                  </div>
                  <div slot="appContent" class="column" style="height: 100%;">
                    <div class="column" style="flex: 1;">
                      ${this.renderHappDetail()}
                    </div>
                  </div>
                </mwc-drawer>
              </div>
            </div>
          </div>
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
        .disabled {
          pointer-events: none;
          opacity: 0.6;
        }
      `,
      sharedStyles,
    ];
  }

  static get scopedElements() {
    return {
      'mwc-list-item': ListItem,
      'mwc-icon-button': IconButton,
      'mwc-textfield': TextField,
      'mwc-list': List,
      'copyable-hash': CopyableHash,
      'mwc-select': Select,
      'mwc-card': Card,
      'mwc-button': Button,
      'mwc-drawer': Drawer,
    };
  }
}
