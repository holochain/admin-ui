import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const pkg = require('./package.json');

export const plugins = [
  replace({
    'customElements.define(JsonViewer.is, JsonViewer);': '',
    'customElements.define(GridElement.is, GridElement);': '',
    'customElements.define(GridColumnElement.is, GridColumnElement);': '',
  }),
  json(),
  typescript(),
  resolve({
    preferBuiltins: false,
    browser: true,
    mainFields: ['browser', 'module', 'main'],
  }),
  commonjs({
    include: /node_modules/,
  }),
];

export default {
  input: `src/index.ts`,
  output: { dir: 'dist', format: 'es', sourcemap: true },
  external: [
    ...Object.keys(pkg.dependencies).filter(
      (key) =>
        !key.includes('cytoscape') &&
        !key.includes('json-viewer') &&
        !key.includes('@vaadin')
    ),
    /scoped-material-components/,
    'lit/directives/style-map.js',
    'lit/directives/class-map.js',
    'lodash-es',
  ],
  plugins,
};
