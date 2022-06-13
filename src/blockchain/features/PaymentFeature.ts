export interface PaymentParameters {}

export interface PaymentResult {}

export default interface PaymentFeature {
  pay(params: PaymentParameters): Promise<PaymentResult>
}
