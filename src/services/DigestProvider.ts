import AbstractService from '../lib/AbstractService'

/**
 * Implementation dependent, digest provider.
 * Takes an object, applies a digest function and returns the result.
 */
export interface type {
  digest<T>(payload: T): Uint8Array
}

export const { get, inject, declare, token } = AbstractService<type>()
