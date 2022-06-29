import BlockchainGateway from '../BlockchainGateway'
import { InvokeContractParameters } from '../features/InvokeContractFeature'

export abstract class SmartContractID {
  readonly tag = 'smart-contract-id' as const
}

export type InvokeParams = Omit<InvokeContractParameters, 'contract'>

export class SmartContract {
  constructor(
    readonly chain: BlockchainGateway,
    readonly id: SmartContractID
  ) {}

  /**
   * Prepares the invocation for this smart contract parameter,
   * leaving it as an unsigned operation.
   */
  async prepareInvoke(params: InvokeParams) {
    const { result } = await this.chain.callSmartContract({
      contract: this.id,
      ...params,
    })
    return result
  }

  async invoke<A = void>(params: InvokeParams): Promise<A> {
    const result = await this.prepareInvoke(params)
    const tx = await this.chain
      .signOperation(result)
      .then(o => o.commit())
      .then(o => o.confirm())
      .then(o => o.operations[0])
    return null as any as A
  }
}
