import BlockchainGateway from '../BlockchainGateway'
import OptInFeature from '../features/OptInFeature'
import PaymentFeature from '../features/PaymentFeature'

/**
 * Algorand blockchain-oriented gateway, enables features from algorand.
 */
export type AlgorandGateway = BlockchainGateway & PaymentFeature & OptInFeature
