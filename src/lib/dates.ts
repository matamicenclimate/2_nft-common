/*
  This module contains common abstractions for date checks.
*/
import { None, Option, Some } from '@octantis/option'

/**
 * ## Immutable Date
 *
 * A readonly version of the JS date object, where
 * the mutators have been hidden to the implementation,
 * in order to avoid mutations.
 */
export type DateLike = Omit<
  Date,
  | 'setDate'
  | 'setHours'
  | 'setMinutes'
  | 'setSeconds'
  | 'setUTCDate'
  | 'setUTCHours'
  | 'setUTCMinutes'
  | 'setUTCSeconds'
  | 'setFullYear'
  | 'setMilliseconds'
  | 'setMonth'
  | 'setTime'
  | 'setUTCFullYear'
  | 'setUTCMilliseconds'
  | 'setUTCMonth'
  | 'setYear'
  | 'toUTCString'
>

/**
 * Attempts to parse the input string as a valid moment.
 * If not a valid unix timestamp, returns empty.
 */
export function asMoment(input: string): Option<number> {
  if (typeof input !== 'string') return None()
  const moment = Date.parse(input)
  if (Number.isNaN(moment)) {
    return None()
  }
  return Some(moment)
}

/**
 * Boolean version of date check.
 * @warning You might prefer to use option control flow to determine
 * the validity of a date!
 * @see asMoment(string): option<number>
 */
export function isValidDate(input: string): boolean {
  return asMoment(input).isDefined()
}

/**
 * Attempts to parse the input, if not valid will return
 * an empty option.
 */
export function asDate(input: string): Option<DateLike> {
  return asMoment(input).map(moment => new Date(moment))
}

/**
 * A simple numeric wrapper that represents the distance
 * between two scalar points.
 */
class Delta {
  constructor(readonly value: number) {}
  get positive() {
    return this.value > 0
  }
  /**
   * Returns the difference between two dates, in milliseconds.
   */
  static from(start: DateLike, end: DateLike): Delta {
    return new Delta((end as unknown as number) - (start as unknown as number))
  }
}

/**
 * A wrapper for the distance of two dates.
 */
class DateDiff {
  readonly delta: Delta
  constructor(readonly start: DateLike, readonly end: DateLike) {
    this.delta = Delta.from(start, end)
  }
  /** This time-like distance is not valid, as represents a reverse time-like flow. */
  get valid() {
    return this.delta.positive
  }
  /** This date difference originates in the past, if true. */
  get past() {
    return this.start < new Date()
  }
  /** Return the distance of those two date points. */
  get distance() {
    return this.delta.value
  }
}

/**
 * Creates a diff from nullish values, if possible.
 */
export function diffFrom(
  start?: DateLike | null,
  end?: DateLike | null
): Option<DateDiff> {
  if (start != null && end != null) {
    return Some(new DateDiff(start, end))
  }
  return None()
}

/**
 * Parses two input strings, and returns them along with the
 * time delta.
 * If one or both input strings account as invalid, it won't resolve.
 */
export function asDiff(start: string, end: string): Option<DateDiff> {
  return asDate(start)
    .zip(asDate(end))
    .map(([start, end]) => new DateDiff(start, end))
}
