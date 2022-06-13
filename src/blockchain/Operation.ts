export interface Operation {
  id: string
  data?: Record<string, unknown>
  signed?: true
  commited?: true
  confirmed?: true
}

export interface UnsignedOperation extends Operation {
  signed: undefined
  commited: undefined
  confirmed: undefined
}

export interface SignedOperation extends Operation {
  signed: true
  commited: undefined
  confirmed: undefined
}

export interface CommitedOperation extends Operation {
  signed: true
  commited: true
  confirmed: undefined
}

export interface ConfirmedOperation extends Operation {
  signed: true
  commited: true
  confirmed: true
}
