import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Service } from 'typedi'
import { AnyEndpoint, AnyGet, AnyPost, Query, Response } from '../lib/api'
import { causes, core } from '../lib/api/endpoints'

export interface EndpointClient {
  post?: Record<string, AnyPost>
  get?: Record<string, AnyGet>
  put?: Record<string, AnyEndpoint>
  delete?: Record<string, AnyEndpoint>
  head?: Record<string, AnyEndpoint>
  options?: Record<string, AnyEndpoint>
}

export type WillRespond<A extends AnyEndpoint> = Promise<
  AxiosResponse<Response<A>>
>

export type ApiFuture<
  T extends NonNullable<EndpointClient>,
  Verb extends keyof T,
  Res extends keyof T[Verb]
> = WillRespond<T[Verb][Res] extends AnyEndpoint ? T[Verb][Res] : never>

export type CustomClient<T extends EndpointClient> = Omit<
  AxiosInstance,
  'get' | 'post'
> & {
  get<K extends keyof T['get']>(
    resource: K,
    options?: Omit<AxiosRequestConfig, 'query'> &
      (T['get'] extends undefined
        ? {}
        : Query<NonNullable<T['get']>[K]> extends undefined
        ? {}
        : { query: Query<NonNullable<T['get']>[K]> })
  ): ApiFuture<T, 'get', K>
  post<K extends keyof T['post']>(
    resource: K,
    data: any,
    options?: AxiosRequestConfig
  ): ApiFuture<T, 'post', K>
}

export function makeClient<T extends EndpointClient>(
  baseURL: string
): CustomClient<T> {
  return Axios.create({ baseURL }) as CustomClient<T>
}

export type CoreV1 = core['api']['v1']
export type CausesV1 = causes['api']['v1']

/**
 * This service is capable of consuming configured
 */
@Service()
export default class NetworkClient {
  readonly core: CustomClient<{
    get: {
      nfts: CoreV1['get_nfts']
      healthz: CoreV1['get_healthz']
    }
    post: {
      ['opt-in']: CoreV1['post_opt_in']
      ['create-auction']: CoreV1['post_create_auction']
      ['activate-auction']: CoreV1['post_activate_auction']
      ipfs: CoreV1['post_ipfs']
    }
  }>
  readonly causes: CustomClient<{
    get: {
      causes: CausesV1['get_causes']
    }
    post: {
      causes: CausesV1['post_causes']
    }
  }>
  constructor(coreUrl: string, causesUrl: string) {
    this.core = makeClient(coreUrl)
    this.causes = makeClient(causesUrl)
  }
}
