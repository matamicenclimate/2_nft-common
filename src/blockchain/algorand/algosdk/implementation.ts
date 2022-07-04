/*
  This module exports implementing types for all
  specific data on this chain.
*/
import algosdk from 'algosdk'
import BlockchainGateway from '../../BlockchainGateway'
import BlockchainGatewayFactory from '../../BlockchainGatewayFactory'
import OperationSigner from '../../lib/OperationSigner'
import { AlgosdkAlgorandGateway } from '.'
import { ChainAsset } from '../../lib/ChainAsset'
import { ChainWallet } from '../../lib/ChainWallet'
import { SmartContractID } from '../../lib/SmartContract'
import { SmartContractMethod } from '../../lib/SmartContractMethod'

export class AlgorandChainWallet extends ChainWallet {
  isNull(): boolean {
    return this.address.reduce((a, b) => a + b, 0) === 0
  }
  constructor(readonly address: Uint8Array) {
    super()
  }
}

export class AlgorandSmartContractID extends SmartContractID {
  constructor(readonly id: number) {
    super()
  }
}

export class AlgorandSmartContractMethod extends SmartContractMethod {
  constructor(readonly name: string) {
    super()
  }
}

export class AlgorandChainAsset extends ChainAsset {
  constructor(readonly id: number) {
    super()
  }
}

export class AlgosdkAlgorandGatewayFactory implements BlockchainGatewayFactory {
  constructor(
    private readonly client: algosdk.Algodv2,
    private readonly signer: OperationSigner
  ) {}
  provide(): BlockchainGateway {
    return new AlgosdkAlgorandGateway(this.client, this.signer)
  }
}

export const ALGORAND_GATEWAY_ID = 'algorand'

export type Unasserted =
  | ChainWallet
  | SmartContractID
  | ChainAsset
  | SmartContractMethod

export type Asserted<A> = A extends ChainWallet
  ? AlgorandChainWallet
  : A extends SmartContractID
  ? AlgorandSmartContractID
  : A extends ChainAsset
  ? AlgorandChainAsset
  : A extends SmartContractMethod
  ? AlgorandSmartContractMethod
  : never
