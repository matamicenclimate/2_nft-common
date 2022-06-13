import BlockchainGateway from './BlockchainGateway'

/**
 * Provides custom data about the supplied blockchain gateway.
 */
export default interface BlockchainGatewayFactory {
  provide(): BlockchainGateway
}
