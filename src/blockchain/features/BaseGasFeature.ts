export interface BaseGasParameters {}

export interface BaseGasResult {
  value: number
}

export default interface BaseGasFeature {
  getBaseGas(params: BaseGasParameters): Promise<BaseGasResult>
}
