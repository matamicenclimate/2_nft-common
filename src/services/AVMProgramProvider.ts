import AbstractService from '../lib/AbstractService'

/**
 * Algorand virtual machine program provider.
 *
 * Provides, if available, the needed AVM programs (Compiled & ready to be uploaded).
 */
export interface type {
  get auctionApprovalProgram(): Promise<Uint8Array>
  get clearStateProgram(): Promise<Uint8Array>
}

export const { token, get, inject, declare } = AbstractService<type>()
