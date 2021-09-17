import { Button } from '@scoped-elements/material-web';
import { Dialog } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../../base/playground-element';
export declare class HelpButton extends PlaygroundElement {
    heading: string;
    _helpDialog: Dialog;
    renderHelpDialog(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-icon-button': typeof IconButton;
        'mwc-button': typeof Button;
        'mwc-dialog': typeof Dialog;
    };
}
