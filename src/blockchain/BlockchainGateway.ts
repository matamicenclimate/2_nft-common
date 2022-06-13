import Payment from './Payment'

export default interface BlockchainGateway {
  pay(): Promise<Payment>
}
