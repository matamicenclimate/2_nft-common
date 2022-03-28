import * as tdi from 'typedi'
import AbstractService from '../lib/AbstractService'

/** @deprecated See export interface 'type' */
export default interface AlgodConfigProvider {
  get port(): number | ''
  get token(): string
  get server(): string
}

/**
 * Abstract configuration provider for Algod client lazy factory.
 */
export interface type extends AlgodConfigProvider {}

export const { token, inject, declare, get } = AbstractService<type>()

/** @deprecated See Service.token exported object  */
export const ALGOD_CONFIG_PROVIDER_ID = 'algod-config'

/** @deprecated See Service object */
export const AlgodConfigProviderDecorators = {
  Inject: () => tdi.Inject(ALGOD_CONFIG_PROVIDER_ID),
  Service: () => tdi.Service(ALGOD_CONFIG_PROVIDER_ID),
}
