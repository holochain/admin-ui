import { JsonViewer } from '@power-elements/json-viewer';
import { Card } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { PlaygroundElement } from '../../base/playground-element';
/**
 * @element entry-contents
 */
export declare class EntryContents extends PlaygroundElement {
    static get styles(): import("lit").CSSResult[];
    get activeHashedContent(): any;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'json-viewer': typeof JsonViewer;
        'mwc-card': typeof Card;
        'copyable-hash': typeof CopyableHash;
    };
}
