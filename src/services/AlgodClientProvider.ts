import { Service } from 'typedi'
import algosdk from 'algosdk'
import * as AlgodConfigProvider from './AlgodConfigProvider'

@Service()
export default class AlgodClientProvider {
  readonly client: algosdk.Algodv2
  readonly config: AlgodConfigProvider.type
  constructor() {
    this.config = AlgodConfigProvider.get()
    const token = {
      'x-api-key': this.config.token,
    }
    const { server, port } = this.config
    this.client = new algosdk.Algodv2(token, server, port)
  }
}
