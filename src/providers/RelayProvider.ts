import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import { Observable } from 'rxjs/Observable'

import utils from '../utils'

import { TLProvider } from './TLProvider'

import {
  Amount,
  MetaTransaction,
  MetaTransactionFees,
  ReconnectingWSOptions,
  TxInfos,
  TxInfosRaw
} from '../typings'

export class RelayProvider implements TLProvider {
  public relayApiUrl: string
  public relayWsApiUrl: string

  constructor(relayApiUrl: string, relayWsApiUrl: string) {
    this.relayApiUrl = relayApiUrl
    this.relayWsApiUrl = relayWsApiUrl
  }

  /**
   * Returns a JSON response from the REST API of the relay server.
   * @param endpoint Endpoint to fetch.
   * @param options Optional fetch options.
   */
  public async fetchEndpoint<T>(
    endpoint: string,
    options?: object
  ): Promise<T> {
    const trimmedEndpoint = utils.trimUrl(endpoint)
    return utils.fetchUrl<T>(`${this.relayApiUrl}/${trimmedEndpoint}`, options)
  }

  public async postToEndpoint<T>(endpoint: string, data: any): Promise<T> {
    const options = {
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
      method: 'POST'
    }
    return this.fetchEndpoint<T>(endpoint, options)
  }

  /**
   * Creates a websocket stream connection to the relay server.
   * @param endpoint Websocket stream endpoint to connect to.
   * @param functionName Function to call on connection.
   * @param args Function arguments.
   * @param reconnectOnError Optional flag whether to try reconnecting web socket.
   */
  public createWebsocketStream(
    endpoint: string,
    functionName: string,
    args: object,
    reconnectingOptions?: ReconnectingWSOptions
  ): Observable<any> {
    const trimmedEndpoint = utils.trimUrl(endpoint)
    return utils.websocketStream(
      `${this.relayWsApiUrl}/${trimmedEndpoint}`,
      functionName,
      args,
      reconnectingOptions
    )
  }

  /**
   * Returns needed information for creating an ethereum transaction.
   * @param address Address of user creating the transaction
   * @returns Information for creating an ethereum transaction for the given user address.
   *          See type `TxInfos` for more details.
   */
  public async getTxInfos(address: string): Promise<TxInfos> {
    const { nonce, gasPrice, balance } = await this.fetchEndpoint<TxInfosRaw>(
      `users/${address}/txinfos`
    )
    return {
      balance: new BigNumber(balance),
      gasPrice: new BigNumber(gasPrice),
      nonce
    }
  }

  /**
   * Returns needed information for creating a meta transaction.
   * @param address Address of user creating the transaction
   * @returns Information for creating an ethereum transaction for the given identity address.
   *          See type `TxInfos` for more details.
   */
  public async getMetaTxInfos(address: string): Promise<TxInfos> {
    const { identity, nextNonce, balance } = await this.fetchEndpoint<any>(
      `/identities/${address}`
    )
    return {
      balance: new BigNumber(balance),
      gasPrice: new BigNumber(0),
      nonce: nextNonce
    }
  }

  /**
   * Returns the fees the provider would be willing to pay for the transaction
   * @param metaTransaction Meta transaction to be relayed
   * @returns The fees value and currency network of fees for given meta transaction
   */
  public async getMetaTxFees(
    metaTransaction: MetaTransaction
  ): Promise<MetaTransactionFees> {
    const potentialDelegationFees = await this.postToEndpoint<any>(
      `/meta-transaction-fees`,
      {
        metaTransaction
      }
    )
    let delegationFees = '0'
    let currencyNetworkOfFees = ''
    if (potentialDelegationFees.length) {
      // For now just get the first possible fee given by the relay server
      // Could be changed later to show the possible fees to the user and let it decide
      delegationFees = potentialDelegationFees[0].delegationFees
      currencyNetworkOfFees = potentialDelegationFees[0].currencyNetworkOfFees
    }
    return {
      delegationFees,
      currencyNetworkOfFees
    }
  }

  /**
   * Returns balance of given address.
   * @param address Address to determine balance for.
   */
  public async getBalance(address: string): Promise<Amount> {
    const balance = await this.fetchEndpoint<string>(`users/${address}/balance`)
    return utils.formatToAmount(utils.calcRaw(balance, 18), 18)
  }

  /**
   * Returns the version of the currently configured relay server.
   * @returns Version of relay in the format `<name>/vX.X.X`.
   */
  public async getRelayVersion(): Promise<string> {
    return this.fetchEndpoint<string>(`version`)
  }

  /**
   * Send the given _signedTransaction_ to a relay server to execute it on the
   * blockchain and returns a `Promise` with the transaction hash.
   * @param signedTransaction
   */
  public async sendSignedTransaction(
    signedTransaction: string
  ): Promise<string> {
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const options = {
      body: JSON.stringify({
        rawTransaction: ethers.utils.hexlify(signedTransaction)
      }),
      headers,
      method: 'POST'
    }
    return this.fetchEndpoint<string>(`relay`, options)
  }

  /**
   * Send the given signed meta-transaction to a relay server to execute it on the
   * blockchain and returns a `Promise` with the transaction hash.
   * @param signedMetaTransaction Signed meta-transaction to be sent to the relay server
   * @returns The hash of the transaction sent by the relay server, not to be confused with the hash of the meta-transaction
   */
  public async sendSignedMetaTransaction(
    signedMetaTransaction: MetaTransaction
  ): Promise<string> {
    return this.postToEndpoint<string>('relay-meta-transaction', {
      metaTransaction: signedMetaTransaction
    })
  }
}
