import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import css from "rollup-plugin-css-only";

const pkg = require("./package.json");

export default {
  input: "src/lib.ts",
  output: {
    format: "esm",
    dir: "dist",
  },
  external: [...Object.keys(pkg.dependencies)],
  plugins: [typescript({}), css({}), vue({})],
};
