import { ComponentPublicInstance, App } from 'vue';
import { DOMWrapper } from './domWrapper';
import { FindAllComponentsSelector, FindComponentSelector } from './types';
import BaseWrapper from './baseWrapper';
import WrapperLike from './interfaces/wrapperLike';
export declare class VueWrapper<T extends ComponentPublicInstance> extends BaseWrapper<T['$el']> implements WrapperLike {
    private componentVM;
    private rootVM;
    private __app;
    private __setProps;
    constructor(app: App | null, vm: ComponentPublicInstance, setProps?: (props: Record<string, unknown>) => void);
    private get hasMultipleRoots();
    private get parentElement();
    private attachNativeEventListener;
    get element(): Element;
    get vm(): T;
    props(): {
        [key: string]: any;
    };
    props(selector: string): any;
    emitted<T = unknown>(): Record<string, T[]>;
    emitted<T = unknown>(eventName: string): undefined | T[];
    html(): string;
    find<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>;
    find<K extends keyof SVGElementTagNameMap>(selector: K): DOMWrapper<SVGElementTagNameMap[K]>;
    find<T extends Element>(selector: string): DOMWrapper<T>;
    findComponent<T extends ComponentPublicInstance>(selector: FindComponentSelector | (new () => T)): VueWrapper<T>;
    getComponent<T extends ComponentPublicInstance>(selector: FindComponentSelector | (new () => T)): Omit<VueWrapper<T>, 'exists'>;
    findAllComponents(selector: FindAllComponentsSelector): VueWrapper<T>[];
    findAll<K extends keyof HTMLElementTagNameMap>(selector: K): DOMWrapper<HTMLElementTagNameMap[K]>[];
    findAll<K extends keyof SVGElementTagNameMap>(selector: K): DOMWrapper<SVGElementTagNameMap[K]>[];
    findAll<T extends Element>(selector: string): DOMWrapper<T>[];
    isVisible(): boolean;
    setData(data: Record<string, unknown>): Promise<void>;
    setProps(props: Record<string, unknown>): Promise<void>;
    setValue(value: unknown, prop?: string): Promise<void>;
    unmount(): void;
}
export declare function createWrapper<T extends ComponentPublicInstance>(app: App | null, vm: ComponentPublicInstance, setProps?: (props: Record<string, unknown>) => void): VueWrapper<T>;
