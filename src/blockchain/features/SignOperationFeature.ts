import {
  SignedOperationCluster,
  UnsignedOperation,
  UnsignedOperationCluster,
} from '../Operation'

export interface SignOperationFeature {
  /**
   * Signs an operation, returns the signed version.
   */
  signOperation(op: UnsignedOperationCluster): Promise<SignedOperationCluster>
  signOperation(...ops: UnsignedOperation[]): Promise<SignedOperationCluster>
}
