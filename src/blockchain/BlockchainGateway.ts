import { AccountInformationFeature } from './features/AccountInformationFeature'
import BaseGasFeature from './features/BaseGasFeature'
import { BindSmartContractFeature } from './features/BindSmartContractFeature'
import { CommitOperationFeature } from './features/CommitOperationFeature'
import { ConfirmOperationFeature } from './features/ConfirmOperationFeature'
import { CreateAssetFeature } from './features/CreateAssetFeature'
import { DecodeWalletFeature } from './features/DecodeWalletFeature'
import { DestroyAssetFeature } from './features/DestroyAssetFeature'
import { EncodeFeature } from './features/EncodeFeature'
import InvokeContractFeature from './features/InvokeContractFeature'
import { NodeAvailableFeature } from './features/NodeAvailableFeature'
import OperationFeature from './features/OperationFeature'
import OptInFeature from './features/OptInFeature'
import PaymentFeature from './features/PaymentFeature'
import { SignOperationFeature } from './features/SignOperationFeature'
import { SmartContractWalletFeature } from './features/SmartContractWalletFeature'

export type Features = PaymentFeature &
  OptInFeature &
  EncodeFeature &
  CreateAssetFeature &
  SignOperationFeature &
  CommitOperationFeature &
  ConfirmOperationFeature &
  NodeAvailableFeature &
  AccountInformationFeature &
  DestroyAssetFeature &
  OperationFeature &
  BaseGasFeature &
  InvokeContractFeature &
  BindSmartContractFeature &
  SmartContractWalletFeature &
  DecodeWalletFeature

/**
 * Abstract blockchain gateway.
 */
export default interface BlockchainGateway extends Features {
  get id(): string
}
