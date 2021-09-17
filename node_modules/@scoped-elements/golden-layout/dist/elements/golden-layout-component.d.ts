import { ComponentItemConfig } from 'golden-layout';
import { GetContent } from '../utils/get-content';
import { ItemElement } from '../utils/item-element';
export declare class GoldenLayoutComponent extends ItemElement implements GetContent {
    componentType: string;
    title: string;
    unclosable: boolean;
    getContent(): Promise<ComponentItemConfig>;
    render(): import("lit-html").TemplateResult<1>;
}
