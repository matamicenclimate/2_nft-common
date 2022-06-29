import Container from 'typedi'
import algosdk from 'algosdk'
import BlockchainGatewayProvider from '../../BlockchainGatewayProvider'
import { BlockchainGateway } from '../..'
import { EncodeParameters, EncodeResult } from '../../features/EncodeFeature'
import { OptInParameters, OptInResult } from '../../features/OptInFeature'
import { PaymentParameters, PaymentResult } from '../../features/PaymentFeature'
import { CreateAssetParameters } from '../../features/CreateAssetFeature'
import {
  CommittedOperation,
  CommittedOperationCluster,
  ConfirmedOperation,
  ConfirmedOperationCluster,
  Data,
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
import { BaseGasParameters, BaseGasResult } from '../../features/BaseGasFeature'
import {
  InvokeContractParameters,
  InvokeContractResult,
} from '../../features/InvokeContractFeature'
import { SmartContractID, SmartContract } from '../../lib/SmartContract'
import {
  AlgorandChainAsset,
  AlgorandChainWallet,
  AlgorandSmartContractID,
  AlgorandSmartContractMethod,
  ALGORAND_GATEWAY_ID,
  AlgosdkAlgorandGatewayFactory,
  Asserted,
  Unasserted,
} from './implementation'

export class AlgosdkAlgorandGateway implements BlockchainGateway {
  private assert<A extends Unasserted>(input: A): Asserted<A> {
    if (
      input instanceof AlgorandChainWallet ||
      input instanceof AlgorandSmartContractID ||
      input instanceof AlgorandChainAsset ||
      input instanceof AlgorandSmartContractMethod
    ) {
      return input as any
    }
    throw new Error(
      `Attempting to use an invalid handle (Either smart contract ID or wallet that does not correspond with the current blockchain.)`
    )
  }
  constructor(
    private readonly client: algosdk.Algodv2,
    private readonly signer: OperationSigner
  ) {}
  async callSmartContract(
    params: InvokeContractParameters
  ): Promise<InvokeContractResult> {
    const participants = params.participants.map(p => this.assert(p))
    const caller = this.assert(params.caller)
    const assets = params.assets.map(a => this.assert(a))
    const method = this.assert(params.method)
    const contract = this.assert(params.contract)
    const out = await algosdk.makeApplicationCallTxnFromObject({
      from: algosdk.encodeAddress(caller.address),
      accounts: participants.map(p => algosdk.encodeAddress(p.address)),
      suggestedParams: await this.client.getTransactionParams().do(),
      foreignAssets: assets.map(a => a.id),
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appIndex: contract.id,
    })
    return {
      result: this.operation(out.txID(), out as unknown as Data),
    }
  }
  async bindSmartContract(from: SmartContractID): Promise<SmartContract> {
    return new SmartContract(this, from)
  }
  async getBaseGas(_params: BaseGasParameters): Promise<BaseGasResult> {
    return {
      value: algosdk.ALGORAND_MIN_TX_FEE,
    }
  }
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
    if (op instanceof SignedOperationCluster) {
      const txs = await this.client
        .sendRawTransaction(op.operations.map(s => s.data?.blob as Uint8Array))
        .do()
      const ops = (txs instanceof Array ? txs : [txs]).map(
        o => new CommittedOperation(this, o.txId, o)
      )
      return new CommittedOperationCluster(this, ops)
    }
    const txs = await this.client
      .sendRawTransaction([op, ...rest].map(s => s.data?.blob as Uint8Array))
      .do()
    const ops = (txs instanceof Array ? txs : [txs]).map(
      o => new CommittedOperation(this, o.txId, o)
    )
    return new CommittedOperationCluster(this, ops)
  }
  confirmOperation(
    ...ops: CommittedOperation[]
  ): Promise<ConfirmedOperationCluster>
  confirmOperation(
    op: CommittedOperationCluster
  ): Promise<ConfirmedOperationCluster>
  async confirmOperation(
    op?: any,
    ...rest: any[]
  ): Promise<ConfirmedOperationCluster> {
    if (op instanceof CommittedOperationCluster) {
      const ops = op.operations.map(op =>
        algosdk.waitForConfirmation(this.client, op.id, 10)
      )
      const confirmedTxs = await Promise.all(ops)
      const out = confirmedTxs.map(o => new ConfirmedOperation(this, o.txId, o))
      console.log(out)
      return new ConfirmedOperationCluster(this, out)
    }
    throw new Error('Method not implemented.')
    //   const confirmedTxn = await algosdk.waitForConfirmation(
    //     this.client,
    //     params.operation.id,
    //     10
    //   )
    //   const op =
    //   return new ConfirmedOperationCluster(this, [op])
  }
  operation(id: string, data?: Data): UnsignedOperation {
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
