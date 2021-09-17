import { SlColorPicker as BaseElement, SlDropdown, SlIcon, SlSpinner } from '@shoelace-style/shoelace';
import { SlButton } from './sl-button';
import { SlInput } from './sl-input';
declare const SlColorPicker_base: typeof BaseElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost>;
export declare class SlColorPicker extends SlColorPicker_base {
    static get scopedElements(): {
        'sl-icon': typeof SlIcon;
        'sl-button': typeof SlButton;
        'sl-input': typeof SlInput;
        'sl-spinner': typeof SlSpinner;
        'sl-dropdown': typeof SlDropdown;
    };
}
export {};
