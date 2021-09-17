import { Conductor, SimulatedHappBundle } from '@holochain-playground/core';
import { html } from 'lit';
import { buildHappBundle } from '../../base/context';
import { PlaygroundElement } from '../../base/playground-element';
import { CallableFn } from '../helpers/call-functions';

export function adminApi(
  element: PlaygroundElement,
  conductor: Conductor
): CallableFn[] {
  const installedAppIds = Object.keys(conductor.installedHapps);

  const allHapps = Object.keys(element.happs).filter(
    (key) => !conductor.installedHapps[key]
  );

  return [
    {
      name: 'Install hApp',
      args: [
        {
          name: 'hAppId',
          field: 'custom',
          required: true,
          render(args, setValue) {
            if (allHapps.length === 0)
              return html`<span class="placeholder"
                >There are no hApps that you don't have installed</span
              >`;

            return html`<mwc-select
              outlined
              required
              label="Select Happ to Install"
              .value=${args['hAppId']}
              @selected=${(e) => setValue(allHapps[e.detail.index])}
            >
              ${allHapps.map(
                (appId) =>
                  html`<mwc-list-item .value=${appId}>${appId}</mwc-list-item>`
              )}
            </mwc-select>`;
          },
        },

        {
          name: 'membraneProofs',
          field: 'custom',
          required: false,
          render(args, setValue) {
            if (!args['hAppId'])
              return html`<div class="column">
                <span>Membrane Proofs</span
                ><span style="margin-top: 4px;" class="placeholder"
                  >Select a hApp to install</span
                >
              </div>`;

            const membraneProofs = args['membraneProofs'] || {};
            const happ = element.happs[args['hAppId']];

            return html` <div class="column">
              <span>Membrane Proofs</span>${Object.entries(happ.slots)
                .filter(([_, slot]) => !slot.deferred)
                .map(
                  ([slotNick, dnaSlot]) => html`<mwc-textfield
                    style="margin-top: 12px;"
                    outlined
                    .label=${slotNick}
                    .value=${(args['membraneProofs'] &&
                      args['membraneProofs'][slotNick]) ||
                    ''}
                    @input=${(e) =>
                      setValue({
                        ...membraneProofs,
                        [slotNick]: e.target.value,
                      })}
                  >
                  </mwc-textfield>`
                )}
            </div>`;
          },
        },
      ],
      call: async (args) => {
        const happ = buildHappBundle(element, args['hAppId']);

        await conductor.installHapp(happ, args['membraneProofs'] || {});
      },
    },
    {
      name: 'Clone DNA',
      args: [
        {
          name: 'installedAppId',
          field: 'custom',
          required: true,
          render(args, setValue) {
            return html`<mwc-select
              outlined
              label="Select Happ"
              .value=${args['installedAppId']}
              @selected=${(e) => setValue(installedAppIds[e.detail.index])}
            >
              ${installedAppIds.map(
                (installedAppId) =>
                  html`<mwc-list-item .value=${installedAppId}
                    >${installedAppId}</mwc-list-item
                  >`
              )}
            </mwc-select>`;
          },
        },
        {
          name: 'slotNick',
          field: 'custom',
          required: true,
          render(args, setValue) {
            const slotNicks = args.installedAppId
              ? Object.keys(conductor.installedHapps[args.installedAppId].slots)
              : [];
            return html`<mwc-select
              outlined
              label="Select DNA Slot"
              .value=${args['slotNick']}
              @selected=${(e) => setValue(slotNicks[e.detail.index])}
            >
              ${slotNicks.map(
                (nick) =>
                  html`<mwc-list-item .value=${nick}>${nick}</mwc-list-item>`
              )}
            </mwc-select>`;
          },
        },
        { name: 'uid', field: 'textfield', type: 'String' },
        {
          name: 'properties',
          field: 'custom',
          render(args, setValue) {
            const properties = args['properties'] || {};

            const propertyNames = args['slotNick']
              ? Object.keys(
                  conductor.registeredDnas[
                    conductor.installedHapps[args.installedAppId].slots[
                      args.slotNick
                    ].base_cell_id[0]
                  ].properties
                )
              : [];
            return html`<div class="column">
              <span>Properties</span>
              ${args['slotNick']
                ? propertyNames.length === 0
                  ? html`<span style="margin-top: 4px;" class="placeholder"
                      >This DNA has no properties</span
                    >`
                  : html`
                      ${propertyNames.map(
                        (property) => html`<mwc-textfield
                          style="margin-top: 8px"
                          outlined
                          label=${property}
                          .value=${properties[property] || ''}
                          @input=${(e) =>
                            setValue({
                              ...properties,
                              [property]: e.target.value,
                            })}
                        ></mwc-textfield>`
                      )}
                    `
                : html`<span style="margin-top: 4px;" class="placeholder"
                    >Select a slot</span
                  >`}
            </div>`;
          },
        },
        { name: 'membraneProof', field: 'textfield', type: 'String' },
      ],
      call: async (args) => {
        try {
          const cell = await conductor.cloneCell(
            args.installedAppId,
            args.slotNick,
            args.uid,
            args.properties,
            args.membraneProof
          );

          element.updatePlayground({
            activeDna: cell.dnaHash,
            activeAgentPubKey: cell.agentPubKey,
          });
        } catch (e) {
          element.showMessage(`Error: ${e.message}`);
        }
      },
    },
  ];
}
