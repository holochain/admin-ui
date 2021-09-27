import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import css from "rollup-plugin-css-only";

const pkg = require("./package.json");

export default {
  input: "src/index.ts",
  output: {
    format: "esm",
    dir: "dist",
  },
  external: [...Object.keys(pkg.dependencies)],
  plugins: [
    typescript({}),
    css({}),
    vue({
      compilerOptions: {
        // treat any tag that starts with ion- as custom elements
        isCustomElement: (tag) =>
          tag.startsWith("copyable-") ||
          tag.startsWith("mwc-") ||
          tag.startsWith("ui5-") ||
          tag.startsWith("sl-"),
      },
    }),
  ],
};
