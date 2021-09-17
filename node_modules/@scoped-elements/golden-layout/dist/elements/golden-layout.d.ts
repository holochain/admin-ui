import { Constructor } from '@open-wc/scoped-elements/types/src/types';
import { GoldenLayout as GoldenLayoutClass, LayoutConfig, ResolvedLayoutConfig } from 'golden-layout';
import { ContextProvider } from '@lit-labs/context';
import { BaseElement } from '../utils/base-element';
export declare class GoldenLayout extends BaseElement {
    scopedElements: {
        [key: string]: Constructor<HTMLElement>;
    } | undefined;
    layoutConfig: LayoutConfig | undefined;
    _goldenLayoutContext: ContextProvider<import("@lit-labs/context").Context<GoldenLayoutClass>>;
    connectedCallback(): void;
    saveLayout(): ResolvedLayoutConfig;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
}
