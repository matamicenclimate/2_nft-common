import { CreateAssetFeature } from './features/CreateAssetFeature'
import { EncodeFeature } from './features/EncodeFeature'
import OptInFeature from './features/OptInFeature'
import PaymentFeature from './features/PaymentFeature'
import { SignOperationFeature } from './features/SignOperation'

export type Features = Partial<PaymentFeature> &
  Partial<OptInFeature> &
  Partial<EncodeFeature> &
  Partial<CreateAssetFeature> &
  Partial<SignOperationFeature>

/**
 * Abstract blockchain gateway.
 */
export default interface BlockchainGateway extends Features {
  get id(): string
}
