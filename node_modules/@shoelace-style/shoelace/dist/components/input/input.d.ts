import { LitElement } from 'lit';
import '../icon/icon';
export default class SlInput extends LitElement {
    static styles: import("lit").CSSResult;
    input: HTMLInputElement;
    private inputId;
    private helpTextId;
    private labelId;
    private hasFocus;
    private hasHelpTextSlot;
    private hasLabelSlot;
    private isPasswordVisible;
    type: 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
    size: 'small' | 'medium' | 'large';
    name: string;
    value: string;
    filled: boolean;
    pill: boolean;
    label: string;
    helpText: string;
    clearable: boolean;
    togglePassword: boolean;
    placeholder: string;
    disabled: boolean;
    readonly: boolean;
    minlength: number;
    maxlength: number;
    min: number | string;
    max: number | string;
    step: number;
    pattern: string;
    required: boolean;
    invalid: boolean;
    autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    autocorrect: string;
    autocomplete: string;
    autofocus: boolean;
    spellcheck: boolean;
    inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    select(): void;
    setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection?: 'forward' | 'backward' | 'none'): void;
    setRangeText(replacement: string, start: number, end: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    handleBlur(): void;
    handleChange(): void;
    handleClearClick(event: MouseEvent): void;
    handleDisabledChange(): void;
    handleFocus(): void;
    handleInput(): void;
    handleInvalid(): void;
    handlePasswordToggle(): void;
    handleSlotChange(): void;
    handleValueChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-input': SlInput;
    }
}
