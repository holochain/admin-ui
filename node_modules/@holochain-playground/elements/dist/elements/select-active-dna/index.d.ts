import { PlaygroundElement } from '../../base/playground-element';
import { Select } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
export declare class SelectActiveDna extends PlaygroundElement {
    selectDNA(dna: string): void;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-list-item': typeof ListItem;
        'mwc-select': typeof Select;
        'mwc-card': typeof Card;
    };
}
