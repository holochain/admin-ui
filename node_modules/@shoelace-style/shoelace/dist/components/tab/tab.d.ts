import { LitElement } from 'lit';
import '../icon-button/icon-button';
export default class SlTab extends LitElement {
    static styles: import("lit").CSSResult;
    tab: HTMLElement;
    private componentId;
    panel: string;
    active: boolean;
    closable: boolean;
    disabled: boolean;
    focus(options?: FocusOptions): void;
    blur(): void;
    handleCloseClick(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-tab': SlTab;
    }
}
