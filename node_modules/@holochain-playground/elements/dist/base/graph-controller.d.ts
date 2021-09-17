/// <reference types="resize-observer-browser" />
import { LitElement, ReactiveController } from 'lit';
export interface GraphElement {
}
export declare class GraphController implements ReactiveController {
    protected host: LitElement;
    protected cy: any;
    protected layout: any;
    observer: ResizeObserver;
    constructor(host: LitElement, cy: any, layout: any);
    hostConnected(): void;
    hostUpdated(): void;
    hostDisconnected(): void;
}
