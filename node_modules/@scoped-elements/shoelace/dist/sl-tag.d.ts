import { SlTag as BaseElement, SlIcon, SlIconButton } from '@shoelace-style/shoelace';
declare const SlTag_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlTag extends SlTag_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
        'sl-icon-button': typeof SlIconButton;
    };
}
export {};
