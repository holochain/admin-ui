import rollupTypescript from '@rollup/plugin-typescript';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';

const typescript = fromRollup(rollupTypescript);
const commonjs = fromRollup(rollupCommonjs);

export default /** @type {import('@web/dev-server').DevServerConfig} */ {
  port: 8080,
  watch: true,
  open: '/demo/index.html',
  nodeResolve: {
    preferBuiltins: false,
    browser: true,
    mainFields: ['browser', 'module', 'main'],
  },
  plugins: [
    typescript(),
    commonjs({
      include: [
        'node_modules/cytoscape/**/*',
        'node_modules/cytoscape-dagre/**/*',
        'node_modules/cytoscape-cola/**/*',
      ],
    }),
  ],
};
