import { LitElement } from 'lit';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { GoldenLayoutDragSource } from '@scoped-elements/golden-layout';
declare const HolochainPlaygroundGoldenLayoutMenu_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class HolochainPlaygroundGoldenLayoutMenu extends HolochainPlaygroundGoldenLayoutMenu_base {
    renderItem(label: string, componentType: string): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-list': typeof List;
        'mwc-list-item': typeof ListItem;
        'golden-layout-drag-source': typeof GoldenLayoutDragSource;
    };
    static get styles(): import("lit").CSSResult[];
}
export {};
