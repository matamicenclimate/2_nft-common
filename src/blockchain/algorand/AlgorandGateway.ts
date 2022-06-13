import BlockchainGateway from '../BlockchainGateway'
import OptInResult from './OptInResult'

export interface OptInParams {}

/**
 * Algorand blockchain-oriented gateway.
 */
export default interface AlgorandGateway extends BlockchainGateway {
  optIn(params: OptInParams): Promise<OptInResult>
}
