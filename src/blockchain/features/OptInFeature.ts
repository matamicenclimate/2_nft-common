export interface OptInParameters {}

export interface OptInResult {}

export default interface OptInFeature {
  optIn(params: OptInParameters): Promise<OptInResult>
}
