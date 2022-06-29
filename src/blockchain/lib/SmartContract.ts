import BlockchainGateway from '../BlockchainGateway'
import { InvokeContractParameters } from '../features/InvokeContractFeature'

export abstract class SmartContractID {
  readonly tag = 'smart-contract-id' as const
}

export class SmartContract {
  constructor(
    readonly chain: BlockchainGateway,
    readonly id: SmartContractID
  ) {}

  async invoke<A = void>(
    params: Omit<InvokeContractParameters, 'contract'>
  ): Promise<A> {
    const { result } = await this.chain.callSmartContract({
      contract: this.id,
      ...params,
    })
    const tx = await this.chain
      .signOperation(result)
      .then(o => o.commit())
      .then(o => o.confirm())
      .then(o => o.operations[0])
    return null as any as A
  }
}
