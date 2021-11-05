import * as React from 'react';
import Component from '../../components/range/range';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlChange?: ((e: Event) => unknown) | undefined;
    onSlBlur?: ((e: Event) => unknown) | undefined;
    onSlFocus?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
