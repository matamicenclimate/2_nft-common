/*
  Common runtime and static type manipulation.
*/

/**
 * Type guard for inferred arrays.
 */
export function isArray<U>(value: unknown): value is U[] {
  return value instanceof Array
}

/**
 * Utility function that throws if the provided type is not an array type.
 */
export function assertArray<T>(value: T): T extends unknown[] ? T : never {
  if (isArray(value)) return value as T extends unknown[] ? T : never
  throw new Error('Not an array!')
}

/**
 * A well-known Auction approval application's global state.
 *
 * @example
 * // Example of use:
 * const state = await TransactionOperation.do.getApplicationState<AuctionAppState>(...)
 * const a = state.start + 1 // here is number already.     Here: ^^^^^^^^^^^^^^^^^
 */
export type AuctionAppState = {
  end: number
  nft_id: number
  bid_account: Uint8Array
  bid_amount?: number
  num_bids?: number
  min_bid_inc: number
  reserve_amount: number
  start: number
  seller: Uint8Array
}
