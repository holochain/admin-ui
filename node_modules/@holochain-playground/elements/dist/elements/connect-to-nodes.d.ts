import { TextField, IconButton, Button, Dialog } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../base/playground-element';
export declare class ConnectToNodes extends PlaygroundElement {
    private open;
    private urlsState;
    static get styles(): import("lit").CSSResult;
    getUrlFields(): TextField[];
    setConnectionValidity(element: any): void;
    updateFields(): void;
    renderDialog(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-button': typeof Button;
        'mwc-dialog': typeof Dialog;
        'mwc-textfield': typeof TextField;
        'mwc-icon-button': typeof IconButton;
    };
}
