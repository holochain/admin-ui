import {
  component_styles_default
} from "./chunk.G466JWVF.js";
import {
  n as n2
} from "./chunk.L2RLCVJQ.js";
import {
  n,
  r,
  y
} from "./chunk.X3WLUTHF.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// src/components/menu-label/menu-label.styles.ts
var menu_label_styles_default = r`
  ${component_styles_default}

  :host {
    display: block;
  }

  .menu-label {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: rgb(var(--sl-color-neutral-500));
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-large);
    user-select: none;
  }
`;

// src/components/menu-label/menu-label.ts
var SlMenuLabel = class extends n {
  render() {
    return y`
      <div part="base" class="menu-label">
        <slot></slot>
      </div>
    `;
  }
};
SlMenuLabel.styles = menu_label_styles_default;
SlMenuLabel = __decorateClass([
  n2("sl-menu-label")
], SlMenuLabel);
var menu_label_default = SlMenuLabel;

export {
  menu_label_default
};
