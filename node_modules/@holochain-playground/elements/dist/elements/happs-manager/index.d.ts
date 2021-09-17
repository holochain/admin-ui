import { PropertyValues } from 'lit';
import { PlaygroundElement } from '../../base/playground-element';
import { Select } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { Drawer } from '@scoped-elements/material-web';
import { List } from '@scoped-elements/material-web';
import { LightDnaSlot, LightHappBundle } from '../../base/context';
import { TextField } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { IconButton } from '@scoped-elements/material-web';
export interface EditingHappBundle {
    name: string;
    description: string;
    slots: Array<[string, LightDnaSlot]>;
}
export declare class HappsManager extends PlaygroundElement {
    _selectedHappId: string;
    _editingHapp: EditingHappBundle | undefined;
    _lastSelectedDna: string | undefined;
    _newDnaCount: number;
    _newHappCount: number;
    get _activeHapp(): LightHappBundle;
    get _editingHappValid(): boolean;
    firstUpdated(): void;
    update(changedValues: PropertyValues): void;
    renderDnaSlot(index: number, slotNick: string, dnaSlot: LightDnaSlot): import("lit").TemplateResult<1>;
    setupHappNameTextfield(field: TextField): void;
    setupNickField(field: TextField, oldValue: string): void;
    saveHapp(): void;
    renderBottomBar(): import("lit").TemplateResult<1>;
    renderHappDetail(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-list-item': typeof ListItem;
        'mwc-icon-button': typeof IconButton;
        'mwc-textfield': typeof TextField;
        'mwc-list': typeof List;
        'copyable-hash': typeof CopyableHash;
        'mwc-select': typeof Select;
        'mwc-card': typeof Card;
        'mwc-button': typeof Button;
        'mwc-drawer': typeof Drawer;
    };
}
