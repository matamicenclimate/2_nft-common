export interface Operation<A> {
  id: string
  data: A
}

export interface SignedOperation<A = undefined> extends Operation<A> {
  signed: true
  confirmed: false
}

export interface UnsignedOperation<A = undefined> extends Operation<A> {
  signed: false
  confirmed: false
}

export interface SignedConfirmedOperation<A = undefined> extends Operation<A> {
  signed: true
  confirmed: true
}
