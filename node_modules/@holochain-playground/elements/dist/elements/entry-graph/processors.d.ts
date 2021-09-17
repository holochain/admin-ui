import { Cell } from '@holochain-playground/core';
export declare function allEntries(cells: Cell[], showEntryContents: boolean, showHeaders: boolean, excludedEntryTypes: string[]): {
    entries: any[];
    entryTypes: string[];
};
export declare function getImplicitLinks(allEntryIds: string[], value: any): Array<{
    label: string;
    target: string;
}>;
