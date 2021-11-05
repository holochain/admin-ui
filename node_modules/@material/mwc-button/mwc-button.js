/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
import { customElement } from 'lit/decorators.js';
import { ButtonBase } from './mwc-button-base';
import { styles } from './styles.css';
/** @soyCompatible */
let Button = class Button extends ButtonBase {
};
Button.styles = [styles];
Button = __decorate([
    customElement('mwc-button')
], Button);
export { Button };
//# sourceMappingURL=mwc-button.js.map