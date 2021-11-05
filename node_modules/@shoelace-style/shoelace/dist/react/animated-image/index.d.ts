import * as React from 'react';
import Component from '../../components/animated-image/animated-image';
declare const _default: React.ForwardRefExoticComponent<Partial<Omit<Component, "children">> & {
    onSlLoad?: ((e: Event) => unknown) | undefined;
    onSlError?: ((e: Event) => unknown) | undefined;
} & React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export default _default;
