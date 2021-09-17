import { Task } from './task';
export declare type Middleware<P> = (payload: P) => Promise<void>;
export declare type SuccessMiddleware<P> = (payload: P, result: any) => Promise<void>;
export declare type ErrorMiddleware<P> = (payload: P, error: any) => Promise<void>;
export declare type MiddlewareSubscription = {
    unsubscribe: () => void;
};
export declare class MiddlewareExecutor<P> {
    _beforeMiddlewares: Array<Middleware<P>>;
    _successMiddlewares: Array<SuccessMiddleware<P>>;
    _errorMiddlewares: Array<ErrorMiddleware<P>>;
    execute<T>(task: Task<T>, payload: P): Promise<T>;
    before(callback: Middleware<P>): MiddlewareSubscription;
    success(callback: SuccessMiddleware<P>): MiddlewareSubscription;
    error(callback: ErrorMiddleware<P>): MiddlewareSubscription;
    private _addListener;
}
