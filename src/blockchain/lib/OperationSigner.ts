import { SignedOperation, UnsignedOperation } from '../Operation'

/**
 * Abstract version of an operation signer, implementations may
 * be used by sign feature.
 */
export default interface OperationSigner {
  /**
   * Signs an abstract operation.
   * @param ops The pending operation list to be signed.
   */
  sign(ops: UnsignedOperation[]): Promise<SignedOperation[]>
}
