import { LitElement } from 'lit';
export default class SlProgressRing extends LitElement {
    static styles: import("lit").CSSResult;
    indicator: SVGCircleElement;
    indicatorOffset: string;
    value: number;
    label: string;
    updated(changedProps: Map<string, any>): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-progress-ring': SlProgressRing;
    }
}
