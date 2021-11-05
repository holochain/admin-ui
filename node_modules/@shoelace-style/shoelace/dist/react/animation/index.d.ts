import * as React from 'react';
import Component from '../../components/animation/animation';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlCancel?: ((e: Event) => unknown) | undefined;
    onSlFinish?: ((e: Event) => unknown) | undefined;
    onSlStart?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
