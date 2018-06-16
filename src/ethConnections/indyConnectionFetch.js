/**
 * Created by adys on 06/13/2018.
 * @flow
 */
import type { EdgeIo } from 'edge-core-js'
import { ConnectionFetch } from '../ethTypes.js'
import { ConnectionUtils } from './connectionUtils'

class IndyConnectionFetch implements ConnectionFetch {
  connection: ConnectionUtils
  constructor (io: EdgeIo) {
    this.connection = new ConnectionUtils(io)
  }

  async getAddressBalance (address: string): Promise<string> {
    const url = `/account/balance/${address}`
    const balance = await this.connection.indyFetchGet(url)
    console.log(`Indy balance: ${balance} for account: ${address}`)
    return balance
  }

  async getTokenBalance (address: string, token: string): Promise<string> {
    const url = `/token/balance/${address}`
    const balance = await this.connection.indyFetchGet(url)
    console.log(`Indy token balance: ${balance} for account: ${address}, token: ${token}`)
    return balance
  }

  async getHighestBlock (): Promise<string> {
    const url = `/mempool/latest`
    const highetBlockNumber = await this.connection.indyFetchGet(url)
    console.log(`Indy highest block: ${highetBlockNumber}`)
    return highetBlockNumber
  }

  async getPendingTxs (address: string): Promise<[]> {
    const url = `/mempool/pending${address}`
    const pendingTxs = await this.connection.indyFetchGet(url)
    console.log(`Indy return ${pendingTxs.length} pending Txs`)
    return pendingTxs
  }

  async getAddressTxs (address: string): Promise<[]> {
    const url = `/account/${address}`
    const accountTxs = await this.connection.indyFetchGet(url)
    console.log(`Indy return ${accountTxs.length} Txs for account: ${address} `)
    return accountTxs
  }

  async getTokenTxs (address: string, token: string): Promise<[]> {
    const url = `/tokens/${address}/${token}`
    const tokenTxs = await this.connection.indyFetchGet(url)
    console.log(`Indy return ${tokenTxs.length} Txs of token: ${token} for account: ${address} `)
    return tokenTxs
  }

  async getBlockTxs (block: string): Promise<[]> {
    const url = `/mempool/block/${block}`
    const blockTxs = await this.connection.indyFetchGet(url)
    console.log(`Indy return ${blockTxs.length} Txs of block: ${block} `)
    return blockTxs
  }
}

export { IndyConnectionFetch }
