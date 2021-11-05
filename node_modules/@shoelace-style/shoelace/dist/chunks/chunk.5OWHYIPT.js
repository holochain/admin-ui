import {
  l
} from "./chunk.SJSINRNQ.js";
import {
  component_styles_default
} from "./chunk.G466JWVF.js";
import {
  e,
  i,
  n as n2,
  t
} from "./chunk.L2RLCVJQ.js";
import {
  n,
  r,
  y
} from "./chunk.X3WLUTHF.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// src/components/progress-ring/progress-ring.styles.ts
var progress_ring_styles_default = r`
  ${component_styles_default}

  :host {
    --size: 128px;
    --track-width: 4px;
    --track-color: rgb(var(--sl-color-neutral-500) / 20%);
    --indicator-color: rgb(var(--sl-color-primary-600));

    display: inline-flex;
  }

  .progress-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .progress-ring__image {
    width: var(--size);
    height: var(--size);
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  .progress-ring__track,
  .progress-ring__indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) * 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    fill: none;
    stroke-width: var(--track-width);
    r: var(--radius);
    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
  }

  .progress-ring__track {
    stroke: var(--track-color);
  }

  .progress-ring__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    transition: 0.35s stroke-dashoffset;
    stroke-dasharray: var(--circumference) var(--circumference);
    stroke-dashoffset: calc(var(--circumference) - var(--percentage) * var(--circumference));
  }

  .progress-ring__label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
  }
`;

// src/components/progress-ring/progress-ring.ts
var SlProgressRing = class extends n {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.label = "Progress";
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("percentage")) {
      const radius = parseFloat(getComputedStyle(this.indicator).getPropertyValue("r"));
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - this.value / 100 * circumference;
      this.indicatorOffset = String(offset) + "px";
    }
  }
  render() {
    return y`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${l(this.label)}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value / 100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <span part="label" class="progress-ring__label">
          <slot></slot>
        </span>
      </div>
    `;
  }
};
SlProgressRing.styles = progress_ring_styles_default;
__decorateClass([
  i(".progress-ring__indicator")
], SlProgressRing.prototype, "indicator", 2);
__decorateClass([
  t()
], SlProgressRing.prototype, "indicatorOffset", 2);
__decorateClass([
  e({ type: Number, reflect: true })
], SlProgressRing.prototype, "value", 2);
__decorateClass([
  e()
], SlProgressRing.prototype, "label", 2);
SlProgressRing = __decorateClass([
  n2("sl-progress-ring")
], SlProgressRing);
var progress_ring_default = SlProgressRing;

export {
  progress_ring_default
};
