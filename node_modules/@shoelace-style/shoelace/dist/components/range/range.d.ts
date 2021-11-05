import { LitElement } from 'lit';
export default class SlRange extends LitElement {
    static styles: import("lit").CSSResult;
    input: HTMLInputElement;
    output: HTMLOutputElement;
    private inputId;
    private helpTextId;
    private labelId;
    private resizeObserver;
    private hasFocus;
    private hasHelpTextSlot;
    private hasLabelSlot;
    private hasTooltip;
    name: string;
    value: number;
    label: string;
    helpText: string;
    disabled: boolean;
    invalid: boolean;
    min: number;
    max: number;
    step: number;
    tooltip: 'top' | 'bottom' | 'none';
    tooltipFormatter: (value: number) => string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    setCustomValidity(message: string): void;
    handleInput(): void;
    handleBlur(): void;
    handleValueChange(): void;
    handleDisabledChange(): void;
    handleFocus(): void;
    handleSlotChange(): void;
    handleThumbDragStart(): void;
    handleThumbDragEnd(): void;
    syncRange(): void;
    syncProgress(percent: number): void;
    syncTooltip(percent: number): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-range': SlRange;
    }
}
