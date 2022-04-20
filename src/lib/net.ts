/*
  Network utility functions.
*/

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

/**
 * Returns a promise that will resolve or fail after
 * the nth retry, in case of failure.
 */
export async function retrying<A>(
  req: Promise<AxiosResponse<A>>,
  retries: number,
  total = retries,
  errors: Error[] = []
): Promise<AxiosResponse<A>> {
  try {
    return await req
  } catch (err) {
    errors.push(err as Error)
    if (errorIsAxios(err)) {
      if (retries <= 0) {
        throw new RetryError(`Request failed after ${total} retries.`, errors)
      }
      console.warn(`Request ${err.config.url} failed ${retries}/${total}`)
      return retrying(axios(err.config), retries - 1, total, errors)
    } else {
      throw new RetryError(`Unexpected mid-flight failure`, errors)
    }
  }
}
