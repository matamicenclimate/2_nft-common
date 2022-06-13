import { SignedOperation, UnsignedOperation } from '@common/src/Operation'

export interface SignOperationParameters {
  operation: UnsignedOperation
}

export interface SignOperationResult {
  operation: SignedOperation
}

export interface SignOperationFeature {
  /**
   * Signs an operation, returns the signed version.
   */
  signOperation(params: SignOperationParameters): Promise<SignOperationResult>
}
