import { JsonViewer } from '@power-elements/json-viewer';
import { PlaygroundElement } from '../base/playground-element';
export declare class DhtShard extends PlaygroundElement {
    cell: {
        dna: string;
        agentId: string;
    };
    static style(): import("lit").CSSResult;
    get activeCell(): import("@holochain-playground/core").Cell;
    render(): import("lit").TemplateResult<1>;
    static get scopedElements(): {
        'json-viewer': typeof JsonViewer;
    };
}
