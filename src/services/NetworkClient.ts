import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Service } from 'typedi'
import {
  AnyEndpoint,
  AnyGet,
  AnyPost,
  Body,
  HttpVerbLow,
  Params,
  Query,
  Response,
} from '../lib/api'
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

type GetOptions<
  T extends EndpointClient,
  K extends keyof T['get']
> = T['get'] extends undefined
  ? {}
  : (Query<NonNullable<T['get']>[K]> extends undefined
      ? {}
      : { query: Query<NonNullable<T['get']>[K]> }) &
      (Params<NonNullable<T['get']>[K]> extends undefined
        ? {}
        : {
            params: {
              [R in NonNullable<Params<NonNullable<T['get']>[K]>>]: string
            }
          })

type PostOptions<T extends EndpointClient, K extends keyof T['post']> = Maybe<
  T['post'],
  Maybe<
    Params<NonNullable<T['post']>[K]>,
    {
      params: {
        [R in NonNullable<Params<NonNullable<T['post']>[K]>>]: string
      }
    }
  >
>

type If<T, A, B> = T extends undefined ? B : A
type Require<T, A> = If<T, A, never>
type Maybe<T, A> = If<T, A, {}>

export type CustomClient<T extends EndpointClient> = Omit<
  AxiosInstance,
  'get' | 'post'
> & {
  get<K extends keyof T['get']>(
    resource: K,
    options?: Omit<AxiosRequestConfig, 'query' | 'params'> & GetOptions<T, K>
  ): ApiFuture<T, 'get', K>
  post<K extends keyof T['post']>(
    resource: K,
    data: T['post'] extends undefined ? never : Body<NonNullable<T['post']>[K]>,
    options?: Omit<AxiosRequestConfig, 'params'> & PostOptions<T, K>
  ): ApiFuture<T, 'post', K>
}

function patch(client: AxiosInstance, key: HttpVerbLow) {
  const original = client[key]
  client[key] = (url, config = {}) => {
    const params: Record<string, string> =
      (config as unknown as Record<string, Record<string, string>>).params ?? {}
    ;(config as unknown as Record<string, unknown>).params = (
      config as unknown as Record<string, unknown>
    ).query
    url = url.toString().replace(/:([^\/]+)/g, (_, p) => params[p])
    return original(url, config as unknown as Record<string, unknown>)
  }
}

export function makeClient<T extends EndpointClient>(
  baseURL: string
): CustomClient<T> {
  const client = Axios.create({ baseURL })
  patch(client, 'get')
  patch(client, 'post')
  patch(client, 'put')
  patch(client, 'delete')
  patch(client, 'patch')
  patch(client, 'head')
  patch(client, 'options')
  return client as CustomClient<T>
}

/**
 * This service is capable of consuming configured
 */
@Service()
export default class NetworkClient {
  readonly core: CustomClient<core>
  readonly causes: CustomClient<causes>
  constructor(coreUrl: string, causesUrl: string) {
    this.core = makeClient(coreUrl)
    this.causes = makeClient(causesUrl)
  }
}
