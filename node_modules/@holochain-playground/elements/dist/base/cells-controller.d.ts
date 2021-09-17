import { PlaygroundElement } from './playground-element';
import { Dictionary } from '@holochain-open-dev/core-types';
import { Cell, MiddlewareSubscription } from '@holochain-playground/core';
import { ReactiveController } from 'lit';
import { CellObserver } from './cell-observer';
export declare class CellsController implements ReactiveController {
    protected host: PlaygroundElement & CellObserver;
    protected _subscriptions: Dictionary<Array<MiddlewareSubscription>>;
    observedCells: Array<Cell>;
    constructor(host: PlaygroundElement & CellObserver);
    hostUpdated(): void;
    hostDisconnected(): void;
    private getStrCellId;
    private unsubscribeFromCellId;
}
