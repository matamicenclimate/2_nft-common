import { Account } from 'algosdk'
import * as tdi from 'typedi'
import AbstractService from '../lib/AbstractService'

/**
 * Provides an account
 */
export default interface WalletAccountProvider {
  get account(): Account
}

export type type = WalletAccountProvider

export const { get, token, inject, declare } =
  AbstractService<WalletAccountProvider>()

/** @deprecated See Service.token exported object  */
export const WALLET_ACCOUNT_PROVIDER_ID = 'wallet-provider'

/** @deprecated See Service object */
export const WalletAccountProviderDecorators = {
  Inject: () => tdi.Inject(WALLET_ACCOUNT_PROVIDER_ID),
  Service: () => tdi.Service(WALLET_ACCOUNT_PROVIDER_ID),
}
