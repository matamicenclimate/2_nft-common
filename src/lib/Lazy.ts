export type LazyValue<T> = () => T

/**
 * Creates a lazy value that will be provided the first time is asked.
 *
 * @example // The provider is only called once.
 * let i = 0
 * const foo = Lazy(() => `foo ${i++}` as const)
 * assert(foo() === 'foo 0')
 * assert(foo() === 'foo 0')
 * assert(foo() === 'foo 0')
 * assert(foo() === 'foo 0')
 * assert(i === 1)
 */
export function Lazy<T>(provider: () => T): LazyValue<T> {
  let value: T
  // The lazy override is done by replacing the function pointer,
  // enabling us to avoid branching at access time (Faster).
  let accessor = () => {
    accessor = () => value
    value = provider()
    return value
  }
  return () => accessor()
}
