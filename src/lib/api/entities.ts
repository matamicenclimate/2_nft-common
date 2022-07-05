/*
  This module contains data about the entities used in API
  transactions (Parameters and responses).
*/
import { Arc69 } from "../AssetNote"

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
  deletedAt?: Date | null;
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
export interface Listing {
  id: string
  assetUrl?: string | undefined
  marketplaceWallet: string
  assetId: string
  asset: AssetEntity
  auction?: Auction
  auctionId?: string
  assetIdBlockchain: number
  applicationIdBlockchain: number
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
  type: 'auction' | 'direct-listing'
  deletedAt?: Date | null
}

export interface NftAssetInfo {
  assetInfo: Listing
}
