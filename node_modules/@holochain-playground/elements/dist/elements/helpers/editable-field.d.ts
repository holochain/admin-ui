import { LitElement } from 'lit';
import { IconButton } from '@scoped-elements/material-web';
declare const EditableField_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class EditableField extends EditableField_base {
    value: any;
    _editing: boolean;
    _newValue: any;
    _valid: boolean;
    save(): void;
    cancel(): void;
    firstUpdated(): void;
    setupField(fieldSlot: HTMLSlotElement): void;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'mwc-icon-button': typeof IconButton;
    };
    static styles: import("lit").CSSResult[];
}
export {};
