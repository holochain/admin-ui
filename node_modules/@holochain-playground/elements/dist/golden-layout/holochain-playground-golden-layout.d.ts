import { GoldenLayout, GoldenLayoutRegister } from '@scoped-elements/golden-layout';
import { HolochainPlaygroundContainer } from '../base/holochain-playground-container';
export declare class HolochainPlaygroundGoldenLayout extends HolochainPlaygroundContainer {
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'golden-layout': typeof GoldenLayout;
        'golden-layout-register': typeof GoldenLayoutRegister;
        'mwc-circular-progress': typeof import("@scoped-elements/material-web").CircularProgress;
        'mwc-snackbar': typeof import("@scoped-elements/material-web").Snackbar;
        'mwc-icon-button': typeof import("@scoped-elements/material-web").IconButton;
    };
}
