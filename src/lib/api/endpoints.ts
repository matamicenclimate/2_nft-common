/*
  This contains data about endpoints shared between client and server.
*/

import { Get, Post } from '.'
import { Cause, Nft } from './entities'

/**
 * Endpoints for the core microservice.
 */
export type core = {
  api: {
    v1: {
      get_nfts: Get<'nfts', Nft[]>
      get_healthz: Get<'healthz', { status: 'ok' }>
      post_opt_in: Post<
        'opt-in',
        { targetAccount: string },
        { assetId: number }
      >
      post_create_auction: Post<
        'create-auction',
        { appIndex: number },
        { assetId: number }
      >
      post_activate_auction: Post<
        'activate-auction',
        { appId: number; assetId: number },
        undefined
      >
      post_ipfs: Post<'ipfs', Nft, FormData>
    }
  }
}

/**
 * Endpoints for the causes microservice.
 */
export type causes = {
  api: {
    v1: {
      get_causes: Get<'causes', Cause[]>
      post_causes: Post<
        'causes',
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
}
