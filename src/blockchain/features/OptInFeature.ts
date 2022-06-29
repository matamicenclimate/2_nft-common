import { ChainAsset } from "../lib/ChainAsset"
import { UnsignedOperation } from "../Operation"

export interface OptInParameters {
  asset: ChainAsset
}

export interface OptInResult {
  operation: UnsignedOperation
}

export default interface OptInFeature {
  optIn(params: OptInParameters): Promise<OptInResult>
}
