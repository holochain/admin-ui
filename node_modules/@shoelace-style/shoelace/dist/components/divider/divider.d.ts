import { LitElement } from 'lit';
export default class SlDivider extends LitElement {
    static styles: import("lit").CSSResult;
    vertical: boolean;
    firstUpdated(): void;
    handleVerticalChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-divider': SlDivider;
    }
}
