import { CommitedOperation, ConfirmedOperation } from '../Operation'

export interface ConfirmOperationParameters {
  operation: CommitedOperation
}

export interface ConfirmOperationResult {
  operation: ConfirmedOperation
}

export interface ConfirmOperationFeature {
  /**
   * Awaits for the blockchain to validate the ongoing, commited & signed operation.
   */
  confirmOperation(
    params: ConfirmOperationParameters
  ): Promise<ConfirmOperationResult>
}
