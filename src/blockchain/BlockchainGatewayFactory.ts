/**
 * Provides custom data about the supplied blockchain gateway.
 */
export default interface BlockchainGatewayFactory {
  name(): string
  provide(): any
}
