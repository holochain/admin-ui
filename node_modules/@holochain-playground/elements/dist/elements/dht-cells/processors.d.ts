import { Cell } from '@holochain-playground/core';
export declare function dhtCellsNodes(cells: Cell[]): {
    data: {
        id: string;
        label: string;
    };
    classes: string[];
}[];
export declare function neighborsEdges(cells: Cell[]): any[];
