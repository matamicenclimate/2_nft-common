/**
 * A wallet handle representation.
 */
export abstract class ChainWallet {
  readonly tag = 'wallet' as const

  /**
   * Returns true if this wallet represents a null-like
   * value, zero or root type wallet.
   */
  abstract isNull(): boolean
}
