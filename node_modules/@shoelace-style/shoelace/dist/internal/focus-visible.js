import { unsafeCSS } from 'lit';
export const hasFocusVisible = (() => {
    const style = document.createElement('style');
    let isSupported;
    try {
        document.head.appendChild(style);
        style.sheet.insertRule(':focus-visible { color: inherit }');
        isSupported = true;
    }
    catch (_a) {
        isSupported = false;
    }
    finally {
        style.remove();
    }
    return isSupported;
})();
export const focusVisibleSelector = unsafeCSS(hasFocusVisible ? ':focus-visible' : ':focus');
