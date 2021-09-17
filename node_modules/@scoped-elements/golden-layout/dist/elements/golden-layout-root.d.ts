import { BaseElement } from '../utils/base-element';
export declare class GoldenLayoutRoot extends BaseElement {
    initLayout(el: Element | undefined): void;
    getRoot(): Promise<import("golden-layout").RowOrColumnItemConfig | import("golden-layout").StackItemConfig | import("golden-layout").ComponentItemConfig>;
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    static get styles(): any[];
}
