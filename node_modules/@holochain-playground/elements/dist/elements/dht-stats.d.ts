import { Dialog } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { TextField } from '@scoped-elements/material-web';
import { LinearProgress } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../base/playground-element';
export declare class DhtStats extends PlaygroundElement {
    private statsHelp;
    private nNodes;
    private rFactor;
    private timeout;
    private processing;
    static get styles(): import("lit").CSSResult;
    get activeCell(): import("@holochain-playground/core").Cell;
    get allCells(): import("@holochain-playground/core").Cell[];
    renderStatsHelp(): import("lit").TemplateResult<1>;
    republish(): Promise<void>;
    updateDHTStats(): void;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-linear-progress': typeof LinearProgress;
        'mwc-textfield': typeof TextField;
        'mwc-icon-button': typeof IconButton;
        'mwc-dialog': typeof Dialog;
    };
}
