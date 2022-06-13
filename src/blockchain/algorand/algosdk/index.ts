import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import { AlgorandGateway } from '../AlgorandGateway'

export class AlgosdkAlgorandGateway implements AlgorandGateway {
  get id(): string {
    return 'algosdk'
  }
  pay(params: PaymentParameters): Promise<PaymentResult> {
    throw new Error('Method not implemented.')
  }
  optIn(params: OptInParameters): Promise<OptInResult> {
    throw new Error('Method not implemented.')
  }
}
