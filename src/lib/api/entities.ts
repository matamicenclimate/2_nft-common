/*
  This module contains data about the entities used in API
  transactions (Parameters and responses).
*/
import { Arc69 } from '../AssetNote'

export interface Asset {
  'asset-id': number
  amount?: number
  deleted?: boolean
  'is-frozen'?: boolean
  'opted-in-at-round'?: number
}
export interface Cause {
  title: string
  description: string
  imageUrl: string
  wallet: string
  deletedAt: string | null
  id: string
  createdAt: string
  updatedAt: string
}

export interface Nft {
  arc69: Arc69
  id: number
  image_url: string
  ipnft: string
  url: string
  title: string
  creator: string
}

export interface AssetEntity {
  id: string
  arc69: Arc69
  assetIdBlockchain: number
  causeId: string
  applicationIdBlockchain: number
  imageUrl: string
  ipnft: string
  url: string
  title: string
  creator: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
/** A discriminator field that tells us about the type of asset sale (What mode). */
export type RekeyAccountType = 'direct-listing' | 'create-auction' | undefined

export interface Auction {
  id: string
  startDate: string
  endDate: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
export interface Offer {
  id: string
  offerWallet: string
  price: number
  listingId: string
  listing?: Listing
  transactionId: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type ListingTypes = 'auction' | 'direct-listing'
export interface Listing {
  id: string
  assetUrl?: string | undefined
  marketplaceWallet: string
  assetId: string
  asset: AssetEntity
  offers?: Offer[]
  auction?: Auction
  auctionId?: string
  assetIdBlockchain: number
  applicationIdBlockchain: number
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
  type: ListingTypes
  deletedAt?: Date | null
}

export interface NftAssetInfo {
  assetInfo: Listing
}

export type CauseAppInfo = {
  causeWallet: string
  causePercentage: number
  creatorPercentage: number
}

/*
 @todo REFACTOR TYPES!!!!! TIGHT COUPLING Transport layer <=> Storage layer
 @warn This causes data inconsistencies plus a tight coupling with
 the storage strategy, BEWARE!
*/

export const AssetInformationType = {
  STORED_IN_WALLET: 'wallet' as const,
  LISTED_AS_AUCTION: 'auction' as const,
  LISTED_AS_SELLING: 'selling' as const,
  UNKNOWN_STATE: 'unknown' as const,
}

export interface CommonAssetInfo {
  id: number
}

/**
 * Represents an asset that is present in the user's wallet.
 */
export interface StoredInWalletAssetInfo extends CommonAssetInfo {
  readonly type: typeof AssetInformationType['STORED_IN_WALLET']
  amount: number
  _original: Asset
}

/**
 * Common fields for all assets stored in the marketplace's database.
 */
export interface StoredInMarketplaceAssetInfo {
  arc69: Arc69
  causeId: string
  applicationIdBlockchain: number
  imageUrl: string
  ipnft: string
  url: string
  title: string
  creator: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  _original: AssetEntity
}

/**
 * The asset information regarding an asset that has been listed
 * in the marketplace as an _"Auction"_.
 */
export interface ListedAsAuctionAssetInfo
  extends CommonAssetInfo,
    StoredInMarketplaceAssetInfo {
  readonly type: typeof AssetInformationType['LISTED_AS_AUCTION']
}

/**
 * The asset information regarding an asset that has been listed
 * in the marketplace as a _"Direct Selling"_.
 */
export interface ListedAsSellingAssetInfo
  extends CommonAssetInfo,
    StoredInMarketplaceAssetInfo {
  readonly type: typeof AssetInformationType['LISTED_AS_SELLING']
}

/**
 * # Asset Information Interface
 *
 * This type represents the whole asset information,
 * regardless of it's data source or origin.
 *
 * All data might be discriminated through the type
 * field, which are declared constant.
 *
 * @remarks Use only in transport layer! DO NOT ATTEMPT TO STORE!
 */
export type AssetInformation =
  | StoredInWalletAssetInfo
  | ListedAsAuctionAssetInfo
  | ListedAsSellingAssetInfo
