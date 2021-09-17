import { Task } from './task';

export type Middleware<P> = (payload: P) => Promise<void>;
export type SuccessMiddleware<P> = (payload: P, result: any) => Promise<void>;
export type ErrorMiddleware<P> = (payload: P, error: any) => Promise<void>;
export type MiddlewareSubscription = { unsubscribe: () => void };

export class MiddlewareExecutor<P> {
  _beforeMiddlewares: Array<Middleware<P>> = [];
  _successMiddlewares: Array<SuccessMiddleware<P>> = [];
  _errorMiddlewares: Array<ErrorMiddleware<P>> = [];

  async execute<T>(task: Task<T>, payload: P): Promise<T> {
    for (const middleware of this._beforeMiddlewares) {
      await middleware(payload);
    }

    try {
      const result = await task();

      for (const middleware of this._successMiddlewares) {
        await middleware(payload, result);
      }

      return result;
    } catch (e) {
      for (const middleware of this._errorMiddlewares) {
        await middleware(payload, e);
      }

      throw e;
    }
  }

  before(callback: Middleware<P>): MiddlewareSubscription {
    return this._addListener(callback, this._beforeMiddlewares);
  }
  success(callback: SuccessMiddleware<P>): MiddlewareSubscription {
    return this._addListener(callback, this._successMiddlewares);
  }

  error(callback: ErrorMiddleware<P>): MiddlewareSubscription {
    return this._addListener(callback, this._errorMiddlewares);
  }

  private _addListener(callback: Function, middlewareList: Array<Function>) {
    middlewareList.unshift(callback);

    return {
      unsubscribe: () => {
        const index = middlewareList.findIndex(c => c === callback);
        middlewareList.splice(index, 1);
      },
    };
  }
}
