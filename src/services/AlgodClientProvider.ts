import { Inject, Service } from 'typedi'
import algosdk from 'algosdk'
import AlgodConfigProvider from './AlgodConfigProvider'

@Service()
export default class AlgodClientProvider {
  readonly client: algosdk.Algodv2

  constructor(
    @Inject('algod-config')
    readonly config: AlgodConfigProvider
  ) {
    const token = {
      'x-api-key': this.config.token,
    }
    const { server, port } = this.config
    this.client = new algosdk.Algodv2(token, server, port)
  }
}
