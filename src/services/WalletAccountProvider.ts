import { Account } from 'algosdk'
import AbstractService from '../lib/AbstractService'

/**
 * Provides an account
 */
export interface type {
  get account(): Account
}

export const { get, token, inject, declare } = AbstractService<type>()
