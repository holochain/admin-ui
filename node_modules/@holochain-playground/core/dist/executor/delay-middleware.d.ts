import { Middleware } from './middleware-executor';
export declare const sleep: (ms: number) => Promise<void>;
export declare const DelayMiddleware: (ms: number) => Middleware<any>;
