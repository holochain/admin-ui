import { html } from 'lit';

export default {
  title: 'DHT Cells',
  component: 'dht-cells',
};

export const Simple = () => html`
  <holochain-playground-container>
    <dht-cells style="flex: 1; min-height: 700px;"></dht-cells>
  </holochain-playground-container>
`;