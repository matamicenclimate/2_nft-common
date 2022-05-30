/*
  This package contains definitions and means to
  calculate the amount of "future" transactions
  that cannot be signed right now in this project.
  This is designed to know the amount of tokens
  that the issuer has to deposit into the network,
  in order to prevent future gas-runout if something
  goes either wrong or loses the bid, or on the
  contrary, it wins it.
*/
import { none, option, some } from '@octantis/option'

export class Transact {
  static get root(): Transact {
    return new Transact('root', none())
  }
  readonly fee = 1000
  constructor(readonly name: string, readonly previous: option<Transact>) {}
  add(name: string): Transact {
    return new Transact(name, some(this))
  }
  get gas(): number {
    return this.fee + this.previous.fold(0, t => t.gas)
  }
  get count(): number {
    return 1 + this.previous.fold(0, t => t.count)
  }
}

export const bids = Transact.root
  .add('transfer to market')
  .add('opt-in')
  .add('maybe win')
  .add('transfer to user')

export const gas = bids.gas
export const count = bids.count
