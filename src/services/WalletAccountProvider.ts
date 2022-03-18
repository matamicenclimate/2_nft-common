import { Account } from 'algosdk'

/**
 * Provides an account
 */
export default interface WalletAccountProvider {
  get account(): Account
}
