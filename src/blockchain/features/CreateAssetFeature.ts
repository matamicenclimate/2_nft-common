import { UnsignedOperation } from '@common/src/Operation'

export interface CreateAssetResult {
  transaction: UnsignedOperation
}

export interface CreateAssetParameters {
  operation: UnsignedOperation
}

export interface CreateAssetFeature {
  /**
   * Creates a custom asset into the blockchain.
   */
  createAsset(params: CreateAssetParameters): Promise<CreateAssetResult>
}
