import { UnsignedOperation } from '../Operation'

export interface DestroyAssetParameters {
  owner: string
  asset: string | number
  metadata?: {
    payload: Uint8Array
    checksum?: Uint8Array
  }
}

export interface DestroyAssetResult {
  operation: UnsignedOperation
}

export interface DestroyAssetFeature {
  /**
   * Creates an asset destruction operation.
   */
  destroyAsset(param: DestroyAssetParameters): Promise<DestroyAssetResult>
}
