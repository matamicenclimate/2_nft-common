import Container from 'typedi'
import { BlockchainGateway } from '../..'
import BlockchainGatewayFactory from '../../BlockchainGatewayFactory'
import BlockchainGatewayProvider from '../../BlockchainGatewayProvider'
import { EncodeParameters, EncodeResult } from '../../features/EncodeFeature'
import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import algosdk from 'algosdk'
import { CreateAssetParameters } from '../../features/CreateAssetFeature'
import {
  CommittedOperation,
  CommittedOperationCluster,
  ConfirmedOperationCluster,
  SignedOperation,
  SignedOperationCluster,
  UnsignedOperation,
  UnsignedOperationCluster,
} from '../../Operation'
import OperationSigner from '../../lib/OperationSigner'
import {
  NodeAvailableParameters,
  NodeAvailableResult,
} from '../../features/NodeAvailableFeature'
import {
  AccountInformationParameters,
  AccountInformationResult,
} from '../../features/AccountInformationFeature'
import { DestroyAssetParameters } from '../../features/DestroyAssetFeature'
import { Dict } from '@common/src/lib/app'

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
  signOperation(op: UnsignedOperationCluster): Promise<SignedOperationCluster>
  signOperation(...ops: UnsignedOperation[]): Promise<SignedOperationCluster>
  async signOperation(
    op?: any,
    ...rest: any[]
  ): Promise<SignedOperationCluster> {
    if (op instanceof UnsignedOperationCluster) {
      const ops = await this.signer.sign(op.operations)
      return new SignedOperationCluster(this, ops)
    }
    const ops = await this.signer.sign([op, ...rest])
    return new SignedOperationCluster(this, ops)
  }
  commitOperation(
    op: SignedOperationCluster
  ): Promise<CommittedOperationCluster>
  commitOperation(...ops: SignedOperation[]): Promise<CommittedOperationCluster>
  async commitOperation(
    op?: any,
    ...rest: any[]
  ): Promise<CommittedOperationCluster> {
    // if (!(params.operation.data?.blob instanceof Uint8Array)) {
    //   throw new Error(
    //     `Invalid operation: Attempting to commit an operation that is not compatible with the Algorand blockchain!`
    //   )
    // }
    if (op instanceof SignedOperationCluster) {
      const txs = await this.client
        .sendRawTransaction(op.operations.map(s => s.data?.blob as Uint8Array))
        .do()
      console.log('DEBUG,1:', txs)
      return new CommittedOperationCluster(this, txs)
    }
    const txs = await this.client
      .sendRawTransaction([op, ...rest].map(s => s.data?.blob as Uint8Array))
      .do()
    console.log('DEBUG,0:', txs)
    return new CommittedOperationCluster(this, txs)
  }
  confirmOperation(
    ...ops: CommittedOperation[]
  ): Promise<ConfirmedOperationCluster>
  confirmOperation(
    op: CommittedOperationCluster
  ): Promise<ConfirmedOperationCluster>
  confirmOperation(
    op?: any,
    ...rest: any[]
  ): Promise<ConfirmedOperationCluster> {
    throw new Error('Method not implemented.')
    //   const confirmedTxn = await algosdk.waitForConfirmation(
    //     this.client,
    //     params.operation.id,
    //     10
    //   )
    //   const op =
    //   return new ConfirmedOperationCluster(this, [op])
  }
  operation(id: string, data?: Dict): UnsignedOperation {
    return new UnsignedOperation(this, id, data)
  }
  async destroyAsset(
    param: DestroyAssetParameters
  ): Promise<UnsignedOperationCluster> {
    const params = await this.client.getTransactionParams().do()
    const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
      from: param.owner,
      note: param.metadata?.payload,
      assetIndex: Number(param.asset),
      suggestedParams: params,
    })
    return this.operation(txn.txID(), { txn: txn as any }).cluster()
  }
  async getAccountInformation(
    params: AccountInformationParameters
  ): Promise<AccountInformationResult> {
    const accountInfo = await this.client
      .accountInformation(params.address)
      .do()
    return {
      balance: accountInfo.amount,
      data: accountInfo,
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
  async createAsset(
    params: CreateAssetParameters
  ): Promise<UnsignedOperationCluster> {
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
      freeze: params.accounts?.freeze,
      manager: params.accounts?.manager,
      clawback: params.accounts?.clawback,
      reserve: params.accounts?.reserve,
      suggestedParams: await this.client.getTransactionParams().do(),
    })
    return this.operation(txn.txID(), { txn: txn as any }).cluster()
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
