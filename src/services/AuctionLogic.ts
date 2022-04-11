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
    bidIncrement: number,
    account: algosdk.Account,
    endTime: number
  ): Promise<AuctionCreationResult> {
    const approval = await this.programs.auctionApprovalProgram
    const clear = await this.programs.clearStateProgram
    const now = Date.now() / 1000
    const start = Math.floor(now + 120)
    const end = Math.trunc(start + endTime)
    console.warn(`Auction start in ${start} and end on ${end}`)
    const args: Uint8Array[] = [
      algosdk.decodeAddress(this.account.account.addr).publicKey,
      assetId.toBytes(8, 'big'),
      start.toBytes(8, 'big'),
      end.toBytes(8, 'big'),
      reserve.toBytes(8, 'big'),
      bidIncrement.toBytes(8, 'big'),
    ]
    const client = this.client.client
    const params = await client.getTransactionParams().do()
    console.log(`Creating smart app, bound to ${account.addr}...`)
    const txn = await algosdk.makeApplicationCreateTxnFromObject({
      from: account.addr,
      suggestedParams: params,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approval,
      clearProgram: clear,
      numGlobalByteSlices: 2,
      numGlobalInts: 7,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      appArgs: args,
    })
    const { txId, result } =
      await this.op.signAndConfirm<AuctionCreationResult>(txn)
    console.log(
      `Application creation TX: https://testnet.algoexplorer.io/tx/${txId}`
    )
    return result
  }

  /**
   * Funds the given auction (The app ID MUST be an auction app!).
   */
  async fundAuction(appIndex: number) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    const appAddr = algosdk.getApplicationAddress(appIndex)
    const amount = 100000 + 100000 + 3 * 1000
    const fundTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account,
      to: appAddr,
      amount,
      suggestedParams,
    })
    return { amount, result: await this.op.signAndConfirm(fundTxn) }
  }

  /**
   * Calls the 'setup' procedure from the provided app (id).
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
   */
  async makeTransferToApp(
    appIndex: number,
    assetId: number,
    note?: Uint8Array
  ) {
    const address = algosdk.getApplicationAddress(appIndex)
    return await this.makeTransferToAccount(address, assetId, note)
  }

  /**
   * Makes the asset to be transferred from this running account into the
   * app's account.
   */
  async makeTransferToAccount(
    address: string,
    assetId: number,
    note?: Uint8Array
  ) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    const fundNftTxn =
      await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account,
        to: address,
        assetIndex: assetId,
        amount: 1,
        suggestedParams,
        note,
      })
    return await this.op.signAndConfirm(fundNftTxn)
  }
}
