// @flow

import type { EdgeTransaction } from 'edge-core-js'
import { currencyInfo } from './currencyInfoETH.js'
export const DATA_STORE_FOLDER = 'txEngineFolder'
export const DATA_STORE_FILE = 'walletLocalData.json'
export const PRIMARY_CURRENCY = currencyInfo.currencyCode

export type BroadcastResults = {
  decrementNonce: boolean,
  incrementNonce: boolean
}

export type EthereumSettings = {
  etherscanApiServers: Array<string>,
  blockcypherApiServers: Array<string>,
  superethServers: Array<string>,
  iosAllowedTokens: { [currencyCode: string]: boolean }
}

type EthereumFeesGasLimit = {
  regularTransaction: string,
  tokenTransaction: string
}

export type EthereumFeesGasPrice = {
  lowFee: string,
  standardFeeLow: string,
  standardFeeHigh: string,

  // The amount of wei which will be charged the standardFeeLow
  standardFeeLowAmount: string,

  // The amount of wei which will be charged the standardFeeHigh
  standardFeeHighAmount: string,
  highFee: string
}

export type EthereumFee = {
  gasLimit: EthereumFeesGasLimit,
  gasPrice?: EthereumFeesGasPrice
}

export type EthereumFees = {
  [address: string]: EthereumFee
}

export type EthereumCalcedFees = {
  gasPrice: string,
  gasLimit: string
}

const defaultNetworkFees = {
  default: {
    gasLimit: {
      regularTransaction: '21001',
      tokenTransaction: '37123'
    },
    gasPrice: {
      lowFee: '1000000001',
      standardFeeLow: '40000000001',
      standardFeeHigh: '300000000001',
      standardFeeLowAmount: '100000000000000000',
      standardFeeHighAmount: '10000000000000000000',
      highFee: '40000000001'
    }
  },
  '1983987abc9837fbabc0982347ad828': {
    gasLimit: {
      regularTransaction: '21002',
      tokenTransaction: '37124'
    },
    gasPrice: {
      lowFee: '1000000002',
      standardFeeLow: '40000000002',
      standardFeeHigh: '300000000002',
      standardFeeLowAmount: '200000000000000000',
      standardFeeHighAmount: '20000000000000000000',
      highFee: '40000000002'
    }
  },
  '2983987abc9837fbabc0982347ad828': {
    gasLimit: {
      regularTransaction: '21002',
      tokenTransaction: '37124'
    }
  }
}

export type EthCustomToken = {
  currencyCode: string,
  currencyName: string,
  multiplier: string,
  contractAddress: string
}

export type Timestamp = number
export type TxidsWithTimestamp = { [id: string]: Timestamp }
export type TxidsByCurrencyCode = { [currencyCode: string]: TxidsWithTimestamp }

export class WalletLocalData {
  blockHeight: number
  enabledTokens: Array<string>
  ethereumAddress: string
  lastAddressQueryHeight: number
  networkFees: EthereumFees
  nextNonce: string
  totalBalances: { [currencyCode: string]: string }
  transactionsObj: { [currencyCode: string]: Array<EdgeTransaction> }
  txids: TxidsByCurrencyCode

  constructor (jsonString: string | null) {
    this.blockHeight = 0
    this.enabledTokens = [PRIMARY_CURRENCY]
    this.ethereumAddress = ''
    this.lastAddressQueryHeight = 0
    this.networkFees = defaultNetworkFees
    this.nextNonce = '0'
    this.totalBalances = {}
    this.transactionsObj = {}
    this.txids = {}

    if (jsonString !== null) {
      const data = JSON.parse(jsonString)

      if (typeof data.blockHeight === 'number') {
        this.blockHeight = data.blockHeight
      }
      if (typeof data.lastAddressQueryHeight === 'string') {
        this.lastAddressQueryHeight = data.lastAddressQueryHeight
      }
      if (typeof data.nextNonce === 'string') this.nextNonce = data.nextNonce
      if (typeof data.ethereumAddress === 'string') {
        this.ethereumAddress = data.ethereumAddress
      }
      if (typeof data.totalBalances !== 'undefined') {
        this.totalBalances = data.totalBalances
      }
      if (typeof data.enabledTokens !== 'undefined') {
        this.enabledTokens = data.enabledTokens
      }
      if (typeof data.networkFees !== 'undefined') {
        this.networkFees = data.networkFees
      }
      if (typeof data.transactionsObj !== 'undefined') {
        this.transactionsObj = data.transactionsObj
      }
      if (typeof data.txids !== 'undefined') this.txids = data.txids
    }
  }
}
