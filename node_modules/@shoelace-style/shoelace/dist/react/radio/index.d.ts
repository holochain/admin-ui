import * as React from 'react';
import Component from '../../components/radio/radio';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlBlur?: ((e: Event) => unknown) | undefined;
    onSlChange?: ((e: Event) => unknown) | undefined;
    onSlFocus?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
