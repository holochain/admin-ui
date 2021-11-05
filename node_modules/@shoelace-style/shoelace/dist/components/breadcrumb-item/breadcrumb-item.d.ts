import { LitElement } from 'lit';
export default class SlBreadcrumbItem extends LitElement {
    static styles: import("lit").CSSResult;
    hasPrefix: boolean;
    hasSuffix: boolean;
    href: string;
    target: '_blank' | '_parent' | '_self' | '_top';
    rel: string;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-breadcrumb-item': SlBreadcrumbItem;
    }
}
