import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement } from 'lit';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';

import { GoldenLayoutDragSource } from '@scoped-elements/golden-layout';
import { GOLDEN_LAYOUT_COMPONENTS } from './components';
import { sharedStyles } from '../elements/utils/shared-styles';

export class HolochainPlaygroundGoldenLayoutMenu extends ScopedElementsMixin(
  LitElement
) {
  renderItem(label: string, componentType: string) {
    return html`
      <golden-layout-drag-source component-type="${componentType}">
        <mwc-list-item>${label}</mwc-list-item>
      </golden-layout-drag-source>
    `;
  }

  render() {
    return html`
      <span class="title">Blocks</span>
      <mwc-list
        >${GOLDEN_LAYOUT_COMPONENTS.map((component) =>
          this.renderItem(component.name, component.tag)
        )}</mwc-list
      >
    `;
  }

  static get scopedElements() {
    return {
      'mwc-list': List,
      'mwc-list-item': ListItem,
      'golden-layout-drag-source': GoldenLayoutDragSource,
    };
  }

  static get styles() {
    return [sharedStyles];
  }
}
