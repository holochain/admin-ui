import {
  getIconLibrary,
  unwatchIcon,
  watchIcon
} from "./chunk.S67EMIEU.js";
import {
  requestIcon
} from "./chunk.ARRH633M.js";
import {
  watch
} from "./chunk.BD26TKS4.js";
import {
  emit
} from "./chunk.I4TE3TJV.js";
import {
  e as e2,
  i,
  t as t2
} from "./chunk.2JQPDYNA.js";
import {
  component_styles_default
} from "./chunk.G466JWVF.js";
import {
  e,
  n as n2,
  t
} from "./chunk.L2RLCVJQ.js";
import {
  T,
  n,
  r,
  x,
  y
} from "./chunk.X3WLUTHF.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// node_modules/lit-html/directives/unsafe-html.js
var e3 = class extends i {
  constructor(i2) {
    if (super(i2), this.it = x, i2.type !== t2.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r2) {
    if (r2 === x || r2 == null)
      return this.vt = void 0, this.it = r2;
    if (r2 === T)
      return r2;
    if (typeof r2 != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r2 === this.it)
      return this.vt;
    this.it = r2;
    const s = [r2];
    return s.raw = s, this.vt = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
};
e3.directiveName = "unsafeHTML", e3.resultType = 1;
var o = e2(e3);

// node_modules/lit-html/directives/unsafe-svg.js
var t3 = class extends e3 {
};
t3.directiveName = "unsafeSVG", t3.resultType = 2;
var o2 = e2(t3);

// src/components/icon/icon.styles.ts
var icon_styles_default = r`
  ${component_styles_default}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    contain: strict;
    box-sizing: content-box !important;
  }

  .icon,
  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;

// src/components/icon/icon.ts
var parser = new DOMParser();
var SlIcon = class extends n {
  constructor() {
    super(...arguments);
    this.svg = "";
    this.library = "default";
  }
  connectedCallback() {
    super.connectedCallback();
    watchIcon(this);
  }
  firstUpdated() {
    this.setIcon();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    unwatchIcon(this);
  }
  getLabel() {
    let label = "";
    if (this.label) {
      label = this.label;
    } else if (this.name) {
      label = this.name.replace(/-/g, " ");
    } else if (this.src) {
      label = this.src.replace(/.*\//, "").replace(/-/g, " ").replace(/\.svg/i, "");
    }
    return label;
  }
  getUrl() {
    const library = getIconLibrary(this.library);
    if (this.name && library) {
      return library.resolver(this.name);
    } else {
      return this.src;
    }
  }
  redraw() {
    this.setIcon();
  }
  async setIcon() {
    const library = getIconLibrary(this.library);
    const url = this.getUrl();
    if (url) {
      try {
        const file = await requestIcon(url);
        if (url !== this.getUrl()) {
          return;
        } else if (file.ok) {
          const doc = parser.parseFromString(file.svg, "text/html");
          const svgEl = doc.body.querySelector("svg");
          if (svgEl) {
            if (library && library.mutator) {
              library.mutator(svgEl);
            }
            this.svg = svgEl.outerHTML;
            emit(this, "sl-load");
          } else {
            this.svg = "";
            emit(this, "sl-error", { detail: { status: file.status } });
          }
        } else {
          this.svg = "";
          emit(this, "sl-error", { detail: { status: file.status } });
        }
      } catch (e4) {
        emit(this, "sl-error", { detail: { status: -1 } });
      }
    } else if (this.svg) {
      this.svg = "";
    }
  }
  handleChange() {
    this.setIcon();
  }
  render() {
    return y` <div part="base" class="icon" role="img" aria-label=${this.getLabel()}>${o2(this.svg)}</div>`;
  }
};
SlIcon.styles = icon_styles_default;
__decorateClass([
  t()
], SlIcon.prototype, "svg", 2);
__decorateClass([
  e()
], SlIcon.prototype, "name", 2);
__decorateClass([
  e()
], SlIcon.prototype, "src", 2);
__decorateClass([
  e()
], SlIcon.prototype, "label", 2);
__decorateClass([
  e()
], SlIcon.prototype, "library", 2);
__decorateClass([
  watch("name"),
  watch("src"),
  watch("library")
], SlIcon.prototype, "setIcon", 1);
SlIcon = __decorateClass([
  n2("sl-icon")
], SlIcon);
var icon_default = SlIcon;

export {
  o,
  icon_default
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
