import BlockchainGateway from './BlockchainGateway'

export type Data = Record<string, unknown>

export abstract class Operation {
  constructor(
    readonly chain: BlockchainGateway,
    readonly id: string,
    public data?: Data
  ) {}
}

export class UnsignedOperation extends Operation {
  public readonly tag = 'unsigned' as const
  cluster(...extra: UnsignedOperation[]) {
    return new UnsignedOperationCluster(this.chain, [this, ...extra])
  }
  async sign() {
    const op = await this.chain.signOperation(this)
    return op.operations[0]
  }
}

export class UnsignedOperationCluster {
  constructor(
    private readonly chain: BlockchainGateway,
    public operations: UnsignedOperation[]
  ) {}
  async sign() {
    const ops = await this.chain.signOperation(this)
    return new SignedOperationCluster(this.chain, ops.operations)
  }
  join(...operations: UnsignedOperation[]) {
    return new UnsignedOperationCluster(this.chain, [
      ...this.operations,
      ...operations,
    ])
  }
}

export class SignedOperation extends Operation {
  readonly tag = 'signed' as const
  cluster() {
    return new SignedOperationCluster(this.chain, [this])
  }
  async commit() {
    const op = await this.chain.commitOperation(this)
    return op.operations[0]
  }
}

export class SignedOperationCluster {
  constructor(
    private readonly chain: BlockchainGateway,
    public operations: SignedOperation[]
  ) {}
  async commit() {
    const ops = await this.chain.commitOperation(...this.operations)
    return new CommittedOperationCluster(this.chain, ops.operations)
  }
  join(...operations: SignedOperation[]) {
    return new SignedOperationCluster(this.chain, [
      ...this.operations,
      ...operations,
    ])
  }
}

export class CommittedOperation extends Operation {
  readonly tag = 'commited' as const
  cluster() {
    return new CommittedOperationCluster(this.chain, [this])
  }
  async confirm() {
    const op = await this.chain.confirmOperation(this)
    return op.operations[0]
  }
}

export class CommittedOperationCluster {
  constructor(
    private readonly chain: BlockchainGateway,
    public operations: CommittedOperation[]
  ) {}
  async confirm() {
    const ops = await this.chain.confirmOperation(this)
    return new ConfirmedOperationCluster(this.chain, ops.operations)
  }
  join(...operations: CommittedOperation[]) {
    return new CommittedOperationCluster(this.chain, [
      ...this.operations,
      ...operations,
    ])
  }
}

export class ConfirmedOperation extends Operation {
  readonly tag = 'confirmed' as const
  cluster() {
    return new ConfirmedOperationCluster(this.chain, [this])
  }
}

export class ConfirmedOperationCluster {
  constructor(
    private readonly chain: BlockchainGateway,
    public operations: ConfirmedOperation[]
  ) {}
}
