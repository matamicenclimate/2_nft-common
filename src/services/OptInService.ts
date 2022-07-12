import algosdk from 'algosdk'
import * as WalletAccountProvider from './WalletAccountProvider'
import Container, { Service } from 'typedi'
import AlgodClientProvider from './AlgodClientProvider'
import * as TransactionSigner from './TransactionSigner'
import { TransactionOperation } from './TransactionOperation'

@Service()
export default class OptInService {
  readonly clientProvider: AlgodClientProvider
  readonly walletProvider: WalletAccountProvider.type
  readonly signer: TransactionSigner.type
  readonly op: TransactionOperation

  constructor() {
    this.clientProvider = Container.get(AlgodClientProvider)
    this.walletProvider = WalletAccountProvider.get()
    this.signer = TransactionSigner.get()
    this.op = Container.get(TransactionOperation)
  }

  private get client() {
    return this.clientProvider.client
  }
  static waitForConfirmation = algosdk.waitForConfirmation

  static makeAssetTransferTransaction =
    algosdk.makeAssetTransferTxnWithSuggestedParams

  /**
   * Prepares a raw asset opt-in transaction request.
   */
  async createOptInRequest(
    assetId: number,
    sender: string = this.walletProvider.account.addr,
    recipient = sender,
    ammout = 0
  ) {
    const params = await this.client.getTransactionParams().do()
    const revocationTarget = undefined
    const closeRemainderTo = undefined
    const note = undefined
    const amount = ammout
    console.log(`[OPT IN]\nsender = ${sender}\nrecipient = ${recipient}`)
    return await OptInService.makeAssetTransferTransaction(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      amount,
      note,
      assetId,
      params
    )
  }

  /**
   * Opts in the asset, signs the transaction.
   */
  async optInAssetByID(
    assetId: number,
    sender: string = this.walletProvider.account.addr,
    recipient = sender,
    signer?: algosdk.Account,
    ammout = 0
  ) {
    const optInTxUnsigned = await this.createOptInRequest(
      assetId,
      sender,
      recipient,
      ammout
    )
    return await this.op.signAndConfirm(optInTxUnsigned, undefined, signer)
  }
}
