import { LitElement } from 'lit';
export default class SlRadioGroup extends LitElement {
    static styles: import("lit").CSSResult;
    defaultSlot: HTMLSlotElement;
    label: string;
    fieldset: boolean;
    handleFocusIn(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-radio-group': SlRadioGroup;
    }
}
