import { LitElement } from 'lit';
import type SlMenuItem from '../menu-item/menu-item';
export default class SlMenu extends LitElement {
    static styles: import("lit").CSSResult;
    menu: HTMLElement;
    defaultSlot: HTMLSlotElement;
    private typeToSelectString;
    private typeToSelectTimeout;
    getAllItems(options?: {
        includeDisabled: boolean;
    }): SlMenuItem[];
    getCurrentItem(): SlMenuItem | undefined;
    setCurrentItem(item: SlMenuItem): void;
    typeToSelect(key: string): void;
    handleClick(event: MouseEvent): void;
    handleKeyUp(): void;
    handleKeyDown(event: KeyboardEvent): void;
    handleMouseDown(event: MouseEvent): void;
    handleSlotChange(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-menu': SlMenu;
    }
}
