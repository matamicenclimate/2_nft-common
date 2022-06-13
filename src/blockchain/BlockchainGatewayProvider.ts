import BlockchainGateway from './BlockchainGateway'
import BlockchainGatewayFactory from './BlockchainGatewayFactory'

/**
 * A service-type registry that serves custom blockchain gateways to consumers.
 */
export default class BlockchainGatewayProvider {
  private readonly registry = new Map<string, BlockchainGateway>()
  register<T extends BlockchainGatewayFactory>(factory: T): void {}
}
