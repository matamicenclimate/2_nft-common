import Container, { Service } from 'typedi'
import { BlockchainGateway } from '../..'
import BlockchainGatewayFactory from '../../BlockchainGatewayFactory'
import BlockchainGatewayProvider from '../../BlockchainGatewayProvider'
import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import { AlgorandGateway, ALGORAND_GATEWAY_ID } from '../AlgorandGateway'

class AlgosdkAlgorandGatewayFactory implements BlockchainGatewayFactory {
  provide(): BlockchainGateway {
    return new AlgosdkAlgorandGateway()
  }
}

class AlgosdkAlgorandGateway implements AlgorandGateway {
  static register() {}
  get id(): typeof ALGORAND_GATEWAY_ID {
    return ALGORAND_GATEWAY_ID
  }
  pay(params: PaymentParameters): Promise<PaymentResult> {
    throw new Error('Method not implemented.')
  }
  optIn(params: OptInParameters): Promise<OptInResult> {
    throw new Error('Method not implemented.')
  }
}

Container.get(BlockchainGatewayProvider).register(
  new AlgosdkAlgorandGatewayFactory()
)
