/*
  This contains data about endpoints shared between client and server.
*/

import { Get, Post } from '.'
import { Asset, Cause, Nft } from './entities'

/**
 * Endpoints for the core microservice.
 */
export type core = {
  get: {
    nfts: Get<Nft[]>
    assets: Get<Asset[], { wallet?: string }>
    healthz: Get<'healthz', { status: 'ok' }>
  }
  post: {
    'opt-in': Post<{ targetAccount: string }, { assetId: number }>
    'create-auction': Post<{ appIndex: number }, { assetId: number }>
    'activate-auction': Post<{ appId: number; assetId: number }, undefined>
    ipfs: Post<Nft, FormData>
  }
}

/**
 * Endpoints for the causes microservice.
 */
export type causes = {
  get: {
    causes: Get<'causes', Cause[]>
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
      {
        authorization: string
      }
    >
  }
}
