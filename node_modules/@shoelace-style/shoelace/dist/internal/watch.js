export function watch(propName, options) {
    return (protoOrDescriptor, name) => {
        const { update } = protoOrDescriptor;
        options = Object.assign({ waitUntilFirstUpdate: false }, options);
        protoOrDescriptor.update = function (changedProps) {
            if (changedProps.has(propName)) {
                const oldValue = changedProps.get(propName);
                const newValue = this[propName];
                if (oldValue !== newValue) {
                    if (!(options === null || options === void 0 ? void 0 : options.waitUntilFirstUpdate) || this.hasUpdated) {
                        this[name].call(this, oldValue, newValue);
                    }
                }
            }
            update.call(this, changedProps);
        };
    };
}
