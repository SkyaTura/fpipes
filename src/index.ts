/**
 * FPipes (Functional Pipes) is a utility library that provides a way to chain
 * synchronous and asynchronous functions in a readable manner.
 */
export class F {
  /**
   * Creates a new pipe with an initial value.
   * @param initialValue - The initial value of the pipe.
   * @returns An object with methods for chaining pipe operations.
   */
  static pipe = <T>(initialValue: T) => ({
    /**
     * Retrieves the current value of the pipe.
     * @returns The current value in the pipe.
     */
    value: () => initialValue,

    /**
     * Adds a new method to the pipe.
     * If the method returns a Promise, the chain will be treated as a Promise until the end,
     * waiting for the Promise to resolve before proceeding with subsequent operations.
     * @param method - The method to add to the pipe.
     * @returns A new pipe with the added method.
     */
    pipe: <R>(method: F.PipeMethod<T, R>) => F.pipe(F.callMethod(initialValue, method)),
  })

  /**
   * Determines if the given value is a Promise.
   * @param value - The value to check.
   * @returns True if the value is a Promise, false otherwise.
   */
  private static isPromise = <T extends F.MaybePromise<any>>(value: T) =>
    (typeof (value as Promise<any>)?.then === 'function') as (T extends Promise<any> ? true : false)

  /**
   * Calls the provided method with the given value.
   * Handles synchronous and asynchronous cases.
   * @param value - The value to pass to the method.
   * @param method - The method to call with the value.
   * @returns The result of the method call.
   */
  private static callMethod = <T extends F.MaybePromise<any>, R extends F.MaybePromise<any>>(
    value: T,
    method: F.PipeMethod<T, R>
  ) =>
    (!F.isPromise(value)
      ? method(value as F.UnwrapPromise<T>)
      : (value as F.WrapPromise<T>)
        .then(awaited => method(awaited as F.UnwrapPromise<T>))) as F.IfPromise<T, F.WrapPromise<R>, R>
}

export namespace F {
  /**
   * Represents a value that may be a Promise.
   */
  export type MaybePromise<T> = T | Promise<T>

  /**
   * Unwraps a Promise type if the input type is a Promise.
   */
  export type UnwrapPromise<T extends any | Promise<any>> = T extends Promise<infer R> ? R : T

  /**
   * Wraps a type with a Promise if the input type is not already a Promise.
   */
  export type WrapPromise<T extends any | Promise<any>> = T extends Promise<any> ? T : Promise<T>

  /**
   * Conditionally applies the Then type if the input type is a Promise, or the Else type otherwise.
   */
  export type IfPromise<T extends MaybePromise<any>, Then, Else> = T extends Promise<any> ? Then : Else

  /**
   * Represents a method in a pipe that takes a previous value and returns a new value.
   */
  export type PipeMethod<T extends MaybePromise<any>, R extends MaybePromise<any>> = (previousValue: UnwrapPromise<T>) => R
}