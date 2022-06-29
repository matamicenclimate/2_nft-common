import { ChainWallet } from '../lib/ChainWallet'
import { SmartContractID } from '../lib/SmartContract'

export interface SmartContractWalletFeature {
  /**
   * Extracts the smart contract's wallet, if any.
   * Rejects if not. This is expected to extract at leats some wallet.
   */
  getSmartContractWallet(smartContract: SmartContractID): Promise<ChainWallet>
}
