/*
  This contains data about endpoints shared between client and server.
*/
import { Get, Post, Delete, Put } from '.'
import {
  Asset,
  Cause,
  Nft,
  Listing,
  AssetEntity,
  ListingTypes,
} from './entities'

/**
 * Endpoints for the core microservice.
 */
export type core = {
  get: {
    nfts: Get<Nft[]>
    assets: Get<{ assets: Listing[] }, { wallet?: string }>
    'my-assets': Get<{ assets: (Asset | AssetEntity)[] }, { wallet?: string }>
    'asset/:id': Get<{ value: Nft }, undefined, 'id'>
    'listing/:id': Get<Listing, undefined, 'id'>
    'asset-info/:id': Get<Listing, undefined, 'id'>
    healthz: Get<{ status: 'ok' }>
  }
  put: {
    'make-offer': Put<
      {
        offerWallet: string
        transactionId: string
        listingId: string
        price: number
      },
      {
        assetId: number
        offerWallet: string
        transactionId: string
        listingId: string
        type: string
        price: number
      }
    >
  }
  post: {
    'opt-in': Post<{ targetAccount: string }, { assetId: number }>
    'create-auction': Post<
      { appIndex: number },
      {
        assetId: number
        creatorWallet: string
        causePercentage: number
        startDate: string
        endDate: string
      }
    >
    'direct-listing': Post<
      { appIndex: number },
      {
        assetId: number
        creatorWallet: string
        causePercentage: number
      }
    >
    'activate-auction': Post<{ appId: number; assetId: number }, undefined>
    ipfs: Post<Nft, FormData>
    'create-listing': Post<
      CreateListingResponse,
      {
        assetId: number
        creatorWallet: string
        type: ListingTypes
        causePercentage: number
        startDate: string
        endDate: string
      }
    >
    'finish-create-listing': Post<{ appIndex: number }, CreateListingRequest>
  }
  delete: {
    'sell-asset/:appId': Delete<undefined, 'appId'>
  }
}

/**
 * Endpoints for the causes microservice.
 */
export type causes = {
  get: {
    causes: Get<Cause[]>
    'causes/config': Get<{
      percentages: {
        marketplace: number
        cause: number
      }
    }>
  }
  post: {
    causes: Post<
      {
        title: string
        description: string
        wallet: string
        imageUrl: string
      },
      Cause,
      undefined,
      {
        authorization: string
      }
    >
  }
}

export type CreateListingResponse = {
  appIndex: number
  unsignedTxnGroup: {
    signedOptInTxn: string
    encodedTransferTxn: string
    signedFundAppTxn: string
    signedAppCallTxn: string
    signedPayGasTxn: string
    signedFundNftTxn: string
  }
}

export type CreateListingRequest = {
  appIndex: number
  type: ListingTypes
  signedTxn: CreateListingSignedTransactions
}

export type CreateListingSignedTransactions = {
  signedTransferTxn: string
} & Omit<CreateListingResponse['unsignedTxnGroup'], 'encodedTransferTxn'>
