import {
  CommittedOperationCluster,
  SignedOperation,
  SignedOperationCluster,
} from '../Operation'

export interface CommitOperationFeature {
  /**
   * Commits an operation to the blockchain, making it effective, yet unconfirmed.
   */
  commitOperation(
    op: SignedOperationCluster
  ): Promise<CommittedOperationCluster>
  commitOperation(...ops: SignedOperation[]): Promise<CommittedOperationCluster>
}
