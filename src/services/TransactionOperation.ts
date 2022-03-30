import Container, { Service } from 'typedi'
import { Transaction, waitForConfirmation } from 'algosdk'
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
    overrideRounds?: number
  ): Promise<{ txId: number; result: T }> {
    const client = this.client.client
    const signedTxn = await this.signer.signTransaction(transaction)
    const { txId } = await client.sendRawTransaction(signedTxn).do()
    const result = (await waitForConfirmation(
      client,
      txId,
      overrideRounds ?? this.rounds
    )) as unknown as T
    return { result, txId }
  }
}
