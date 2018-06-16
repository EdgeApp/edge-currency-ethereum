/**
 * Created by adys on 06/13/18.
 * @flow
 */
import type { EdgeIo } from 'edge-core-js'
import type { ConnectionFetch } from '../ethTypes'
import { ConnectionUtils } from './connectionUtils'
import { sprintf } from 'sprintf-js'

const startBlock: number = 0
const endBlock: number = 999999999

class EtherscanConnectionFetch implements ConnectionFetch {
  connection: ConnectionUtils
  constructor (io: EdgeIo) {
    this.connection = new ConnectionUtils(io)
  }

  async getAddressBalance (address: string): Promise<string> {
    const url = `/account/balance/${address}`
    const balance = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan balance: ${balance} for account: ${address}`)
    return balance
  }

  async getTokenBalance (address: string, token: string): Promise<string> {
    const url = `/token/balance/${address}`
    const balance = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan token balance: ${balance} for account: ${address}, token: ${token}`)
    return balance
  }

  async getHighestBlock (): Promise<string> {
    const url = '?module=proxy&action=eth_blockNumber'
    const highetBlockNumber = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan highest block: ${highetBlockNumber}`)
    return highetBlockNumber
  }

  async getPendingTxs (address: string): Promise<[]> {
    const url = `/mempool/pending${address}`
    const pendingTxs = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan return ${pendingTxs.length} pending Txs`)
    return pendingTxs
  }

  async getAddressTxs (address: string): Promise<[]> {
    const url = sprintf('?module=account&action=txlist&address=%s&startblock=%d&endblock=%d&sort=asc', address, startBlock, endBlock)
    // TBD
    // const urlNew = `?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=asc`
    const accountTxs = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan return ${accountTxs.length} Txs for account: ${address} `)
    return accountTxs
  }

  async getTokenTxs (address: string, token: string): Promise<[]> {
    const url = sprintf('?module=logs&action=getLogs&fromBlock=%d&toBlock=latest&address=%s&topic0=%s', startBlock, address, address)
    // TBD
    // const url = `/tokens/${address}/${token}`
    const tokenTxs = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan return ${tokenTxs.length} Txs of token: ${token} for account: ${address} `)
    return tokenTxs
  }

  async getBlockTxs (block: string): Promise<[]> {
    const url = `/mempool/block/${block}`
    const blockTxs = await this.connection.etherscanFetchGet(url)
    console.log(`Etherscan return ${blockTxs.length} Txs of block: ${block} `)
    return blockTxs
  }
}

export { EtherscanConnectionFetch }
