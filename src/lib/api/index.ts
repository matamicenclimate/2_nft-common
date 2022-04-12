/*
  This module contains shared API type definitions.

  The code presented here is intended to have the server
  and the client in-sync (in schema terms) all the time.
*/

export type Zero = 0

export type HttpVerb =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'PATCH'

export type HttpVerbLow = Lowercase<HttpVerb>

/**
 * Describes a type constraint for an API endpoint.
 */
export type Endpoint<
  Action extends HttpVerb,
  Path extends string,
  Res,
  Head = undefined
> = { action: Action; path: Path; response: Res; headers: Head }

export type Get<
  Path extends string,
  Res,
  Query = undefined,
  Head = undefined
> = Endpoint<'GET', Path, Res, Head> & { query: Query }

export type Post<Path extends string, Res, Body, Head = undefined> = Endpoint<
  'POST',
  Path,
  Res,
  Head
> & { body: Body }

export type AnyEndpoint = Endpoint<HttpVerb, string, unknown, unknown>
export type AnyPost = Post<string, unknown, unknown, unknown>
export type AnyGet = Get<string, unknown, unknown, unknown>

/**
 * Extracts the request body of a POST type request.
 */
export type Body<A extends AnyPost> = A['body']

/**
 * Extracts the response of any endpoint.
 */
export type Response<A extends AnyEndpoint> = A['response']

/**
 * Extracts the query parameters of the GET request.
 */
export type Query<A extends AnyGet> = A['query']

/**
 * Extracts the expected headers.
 */
export type Headers<A extends AnyEndpoint> = A['headers']

/**
 * Extracts the expected type const path.
 */
export type Path<A extends AnyEndpoint> = A['path']
