import Container, { Service } from 'typedi'
import BlockchainGateway from '../BlockchainGateway'
import BlockchainGatewayProvider from '../BlockchainGatewayProvider'
import { EncodeFeature } from '../features/EncodeFeature'
import OptInFeature from '../features/OptInFeature'
import PaymentFeature from '../features/PaymentFeature'

export const ALGORAND_GATEWAY_ID = 'algorand'

/**
 * Algorand blockchain-oriented gateway, enables features from algorand.
 */
export type AlgorandGateway = BlockchainGateway &
  PaymentFeature &
  OptInFeature &
  EncodeFeature

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

  /**
   * Attempts to retrieve any algorand gateway, throws if not provided.
   */
  static get gateway(): AlgorandGateway {
    return Container.get(AlgorandGatewayProvider).gateway
  }

  /**
   * Attempts to retrieve any algorand gateway, throws if not provided.
   */
  get gateway(): AlgorandGateway {
    for (const instance of this.registry.get(ALGORAND_GATEWAY_ID)) {
      return instance as AlgorandGateway
    }
    throw new AlgorandGatewayNotProvidedException()
  }
}
