import * as React from 'react';
import Component from '../../components/tab-group/tab-group';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlTabShow?: ((e: Event) => unknown) | undefined;
    onSlTabHide?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
