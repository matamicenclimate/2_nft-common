import { Transaction } from 'algosdk'
import AbstractService from '../lib/AbstractService'

/**
 * An abstraction that allows sevices to sign transactions.
 */
export interface type {
  /**
   * Signs a single transaction, by using an implementation-dependent wallet.
   */
  signTransaction(transaction: Transaction): Promise<Uint8Array>
  signTransaction(transaction: Transaction[]): Promise<Uint8Array[]>
}

export const { get, token, inject, declare } = AbstractService<type>()
