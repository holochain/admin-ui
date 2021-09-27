import {
  __spreadProps,
  __spreadValues
} from "./chunk.IHGPZX35.js";

// node_modules/@lit/reactive-element/decorators/custom-element.js
var n = (n2) => (e3) => typeof e3 == "function" ? ((n3, e4) => (window.customElements.define(n3, e4), e4))(n2, e3) : ((n3, e4) => {
  const { kind: t2, elements: i3 } = e4;
  return { kind: t2, elements: i3, finisher(e5) {
    window.customElements.define(n3, e5);
  } };
})(n2, e3);

// node_modules/@lit/reactive-element/decorators/property.js
var i = (i3, e3) => e3.kind === "method" && e3.descriptor && !("value" in e3.descriptor) ? __spreadProps(__spreadValues({}, e3), { finisher(n2) {
  n2.createProperty(e3.key, i3);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e3.key, initializer() {
  typeof e3.initializer == "function" && (this[e3.key] = e3.initializer.call(this));
}, finisher(n2) {
  n2.createProperty(e3.key, i3);
} };
function e(e3) {
  return (n2, t2) => t2 !== void 0 ? ((i3, e4, n3) => {
    e4.constructor.createProperty(n3, i3);
  })(e3, n2, t2) : i(e3, n2);
}

// node_modules/@lit/reactive-element/decorators/state.js
function t(t2) {
  return e(__spreadProps(__spreadValues({}, t2), { state: true }));
}

// node_modules/@lit/reactive-element/decorators/base.js
var o = ({ finisher: e3, descriptor: t2 }) => (o2, n2) => {
  var r;
  if (n2 === void 0) {
    const n3 = (r = o2.originalKey) !== null && r !== void 0 ? r : o2.key, i3 = t2 != null ? { kind: "method", placement: "prototype", key: n3, descriptor: t2(o2.key) } : __spreadProps(__spreadValues({}, o2), { key: n3 });
    return e3 != null && (i3.finisher = function(t3) {
      e3(t3, n3);
    }), i3;
  }
  {
    const r2 = o2.constructor;
    t2 !== void 0 && Object.defineProperty(o2, n2, t2(n2)), e3 == null || e3(r2, n2);
  }
};

// node_modules/@lit/reactive-element/decorators/query.js
function i2(i3, n2) {
  return o({ descriptor: (o2) => {
    const t2 = { get() {
      var o3, n3;
      return (n3 = (o3 = this.renderRoot) === null || o3 === void 0 ? void 0 : o3.querySelector(i3)) !== null && n3 !== void 0 ? n3 : null;
    }, enumerable: true, configurable: true };
    if (n2) {
      const n3 = typeof o2 == "symbol" ? Symbol() : "__" + o2;
      t2.get = function() {
        var o3, t3;
        return this[n3] === void 0 && (this[n3] = (t3 = (o3 = this.renderRoot) === null || o3 === void 0 ? void 0 : o3.querySelector(i3)) !== null && t3 !== void 0 ? t3 : null), this[n3];
      };
    }
    return t2;
  } });
}

// node_modules/@lit/reactive-element/decorators/query-async.js
function e2(e3) {
  return o({ descriptor: (r) => ({ async get() {
    var r2;
    return await this.updateComplete, (r2 = this.renderRoot) === null || r2 === void 0 ? void 0 : r2.querySelector(e3);
  }, enumerable: true, configurable: true }) });
}

export {
  n,
  e,
  t,
  i2 as i,
  e2
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
