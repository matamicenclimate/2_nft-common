import { Transaction } from 'algosdk'
import * as tdi from 'typedi'
import AbstractService from '../lib/AbstractService'

/**
 * An abstraction that allows sevices to sign transactions.
 */
export default interface TransactionSigner {
  /**
   * Signs a single transaction, by using an implementation-dependent wallet.
   */
  signTransaction(transaction: Transaction): Promise<Uint8Array>
}

export type type = TransactionSigner

export const { get, token, inject, declare } =
  AbstractService<TransactionSigner>()

/** @deprecated See Service.token exported object  */
export const TRANSACTION_SIGNER_ID = 'transaction-signer'

/** @deprecated See Service object */
export const TransactionSignerDecorators = {
  Inject: () => tdi.Inject(TRANSACTION_SIGNER_ID),
  Service: () => tdi.Service(TRANSACTION_SIGNER_ID),
}
