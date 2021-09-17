import { RowOrColumnItemConfig } from 'golden-layout';
import { CollectionElement } from '../utils/collection-element';
import { GetContent } from '../utils/get-content';
export declare class GoldenLayoutColumn extends CollectionElement implements GetContent {
    getContent(): Promise<RowOrColumnItemConfig>;
}
