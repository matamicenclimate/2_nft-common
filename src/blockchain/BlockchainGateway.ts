import PaymentFeature from './features/PaymentFeature'

/**
 * Abstract blockchain gateway.
 */
export default interface BlockchainGateway
  extends Partial<PaymentFeature>,
    Partial<{}> {
  get id(): string
}
