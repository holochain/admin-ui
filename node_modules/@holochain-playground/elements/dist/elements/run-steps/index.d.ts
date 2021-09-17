import { PlaygroundElement } from '../../base/playground-element';
import { ListItem } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { List } from '@scoped-elements/material-web';
import { Button } from '@scoped-elements/material-web';
import { CircularProgress } from '@scoped-elements/material-web';
export interface Step {
    title: (context: PlaygroundElement) => string;
    run: (context: PlaygroundElement) => Promise<void>;
}
export declare class RunSteps extends PlaygroundElement {
    steps: Array<Step>;
    _runningStepIndex: number | undefined;
    _running: boolean;
    runSteps(): Promise<void>;
    awaitNetworkConsistency(): Promise<unknown>;
    renderContent(): any;
    render(): any;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-list-item': typeof ListItem;
        'mwc-list': typeof List;
        'mwc-button': typeof Button;
        'mwc-card': typeof Card;
    };
}
