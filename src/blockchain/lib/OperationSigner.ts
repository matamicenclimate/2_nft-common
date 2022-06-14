import { SignedOperation, UnsignedOperation } from '../Operation'

/**
 * Abstract version of an operation signer, implementations may
 * be used by sign feature.
 */
export default interface OperationSigner {
  /**
   * Signs an abstract operation.
   * @param op The pending operation to be signed.
   */
  sign(op: UnsignedOperation): Promise<SignedOperation>
}
