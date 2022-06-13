import { none, option, some } from '@octantis/option'
import { Service } from 'typedi'
import BlockchainGateway from './BlockchainGateway'
import BlockchainGatewayFactory from './BlockchainGatewayFactory'

/**
 * A service-type registry that serves custom blockchain gateways to consumers.
 */
@Service()
export default class BlockchainGatewayProvider {
  private readonly registry = new Map<string, BlockchainGateway>()
  register<T extends BlockchainGatewayFactory>(factory: T): void {
    const instance = factory.provide()
    this.registry.set(instance.id, instance)
  }

  /**
   * Attempts to get a custom gateway accessor object (aka gateway).
   * @param id The identifier of the gateway, provided by implementation.
   * @returns The gateway instance, if known.
   */
  get<T extends BlockchainGateway = BlockchainGateway>(id: string): option<T> {
    const instance = this.registry.get(id)
    if (instance != null) {
      return some(instance as T)
    }
    return none()
  }
}
