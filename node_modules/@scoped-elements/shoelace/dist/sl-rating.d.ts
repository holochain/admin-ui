import { SlRating as BaseElement, SlIcon } from '@shoelace-style/shoelace';
declare const SlRating_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlRating extends SlRating_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
    };
}
export {};
