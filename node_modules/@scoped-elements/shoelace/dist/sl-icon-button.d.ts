import { SlIcon, SlIconButton as OldSlIconButton } from '@shoelace-style/shoelace';
declare const SlIconButton_base: typeof OldSlIconButton & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlIconButton extends SlIconButton_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
    };
}
export {};
