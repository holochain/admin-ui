import { LitElement } from 'lit';
import { IconButton } from '@scoped-elements/material-web';
import { Snackbar } from '@scoped-elements/material-web';
declare const CopyableHash_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class CopyableHash extends CopyableHash_base {
    hash: string;
    sliceLength: number;
    _copyNotification: Snackbar;
    copyHash(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
    static get scopedElements(): {
        'mwc-icon-button': typeof IconButton;
        'mwc-snackbar': typeof Snackbar;
    };
}
export {};
