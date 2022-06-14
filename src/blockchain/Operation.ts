export type Data = Record<string, unknown>

export interface Operation {
  id: string
  data?: Data
  signed?: true
  commited?: true
  confirmed?: true
}

export function unsigned(id: string, data?: Data): UnsignedOperation {
  return {
    id,
    data,
    signed: undefined,
    commited: undefined,
    confirmed: undefined,
  }
}
export interface UnsignedOperation extends Operation {
  signed: undefined
  commited: undefined
  confirmed: undefined
}

export function signed(id: string, data?: Data): SignedOperation {
  return {
    id,
    data,
    signed: true,
    commited: undefined,
    confirmed: undefined,
  }
}
export interface SignedOperation extends Operation {
  signed: true
  commited: undefined
  confirmed: undefined
}

export function commited(id: string, data?: Data): CommitedOperation {
  return {
    id,
    data,
    signed: true,
    commited: true,
    confirmed: undefined,
  }
}
export interface CommitedOperation extends Operation {
  signed: true
  commited: true
  confirmed: undefined
}

export function confirmed(id: string, data?: Data): ConfirmedOperation {
  return {
    id,
    data,
    signed: true,
    commited: true,
    confirmed: true,
  }
}
export interface ConfirmedOperation extends Operation {
  signed: true
  commited: true
  confirmed: true
}
