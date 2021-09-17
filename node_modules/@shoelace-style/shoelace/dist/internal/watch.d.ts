interface WatchOptions {
    waitUntilFirstUpdate?: boolean;
}
export declare function watch(propName: string, options?: WatchOptions): (protoOrDescriptor: any, name: string) => any;
export {};
