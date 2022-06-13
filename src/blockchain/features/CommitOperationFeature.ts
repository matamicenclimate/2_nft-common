import { CommitedOperation, SignedOperation } from '../Operation'

export interface CommitOperationParameters {
  operation: SignedOperation
}

export interface CommitOperationResult {
  operation: CommitedOperation
}

export interface CommitOperationFeature {
  /**
   * Commits an operation to the blockchain, making it effective, yet unconfirmed.
   */
  commitOperation(
    params: CommitOperationParameters
  ): Promise<CommitOperationResult>
}
