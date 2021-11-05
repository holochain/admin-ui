import * as React from 'react';
import Component from '../../components/dropdown/dropdown';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlShow?: ((e: Event) => unknown) | undefined;
    onSlAfterShow?: ((e: Event) => unknown) | undefined;
    onSlHide?: ((e: Event) => unknown) | undefined;
    onSlAfterHide?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
