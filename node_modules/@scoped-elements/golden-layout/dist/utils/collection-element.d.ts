import { ItemElement } from './item-element';
export declare class CollectionElement extends ItemElement {
    getCollectionContent(): Promise<(import("golden-layout").RowOrColumnItemConfig | import("golden-layout").StackItemConfig | import("golden-layout").ComponentItemConfig)[]>;
    render(): import("lit-html").TemplateResult<1>;
}
