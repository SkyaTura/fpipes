/**
 * FPipes (Functional Pipes) is a utility library that provides a way to chain
 * synchronous and asynchronous functions in a readable manner.
 */
export class F {
  /**
   * Starts a new pipe with the given value.
   * 
   * @param {T} value - The initial value to be piped.
   * @returns {F.Pipe<T>} A new pipe instance.
   */
  static start<T>(value: T): F.Pipe<T> {
    return {
      /**
       * @returns {T} The final value of the pipe.
       */
      end: () => value,
      /**
       * Chains a new function to the pipe.
       * If the function returns a promise, the whole pipe chain will be treated as a promise.
       * 
       * @param {M} method - The function to be chained.
       * @returns {F.Pipe<ReturnType<M>>} A new pipe instance.
       */
      pipe: <M extends (value: T) => any>(method: M) => {
        const result = method(value)
        return (
          typeof result?.then === 'function'
            ? F.startPromise(result)
            : F.start(result)
        ) as ReturnType<M> extends Promise<any>
          ? F.PipePromised<ReturnType<M>>
          : F.Pipe<ReturnType<M>>
      }
    }
  }

  /**
   * Starts a new pipe with a promises chained.
   * 
   * @param {T} value - The initial value to be piped.
   * @returns {F.PipePromised<T>} A new pipe instance.
   */
  private static async startPromise<T extends Promise<T>>(value: T) {
    return {
      /**
       * @returns {T} The final value of the pipe.
       */
      end: () => value,
      /**
       * Chains a new function to the pipe.
       * 
       * @param {M} method - The function to be chained.
       * @returns {F.PipePromised<ReturnType<M>>} A new pipe instance.
       */
      pipe: async <M extends ((value: Awaited<T>) => any)>(method: M) => F.startPromise(method(await value))
    }
  }
}

export namespace F {
  export type MaybeAwaited<T extends any | Promise<any>> = T extends Promise<infer R> ? R : T

  /**
   * Pipe chain that returns a promise.
   */
  export type PipePromised<T extends Promise<T>> = {
    end: () => Promise<T>
    pipe: <M extends (value: Awaited<T>) => any>(method: M) => PipePromised<ReturnType<M>>
  }

  /**
   * Pipe chain that returns a value.
   */
  export type Pipe<T> = {
    end: () => T
    pipe: <M extends (value: T) => any>(method: M) => ReturnType<M> extends Promise<any> ? PipePromised<ReturnType<M>> : Pipe<ReturnType<M>>
  }
}