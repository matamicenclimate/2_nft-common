import { ChainWallet } from '../lib/ChainWallet'
import { UnsignedOperation } from '../Operation'

export interface PaymentParameters {
  payer: ChainWallet
  payee: ChainWallet
  amount: number
}

/**
 * Creates a payment operation, which n amount of main chain tokens (assumed),
 * will be transferred from payer to payee.
 */
export default interface PaymentFeature {
  pay(params: PaymentParameters): Promise<UnsignedOperation>
}
