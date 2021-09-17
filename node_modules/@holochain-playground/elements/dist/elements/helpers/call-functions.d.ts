import { Dictionary } from '@holochain-open-dev/core-types';
import { LitElement, PropertyValues, TemplateResult } from 'lit';
import { Button } from '@scoped-elements/material-web';
import { Drawer } from '@scoped-elements/material-web';
import { List } from '@scoped-elements/material-web';
import { ListItem } from '@scoped-elements/material-web';
import { Select } from '@scoped-elements/material-web';
import { TextField } from '@scoped-elements/material-web';
export declare type CallableFnArgument = {
    name: string;
    required?: boolean;
} & ({
    field: 'textfield';
    type: string;
} | {
    field: 'custom';
    render: (value: any, setArgValue: (value: any) => void) => TemplateResult;
});
export interface CallableFn {
    name: string;
    args: CallableFnArgument[];
    call: (args: Dictionary<any>) => void;
}
declare const CallFns_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class CallFns extends CallFns_base {
    callableFns: CallableFn[];
    selectedFnName: string | undefined;
    get activeFn(): CallableFn;
    _arguments: Dictionary<Dictionary<any>>;
    update(changedValues: PropertyValues): void;
    setArgument(fnName: string, argName: string, value: any): void;
    renderField(callableFn: CallableFn, arg: CallableFnArgument): TemplateResult<1>;
    isExecuteDisabled(callableFunction: CallableFn): boolean;
    callFunction(callableFunction: CallableFn): void;
    renderCallableFunction(callableFunction: CallableFn): TemplateResult<1>;
    render(): TemplateResult<1>;
    static styles: import("lit").CSSResult[];
    static get scopedElements(): {
        'mwc-drawer': typeof Drawer;
        'mwc-list': typeof List;
        'mwc-list-item': typeof ListItem;
        'mwc-button': typeof Button;
        'mwc-textfield': typeof TextField;
        'mwc-select': typeof Select;
    };
}
export {};
