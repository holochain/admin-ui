import {
  component_styles_default
} from "./chunk.G466JWVF.js";
import {
  e,
  i,
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

// src/components/breadcrumb/breadcrumb.styles.ts
var breadcrumb_styles_default = r`
  ${component_styles_default}

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`;

// src/components/breadcrumb/breadcrumb.ts
var SlBreadcrumb = class extends n {
  constructor() {
    super(...arguments);
    this.label = "Breadcrumb";
  }
  getSeparator() {
    const separator = this.separatorSlot.assignedElements({ flatten: true })[0];
    const clone = separator.cloneNode(true);
    [clone, ...clone.querySelectorAll("[id]")].map((el) => el.removeAttribute("id"));
    clone.slot = "separator";
    return clone;
  }
  handleSlotChange() {
    const items = [...this.defaultSlot.assignedElements({ flatten: true })].filter((item) => item.tagName.toLowerCase() === "sl-breadcrumb-item");
    items.map((item, index) => {
      const separator = item.querySelector('[slot="separator"]');
      if (!separator) {
        item.append(this.getSeparator());
      }
      if (index === items.length - 1) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }
  render() {
    return y`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <slot name="separator" hidden aria-hidden="true">
        <sl-icon name="chevron-right" library="system"></sl-icon>
      </slot>
    `;
  }
};
SlBreadcrumb.styles = breadcrumb_styles_default;
__decorateClass([
  i("slot")
], SlBreadcrumb.prototype, "defaultSlot", 2);
__decorateClass([
  i('slot[name="separator"]')
], SlBreadcrumb.prototype, "separatorSlot", 2);
__decorateClass([
  e()
], SlBreadcrumb.prototype, "label", 2);
SlBreadcrumb = __decorateClass([
  n2("sl-breadcrumb")
], SlBreadcrumb);
var breadcrumb_default = SlBreadcrumb;

export {
  breadcrumb_default
};
