import BlockchainGateway from '../BlockchainGateway'

interface OptInResult {}

/**
 * Algorand blockchain-oriented gateway.
 */
export default interface AlgorandGateway extends BlockchainGateway {
  optInt(): Promise<OptInResult>
}
