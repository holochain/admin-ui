import { LitElement } from 'lit';
import '../icon/icon';
export default class SlMenuItem extends LitElement {
    static styles: import("lit").CSSResult;
    menuItem: HTMLElement;
    checked: boolean;
    value: string;
    disabled: boolean;
    firstUpdated(): void;
    handleCheckedChange(): void;
    handleDisabledChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-menu-item': SlMenuItem;
    }
}
