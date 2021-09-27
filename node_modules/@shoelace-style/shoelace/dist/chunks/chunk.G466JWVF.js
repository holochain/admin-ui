import {
  r
} from "./chunk.X3WLUTHF.js";

// src/styles/utility.styles.ts
var utility_styles_default = r`
  .sl-scroll-lock {
    overflow: hidden !important;
  }

  .sl-toast-stack {
    position: fixed;
    top: 0;
    right: 0;
    z-index: var(--sl-z-index-toast);
    width: 28rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }

  .sl-toast-stack sl-alert {
    --box-shadow: var(--sl-shadow-large);
    margin: var(--sl-spacing-medium);
  }
`;

// src/styles/component.styles.ts
var component_styles_default = r`
  :host {
    position: relative;
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
var style = document.createElement("style");
style.textContent = utility_styles_default.toString();
document.head.append(style);

export {
  component_styles_default
};
