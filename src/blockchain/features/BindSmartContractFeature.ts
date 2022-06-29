import { SmartContract, SmartContractID } from '../lib/SmartContract'

export interface BindSmartContractFeature {
  /**
   * Creates a new smart contract wrapper bound to this chain.
   */
  bindSmartContract(from: SmartContractID): Promise<SmartContract>
}
