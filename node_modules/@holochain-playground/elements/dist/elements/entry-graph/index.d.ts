import { Checkbox } from '@scoped-elements/material-web';
import { IconButton } from '@scoped-elements/material-web';
import { Formfield } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { HelpButton } from '../helpers/help-button';
import { Menu } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { PlaygroundElement } from '../../base/playground-element';
import { CellObserver } from '../../base/cell-observer';
import { CellsController } from '../../base/cells-controller';
import { CopyableHash } from '../helpers/copyable-hash';
/**
 * @element entry-graph
 */
export declare class EntryGraph extends PlaygroundElement implements CellObserver {
    hideFilter: boolean;
    showEntryContents: boolean;
    showHeaders: boolean;
    showOnlyActiveAgentsShard: boolean;
    excludedEntryTypes: string[];
    private entryGraph;
    private lastEntriesIds;
    private cy;
    private layout;
    private ready;
    private _entryTypes;
    private _visibleEntriesButton;
    private _visibleEntriesMenu;
    _cellsController: CellsController;
    observedCells(): import("@holochain-playground/core").Cell[];
    firstUpdated(): void;
    updated(changedValues: any): void;
    updatedGraph(): any;
    static get styles(): import("lit").CSSResult[];
    renderHelp(): import("lit").TemplateResult<1>;
    renderFilter(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-checkbox': typeof Checkbox;
        'mwc-formfield': typeof Formfield;
        'mwc-icon-button': typeof IconButton;
        'copyable-hash': typeof CopyableHash;
        'mwc-card': typeof Card;
        'mwc-menu': typeof Menu;
        'mwc-icon': typeof Icon;
        'mwc-list-item': typeof ListItem;
        'mwc-button': typeof Button;
        'holochain-playground-help-button': typeof HelpButton;
    };
}
