import { None, Option, Some } from '@octantis/option'
import { Service } from 'typedi'
import BlockchainGateway from './BlockchainGateway'
import BlockchainGatewayFactory from './BlockchainGatewayFactory'

export class NoBlockchainProvidedError extends Error {
  constructor(id?: string) {
    super(`No blockchain ${id ?? '<default>'} provided!`)
  }
}

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
  get(id?: string): Option<BlockchainGateway> {
    if (id == null) {
      for (const val of this.registry.values()) {
        return Some(val)
      }
      return None()
    }
    const instance = this.registry.get(id)
    if (instance != null) {
      return Some(instance)
    }
    return None()
  }

  require(id?: string): BlockchainGateway {
    return this.get(id).getOrThrow(new NoBlockchainProvidedError())
  }
}
