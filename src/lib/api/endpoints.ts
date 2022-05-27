/*
  This contains data about endpoints shared between client and server.
*/

import { Get, Post } from '.'
import { Asset, Cause, Nft, RekeyAccountRecord } from './entities'

/**
 * Endpoints for the core microservice.
 */
export type core = {
  get: {
    nfts: Get<Nft[]>
    assets: Get<{ assets: RekeyAccountRecord[] }, { wallet?: string }>
    'my-assets': Get<{ assets: Asset[] }, { wallet?: string }>
    'asset/:id': Get<{ value: Nft }, undefined, 'id'>
    healthz: Get<{ status: 'ok' }>
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
    'sell-asset/:id': Post<undefined, undefined, 'id'>
    'activate-auction': Post<{ appId: number; assetId: number }, undefined>
    ipfs: Post<Nft, FormData>
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
