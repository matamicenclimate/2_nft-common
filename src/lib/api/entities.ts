/*
  This module contains data about the entities used in API
  transactions (Parameters and responses).
*/

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

export interface RekeyAccountRecord {
  id: string
  assetUrl: string
  rekeyWallet: string
  marketplaceWallet: string
  assetId: number
  applicationId: number
  isClosedAuction: boolean
  auctionStartDate: string
  auctionEndDate: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
