import { Dictionary } from '@holochain-open-dev/core-types';
import { SimulatedZome, Cell } from '@holochain-playground/core';
import { CircularProgress } from '@scoped-elements/material-web';
import { Icon } from '@scoped-elements/material-web';
import { Tab } from '@scoped-elements/material-web';
import { TabBar } from '@scoped-elements/material-web';
import { Card } from '@scoped-elements/material-web';
import { CopyableHash } from '../helpers/copyable-hash';
import { PlaygroundElement } from '../../base/playground-element';
import { CellsController } from '../../base/cells-controller';
import { CellObserver } from '../../base/cell-observer';
import { CallFns } from '../helpers/call-functions';
/**
 * @element call-zome-fns
 */
export declare class CallZomeFns extends PlaygroundElement implements CellObserver {
    hideZomeSelector: boolean;
    hideAgentPubKey: boolean;
    selectedZomeFnName: string | undefined;
    private _selectedZomeIndex;
    _arguments: Dictionary<Dictionary<Dictionary<Dictionary<Dictionary<any>>>>>;
    _cellsController: CellsController;
    get activeCell(): Cell;
    get activeZome(): SimulatedZome;
    observedCells(): Cell[];
    callZomeFunction(fnName: string, args: Dictionary<any>): Promise<void>;
    renderActiveZomeFns(): import("lit").TemplateResult<1>;
    render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-circular-progress': typeof CircularProgress;
        'mwc-icon': typeof Icon;
        'mwc-tab': typeof Tab;
        'mwc-tab-bar': typeof TabBar;
        'mwc-card': typeof Card;
        'copyable-hash': typeof CopyableHash;
        'call-functions': typeof CallFns;
    };
}
