import { SlAlert as OldSlAlert, SlIcon } from '@shoelace-style/shoelace';
import { SlIconButton } from './sl-icon-button';
declare const SlAlert_base: typeof OldSlAlert & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlAlert extends SlAlert_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
        'sl-icon-button': typeof SlIconButton;
    };
}
export {};
