/*
  Network utility functions.
*/

import { none, option } from '@octantis/option'
import axios, { AxiosError, AxiosResponse } from 'axios'

export function errorIsAxios(err: unknown): err is AxiosError {
  const e = err as Record<string, unknown>
  return e.isAxiosError === true && e.response != null
}

export class RetryError extends Error {
  constructor(message: string, readonly errors: Error[]) {
    super(message)
  }
}

const using = <A>(value: A, fn: (a: A) => A) => fn(value)
/** The backoff exponential base. */
export let backoffBase = 2
/** The backoff algorithm time cap. */
export let backoffMaxTime = 10000
/** Computes the maximum backoff time. */
export const backoffTime = (attempt: number) =>
  Math.min(backoffMaxTime, backoffBase * 2 * attempt)
/** Generates a jittered, exponential backoff. */
export const btJitter = (attempt: number) =>
  using(backoffTime(attempt), it => it * Math.random() + it / 2)

/**
 * Returns a promise that will resolve or fail after
 * the nth retry, in case of failure.
 */
export async function retrying<A>(
  req: Promise<AxiosResponse<A>>,
  retries?: number,
  onError?: (failed: AxiosError<A>) => option<A>
): Promise<AxiosResponse<A>>
/** @internal */
export async function retrying<A>(
  req: Promise<AxiosResponse<A>>,
  retries: number,
  onError: (failed: AxiosError<A>) => option<A>,
  errors: Error[],
  attempt: number
): Promise<AxiosResponse<A>>
export async function retrying<A>(
  req: Promise<AxiosResponse<A>>,
  retries: number = Number.POSITIVE_INFINITY,
  onError: (failed: AxiosError<A>) => option<A> = () => none(),
  errors: Error[] = [],
  attempt = 0
): Promise<AxiosResponse<A>> {
  try {
    return await req
  } catch (err) {
    errors.push(err as Error)
    if (errorIsAxios(err)) {
      if (attempt >= retries) {
        throw new RetryError(`Request failed many retries.`, errors)
      }
      for (const result of onError(err)) {
        return {
          data: result,
          status: err.response?.status ?? -1,
          statusText: err.code ?? '',
          headers: err.response?.headers ?? {},
          config: err.config,
          request: err.request,
        }
      }
      await new Promise(r => setTimeout(r, btJitter(attempt)))
      return retrying(axios(err.config), retries, onError, errors, attempt + 1)
    } else {
      throw new RetryError(`Unexpected mid-flight failure`, errors)
    }
  }
}
