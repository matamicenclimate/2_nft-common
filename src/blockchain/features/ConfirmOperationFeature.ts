import {
  CommittedOperation,
  CommittedOperationCluster,
  ConfirmedOperation,
  ConfirmedOperationCluster,
} from '../Operation'

export type ConfirmOperationParameters = CommittedOperation[]

export type ConfirmOperationResult = ConfirmedOperation[]

export interface ConfirmOperationFeature {
  /**
   * Awaits for the blockchain to validate the ongoing, commited & signed operation.
   */
  confirmOperation(
    ...ops: CommittedOperation[]
  ): Promise<ConfirmedOperationCluster>
  confirmOperation(
    op: CommittedOperationCluster
  ): Promise<ConfirmedOperationCluster>
}
