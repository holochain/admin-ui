import type { TriggerOptions } from './createDomEvent';
import { ComponentInternalInstance, ComponentPublicInstance } from 'vue';
import { DomEventNameWithModifier } from './constants/dom-events';
import type { VueWrapper } from './vueWrapper';
import type { DOMWrapper } from './domWrapper';
import { FindAllComponentsSelector, FindComponentSelector } from './types';
export default abstract class BaseWrapper<ElementType extends Element> {
    private readonly wrapperElement;
    get element(): ElementType & {
        __vueParentComponent?: ComponentInternalInstance | undefined;
    };
    constructor(element: ElementType);
    abstract find(selector: string): DOMWrapper<Element>;
    abstract findAll(selector: string): DOMWrapper<Element>[];
    abstract findComponent<T extends ComponentPublicInstance>(selector: FindComponentSelector | (new () => T)): VueWrapper<T>;
    abstract findAllComponents(selector: FindAllComponentsSelector): VueWrapper<any>[];
    abstract html(): string;
    classes(): string[];
    classes(className: string): boolean;
    attributes(): {
        [key: string]: string;
    };
    attributes(key: string): string;
    text(): string;
    exists(): boolean;
    get<K extends keyof HTMLElementTagNameMap>(selector: K): Omit<DOMWrapper<HTMLElementTagNameMap[K]>, 'exists'>;
    get<K extends keyof SVGElementTagNameMap>(selector: K): Omit<DOMWrapper<SVGElementTagNameMap[K]>, 'exists'>;
    get<T extends Element>(selector: string): Omit<DOMWrapper<T>, 'exists'>;
    getComponent<T extends ComponentPublicInstance>(selector: FindComponentSelector | (new () => T)): Omit<VueWrapper<T>, 'exists'>;
    protected isDisabled: () => boolean;
    trigger(eventString: DomEventNameWithModifier, options?: TriggerOptions): Promise<void>;
    trigger(eventString: string, options?: TriggerOptions): Promise<void>;
}
