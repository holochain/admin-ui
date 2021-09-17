import { Cell, Workflow, WorkflowType, NetworkRequestInfo } from '@holochain-playground/core';
import { Subject } from 'rxjs';
import { Card } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { LinearProgress } from '@scoped-elements/material-web';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { CellObserver } from '../../base/cell-observer';
import { PlaygroundElement } from '../../base/playground-element';
export declare class CellTasks extends PlaygroundElement implements CellObserver {
    /** Public properties */
    cell: Cell;
    workflowsToDisplay: WorkflowType[];
    workflowDelay: number;
    hideErrors: boolean;
    showZomeFnSuccess: boolean;
    stepByStep: boolean;
    _onPause: boolean;
    _resumeObservable: Subject<any>;
    /** Private properties */
    private _callZomeTasks;
    private _runningTasks;
    private _successes;
    private _workflowErrors;
    private _networkRequestErrors;
    private _cellsController;
    observedCells(): Cell[];
    beforeWorkflow(cell: Cell, task: Workflow<any, any>): Promise<void>;
    workflowSuccess(cell: Cell, task: Workflow<any, any>, result: any): Promise<void>;
    workflowError(cell: Cell, task: Workflow<any, any>, error: any): Promise<void>;
    networkRequestError(networkRequest: NetworkRequestInfo<any, any>, error: any): Promise<void>;
    sortTasks(tasks: Array<[string, number]>): [string, number][];
    showTasks(): boolean;
    renderListItem(icon: string, primary: string, secondary: string, color?: string): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-card': typeof Card;
        'mwc-list': typeof List;
        'mwc-icon': typeof Icon;
        'mwc-list-item': typeof ListItem;
        'mwc-linear-progress': typeof LinearProgress;
    };
}
