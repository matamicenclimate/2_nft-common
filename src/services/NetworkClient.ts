import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Service } from 'typedi'
import {
  AnyEndpoint,
  AnyGet,
  AnyPost,
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

export type CustomClient<T extends EndpointClient> = Omit<
  AxiosInstance,
  'get' | 'post'
> & {
  get<K extends keyof T['get']>(
    resource: K,
    options?: Omit<AxiosRequestConfig, 'query' | 'params'> &
      (T['get'] extends undefined
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
                }))
  ): ApiFuture<T, 'get', K>
  post<K extends keyof T['post']>(
    resource: K,
    data: any,
    options?: Omit<AxiosRequestConfig, 'params'> &
      (T['post'] extends undefined
        ? {}
        : Params<NonNullable<T['post']>[K]> extends undefined
        ? {}
        : {
            params: {
              [R in NonNullable<Params<NonNullable<T['post']>[K]>>]: string
            }
          })
  ): ApiFuture<T, 'post', K>
}

export function makeClient<T extends EndpointClient>(
  baseURL: string
): CustomClient<T> {
  const client = Axios.create({ baseURL })
  const original = client.get
  client.get = (url, config) => {
    const params = config?.params ?? {}
    delete config?.params
    url = url.toString().replace(/:([^\/]+)/g, (_, p) => params[p])
    return original(url, config)
  }
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
