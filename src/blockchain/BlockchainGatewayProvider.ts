import { none, option, Some, some } from '@octantis/option'
import { AlgorandGateway } from './algorand/AlgorandGateway'
import BlockchainGateway from './BlockchainGateway'
import BlockchainGatewayFactory from './BlockchainGatewayFactory'

/**
 * A service-type registry that serves custom blockchain gateways to consumers.
 */
export default class BlockchainGatewayProvider {
  private readonly registry = new Map<string, BlockchainGateway>()
  register<T extends BlockchainGatewayFactory>(factory: T): void {
    const instance = factory.provide()
    this.registry.set(instance.id, instance)
  }

  // Known implementation of algorand.
  get(id: 'algosdk'): Some<AlgorandGateway>

  /**
   * Attempts to get a custom gateway accessor object (aka gateway).
   * @param id The identifier of the gateway, provided by implementation.
   * @returns The gateway instance, if known.
   */
  get(id: string): option<BlockchainGateway> {
    const instance = this.registry.get(id)
    if (instance != null) {
      return some(instance)
    }
    return none()
  }
}
