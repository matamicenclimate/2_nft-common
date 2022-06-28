import { SmartContract, SmartContractID } from '../lib/SmartContract'

export interface BindSmartContractFeature {
  bindSmartContract(from: SmartContractID): Promise<SmartContract>
}
