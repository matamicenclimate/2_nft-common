import { AccountInformationFeature } from './features/AccountInformationFeature'
import { CommitOperationFeature } from './features/CommitOperationFeature'
import { ConfirmOperationFeature } from './features/ConfirmOperationFeature'
import { CreateAssetFeature } from './features/CreateAssetFeature'
import { DestroyAssetFeature } from './features/DestroyAssetFeature'
import { EncodeFeature } from './features/EncodeFeature'
import { NodeAvailableFeature } from './features/NodeAvailableFeature'
import OptInFeature from './features/OptInFeature'
import PaymentFeature from './features/PaymentFeature'
import { SignOperationFeature } from './features/SignOperationFeature'

export type Features = PaymentFeature &
  OptInFeature &
  EncodeFeature &
  CreateAssetFeature &
  SignOperationFeature &
  CommitOperationFeature &
  ConfirmOperationFeature &
  NodeAvailableFeature &
  AccountInformationFeature &
  DestroyAssetFeature

/**
 * Abstract blockchain gateway.
 */
export default interface BlockchainGateway extends Features {
  get id(): string
}
