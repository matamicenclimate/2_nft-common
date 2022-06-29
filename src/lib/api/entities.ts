/*
  This module contains data about the entities used in API
  transactions (Parameters and responses).
*/
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
  arc69: {
    description: string
    external_url: string
    mime_type: string
    properties: {
      app_id?: number
      artist: string
      cause: string
      causePercentage: number
      file: {
        name: string
        type: string
        size: number
      }
      date: Date
      price: number
    }
  }
  id: number
  image_url: string
  ipnft: string
  url: string
  title: string
  creator: string
}

/** A discriminator field that tells us about the type of asset sale (What mode). */
export type RekeyAccountType = 'direct-listing' | 'create-auction' | undefined

export interface Listing {
  id: string
  assetUrl?: string | undefined
  marketplaceWallet: string
  assetId: string
  auctionId?: string
  assetIdBlockchain: number
  applicationIdBlockchain: number
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface NftAssetInfo {
  assetInfo: Listing
}
