import { SlIcon, SlInput as BaseElement } from '@shoelace-style/shoelace';
declare const SlInput_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlInput extends SlInput_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
    };
}
export {};
