import {
  o
} from "./chunk.X3WLUTHF.js";

// src/internal/focus-visible.ts
var hasFocusVisible = (() => {
  const style = document.createElement("style");
  let isSupported;
  try {
    document.head.appendChild(style);
    style.sheet.insertRule(":focus-visible { color: inherit }");
    isSupported = true;
  } catch (e) {
    isSupported = false;
  } finally {
    style.remove();
  }
  return isSupported;
})();
var focusVisibleSelector = o(hasFocusVisible ? ":focus-visible" : ":focus");

export {
  hasFocusVisible,
  focusVisibleSelector
};
