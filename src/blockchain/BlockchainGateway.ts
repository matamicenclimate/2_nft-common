import OptInFeature from './features/OptInFeature'
import PaymentFeature from './features/PaymentFeature'

/**
 * Abstract blockchain gateway.
 */
export default interface BlockchainGateway
  extends Partial<PaymentFeature>,
    Partial<OptInFeature> {
  get id(): string
}
