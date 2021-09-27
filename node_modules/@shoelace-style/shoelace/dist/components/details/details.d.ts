import { LitElement } from 'lit';
import '../icon/icon';
export default class SlDetails extends LitElement {
    static styles: import("lit").CSSResult;
    details: HTMLElement;
    header: HTMLElement;
    body: HTMLElement;
    private componentId;
    open: boolean;
    summary: string;
    disabled: boolean;
    firstUpdated(): void;
    show(): Promise<void>;
    hide(): Promise<void>;
    handleSummaryClick(): void;
    handleSummaryKeyDown(event: KeyboardEvent): void;
    handleOpenChange(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-details': SlDetails;
    }
}
