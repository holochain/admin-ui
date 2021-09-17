import {
  __spreadProps,
  __spreadValues
} from "./chunk.IHGPZX35.js";

// node_modules/@lit/reactive-element/decorators/custom-element.js
var n = (n3) => (e3) => typeof e3 == "function" ? ((n4, e4) => (window.customElements.define(n4, e4), e4))(n3, e3) : ((n4, e4) => {
  const { kind: t2, elements: i2 } = e4;
  return { kind: t2, elements: i2, finisher(e5) {
    window.customElements.define(n4, e5);
  } };
})(n3, e3);

// node_modules/@lit/reactive-element/decorators/property.js
var i = (i2, e3) => e3.kind === "method" && e3.descriptor && !("value" in e3.descriptor) ? __spreadProps(__spreadValues({}, e3), { finisher(n3) {
  n3.createProperty(e3.key, i2);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e3.key, initializer() {
  typeof e3.initializer == "function" && (this[e3.key] = e3.initializer.call(this));
}, finisher(n3) {
  n3.createProperty(e3.key, i2);
} };
function e(e3) {
  return (n3, t2) => t2 !== void 0 ? ((i2, e4, n4) => {
    e4.constructor.createProperty(n4, i2);
  })(e3, n3, t2) : i(e3, n3);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r(r2) {
  return e(__spreadProps(__spreadValues({}, r2), { state: true, attribute: false }));
}

// node_modules/@lit/reactive-element/decorators/base.js
var o = ({ finisher: e3, descriptor: t2 }) => (o3, n3) => {
  var r2;
  if (n3 === void 0) {
    const n4 = (r2 = o3.originalKey) !== null && r2 !== void 0 ? r2 : o3.key, i2 = t2 != null ? { kind: "method", placement: "prototype", key: n4, descriptor: t2(o3.key) } : __spreadProps(__spreadValues({}, o3), { key: n4 });
    return e3 != null && (i2.finisher = function(t3) {
      e3(t3, n4);
    }), i2;
  }
  {
    const r3 = o3.constructor;
    t2 !== void 0 && Object.defineProperty(o3, n3, t2(n3)), e3 == null || e3(r3, n3);
  }
};

// node_modules/@lit/reactive-element/decorators/query.js
function o2(o3, r2) {
  return o({ descriptor: (t2) => {
    const i2 = { get() {
      var t3;
      return (t3 = this.renderRoot) === null || t3 === void 0 ? void 0 : t3.querySelector(o3);
    }, enumerable: true, configurable: true };
    if (r2) {
      const r3 = typeof t2 == "symbol" ? Symbol() : "__" + t2;
      i2.get = function() {
        var t3;
        return this[r3] === void 0 && (this[r3] = (t3 = this.renderRoot) === null || t3 === void 0 ? void 0 : t3.querySelector(o3)), this[r3];
      };
    }
    return i2;
  } });
}

// node_modules/@lit/reactive-element/decorators/query-async.js
function e2(e3) {
  return o({ descriptor: (r2) => ({ async get() {
    var r3;
    return await this.updateComplete, (r3 = this.renderRoot) === null || r3 === void 0 ? void 0 : r3.querySelector(e3);
  }, enumerable: true, configurable: true }) });
}

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var t = Element.prototype;
var n2 = t.msMatchesSelector || t.webkitMatchesSelector;

export {
  n,
  e,
  r,
  o2 as o,
  e2
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
