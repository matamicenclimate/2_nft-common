interface failure {
  failed: true
  reason: Error
}
export const failure = function (this: failure, reason: Error) {
  if (new.target == null) {
    return new failure(reason)
  }
  this.failed = true as const
  this.reason = reason
} as unknown as ((reason: Error) => failure) & { new (reason: Error): failure }

interface success<A> {
  failed: false
  result: A
}
export const success = function <A>(this: success<A>, result: A) {
  if (new.target == null) {
    return new success<A>(result)
  }
  this.failed = false as const
  this.result = result
} as unknown as (<A>(result: A) => success<A>) & {
  new <A>(result: A): success<A>
}

export type Result<A> = failure | success<A>

/**
 * Runs a failable operation inside this block, then returns the
 * result, as expected, that it might be a success or a failure.
 *
 * You can match the result like so:
 * @example
 *  const op = Try(() => a / b) // It might throw?
 *  switch (op.failed) {
 *   case true:
 *    return console.log('Bah, failed:', op.reason)
 *   case false:
 *    return op.result + 1
 *  }
 * @param what A functor to be run that might throw.
 * @returns The result of the operation.
 */
export function Try<A>(what: () => A): Result<A> {
  try {
    return success(what())
  } catch (err) {
    return failure(err as Error)
  }
}

/**
 * A factory function that creates an unbound method that will try
 * to run whatever function you passed onto.
 * @param what The functor that may lay an error.
 * @returns A function that is safe against internal throws.
 */
export function Trying<R, Args extends unknown[]>(
  what: (...args: Args) => R
): (...args: Args) => Result<R> {
  return (...args: Args) => Try(() => what(...args))
}
