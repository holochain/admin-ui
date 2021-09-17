import { SlBreadcrumb as OldSlBreadcrumb, SlIcon } from '@shoelace-style/shoelace';
declare const SlBreadcrumb_base: typeof OldSlBreadcrumb & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlBreadcrumb extends SlBreadcrumb_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
    };
}
export {};
