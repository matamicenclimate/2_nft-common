import algosdk from 'algosdk'
import WalletAccountProvider from 'src/services/WalletAccountProvider'
import { Inject, Service } from 'typedi'
import AlgodClientProvider from './AlgodClientProvider'
import TransactionSigner from './TransactionSigner'

@Service()
export default class OptInService {
  @Inject()
  readonly clientProvider: AlgodClientProvider

  @Inject()
  readonly walletProvider: WalletAccountProvider

  @Inject('transaction-signer')
  readonly signer: TransactionSigner

  private get client() {
    return this.clientProvider.client
  }

  async optInAssetByID(assetID: number) {
    const params = await this.client.getTransactionParams().do()
    const walletInfo = this.walletProvider.account
    const sender = walletInfo.addr
    const recipient = sender
    const revocationTarget = undefined
    const closeRemainderTo = undefined
    const note = undefined
    const amount = 0
    const optInTxUnsigned = algosdk.makeAssetTransferTxnWithSuggestedParams(
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
    const confirmedOptInTx = await algosdk.waitForConfirmation(
      this.client,
      optInSendTx.txId,
      4
    )
    return confirmedOptInTx
  }
}
