import { LitElement } from 'lit';
import '../icon/icon';
export default class SlBreadcrumb extends LitElement {
    static styles: import("lit").CSSResult;
    defaultSlot: HTMLSlotElement;
    separatorSlot: HTMLSlotElement;
    label: string;
    private getSeparator;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-breadcrumb': SlBreadcrumb;
    }
}
