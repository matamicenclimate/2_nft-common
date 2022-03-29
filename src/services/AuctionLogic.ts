import Container, { Inject, Service } from 'typedi'
import { AuctionCreationResult } from '../lib/AuctionCreationResult'
import * as AVMProgramProvider from './AVMProgramProvider'
import * as algosdk from 'algosdk'
import * as WalletAccountProvider from './WalletAccountProvider'
import * as TransactionSigner from './TransactionSigner'
import AlgodClientProvider from './AlgodClientProvider'
import { TransactionOperation } from './TransactionOperation'
import '../lib/binary/extension'

@Service()
export class AuctionLogic {
  readonly programs: AVMProgramProvider.type
  readonly account: WalletAccountProvider.type
  readonly signer: TransactionSigner.type
  readonly client: AlgodClientProvider
  readonly op: TransactionOperation

  constructor() {
    this.programs = AVMProgramProvider.get()
    this.account = WalletAccountProvider.get()
    this.signer = TransactionSigner.get()
    this.client = Container.get(AlgodClientProvider)
    this.op = Container.get(TransactionOperation)
  }

  /**
   * Creates the auction, sends the smart contract to the blockchain.
   *
   * @param assetId The asset (NFT)'s ID
   * @param reserve The price
   * @param bidIncrement Minimum amount to increment.
   */
  async createAuction(
    assetId: number,
    reserve: number,
    bidIncrement: number
  ): Promise<AuctionCreationResult> {
    const approval = await this.programs.auctionApprovalProgram
    const clear = await this.programs.clearStateProgram
    const args: Uint8Array[] = [
      algosdk.decodeAddress(this.account.account.addr).publicKey,
      assetId.toBytes(8, 'big'),
      Date.now().toBytes(8, 'big'),
      (Date.now() + 5 * 60 * 1000).toBytes(8, 'big'),
      reserve.toBytes(8, 'big'),
      bidIncrement.toBytes(8, 'big'),
    ]
    const client = this.client.client
    const params = await client.getTransactionParams().do()
    const txn = await algosdk.makeApplicationCreateTxn(
      this.account.account.addr,
      params,
      algosdk.OnApplicationComplete.NoOpOC,
      approval,
      clear,
      0,
      0,
      7,
      2,
      args
    )
    const { txId, result } =
      await this.op.signAndConfirm<AuctionCreationResult>(txn)
    console.log(
      `Application creation TX: https://testnet.algoexplorer.io/tx/${txId}`
    )
    return result
  }

  /**
   * Funds the given auction (The app ID MUST be an auction app!).
   * @param appIndex
   * @returns
   */
  async fundAuction(appIndex: number) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    const appAddr = algosdk.getApplicationAddress(appIndex)
    const amount = 100000 + 10000 + 3 * 1000
    const fundTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account,
      to: appAddr,
      amount,
      suggestedParams,
    })
    return await this.op.signAndConfirm(fundTxn)
  }

  /**
   * Calls the 'setup' procedure from the provided app (id).
   * @param appIndex
   * @param assetId
   * @returns
   */
  async makeAppCallSetupProc(appIndex: number, assetId: number) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    const appCallTxn = await algosdk.makeApplicationCallTxnFromObject({
      from: account,
      appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: ['setup'.toBytes()],
      foreignAssets: [assetId],
      suggestedParams,
    })
    return await this.op.signAndConfirm(appCallTxn)
  }

  /**
   * Makes the asset to be transferred from this running account into the
   * app's account.
   * @param appIndex
   * @param assetId
   * @returns
   */
  async makeTransferToApp(appIndex: number, assetId: number) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    const appAddr = algosdk.getApplicationAddress(appIndex)
    const fundNftTxn =
      await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account,
        to: appAddr,
        assetIndex: assetId,
        amount: 1,
        suggestedParams,
      })
    return await this.op.signAndConfirm(fundNftTxn)
  }
}
