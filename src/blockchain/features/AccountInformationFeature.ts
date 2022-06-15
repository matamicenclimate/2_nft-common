import { Data } from '../Operation'

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
  data?: Data
}

export interface AccountInformationFeature {
  /**
   * Gathers account information.
   */
  getAccountInformation(
    params: AccountInformationParameters
  ): Promise<AccountInformationResult>
}
