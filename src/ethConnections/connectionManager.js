/**
 * Created by adys on 06/13/2018.
 * @flow
 */

import type { EdgeIo } from 'edge-core-js'
import { ConnectionFetch } from '../ethTypes.js'
import { IndyConnectionFetch } from './indyConnectionFetch'
import { EtherscanConnectionFetch } from './etherscanConnectionFetch'

class ConnectionManager implements ConnectionFetch {
  indyConnection: IndyConnectionFetch
  etherscanConnection: EtherscanConnectionFetch

  constructor (io: EdgeIo) {
    this.indyConnection = new IndyConnectionFetch(io)
    this.etherscanConnection = new EtherscanConnectionFetch(io)
  }

  async getAddressBalance (address: string): Promise<string> {
    try {
      const res = await this.indyConnection.getAddressBalance(address)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getAddressBalance(address)
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getTokenBalance (address: string, token: string): Promise<string> {
    try {
      const res = await this.indyConnection.getTokenBalance(address, token)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getTokenBalance(address, token)
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getHighestBlock (): Promise<string> {
    try {
      const res = await this.indyConnection.getHighestBlock()
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getHighestBlock()
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getPendingTxs (address: string): Promise<[]> {
    try {
      const res = await this.indyConnection.getPendingTxs(address)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getPendingTxs(address)
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getAddressTxs (address: string): Promise<[]> {
    try {
      const res = await this.indyConnection.getAddressTxs(address)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getAddressTxs(address)
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getTokenTxs (address: string, token: string): Promise<[]> {
    try {
      const res = await this.indyConnection.getTokenTxs(address, token)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getTokenTxs(address, token)
        return res
      } catch (error) {
        throw error
      }
    }
  }

  async getBlockTxs (block: string): Promise<[]> {
    try {
      const res = await this.indyConnection.getBlockTxs(block)
      return res
    } catch (error) {
      try {
        const res = await this.etherscanConnection.getBlockTxs(block)
        return res
      } catch (error) {
        throw error
      }
    }
  }
}

export { ConnectionManager }
