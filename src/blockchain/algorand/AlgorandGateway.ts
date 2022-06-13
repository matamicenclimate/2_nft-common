import Container, { Service } from 'typedi'
import BlockchainGateway from '../BlockchainGateway'
import BlockchainGatewayProvider from '../BlockchainGatewayProvider'
import OptInFeature from '../features/OptInFeature'
import PaymentFeature from '../features/PaymentFeature'

export const ALGORAND_GATEWAY_ID = 'algorand'

/**
 * Algorand blockchain-oriented gateway, enables features from algorand.
 */
export type AlgorandGateway = BlockchainGateway & PaymentFeature & OptInFeature

export class AlgorandGatewayNotProvidedException extends Error {
  constructor() {
    super(
      `Algorand gateway was not found, or implmentation missing! (did you forget to register it?)`
    )
  }
}

/**
 * A simple service type that provides algorand gateways.
 */
@Service()
export class AlgorandGatewayProvider {
  private readonly registry: BlockchainGatewayProvider
  constructor() {
    this.registry = Container.get(BlockchainGatewayProvider)
  }
  get gateway(): AlgorandGateway {
    for (const instance of this.registry.get(ALGORAND_GATEWAY_ID)) {
      return instance as AlgorandGateway
    }
    throw new AlgorandGatewayNotProvidedException()
  }
}
