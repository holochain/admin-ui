import { SlSelect as BaseElement, SlIcon, SlMenu, SlDropdown } from '@shoelace-style/shoelace';
import { SlIconButton } from './sl-icon-button';
import { SlTag } from './sl-tag';
declare const SlSelect_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlSelect extends SlSelect_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
        'sl-icon-button': typeof SlIconButton;
        'sl-menu': typeof SlMenu;
        'sl-tag': typeof SlTag;
        'sl-dropdown': typeof SlDropdown;
    };
}
export {};
