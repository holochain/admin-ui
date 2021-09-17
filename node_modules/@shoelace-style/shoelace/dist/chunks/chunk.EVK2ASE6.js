// src/utilities/animation-registry.ts
var defaultAnimationRegistry = new Map();
var customAnimationRegistry = new WeakMap();
function ensureAnimation(animation) {
  return animation != null ? animation : { keyframes: [], options: { duration: 0 } };
}
function setDefaultAnimation(animationName, animation) {
  defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}
function setAnimation(el, animationName, animation) {
  customAnimationRegistry.set(el, Object.assign({}, customAnimationRegistry.get(el), {
    [animationName]: ensureAnimation(animation)
  }));
}
function getAnimation(el, animationName) {
  const customAnimation = customAnimationRegistry.get(el);
  if (customAnimation && customAnimation[animationName]) {
    return customAnimation[animationName];
  }
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return defaultAnimation;
  }
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}

export {
  setDefaultAnimation,
  setAnimation,
  getAnimation
};
