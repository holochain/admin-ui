import { StackItemConfig } from 'golden-layout';
import { CollectionElement } from '../utils/collection-element';
import { GetContent } from '../utils/get-content';
export declare class GoldenLayoutStack extends CollectionElement implements GetContent {
    getContent(): Promise<StackItemConfig>;
}
