export interface AccountInformationParameters {
  address: string
}

export interface AccountInformationResult {
  balance?: number
  currency?: {
    name?: string
    symbol?: string
  }
  name?: string
  tags?: string[]
}

export interface AccountInformationFeature {
  /**
   * Gathers account information.
   */
  getAccountInformation(
    params: AccountInformationParameters
  ): Promise<AccountInformationResult>
}
