import { LitElement } from "lit";
import "@material/mwc-icon-button";
import { Snackbar } from "@material/mwc-snackbar";
import "@material/mwc-snackbar";
export declare class CopyableHash extends LitElement {
    hash: string;
    sliceLength: number;
    _copyNotification: Snackbar;
    copyHash(): Promise<void>;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
}
