import { html } from 'lit';

export default {
  title: 'Call Zome Fns',
  component: 'call-zome-fns',
};

export const Simple = () => {
  return html`
    <holochain-playground-container
      .numberOfSimulatedConductors=${1}
      @ready=${(e) => {
        const conductor = e.detail.conductors[0];

        const cellId = conductor.getAllCells()[0].cellId;

        e.target.activeAgentPubKey = cellId[1];
      }}
    >
      <call-zome-fns style="flex: 1; min-height: 500px;"></call-zome-fns>
    </holochain-playground-container>
  `;
};
