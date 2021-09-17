import { RowOrColumnItemConfig, StackItemConfig, ComponentItemConfig } from 'golden-layout';
export interface GetContent {
    getContent(): Promise<RowOrColumnItemConfig | StackItemConfig | ComponentItemConfig>;
}
