import Container from 'typedi'
import { BlockchainGateway } from '../..'
import BlockchainGatewayFactory from '../../BlockchainGatewayFactory'
import BlockchainGatewayProvider from '../../BlockchainGatewayProvider'
import { EncodeParameters, EncodeResult } from '../../features/EncodeFeature'
import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import { AlgorandGateway, ALGORAND_GATEWAY_ID } from '../AlgorandGateway'
import algosdk from 'algosdk'
import {
  CreateAssetParameters,
  CreateAssetResult,
} from '../../features/CreateAssetFeature'
import {
  SignOperationParameters,
  SignOperationResult,
} from '../../features/SignOperation'

class AlgosdkAlgorandGatewayFactory implements BlockchainGatewayFactory {
  provide(): BlockchainGateway {
    return new AlgosdkAlgorandGateway()
  }
}

class AlgosdkAlgorandGateway implements AlgorandGateway {
  async signOperation(
    params: SignOperationParameters
  ): Promise<SignOperationResult> {
    throw new Error('Method not implemented.')
  }
  async createAsset(params: CreateAssetParameters): Promise<CreateAssetResult> {
    throw new Error('Method not implemented.')
  }
  async encodeObject(params: EncodeParameters): Promise<EncodeResult> {
    return {
      payload: algosdk.encodeObj(params.object),
    }
  }
  static register() {}
  get id(): typeof ALGORAND_GATEWAY_ID {
    return ALGORAND_GATEWAY_ID
  }
  async pay(params: PaymentParameters): Promise<PaymentResult> {
    throw new Error('Method not implemented.')
  }
  async optIn(params: OptInParameters): Promise<OptInResult> {
    throw new Error('Method not implemented.')
  }
}

Container.get(BlockchainGatewayProvider).register(
  new AlgosdkAlgorandGatewayFactory()
)
