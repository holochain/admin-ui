import { css } from 'lit';
import utilityStyles from '../styles/utility.styles';
export default css `
  :host {
    position: relative;
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
const style = document.createElement('style');
style.textContent = utilityStyles.toString();
document.head.append(style);
