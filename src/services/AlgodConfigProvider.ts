/**
 * Abstract configuration provider for Algod client lazy factory.
 */
export default interface AlgodConfigProvider {
  get port(): number | ''
  get token(): string
  get server(): string
}
