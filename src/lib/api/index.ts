/*
  This module contains shared API type definitions.

  The code presented here is intended to have the server
  and the client in-sync (in schema terms) all the time.
*/

/** Any valid RESTful type HTTP verb. */
export type HttpVerb =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'PATCH'

/** Lowercase version of the HTTP verbs. */
export type HttpVerbLow = Lowercase<HttpVerb>

/**
 * Describes a type constraint for an API endpoint.
 * @template Action The HTTP verb action.
 * @template Res The structure of response of the endpoint.
 * @template Params A union of path parameters.
 * @template Head Required headers object.
 */
export type Endpoint<
  Action extends HttpVerb,
  Res,
  Params extends string | undefined = undefined,
  Head = undefined
> = {
  action: Action
  response: Res
  headers: Head
  params: Params
}

/**
 * Represents a GET type request.
 * @template Res The structure of response of the endpoint.
 * @template Query A query object.
 * @template Params A union of path parameters.
 * @template Head Required headers object.
 */
export type Get<
  Res,
  Query = undefined,
  Params extends string | undefined = undefined,
  Head = undefined
> = Endpoint<'GET', Res, Params, Head> & { query: Query }

/**
 * Represents a POST type request.
 * @template Res The structure of response of the endpoint.
 * @template Body The structure of the request body.
 * @template Params A union of path parameters.
 * @template Head Required headers object.
 */
export type Post<
  Res,
  Body,
  Params extends string | undefined = undefined,
  Head = undefined
> = Endpoint<'POST', Res, Params, Head> & {
  body: Body
}

export type AnyEndpoint = Endpoint<
  HttpVerb,
  unknown,
  string | undefined,
  unknown
>
export type AnyPost = Post<unknown, unknown, string | undefined, unknown>
export type AnyGet = Get<unknown, unknown, string | undefined, unknown>

/**
 * Extracts the request body of a POST type request.
 */
export type Body<A extends AnyPost> = A['body']

/**
 * Extracts the response of any endpoint.
 */
export type Response<A extends AnyEndpoint> = A['response']

/**
 * An alias that wraps a response into a promise, making
 * it easier to read and write.
 */
export type AsyncResponse<A extends AnyEndpoint> = Promise<Response<A>>

/**
 * Extracts the query parameters of the GET request.
 */
export type Query<A extends AnyGet> = A['query']

/**
 * Extracts the expected headers.
 */
export type Headers<A extends AnyEndpoint> = A['headers']

/**
 * Extracts the parameters expected for this request.
 */
export type Params<A extends AnyEndpoint> = A['params']
