import Container, { Service } from 'typedi'
import algosdk, { Transaction, waitForConfirmation } from 'algosdk'
import * as TransactionSigner from './TransactionSigner'
import AlgodClientProvider from './AlgodClientProvider'

/**
 * This service provides a series of façade methods to
 * operate upon transactions (stacks-up various operations
 * needed for simple transactions, like siging, confirming, sending...)
 */
@Service()
export class TransactionOperation {
  readonly signer: TransactionSigner.type
  readonly client: AlgodClientProvider
  rounds = 10

  constructor() {
    this.signer = TransactionSigner.get()
    this.client = Container.get(AlgodClientProvider)
  }

  /**
   * Takes a generic transaction, signs it, sends it to the chain and awaits
   * the confirmation.
   * @param transaction
   * @param overrideRounds
   */
  async signAndConfirm<T = Record<string, unknown>>(
    transaction: Transaction,
    overrideRounds?: number,
    overrideAccount?: algosdk.Account
  ): Promise<{ txId: number; result: T }> {
    const client = this.client.client
    const signedTxn =
      overrideAccount == null
        ? await this.signer.signTransaction(transaction)
        : transaction.signTxn(overrideAccount.sk)
    const { txId } = await client.sendRawTransaction(signedTxn).do()
    const result = (await waitForConfirmation(
      client,
      txId,
      overrideRounds ?? this.rounds
    )) as unknown as T
    return { result, txId }
  }

  /**
   * Simple payment method.
   * @param from
   * @param to
   * @param amount
   * @returns
   */
  async pay(from: algosdk.Account, to: string, amount: number) {
    const suggestedParams = await this.client.client.getTransactionParams().do()
    const tx = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: from.addr,
      to,
      amount,
      suggestedParams,
    })
    return await this.signAndConfirm(tx, undefined, from)
  }
}
