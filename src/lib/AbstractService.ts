import Container, { Inject, Service, Token } from 'typedi'

export type ClassLike<T> = {
  new (): T
  name: string
}

/**
 * Creates two decorators and a function bound to a unique token.
 */
export default function AbstractService<T>(classLike?: ClassLike<T>) {
  const token = new Token<T>(classLike?.name)
  return {
    token,
    inject() {
      return Inject(token)
    },
    declare() {
      return Service(token)
    },
    get() {
      return Container.get(token)
    },
  }
}
