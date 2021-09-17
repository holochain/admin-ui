import { LitElement } from 'lit';
declare const BaseElement_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class BaseElement extends BaseElement_base {
    _slottedChildren: Array<HTMLElement> | undefined;
    firstUpdated(): void;
    getSlottedChildren(): Promise<Array<HTMLElement>>;
}
export {};
