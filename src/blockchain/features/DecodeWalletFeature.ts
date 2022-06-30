import { Result } from '../../lib/Result'
import { ChainWallet } from '../lib/ChainWallet'

export type AddressLike = Uint8Array | string | string[] | number[]

export interface DecodeWalletFeature {
  /**
   * Tries to decode an address-like, binary or text encoded
   * address representing a wallet.
   */
  decodeWallet(from: AddressLike): Result<ChainWallet>
}
