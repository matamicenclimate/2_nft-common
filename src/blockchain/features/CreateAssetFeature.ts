import { UnsignedOperation } from '../Operation'

export interface CreateAssetResult {
  operation: UnsignedOperation
}

export interface CreateAssetParameters {
  owner: string
  amount: number
  name: string
  url: string
  fraction?: number
  accounts?: Record<string, string>
  metadata?: {
    payload: object
    checksum?: Uint8Array
  }
  frozen?: boolean
}

export interface CreateAssetFeature {
  /**
   * Creates a custom asset into the blockchain.
   */
  createAsset(params: CreateAssetParameters): Promise<CreateAssetResult>
}
