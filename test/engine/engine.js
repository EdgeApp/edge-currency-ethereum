// @flow

import EventEmitter from 'events'
import { makeFakeIos, makeContext, destroyAllContexts } from 'edge-core-js'
import type {
  EdgeWalletInfo,
  EdgeCurrencyEngineOptions,
  EdgeCurrencyEngineCallbacks
} from 'edge-core-js'
import { assert } from 'chai'
import { before, describe, it } from 'mocha'
import fetch from 'node-fetch'
import request from 'request'

import { DATA_STORE_FOLDER, DATA_STORE_FILE } from '../../src/ethTypes.js'
import * as Factories from '../../src/indexEthereum.js'
import fixtures from './fixtures.json'
import { testData } from './testData.js'

for (const fixture of fixtures) {
  const CurrencyPluginFactory = Factories[fixture['factory']]
  const WALLET_TYPE = fixture['WALLET_TYPE']

  let plugin, keys, engine
  const emitter = new EventEmitter()
  const [fakeIo] = makeFakeIos(1)
  if (!fakeIo.folder) {
    throw new Error('Missing fakeio.folder')
  }
  const walletLocalFolder = fakeIo.folder
  const plugins = [CurrencyPluginFactory]
  // $FlowFixMe
  fakeIo.fetch = fetch

  const context = makeContext({ io: fakeIo, plugins })

  const callbacks: EdgeCurrencyEngineCallbacks = {
    onAddressesChecked (progressRatio) {
      // console.log('onAddressesCheck', progressRatio)
      emitter.emit('onAddressesCheck', progressRatio)
    },
    onTxidsChanged (txid) {
      // console.log('onTxidsChanged', txid)
      emitter.emit('onTxidsChanged', txid)
    },
    onBalanceChanged (currencyCode, balance) {
      // console.log('onBalanceChange:', currencyCode, balance)
      emitter.emit('onBalanceChange', currencyCode, balance)
    },
    onBlockHeightChanged (height) {
      // console.log('onBlockHeightChange:', height)
      emitter.emit('onBlockHeightChange', height)
    },
    onTransactionsChanged (transactionList) {
      // console.log('onTransactionsChanged:', transactionList)
      emitter.emit('onTransactionsChanged', transactionList)
    }
  }

  const currencyEngineOptions: EdgeCurrencyEngineOptions = {
    callbacks,
    walletLocalFolder,
    walletLocalEncryptedFolder: walletLocalFolder
  }

  describe(`Create Plugin for Wallet type ${WALLET_TYPE}`, function () {
    it('Plugin', function () {
      return context.getCurrencyPlugins().then(currencyPlugins => {
        const currencyPlugin = currencyPlugins[0]
        assert.equal(
          currencyPlugin.currencyInfo.currencyCode,
          fixture['Test Currency code']
        )
        plugin = currencyPlugin
        keys = plugin.createPrivateKey(WALLET_TYPE)
        const info: EdgeWalletInfo = {
          id: '1',
          type: WALLET_TYPE,
          keys
        }
        keys = plugin.derivePublicKey(info)
      })
    })
  })

  describe(`Make Engine for Wallet type ${WALLET_TYPE}`, function () {
    before('Create local cache file', function (done) {
      walletLocalFolder
        .folder(DATA_STORE_FOLDER)
        .file(DATA_STORE_FILE)
        .setText(JSON.stringify(testData))
        .then(done)
    })

    it('Make Engine', function () {
      const info: EdgeWalletInfo = {
        id: '1',
        type: WALLET_TYPE,
        keys
      }
      return plugin.makeEngine(info, currencyEngineOptions).then(e => {
        engine = e
        assert.equal(typeof engine.startEngine, 'function', 'startEngine')
        assert.equal(typeof engine.killEngine, 'function', 'killEngine')
        assert.equal(typeof engine.getBlockHeight, 'function', 'getBlockHeight')
        assert.equal(typeof engine.getBalance, 'function', 'getBalance')
        assert.equal(
          typeof engine.getNumTransactions,
          'function',
          'getNumTransactions'
        )
        assert.equal(
          typeof engine.getTransactions,
          'function',
          'getTransactions'
        )
        assert.equal(typeof engine.getTxids, 'function', 'getTxids')
        assert.equal(
          typeof engine.getFreshAddress,
          'function',
          'getFreshAddress'
        )
        assert.equal(
          typeof engine.addGapLimitAddresses,
          'function',
          'addGapLimitAddresses'
        )
        assert.equal(typeof engine.isAddressUsed, 'function', 'isAddressUsed')
        assert.equal(typeof engine.makeSpend, 'function', 'makeSpend')
        assert.equal(typeof engine.signTx, 'function', 'signTx')
        assert.equal(typeof engine.broadcastTx, 'function', 'broadcastTx')
        assert.equal(typeof engine.saveTx, 'function', 'saveTx')
        return true
      })
    })
  })

  describe(`Get Txids`, function () {
    it('Should get txids from cache', function (done) {
      assert.deepEqual(
        engine.getTxids('ETH'),
        {
          '123': 123,
          '234': 234,
          '345': 345,
          '456': 456
        },
        'getTxids'
      )
      done()
    })

    it('Should get txids from cache, default currency code', function (done) {
      assert.deepEqual(
        engine.getTxids(),
        {
          '123': 123,
          '234': 234,
          '345': 345,
          '456': 456
        },
        'getTxids'
      )
      done()
    })

    it('Should get empty txids from cache, unknown currencyCode', function (done) {
      assert.deepEqual(engine.getTxids('NOT_VALID'), {}, 'getTxids')
      done()
    })
  })

  describe('Start engine', function () {
    it('Get BlockHeight', function (done) {
      this.timeout(10000)
      request.get(
        'https://api.etherscan.io/api?module=proxy&action=eth_blockNumber',
        (err, res, body) => {
          assert(!err, 'getting block height from a second source')
          emitter.once('onBlockHeightChange', height => {
            const thirdPartyHeight = parseInt(JSON.parse(body).result, 16)
            assert(height >= thirdPartyHeight, 'Block height')
            assert(engine.getBlockHeight() >= thirdPartyHeight, 'Block height')
            done() // Can be "done" since the promise resolves before the event fires but just be on the safe side
          })
          engine.startEngine().catch(e => {
            console.log('startEngine error', e, e.message)
          })
        }
      )
    })
  })

  describe('Stop the engine', function () {
    it('Should stop the engine', function (done) {
      engine.killEngine().then(() => {
        destroyAllContexts()
        done()
      })
    })
  })
}
