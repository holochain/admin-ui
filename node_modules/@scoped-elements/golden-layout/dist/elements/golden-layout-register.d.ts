import { GoldenLayout } from 'golden-layout';
import { BaseElement } from '../utils/base-element';
export declare class GoldenLayoutRegister extends BaseElement {
    componentType: string;
    register(goldenLayout: GoldenLayout, template: HTMLTemplateElement): void;
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
