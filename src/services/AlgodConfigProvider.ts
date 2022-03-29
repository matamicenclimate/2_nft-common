import AbstractService from '../lib/AbstractService'

/**
 * Abstract configuration provider for Algod client lazy factory.
 */
export interface type {
  get port(): number | ''
  get token(): string
  get server(): string
}

export const { token, inject, declare, get } = AbstractService<type>()
