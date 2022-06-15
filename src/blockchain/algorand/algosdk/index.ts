import Container from 'typedi'
import { BlockchainGateway } from '../..'
import BlockchainGatewayFactory from '../../BlockchainGatewayFactory'
import BlockchainGatewayProvider from '../../BlockchainGatewayProvider'
import { EncodeParameters, EncodeResult } from '../../features/EncodeFeature'
import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import algosdk from 'algosdk'
import {
  CreateAssetParameters,
  CreateAssetResult,
} from '../../features/CreateAssetFeature'
import {
  SignOperationParameters,
  SignOperationResult,
} from '../../features/SignOperationFeature'
import {
  CommitOperationParameters,
  CommitOperationResult,
} from '../../features/CommitOperationFeature'
import {
  ConfirmOperationParameters,
  ConfirmOperationResult,
} from '../../features/ConfirmOperationFeature'
import { commited, confirmed, unsigned } from '../../Operation'
import OperationSigner from '../../lib/OperationSigner'
import {
  NodeAvailableParameters,
  NodeAvailableResult,
} from '../../features/NodeAvailableFeature'
import {
  AccountInformationParameters,
  AccountInformationResult,
} from '../../features/AccountInformationFeature'

class AlgosdkAlgorandGatewayFactory implements BlockchainGatewayFactory {
  constructor(
    private readonly client: algosdk.Algodv2,
    private readonly signer: OperationSigner
  ) {}
  provide(): BlockchainGateway {
    return new AlgosdkAlgorandGateway(this.client, this.signer)
  }
}

export const ALGORAND_GATEWAY_ID = 'algorand'

class AlgosdkAlgorandGateway implements BlockchainGateway {
  constructor(
    private readonly client: algosdk.Algodv2,
    private readonly signer: OperationSigner
  ) {}
  async getAccountInformation(
    params: AccountInformationParameters
  ): Promise<AccountInformationResult> {
    const accountInfo = await this.client
      .accountInformation(params.address)
      .do()
    return {
      balance: accountInfo.amount,
    }
  }
  async nodeIsAvailable(
    params: NodeAvailableParameters
  ): Promise<NodeAvailableResult> {
    try {
      await this.client.status().do()
      return { available: true }
    } catch {
      return { available: false }
    }
  }
  async confirmOperation(
    params: ConfirmOperationParameters
  ): Promise<ConfirmOperationResult> {
    const confirmedTxn = await algosdk.waitForConfirmation(
      this.client,
      params.operation.id,
      10
    )
    return { operation: confirmed(confirmedTxn.txId, confirmedTxn) }
  }
  async commitOperation(
    params: CommitOperationParameters
  ): Promise<CommitOperationResult> {
    if (!(params.operation.data?.blob instanceof Uint8Array)) {
      throw new Error(
        `Invalid operation: Attempting to commit an operation that is not compatible with the Algorand blockchain!`
      )
    }
    const { txId } = await this.client
      .sendRawTransaction([params.operation.data?.blob as Uint8Array])
      .do()
    return { operation: commited(txId) }
  }
  async signOperation(
    params: SignOperationParameters
  ): Promise<SignOperationResult> {
    return { operation: await this.signer.sign(params.operation) }
  }
  async createAsset(params: CreateAssetParameters): Promise<CreateAssetResult> {
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: params.owner,
      total: params.amount,
      decimals: params.fraction ?? 0,
      assetName: params.name,
      assetURL: params.url,
      assetMetadataHash: params.metadata?.checksum,
      note:
        params.metadata != null
          ? (await this.encodeObject({ object: params.metadata?.payload }))
              .payload
          : undefined,
      defaultFrozen: params.frozen ?? false,
      freeze: params.accounts?.freeze ?? params.owner,
      manager: params.accounts?.manager ?? params.owner,
      clawback: params.accounts?.clawback ?? params.owner,
      reserve: params.accounts?.reserve ?? params.owner,
      suggestedParams: await this.client.getTransactionParams().do(),
    })
    return { operation: unsigned(txn.txID(), { txn }) }
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

export function algorandBlockchainSetup(
  client: algosdk.Algodv2,
  signer: OperationSigner
) {
  Container.get(BlockchainGatewayProvider).register(
    new AlgosdkAlgorandGatewayFactory(client, signer)
  )
}
