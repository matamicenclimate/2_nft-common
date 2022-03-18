import { Transaction } from 'algosdk'

/**
 * An abstraction that allows sevices to sign transactions.
 */
export default interface TransactionSigner {
  /**
   * Signs a single transaction, by using an implementation-dependent wallet.
   */
  signTransaction(transaction: Transaction): Promise<Uint8Array>
}
