import Container, { Service } from 'typedi'
import { AuctionCreationResult } from '../lib/AuctionCreationResult'
import * as AVMProgramProvider from './AVMProgramProvider'
import * as AVMDirectListingProgramProvider from './AVMDirectListingProgramProvider'
import * as algosdk from 'algosdk'
import * as WalletAccountProvider from './WalletAccountProvider'
import * as TransactionSigner from './TransactionSigner'
import AlgodClientProvider from './AlgodClientProvider'
import { TransactionOperation } from './TransactionOperation'
import '../lib/binary/extension'
import { failure, Result, success } from '../lib/Result'
import { TransactionLike } from 'algosdk'
import directListingAbi from '../abi/direct-listing.abi'
import { CauseAppInfo } from '../../../src/interfaces/index';

@Service()
export class AuctionLogic {
  readonly programs: AVMProgramProvider.type
  readonly directListingPrograms: AVMDirectListingProgramProvider.type
  readonly account: WalletAccountProvider.type
  readonly signer: TransactionSigner.type
  readonly client: AlgodClientProvider
  readonly op: TransactionOperation

  constructor() {
    this.programs = AVMProgramProvider.get()
    this.directListingPrograms = AVMDirectListingProgramProvider.get()
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
    causeWallet: string,
    creatorWallet: string,
    causePercentage: number,
    creatorPercentage: number,
    startDate: string,
    endDate: string
  ): Promise<AuctionCreationResult> {
    const approval = await this.programs.auctionApprovalProgram
    const clear = await this.programs.clearStateProgram
    const start = Math.floor(Date.parse(startDate) / 1000 + 60)
    const end = Math.floor(Date.parse(endDate) / 1000)
    console.warn(`Auction start in ${start} and end on ${end}`)
    console.warn(
      `creatorAddress ${creatorWallet} and causeAddress on ${causeWallet}`
    )
    console.warn(
      `causePercentage ${causePercentage} and creatorPercentage on ${creatorPercentage}`
    )
    const args: Uint8Array[] = [
      algosdk.decodeAddress(this.account.account.addr).publicKey,
      assetId.toBytes(8, 'big'),
      start.toBytes(8, 'big'),
      end.toBytes(8, 'big'),
      reserve.toBytes(8, 'big'),
      bidIncrement.toBytes(8, 'big'),
      algosdk.decodeAddress(creatorWallet).publicKey,
      algosdk.decodeAddress(causeWallet).publicKey,
      creatorPercentage.toBytes(8, 'big'),
      causePercentage.toBytes(8, 'big'),
    ]
    const client = this.client.client
    const params = await client.getTransactionParams().do()
    const txn = await algosdk.makeApplicationCreateTxnFromObject({
      from: this.account.account.addr,
      suggestedParams: params,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approval,
      clearProgram: clear,
      foreignAssets: [assetId],
      numGlobalByteSlices: 4,
      numGlobalInts: 9,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      appArgs: args,
    })
    const { txId, result } =
      await this.op.signAndConfirm<AuctionCreationResult>(txn)
    console.log(
      `Auction Application creation TX: https://testnet.algoexplorer.io/tx/${txId}`
    )
    return result
  }

  async createAuctionApp(
    assetId: number,
    reserve: number,
    bidIncrement: number,
    cause: CauseAppInfo,
    creatorWallet: string,
    startDate: string,
    endDate: string
  ): Promise<AuctionCreationResult> {
    const approval = await this.programs.auctionApprovalProgram
    const clear = await this.programs.clearStateProgram
    const start = Math.floor(Date.parse(startDate) / 1000 + 60)
    const end = Math.floor(Date.parse(endDate) / 1000)
    console.warn(`Auction start in ${start} and end on ${end}`)
    console.warn(
      `creatorAddress ${creatorWallet} and causeAddress on ${cause.causeWallet}`
    )
    console.warn(
      `causePercentage ${cause.causePercentage} and creatorPercentage on ${cause.creatorPercentage}`
    )
    const args: Uint8Array[] = [
      algosdk.decodeAddress(this.account.account.addr).publicKey,
      assetId.toBytes(8, 'big'),
      start.toBytes(8, 'big'),
      end.toBytes(8, 'big'),
      reserve.toBytes(8, 'big'),
      bidIncrement.toBytes(8, 'big'),
      algosdk.decodeAddress(creatorWallet).publicKey,
      algosdk.decodeAddress(cause.causeWallet).publicKey,
      cause.creatorPercentage.toBytes(8, 'big'),
      cause.causePercentage.toBytes(8, 'big'),
    ]
    const client = this.client.client
    const params = await client.getTransactionParams().do()
    const txn = await algosdk.makeApplicationCreateTxnFromObject({
      from: this.account.account.addr,
      suggestedParams: params,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approval,
      clearProgram: clear,
      foreignAssets: [assetId],
      numGlobalByteSlices: 4,
      numGlobalInts: 9,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      appArgs: args,
    })
    const { txId, result } =
      await this.op.signAndConfirm<AuctionCreationResult>(txn)
    console.log(
      `Auction Application creation TX: https://testnet.algoexplorer.io/tx/${txId}`
    )
    return result
  }

  async createDirectListing(
    assetId: number,
    reserve: number,
    causeWallet: string,
    creatorWallet: string,
    causePercentage: number,
    creatorPercentage: number
  ): Promise<AuctionCreationResult> {
    const approval = await this.directListingPrograms
      .directListingApprovalProgram
    const clear = await this.directListingPrograms.clearStateProgram
    console.warn(
      `creatorAddress ${creatorWallet} and causeAddress on ${causeWallet}`
    )
    console.warn(
      `causePercentage ${causePercentage} and creatorPercentage on ${creatorPercentage}`
    )
    const args: Uint8Array[] = [
      algosdk.decodeAddress(this.account.account.addr).publicKey,
      assetId.toBytes(8, 'big'),
      reserve.toBytes(8, 'big'),
      algosdk.decodeAddress(creatorWallet).publicKey,
      algosdk.decodeAddress(causeWallet).publicKey,
      creatorPercentage.toBytes(8, 'big'),
      causePercentage.toBytes(8, 'big'),
    ]
    const client = this.client.client
    const params = await client.getTransactionParams().do()
    const txn = await algosdk.makeApplicationCreateTxnFromObject({
      from: this.account.account.addr,
      suggestedParams: params,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approval,
      clearProgram: clear,
      foreignAssets: [assetId],
      numGlobalByteSlices: 5,
      numGlobalInts: 6,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      appArgs: args,
    })
    const { txId, result } =
      await this.op.signAndConfirm<AuctionCreationResult>(txn)
    console.log(
      `Direct Listing Application creation TX: https://testnet.algoexplorer.io/tx/${txId}`
    )
    return result
  }
  /**
   * Funds the given auction (The app ID MUST be an auction app!).
   */
  async fundListing(appIndex: number) {
    const { amount, fundTxn } = await this.fundListingWithoutConfirm(appIndex)
    return { amount, result: await this.op.signAndConfirm(fundTxn) }
  }

  async fundListingWithoutConfirm(appIndex: number) {
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
    return { amount, fundTxn }
  }

  /**
   * Calls the 'setup' procedure from the provided app (id).
   */
  async makeAppCallSetupProc(appIndex: number, assetId: number) {
    const appCallTxn = await this.makeAppCallSetupProcWithoutConfirm(
      appIndex,
      assetId
    )
    return await this.op.signAndConfirm(appCallTxn)
  }

  async makeAppCallSetupProcWithoutConfirm(appIndex: number, assetId: number) {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    return await algosdk.makeApplicationCallTxnFromObject({
      from: account,
      appIndex,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [directListingAbi.getMethodByName('on_setup').getSelector()],
      foreignAssets: [assetId],
      suggestedParams,
    })
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

  async makeTransferToAppWithoutConfirm(
    appIndex: number,
    assetId: number,
    note?: Uint8Array
  ) {
    const address = algosdk.getApplicationAddress(appIndex)
    return await this.makeTransferToAccountWithoutConfirm(
      address,
      assetId,
      note
    )
  }

  /** The fee value. */
  get fee() {
    return algosdk.ALGORAND_MIN_TX_FEE
  }

  /** The amount of transactions that are required for a single mint. */
  get baseMintTxCount() {
    return 4
  }

  /** The amount of transactions that **may** be required for returning the asset to the creator. */
  get depositTxCount() {
    return 4
  }

  /**
   * Makes the asset to be transferred from this running account into the
   * app's account.
   * @TODO Move to a more abstract service (blockchain-wide operations).
   */
  async makeTransferToAccount(
    address: string,
    assetId: number,
    note?: Uint8Array
  ): Promise<Result<TransactionLike>> {
    const client = this.client.client
    const transactions = await this.makeTransferToAccountWithoutConfirm(
      address,
      assetId,
      note
    )
    const txns = algosdk.assignGroupID(transactions)
    const signedTxn = await this.signer.signTransaction(txns)
    {
      let attempt = 0
      for (;;) {
        try {
          const tx = await client.sendRawTransaction(signedTxn).do()
          return success(tx)
        } catch (err) {
          console.warn('Failed to send transaction (asset transfer):', err)
          if (attempt++ > 3) {
            return failure(err as Error)
          }
        }
      }
    }
  }

  async makeTransferToAccountWithoutConfirm(
    address: string,
    assetId: number,
    note?: Uint8Array
  ): Promise<TransactionLike[]> {
    const client = this.client.client
    const suggestedParams = await client.getTransactionParams().do()
    const account = this.account.account.addr
    // This represents the extra fees that might be deduced in the future (total).
    const payGasTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject(
      {
        from: account,
        to: address,
        amount: this.fee * (this.baseMintTxCount + this.depositTxCount),
        suggestedParams,
      }
    )
    const fundNftTxn =
      await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: account,
        to: address,
        assetIndex: assetId,
        amount: 1,
        suggestedParams,
        note,
      })
    return [payGasTxn, fundNftTxn]
  }
}
