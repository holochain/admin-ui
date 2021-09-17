import { SlTabGroup as BaseElement, SlIcon } from '@shoelace-style/shoelace';
import { SlIconButton } from './sl-icon-button';
declare const SlTabGroup_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlTabGroup extends SlTabGroup_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
        'sl-icon-button': typeof SlIconButton;
    };
}
export {};
