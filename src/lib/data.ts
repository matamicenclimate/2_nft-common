/*
  Data transport level, serialization & deserialization
  utility functions.
*/

/**
 * Ensures that the input is not null.
 */
export function isNotNull<A>(x: A | null): x is A {
  return x != null
}

/**
 * Attempts to parse a string or leaves it untouched if failed.
 */
export function parseOrString(input: string): number | boolean | string {
  try {
    return JSON.parse(input)
  } catch {
    return input
  }
}

export function extracting<A, B>(
  key: keyof A,
  mapper: (atom: A[typeof key]) => B
) {
  return (object: A) => mapper(object[key])
}

/**
 * Takes an input that resembles a k-v file separated by
 * an equals character. Ignores lines that do not match,
 * and that includes comments.
 * @example
 * MY_VAR=true
 * MY_OTHER_VAR=999
 * SOME_ENV=a super secret does not need quotes!
 */
export function parseKVFormat(src: string) {
  return src
    .split('\n')
    .map(s => s.match(/^([^=]+)=([^\n#]+)/))
    .filter(isNotNull)
    .map(([, key, value]) => [key.trim(), parseOrString(value.trim())] as const)
}

/**
 * Creates a predicate generator for tuple-like
 * elements in the array. Will run the predicate
 * for the nth element in the input array.
 */
export function at<A extends readonly unknown[]>(position: number) {
  return {
    when<T>(predicate: (a: T) => a is T) {
      return (a: A) => predicate(a[position] as any)
    },
  }
}

/**
 * Returns a matcher that checks the input string array
 * to match the given regex. Use with filter.
 */
export function matches(regex: RegExp | string) {
  return (<A extends string>(input: A) => isNotNull(input.match(regex))) as <
    A extends string
  >(
    a: A
  ) => a is A
}

/**
 * Collects the given pair-array into a record or table.
 */
export function asTable<A extends readonly [string, unknown]>(
  last: Record<string, A[1]>,
  next: A
): Record<string, A[1]> {
  last[next[0]] = next[1]
  return last
}
