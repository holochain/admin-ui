// node_modules/@lit/reactive-element/css-tag.js
var t = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var e = Symbol();
var n = new Map();
var s = class {
  constructor(t3, n5) {
    if (this._$cssResult$ = true, n5 !== e)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t3;
  }
  get styleSheet() {
    let e4 = n.get(this.cssText);
    return t && e4 === void 0 && (n.set(this.cssText, e4 = new CSSStyleSheet()), e4.replaceSync(this.cssText)), e4;
  }
  toString() {
    return this.cssText;
  }
};
var o = (t3) => new s(typeof t3 == "string" ? t3 : t3 + "", e);
var r = (t3, ...n5) => {
  const o5 = t3.length === 1 ? t3[0] : n5.reduce((e4, n6, s4) => e4 + ((t4) => {
    if (t4._$cssResult$ === true)
      return t4.cssText;
    if (typeof t4 == "number")
      return t4;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n6) + t3[s4 + 1], t3[0]);
  return new s(o5, e);
};
var i = (e4, n5) => {
  t ? e4.adoptedStyleSheets = n5.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet) : n5.forEach((t3) => {
    const n6 = document.createElement("style"), s4 = window.litNonce;
    s4 !== void 0 && n6.setAttribute("nonce", s4), n6.textContent = t3.cssText, e4.appendChild(n6);
  });
};
var S = t ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
  let e4 = "";
  for (const n5 of t4.cssRules)
    e4 += n5.cssText;
  return o(e4);
})(t3) : t3;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2;
var r2 = { toAttribute(t3, i3) {
  switch (i3) {
    case Boolean:
      t3 = t3 ? "" : null;
      break;
    case Object:
    case Array:
      t3 = t3 == null ? t3 : JSON.stringify(t3);
  }
  return t3;
}, fromAttribute(t3, i3) {
  let s4 = t3;
  switch (i3) {
    case Boolean:
      s4 = t3 !== null;
      break;
    case Number:
      s4 = t3 === null ? null : Number(t3);
      break;
    case Object:
    case Array:
      try {
        s4 = JSON.parse(t3);
      } catch (t4) {
        s4 = null;
      }
  }
  return s4;
} };
var h = (t3, i3) => i3 !== t3 && (i3 == i3 || t3 == t3);
var o2 = { attribute: true, type: String, converter: r2, reflect: false, hasChanged: h };
var n2 = class extends HTMLElement {
  constructor() {
    super(), this._$Et = new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$Ei = null, this.o();
  }
  static addInitializer(t3) {
    var i3;
    (i3 = this.l) !== null && i3 !== void 0 || (this.l = []), this.l.push(t3);
  }
  static get observedAttributes() {
    this.finalize();
    const t3 = [];
    return this.elementProperties.forEach((i3, s4) => {
      const e4 = this._$Eh(s4, i3);
      e4 !== void 0 && (this._$Eu.set(e4, s4), t3.push(e4));
    }), t3;
  }
  static createProperty(t3, i3 = o2) {
    if (i3.state && (i3.attribute = false), this.finalize(), this.elementProperties.set(t3, i3), !i3.noAccessor && !this.prototype.hasOwnProperty(t3)) {
      const s4 = typeof t3 == "symbol" ? Symbol() : "__" + t3, e4 = this.getPropertyDescriptor(t3, s4, i3);
      e4 !== void 0 && Object.defineProperty(this.prototype, t3, e4);
    }
  }
  static getPropertyDescriptor(t3, i3, s4) {
    return { get() {
      return this[i3];
    }, set(e4) {
      const r5 = this[t3];
      this[i3] = e4, this.requestUpdate(t3, r5, s4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t3) {
    return this.elementProperties.get(t3) || o2;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t3 = Object.getPrototypeOf(this);
    if (t3.finalize(), this.elementProperties = new Map(t3.elementProperties), this._$Eu = new Map(), this.hasOwnProperty("properties")) {
      const t4 = this.properties, i3 = [...Object.getOwnPropertyNames(t4), ...Object.getOwnPropertySymbols(t4)];
      for (const s4 of i3)
        this.createProperty(s4, t4[s4]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i3) {
    const s4 = [];
    if (Array.isArray(i3)) {
      const e4 = new Set(i3.flat(1 / 0).reverse());
      for (const i4 of e4)
        s4.unshift(S(i4));
    } else
      i3 !== void 0 && s4.push(S(i3));
    return s4;
  }
  static _$Eh(t3, i3) {
    const s4 = i3.attribute;
    return s4 === false ? void 0 : typeof s4 == "string" ? s4 : typeof t3 == "string" ? t3.toLowerCase() : void 0;
  }
  o() {
    var t3;
    this._$Ev = new Promise((t4) => this.enableUpdating = t4), this._$AL = new Map(), this._$Ep(), this.requestUpdate(), (t3 = this.constructor.l) === null || t3 === void 0 || t3.forEach((t4) => t4(this));
  }
  addController(t3) {
    var i3, s4;
    ((i3 = this._$Em) !== null && i3 !== void 0 ? i3 : this._$Em = []).push(t3), this.renderRoot !== void 0 && this.isConnected && ((s4 = t3.hostConnected) === null || s4 === void 0 || s4.call(t3));
  }
  removeController(t3) {
    var i3;
    (i3 = this._$Em) === null || i3 === void 0 || i3.splice(this._$Em.indexOf(t3) >>> 0, 1);
  }
  _$Ep() {
    this.constructor.elementProperties.forEach((t3, i3) => {
      this.hasOwnProperty(i3) && (this._$Et.set(i3, this[i3]), delete this[i3]);
    });
  }
  createRenderRoot() {
    var t3;
    const s4 = (t3 = this.shadowRoot) !== null && t3 !== void 0 ? t3 : this.attachShadow(this.constructor.shadowRootOptions);
    return i(s4, this.constructor.elementStyles), s4;
  }
  connectedCallback() {
    var t3;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t3 = this._$Em) === null || t3 === void 0 || t3.forEach((t4) => {
      var i3;
      return (i3 = t4.hostConnected) === null || i3 === void 0 ? void 0 : i3.call(t4);
    });
  }
  enableUpdating(t3) {
  }
  disconnectedCallback() {
    var t3;
    (t3 = this._$Em) === null || t3 === void 0 || t3.forEach((t4) => {
      var i3;
      return (i3 = t4.hostDisconnected) === null || i3 === void 0 ? void 0 : i3.call(t4);
    });
  }
  attributeChangedCallback(t3, i3, s4) {
    this._$AK(t3, s4);
  }
  _$Eg(t3, i3, s4 = o2) {
    var e4, h3;
    const n5 = this.constructor._$Eh(t3, s4);
    if (n5 !== void 0 && s4.reflect === true) {
      const o5 = ((h3 = (e4 = s4.converter) === null || e4 === void 0 ? void 0 : e4.toAttribute) !== null && h3 !== void 0 ? h3 : r2.toAttribute)(i3, s4.type);
      this._$Ei = t3, o5 == null ? this.removeAttribute(n5) : this.setAttribute(n5, o5), this._$Ei = null;
    }
  }
  _$AK(t3, i3) {
    var s4, e4, h3;
    const o5 = this.constructor, n5 = o5._$Eu.get(t3);
    if (n5 !== void 0 && this._$Ei !== n5) {
      const t4 = o5.getPropertyOptions(n5), l3 = t4.converter, a2 = (h3 = (e4 = (s4 = l3) === null || s4 === void 0 ? void 0 : s4.fromAttribute) !== null && e4 !== void 0 ? e4 : typeof l3 == "function" ? l3 : null) !== null && h3 !== void 0 ? h3 : r2.fromAttribute;
      this._$Ei = n5, this[n5] = a2(i3, t4.type), this._$Ei = null;
    }
  }
  requestUpdate(t3, i3, s4) {
    let e4 = true;
    t3 !== void 0 && (((s4 = s4 || this.constructor.getPropertyOptions(t3)).hasChanged || h)(this[t3], i3) ? (this._$AL.has(t3) || this._$AL.set(t3, i3), s4.reflect === true && this._$Ei !== t3 && (this._$ES === void 0 && (this._$ES = new Map()), this._$ES.set(t3, s4))) : e4 = false), !this.isUpdatePending && e4 && (this._$Ev = this._$EC());
  }
  async _$EC() {
    this.isUpdatePending = true;
    try {
      await this._$Ev;
    } catch (t4) {
      Promise.reject(t4);
    }
    const t3 = this.scheduleUpdate();
    return t3 != null && await t3, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t3;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Et && (this._$Et.forEach((t4, i4) => this[i4] = t4), this._$Et = void 0);
    let i3 = false;
    const s4 = this._$AL;
    try {
      i3 = this.shouldUpdate(s4), i3 ? (this.willUpdate(s4), (t3 = this._$Em) === null || t3 === void 0 || t3.forEach((t4) => {
        var i4;
        return (i4 = t4.hostUpdate) === null || i4 === void 0 ? void 0 : i4.call(t4);
      }), this.update(s4)) : this._$ET();
    } catch (t4) {
      throw i3 = false, this._$ET(), t4;
    }
    i3 && this._$AE(s4);
  }
  willUpdate(t3) {
  }
  _$AE(t3) {
    var i3;
    (i3 = this._$Em) === null || i3 === void 0 || i3.forEach((t4) => {
      var i4;
      return (i4 = t4.hostUpdated) === null || i4 === void 0 ? void 0 : i4.call(t4);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
  }
  _$ET() {
    this._$AL = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Ev;
  }
  shouldUpdate(t3) {
    return true;
  }
  update(t3) {
    this._$ES !== void 0 && (this._$ES.forEach((t4, i3) => this._$Eg(i3, this[i3], t4)), this._$ES = void 0), this._$ET();
  }
  updated(t3) {
  }
  firstUpdated(t3) {
  }
};
n2.finalized = true, n2.elementProperties = new Map(), n2.elementStyles = [], n2.shadowRootOptions = { mode: "open" }, (s2 = globalThis.reactiveElementPolyfillSupport) === null || s2 === void 0 || s2.call(globalThis, { ReactiveElement: n2 }), ((e2 = globalThis.reactiveElementVersions) !== null && e2 !== void 0 ? e2 : globalThis.reactiveElementVersions = []).push("1.0.0");

// node_modules/lit-html/lit-html.js
var t2;
var i2;
var s3 = globalThis.trustedTypes;
var e3 = s3 ? s3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var o3 = `lit$${(Math.random() + "").slice(9)}$`;
var n3 = "?" + o3;
var l = `<${n3}>`;
var h2 = document;
var r3 = (t3 = "") => h2.createComment(t3);
var d = (t3) => t3 === null || typeof t3 != "object" && typeof t3 != "function";
var u = Array.isArray;
var v = (t3) => {
  var i3;
  return u(t3) || typeof ((i3 = t3) === null || i3 === void 0 ? void 0 : i3[Symbol.iterator]) == "function";
};
var c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var a = /-->/g;
var f = />/g;
var _ = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var g = /'/g;
var m = /"/g;
var $ = /^(?:script|style|textarea)$/i;
var p = (t3) => (i3, ...s4) => ({ _$litType$: t3, strings: i3, values: s4 });
var y = p(1);
var b = p(2);
var T = Symbol.for("lit-noChange");
var x = Symbol.for("lit-nothing");
var w = new WeakMap();
var A = (t3, i3, s4) => {
  var e4, o5;
  const n5 = (e4 = s4 == null ? void 0 : s4.renderBefore) !== null && e4 !== void 0 ? e4 : i3;
  let l3 = n5._$litPart$;
  if (l3 === void 0) {
    const t4 = (o5 = s4 == null ? void 0 : s4.renderBefore) !== null && o5 !== void 0 ? o5 : null;
    n5._$litPart$ = l3 = new S2(i3.insertBefore(r3(), t4), t4, void 0, s4 != null ? s4 : {});
  }
  return l3._$AI(t3), l3;
};
var C = h2.createTreeWalker(h2, 129, null, false);
var P = (t3, i3) => {
  const s4 = t3.length - 1, n5 = [];
  let h3, r5 = i3 === 2 ? "<svg>" : "", d2 = c;
  for (let i4 = 0; i4 < s4; i4++) {
    const s5 = t3[i4];
    let e4, u3, v2 = -1, p2 = 0;
    for (; p2 < s5.length && (d2.lastIndex = p2, u3 = d2.exec(s5), u3 !== null); )
      p2 = d2.lastIndex, d2 === c ? u3[1] === "!--" ? d2 = a : u3[1] !== void 0 ? d2 = f : u3[2] !== void 0 ? ($.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d2 = _) : u3[3] !== void 0 && (d2 = _) : d2 === _ ? u3[0] === ">" ? (d2 = h3 != null ? h3 : c, v2 = -1) : u3[1] === void 0 ? v2 = -2 : (v2 = d2.lastIndex - u3[2].length, e4 = u3[1], d2 = u3[3] === void 0 ? _ : u3[3] === '"' ? m : g) : d2 === m || d2 === g ? d2 = _ : d2 === a || d2 === f ? d2 = c : (d2 = _, h3 = void 0);
    const y2 = d2 === _ && t3[i4 + 1].startsWith("/>") ? " " : "";
    r5 += d2 === c ? s5 + l : v2 >= 0 ? (n5.push(e4), s5.slice(0, v2) + "$lit$" + s5.slice(v2) + o3 + y2) : s5 + o3 + (v2 === -2 ? (n5.push(void 0), i4) : y2);
  }
  const u2 = r5 + (t3[s4] || "<?>") + (i3 === 2 ? "</svg>" : "");
  return [e3 !== void 0 ? e3.createHTML(u2) : u2, n5];
};
var V = class {
  constructor({ strings: t3, _$litType$: i3 }, e4) {
    let l3;
    this.parts = [];
    let h3 = 0, d2 = 0;
    const u2 = t3.length - 1, v2 = this.parts, [c2, a2] = P(t3, i3);
    if (this.el = V.createElement(c2, e4), C.currentNode = this.el.content, i3 === 2) {
      const t4 = this.el.content, i4 = t4.firstChild;
      i4.remove(), t4.append(...i4.childNodes);
    }
    for (; (l3 = C.nextNode()) !== null && v2.length < u2; ) {
      if (l3.nodeType === 1) {
        if (l3.hasAttributes()) {
          const t4 = [];
          for (const i4 of l3.getAttributeNames())
            if (i4.endsWith("$lit$") || i4.startsWith(o3)) {
              const s4 = a2[d2++];
              if (t4.push(i4), s4 !== void 0) {
                const t5 = l3.getAttribute(s4.toLowerCase() + "$lit$").split(o3), i5 = /([.?@])?(.*)/.exec(s4);
                v2.push({ type: 1, index: h3, name: i5[2], strings: t5, ctor: i5[1] === "." ? k : i5[1] === "?" ? H : i5[1] === "@" ? I : M });
              } else
                v2.push({ type: 6, index: h3 });
            }
          for (const i4 of t4)
            l3.removeAttribute(i4);
        }
        if ($.test(l3.tagName)) {
          const t4 = l3.textContent.split(o3), i4 = t4.length - 1;
          if (i4 > 0) {
            l3.textContent = s3 ? s3.emptyScript : "";
            for (let s4 = 0; s4 < i4; s4++)
              l3.append(t4[s4], r3()), C.nextNode(), v2.push({ type: 2, index: ++h3 });
            l3.append(t4[i4], r3());
          }
        }
      } else if (l3.nodeType === 8)
        if (l3.data === n3)
          v2.push({ type: 2, index: h3 });
        else {
          let t4 = -1;
          for (; (t4 = l3.data.indexOf(o3, t4 + 1)) !== -1; )
            v2.push({ type: 7, index: h3 }), t4 += o3.length - 1;
        }
      h3++;
    }
  }
  static createElement(t3, i3) {
    const s4 = h2.createElement("template");
    return s4.innerHTML = t3, s4;
  }
};
function E(t3, i3, s4 = t3, e4) {
  var o5, n5, l3, h3;
  if (i3 === T)
    return i3;
  let r5 = e4 !== void 0 ? (o5 = s4._$Cl) === null || o5 === void 0 ? void 0 : o5[e4] : s4._$Cu;
  const u2 = d(i3) ? void 0 : i3._$litDirective$;
  return (r5 == null ? void 0 : r5.constructor) !== u2 && ((n5 = r5 == null ? void 0 : r5._$AO) === null || n5 === void 0 || n5.call(r5, false), u2 === void 0 ? r5 = void 0 : (r5 = new u2(t3), r5._$AT(t3, s4, e4)), e4 !== void 0 ? ((l3 = (h3 = s4)._$Cl) !== null && l3 !== void 0 ? l3 : h3._$Cl = [])[e4] = r5 : s4._$Cu = r5), r5 !== void 0 && (i3 = E(t3, r5._$AS(t3, i3.values), r5, e4)), i3;
}
var N = class {
  constructor(t3, i3) {
    this.v = [], this._$AN = void 0, this._$AD = t3, this._$AM = i3;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t3) {
    var i3;
    const { el: { content: s4 }, parts: e4 } = this._$AD, o5 = ((i3 = t3 == null ? void 0 : t3.creationScope) !== null && i3 !== void 0 ? i3 : h2).importNode(s4, true);
    C.currentNode = o5;
    let n5 = C.nextNode(), l3 = 0, r5 = 0, d2 = e4[0];
    for (; d2 !== void 0; ) {
      if (l3 === d2.index) {
        let i4;
        d2.type === 2 ? i4 = new S2(n5, n5.nextSibling, this, t3) : d2.type === 1 ? i4 = new d2.ctor(n5, d2.name, d2.strings, this, t3) : d2.type === 6 && (i4 = new L(n5, this, t3)), this.v.push(i4), d2 = e4[++r5];
      }
      l3 !== (d2 == null ? void 0 : d2.index) && (n5 = C.nextNode(), l3++);
    }
    return o5;
  }
  m(t3) {
    let i3 = 0;
    for (const s4 of this.v)
      s4 !== void 0 && (s4.strings !== void 0 ? (s4._$AI(t3, s4, i3), i3 += s4.strings.length - 2) : s4._$AI(t3[i3])), i3++;
  }
};
var S2 = class {
  constructor(t3, i3, s4, e4) {
    var o5;
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = t3, this._$AB = i3, this._$AM = s4, this.options = e4, this._$Cg = (o5 = e4 == null ? void 0 : e4.isConnected) === null || o5 === void 0 || o5;
  }
  get _$AU() {
    var t3, i3;
    return (i3 = (t3 = this._$AM) === null || t3 === void 0 ? void 0 : t3._$AU) !== null && i3 !== void 0 ? i3 : this._$Cg;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i3 = this._$AM;
    return i3 !== void 0 && t3.nodeType === 11 && (t3 = i3.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i3 = this) {
    t3 = E(this, t3, i3), d(t3) ? t3 === x || t3 == null || t3 === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : t3 !== this._$AH && t3 !== T && this.$(t3) : t3._$litType$ !== void 0 ? this.T(t3) : t3.nodeType !== void 0 ? this.S(t3) : v(t3) ? this.M(t3) : this.$(t3);
  }
  A(t3, i3 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t3, i3);
  }
  S(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.A(t3));
  }
  $(t3) {
    this._$AH !== x && d(this._$AH) ? this._$AA.nextSibling.data = t3 : this.S(h2.createTextNode(t3)), this._$AH = t3;
  }
  T(t3) {
    var i3;
    const { values: s4, _$litType$: e4 } = t3, o5 = typeof e4 == "number" ? this._$AC(t3) : (e4.el === void 0 && (e4.el = V.createElement(e4.h, this.options)), e4);
    if (((i3 = this._$AH) === null || i3 === void 0 ? void 0 : i3._$AD) === o5)
      this._$AH.m(s4);
    else {
      const t4 = new N(o5, this), i4 = t4.p(this.options);
      t4.m(s4), this.S(i4), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i3 = w.get(t3.strings);
    return i3 === void 0 && w.set(t3.strings, i3 = new V(t3)), i3;
  }
  M(t3) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i3 = this._$AH;
    let s4, e4 = 0;
    for (const o5 of t3)
      e4 === i3.length ? i3.push(s4 = new S2(this.A(r3()), this.A(r3()), this, this.options)) : s4 = i3[e4], s4._$AI(o5), e4++;
    e4 < i3.length && (this._$AR(s4 && s4._$AB.nextSibling, e4), i3.length = e4);
  }
  _$AR(t3 = this._$AA.nextSibling, i3) {
    var s4;
    for ((s4 = this._$AP) === null || s4 === void 0 || s4.call(this, false, true, i3); t3 && t3 !== this._$AB; ) {
      const i4 = t3.nextSibling;
      t3.remove(), t3 = i4;
    }
  }
  setConnected(t3) {
    var i3;
    this._$AM === void 0 && (this._$Cg = t3, (i3 = this._$AP) === null || i3 === void 0 || i3.call(this, t3));
  }
};
var M = class {
  constructor(t3, i3, s4, e4, o5) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = t3, this.name = i3, this._$AM = e4, this.options = o5, s4.length > 2 || s4[0] !== "" || s4[1] !== "" ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = x;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3, i3 = this, s4, e4) {
    const o5 = this.strings;
    let n5 = false;
    if (o5 === void 0)
      t3 = E(this, t3, i3, 0), n5 = !d(t3) || t3 !== this._$AH && t3 !== T, n5 && (this._$AH = t3);
    else {
      const e5 = t3;
      let l3, h3;
      for (t3 = o5[0], l3 = 0; l3 < o5.length - 1; l3++)
        h3 = E(this, e5[s4 + l3], i3, l3), h3 === T && (h3 = this._$AH[l3]), n5 || (n5 = !d(h3) || h3 !== this._$AH[l3]), h3 === x ? t3 = x : t3 !== x && (t3 += (h3 != null ? h3 : "") + o5[l3 + 1]), this._$AH[l3] = h3;
    }
    n5 && !e4 && this.k(t3);
  }
  k(t3) {
    t3 === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 != null ? t3 : "");
  }
};
var k = class extends M {
  constructor() {
    super(...arguments), this.type = 3;
  }
  k(t3) {
    this.element[this.name] = t3 === x ? void 0 : t3;
  }
};
var H = class extends M {
  constructor() {
    super(...arguments), this.type = 4;
  }
  k(t3) {
    t3 && t3 !== x ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var I = class extends M {
  constructor(t3, i3, s4, e4, o5) {
    super(t3, i3, s4, e4, o5), this.type = 5;
  }
  _$AI(t3, i3 = this) {
    var s4;
    if ((t3 = (s4 = E(this, t3, i3, 0)) !== null && s4 !== void 0 ? s4 : x) === T)
      return;
    const e4 = this._$AH, o5 = t3 === x && e4 !== x || t3.capture !== e4.capture || t3.once !== e4.once || t3.passive !== e4.passive, n5 = t3 !== x && (e4 === x || o5);
    o5 && this.element.removeEventListener(this.name, this, e4), n5 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    var i3, s4;
    typeof this._$AH == "function" ? this._$AH.call((s4 = (i3 = this.options) === null || i3 === void 0 ? void 0 : i3.host) !== null && s4 !== void 0 ? s4 : this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var L = class {
  constructor(t3, i3, s4) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i3, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    E(this, t3);
  }
};
(t2 = globalThis.litHtmlPolyfillSupport) === null || t2 === void 0 || t2.call(globalThis, V, S2), ((i2 = globalThis.litHtmlVersions) !== null && i2 !== void 0 ? i2 : globalThis.litHtmlVersions = []).push("2.0.0");

// node_modules/lit-element/lit-element.js
var l2;
var o4;
var r4;
var n4 = class extends n2 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Dt = void 0;
  }
  createRenderRoot() {
    var t3, e4;
    const i3 = super.createRenderRoot();
    return (t3 = (e4 = this.renderOptions).renderBefore) !== null && t3 !== void 0 || (e4.renderBefore = i3.firstChild), i3;
  }
  update(t3) {
    const i3 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Dt = A(i3, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t3;
    super.connectedCallback(), (t3 = this._$Dt) === null || t3 === void 0 || t3.setConnected(true);
  }
  disconnectedCallback() {
    var t3;
    super.disconnectedCallback(), (t3 = this._$Dt) === null || t3 === void 0 || t3.setConnected(false);
  }
  render() {
    return T;
  }
};
n4.finalized = true, n4._$litElement$ = true, (l2 = globalThis.litElementHydrateSupport) === null || l2 === void 0 || l2.call(globalThis, { LitElement: n4 }), (o4 = globalThis.litElementPolyfillSupport) === null || o4 === void 0 || o4.call(globalThis, { LitElement: n4 });
((r4 = globalThis.litElementVersions) !== null && r4 !== void 0 ? r4 : globalThis.litElementVersions = []).push("3.0.0");

export {
  o,
  r,
  y,
  T,
  x,
  n4 as n
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
