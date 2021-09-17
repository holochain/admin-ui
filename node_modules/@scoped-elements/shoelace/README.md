# @scoped-elements/shoelace

This is the [Shoelace Design System](https://shoelace.style/) library packaged using the scoped custom elements registries pattern using [@open-wc/scoped-elements](https://www.npmjs.com/package/@open-wc/scoped-elements).

## Installation

```bash
npm i @scoped-elements/shoelace
```

## Usage

### As an sub element in your own custom element

```js
import { SlButton, lightTheme } from '@scoped-elements/shoelace';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class CustomElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'sl-button': SlButton,
    };
  }

  render() {
    return html` <sl-button></sl-button> `;
  }

  static styles = [lightTheme]
}
```

### As a globally defined custom element

```js
import { SlButton } from '@scoped-elements/shoelace';

customElements.define('sl-button', SlButton);

// Use in the same way as the shoelace library in the html
```

This requires you to include the shoelace theming separately. See [theming](https://shoelace.style/getting-started/themes?id=activating-themes).

## Documentation for the elements

As this package is just a re-export, you can find the documentation for the elements [here](https://shoelace.style/).

## Appreciation

This library is just a re-export, all the credit goes to [Shoelace](https://shoelace.style/) and its authors. Thanks!
