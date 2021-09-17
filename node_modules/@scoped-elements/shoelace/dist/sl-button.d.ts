import { SlButton as BaseElement, SlSpinner } from '@shoelace-style/shoelace';
declare const SlButton_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlButton extends SlButton_base {
    static get scopedElements(): {
        'sl-spinner': typeof SlSpinner;
    };
}
export {};
