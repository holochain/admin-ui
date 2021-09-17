# @scoped-elements/golden-layout

Custom Elements that export the [golden-layout](https://github.com/golden-layout/golden-layout) library.

The main goals for these bindings is:

1. To be able to use golden-layout without having to define a tree of components in the JS side.
2. To be able to easily define custom elements as the component types for golden-layout.

## Features

- [x] Golden-Layout shows and works correctly.
- [x] Ability to define the tree structure of the initial layout only with HTML.
- [x] Ability to register HTML components.
- [x] Ability to define a custom HTML structure to fit golden-layout in.
- [x] Ability to define drag sources.
- [ ] Ability to save and load state.
- [ ] Ability to customize the settings for golden-layout.
- [ ] Handle edge cases and errors gracefully.
- [ ] Enable Popup.

## Installation

```bash
npm i "https://github.com/scoped-elements/golden-layout"
```

## Usage

```html
<golden-layout id="layout">
  <golden-layout-register component-type="hello">
    <template>
      <div>hi</div>
    </template>
  </golden-layout-register>
  <golden-layout-register component-type="second">
    <template>
      <div>hi second</div>
    </template>
  </golden-layout-register>

  <div style="display: flex; flex-direction: row; flex: 1;">
    <ul>
      <golden-layout-drag-source component-type="hello">
        <li>hii</li>
      </golden-layout-drag-source>
    </ul>

    <golden-layout-root style="flex: 1">
      <golden-layout-row>

        <golden-layout-column>
          <golden-layout-component component-type="hello" title="hi">
          </golden-layout-component>
          <golden-layout-component component-type="second" title="hi">
          </golden-layout-component>
        </golden-layout-column>

        <golden-layout-stack>
          <golden-layout-component component-type="hello" title="hi2">
          </golden-layout-component>
          <golden-layout-component component-type="second" title="hi2">
          </golden-layout-component>
        </golden-layout-stack>

      </golden-layout-row>
    </golden-layout-root>
  </div>
</golden-layout>

<script type="module">
  import {
    GoldenLayout,
    GoldenLayoutRow,
    GoldenLayoutComponent,
    GoldenLayoutRegister,
    GoldenLayoutDragSource,
    GoldenLayoutRoot,
  } from '../dist/index.js';

  customElements.define('golden-layout', GoldenLayout);
  customElements.define('golden-layout-row', GoldenLayoutRow);
  customElements.define('golden-layout-component', GoldenLayoutComponent);
  customElements.define('golden-layout-register', GoldenLayoutRegister);
  customElements.define('golden-layout-root', GoldenLayoutRoot);
  customElements.define('golden-layout-drag-source', GoldenLayoutDragSource);
</script>
```

You can find a full working demo in `demo/index.html`.

## Linting with ESLint, Prettier, and Types

To scan the project for linting errors, run

```bash
npm run lint
```

You can lint with ESLint and Prettier individually as well

```bash
npm run lint:eslint
```

```bash
npm run lint:prettier
```

To automatically fix many linting errors, run

```bash
npm run format
```

You can format using ESLint and Prettier individually as well

```bash
npm run format:eslint
```

```bash
npm run format:prettier
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
