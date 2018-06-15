/**
 * Created by adys on 6/15/2018.
 * @flow
 */
import type { EdgeIo } from 'edge-core-js'
import { otherSettings } from '../currencyInfoETH'
import { sprintf } from 'sprintf-js'

class ConnectionUtils {
  io: EdgeIo

  constructor (io: EdgeIo) {
    this.io = io
  }

  async indyFetchGet (cmd: string) {
    const url = `${otherSettings.indyApiServers[0]}/${cmd}`
    const response = await this.io.fetch(url, {
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(
        `Indy server returned error code ${response.status} for ${url}`
      )
    }
    return response.json()
  }

  async etherscanFetchGet (cmd: string) {
    let apiKey = ''
    if (global.etherscanApiKey && global.etherscanApiKey.length > 5) {
      apiKey = '&apikey=' + global.etherscanApiKey
    }
    const url = sprintf('%s/api%s%s', otherSettings.etherscanApiServers[0], cmd, apiKey)

    const response = await this.io.fetch(url, {
      method: 'GET'
    })
    if (!response.ok) {
      const cleanUrl = url.replace(global.etherscanApiKey, 'private')
      throw new Error(
        `Etherscan server returned error code ${response.status} for ${cleanUrl}`
      )
    }
    return response.json()
  }
}

export { ConnectionUtils }
