import { html } from 'lit';
import {
  GoldenLayout,
  GoldenLayoutRegister,
} from '@scoped-elements/golden-layout';

import { CallZomeFns } from '../elements/call-zome-fns';
import { ConductorAdmin } from '../elements/conductor-admin';
import { DhtCells } from '../elements/dht-cells';
import { EntryContents } from '../elements/entry-contents';
import { EntryGraph } from '../elements/entry-graph';
import { HappsManager } from '../elements/happs-manager';
import { SourceChain } from '../elements/source-chain';
import { ZomeFnsResults } from '../elements/zome-fns-results';
import { HolochainPlaygroundContainer } from '../base/holochain-playground-container';

export class HolochainPlaygroundGoldenLayout extends HolochainPlaygroundContainer {
  render() {
    return html`
      <golden-layout
        .scopedElements=${{
          'source-chain': SourceChain,
          'dht-cells': DhtCells,
          'conductor-admin': ConductorAdmin,
          'call-zome-fns': CallZomeFns,
          'entry-contents': EntryContents,
          'entry-graph': EntryGraph,
          'happs-manager': HappsManager,
          'zome-fns-results': ZomeFnsResults,
        }}
      >
        <golden-layout-register component-type="source-chain">
          <template>
            <source-chain style="height: 100%; width: 100%;"></source-chain>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="dht-cells">
          <template>
            <dht-cells style="height: 100%; width: 100%;"></dht-cells>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="conductor-admin">
          <template>
            <conductor-admin style="height: 100%; width: 100%;"></conductor-admin>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="call-zome-fns">
          <template>
            <call-zome-fns style="height: 100%; width: 100%;"></call-zome-fns>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-contents">
          <template>
            <entry-contents style="height: 100%; width: 100%;"></entry-contents>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="entry-graph">
          <template>
            <entry-graph style="height: 100%; width: 100%;"></entry-graph>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="happs-manager">
          <template>
            <happs-manager style="height: 100%; width: 100%;"></happs-manager>
          </template>
        </golden-layout-register>
        <golden-layout-register component-type="zome-fns-results">
          <template>
            <zome-fns-results style="height: 100%; width: 100%;"></zome-fns-results>
          </template>
        </golden-layout-register>

        ${super.render()}
      </golden-layout>
    `;
  }

  static get scopedElements() {
    return {
      ...HolochainPlaygroundContainer.scopedElements,
      'golden-layout': GoldenLayout,
      'golden-layout-register': GoldenLayoutRegister,
    };
  }
}
