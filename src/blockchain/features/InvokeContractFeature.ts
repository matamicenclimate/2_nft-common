import { ChainAsset } from '../lib/ChainAsset'
import { ChainWallet } from '../lib/ChainWallet'
import { SmartContractID } from '../lib/SmartContract'
import { SmartContractMethod } from '../lib/SmartContractMethod'
import { UnsignedOperation } from '../Operation'

export interface InvokeContractParameters {
  contract: SmartContractID
  caller: ChainWallet
  participants: ChainWallet[]
  assets: ChainAsset[]
  method: SmartContractMethod
  parameters: Record<string, unknown>
}

export interface InvokeContractResult {
  result: UnsignedOperation
}

/**
 * Produces a call to a smart contract located in the blockchain.
 */
export default interface InvokeContractFeature {
  callSmartContract(
    params: InvokeContractParameters
  ): Promise<InvokeContractResult>
}
