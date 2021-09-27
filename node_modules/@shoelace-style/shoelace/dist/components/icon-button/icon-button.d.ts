import { LitElement } from 'lit';
import '../icon/icon';
export default class SlIconButton extends LitElement {
    static styles: import("lit").CSSResult;
    button: HTMLButtonElement | HTMLLinkElement;
    name: string;
    library: string;
    src: string;
    href: string;
    target: '_blank' | '_parent' | '_self' | '_top';
    download: string;
    label: string;
    disabled: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-icon-button': SlIconButton;
    }
}
