import { ChainAsset } from '../lib/ChainAsset'
import { ChainWallet } from '../lib/ChainWallet'
import { UnsignedOperation } from '../Operation'

export interface OptInParameters {
  asset: ChainAsset
  target: ChainWallet
}

export interface OptInResult {
  operation: UnsignedOperation
}

export default interface OptInFeature {
  optIn(params: OptInParameters): Promise<OptInResult>
}
