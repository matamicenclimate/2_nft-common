import Container, { Service } from 'typedi'
import algosdk, { Transaction, waitForConfirmation } from 'algosdk'
import * as TransactionSigner from './TransactionSigner'
import AlgodClientProvider from './AlgodClientProvider'
import * as app from '../lib/app'
import { assertArray } from '../lib/types'

/**
 * This service provides a series of façade methods to
 * operate upon transactions (stacks-up various operations
 * needed for simple transactions, like siging, confirming, sending...)
 */
@Service()
export class TransactionOperation {
  static get do() {
    return Container.get(TransactionOperation)
  }
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

  /**
   * Requests the raw application information by ID.
   */
  async requestAppInfo(appId: number) {
    return await this.client.client.getApplicationByID(appId).do()
  }

  /**
   * Gets the whole application information.
   */
  async getApplication(appId: number): Promise<Record<string, app.Dict>> {
    const info = await this.requestAppInfo(appId)
    const out: Record<string, app.Dict> = {}
    for (const [k, v] of Object.entries(info)) {
      out[k] = app.parseEntries(v)
    }
    return out
  }

  /**
   * Queries the application information, then extracts the global
   * state.
   */
  async getApplicationState<A extends app.Dict = app.Dict>(
    appId: number
  ): Promise<A> {
    const result = await this.requestAppInfo(appId)
    const state = assertArray(result.params['global-state']) as app.Entry[]
    return app.parseEntries(state) as A
  }
}
