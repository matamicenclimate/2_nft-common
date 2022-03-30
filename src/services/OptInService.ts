import algosdk from 'algosdk'
import * as WalletAccountProvider from './WalletAccountProvider'
import Container, { Inject, Service } from 'typedi'
import AlgodClientProvider from './AlgodClientProvider'
import * as TransactionSigner from './TransactionSigner'

@Service()
export default class OptInService {
  readonly clientProvider: AlgodClientProvider
  readonly walletProvider: WalletAccountProvider.type
  readonly signer: TransactionSigner.type

  constructor() {
    this.clientProvider = Container.get(AlgodClientProvider)
    this.walletProvider = WalletAccountProvider.get()
    this.signer = TransactionSigner.get()
  }

  private get client() {
    return this.clientProvider.client
  }
  static waitForConfirmation = algosdk.waitForConfirmation

  static makeAssetTransferTransaction =
    algosdk.makeAssetTransferTxnWithSuggestedParams

  async optInAssetByID(
    assetID: number,
    sender: string = this.walletProvider.account.addr,
    recipient = sender
  ) {
    const params = await this.client.getTransactionParams().do()
    const revocationTarget = undefined
    const closeRemainderTo = undefined
    const note = undefined
    const amount = 0
    console.log(`[OPT IN]\nsender = ${sender}\nrecipient = ${recipient}`)
    const optInTxUnsigned = await OptInService.makeAssetTransferTransaction(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      amount,
      note,
      assetID,
      params
    )
    const optInTxSigned = await this.signer.signTransaction(optInTxUnsigned)
    const optInSendTx = await this.client.sendRawTransaction(optInTxSigned).do()
    const confirmedOptInTx = await OptInService.waitForConfirmation(
      this.client,
      optInSendTx.txId,
      4
    )
    return confirmedOptInTx
  }
}
