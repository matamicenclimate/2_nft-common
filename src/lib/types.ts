/*
  Common runtime and static type manipulation.
*/

/**
 * Type guard for inferred arrays.
 */
export function isArray<U>(value: unknown): value is U[] {
  return value instanceof Array
}

/**
 * Utility function that throws if the provided type is not an array type.
 */
export function assertArray<T>(value: T): T extends unknown[] ? T : never {
  if (isArray(value)) return value as T extends unknown[] ? T : never
  throw new Error('Not an array!')
}
