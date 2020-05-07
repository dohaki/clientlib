import { BigNumber } from 'bignumber.js';
import { Options as ReconnectingOptions } from 'reconnecting-websocket';
/**
 * Configuration object for a TLNetwork instance
 */
export interface TLNetworkConfig {
    /**
     * Protocol for communicating with a relay server
     */
    protocol?: string;
    /**
     * Host of a relay server
     */
    host?: string;
    /**
     * Port for communication
     */
    port?: number;
    /**
     * Base path for the relay api
     */
    path?: string;
    /**
     * Protocol for WebSockets
     */
    wsProtocol?: string;
    /**
     * Web3 provider
     */
    web3Provider?: any;
    /**
     * Full URL for relay rest api
     */
    relayApiUrl?: string;
    /**
     * Full URL for relay WebSocket api
     */
    relayWsApiUrl?: string;
    /**
     * Wallet type to use, either "WalletTypeEthers" or "WalletTypeIdentity".
     */
    walletType?: string;
    /**
     * Address of the identity factory
     */
    identityFactoryAddress?: string;
    /**
     * Address of the implementation of the identity contract
     */
    identityImplementationAddress?: string;
}
/**
 * For internal use of `prepareContractTransaction` and `prepareValueTransaction`.
 */
export interface TxOptionsInternal {
    value?: BigNumber;
    gasPrice?: BigNumber;
    gasLimit?: BigNumber;
    delegationFees?: string;
    currencyNetworkOfFees?: string;
}
export interface TxOptions {
    value?: string;
    gasPrice?: string;
    gasLimit?: string;
}
export declare type TLOptions = TxOptions & DecimalsOptions;
export interface PaymentOptions extends TLOptions {
    maximumHops?: number;
    maximumFees?: number;
    feePayer?: FeePayer;
    extraData?: string;
}
export interface TrustlineUpdateOptions extends TLOptions {
    interestRateGiven?: number;
    interestRateReceived?: number;
    isFrozen?: boolean;
}
export interface AmountInternal {
    raw: BigNumber;
    value: BigNumber;
    decimals: number;
}
export interface Amount {
    raw: string;
    value: string;
    decimals: number;
}
export interface EventFilterOptions {
    type?: string;
    fromBlock?: number;
}
export interface BlockchainEvent {
    type: string;
    timestamp: number;
    blockNumber: number;
    status: string;
    transactionId: string;
}
export interface TLEvent extends BlockchainEvent {
    from: string;
    to: string;
    direction: string;
    counterParty: string;
    user: string;
}
export interface NetworkEvent extends TLEvent {
    networkAddress: string;
}
export interface NetworkTransferEventRaw extends NetworkEvent {
    amount: string;
    extraData: string;
}
export interface NetworkTransferEvent extends NetworkEvent {
    amount: Amount;
    extraData: string;
}
export interface NetworkTrustlineEventRaw extends NetworkEvent {
    given: string;
    received: string;
    interestRateGiven: string;
    interestRateReceived: string;
    isFrozen: boolean;
}
export interface NetworkTrustlineEvent extends NetworkEvent {
    given: Amount;
    received: Amount;
    interestRateGiven: Amount;
    interestRateReceived: Amount;
    isFrozen: boolean;
}
export declare type NetworkTrustlineCancelEventRaw = NetworkEvent;
export declare type NetworkTrustlineCancelEvent = NetworkEvent;
export declare type AnyNetworkEvent = NetworkTransferEvent | NetworkTrustlineEvent | NetworkTrustlineCancelEvent;
export declare type AnyNetworkEventRaw = NetworkTransferEventRaw | NetworkTrustlineEventRaw | NetworkTrustlineCancelEventRaw;
export interface TokenEvent extends TLEvent {
    tokenAddress: string;
}
export interface TokenAmountEventRaw extends TokenEvent {
    amount: string;
}
export interface TokenAmountEvent extends TokenEvent {
    amount: Amount;
}
export declare type AnyTokenEvent = TokenAmountEvent;
export declare type AnyTokenEventRaw = TokenAmountEventRaw;
interface Message {
    type: string;
    from: string;
    to: string;
    direction: Direction;
}
export interface PaymentRequestMessage extends Message {
    networkAddress: string;
    subject?: string;
    nonce: number;
    amount: Amount;
    counterParty: string;
    user: string;
}
export interface UsernameMessage extends Message {
    username: string;
}
export declare type Direction = 'sent' | 'received';
export interface ExchangeEvent extends TLEvent {
    exchangeAddress: string;
    makerTokenAddress: string;
    takerTokenAddress: string;
    orderHash: string;
}
export interface ExchangeFillEventRaw extends ExchangeEvent {
    filledMakerAmount: string;
    filledTakerAmount: string;
}
export interface ExchangeFillEvent extends ExchangeEvent {
    filledMakerAmount: Amount;
    filledTakerAmount: Amount;
}
export interface ExchangeCancelEventRaw extends ExchangeEvent {
    cancelledMakerAmount: string;
    cancelledTakerAmount: string;
}
export interface ExchangeCancelEvent extends ExchangeEvent {
    cancelledMakerAmount: Amount;
    cancelledTakerAmount: Amount;
}
export declare type AnyExchangeEvent = ExchangeFillEvent | ExchangeCancelEvent;
export declare type AnyExchangeEventRaw = ExchangeFillEventRaw | ExchangeCancelEventRaw;
export declare type AnyEvent = AnyNetworkEvent | AnyTokenEvent | AnyExchangeEvent;
export declare type AnyEventRaw = AnyNetworkEventRaw | AnyTokenEventRaw | AnyExchangeEventRaw;
export declare type AmountEventRaw = NetworkTransferEventRaw | TokenAmountEventRaw;
export interface TxObject {
    rawTx: RawTxObject;
    ethFees: Amount;
    delegationFees?: DelegationFeesObject;
}
export interface TxObjectInternal {
    rawTx: RawTxObject;
    ethFees: AmountInternal;
    delegationFees: DelegationFeesInternal;
}
export interface RawTxObject {
    from: string;
    to?: string;
    value?: number | string | BigNumber;
    gasLimit?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber;
    data?: string;
    nonce?: number;
    delegationFees?: number | string | BigNumber;
    currencyNetworkOfFees?: string;
}
export interface MetaTransaction {
    extraData: string;
    from: string;
    to: string;
    value: string;
    data: string;
    delegationFees: string;
    currencyNetworkOfFees: string;
    nonce: string;
    signature?: string;
}
export interface MetaTransactionFees {
    delegationFees: string;
    currencyNetworkOfFees: string;
}
export interface Web3TxReceipt {
    status: boolean;
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs: Web3Log[];
}
export interface Web3Log {
    address: string;
    data: string;
    topics: string[];
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
}
/**
 * Information for creating an ethereum transaction of a given user address
 * as returned by the relay server.
 */
export interface TxInfosRaw {
    /**
     * Amount of ETH in gwei for every unit of gas user is willing to pay
     */
    gasPrice: string;
    /**
     * Balance of given user address in ETH
     */
    balance: string;
    /**
     * Transaction count of given user address
     */
    nonce: number;
}
export interface TxInfos {
    /**
     * Amount of ETH in gwei for every unit of gas user is willing to pay
     */
    gasPrice: BigNumber;
    /**
     * Balance of given user address in ETH
     */
    balance: BigNumber;
    /**
     * Transaction count of given user address
     */
    nonce: number;
}
export interface DelegationFeesObject {
    raw: string;
    value: string;
    decimals: number;
    currencyNetworkOfFees: string;
}
export interface DelegationFeesInternal {
    raw: BigNumber;
    value: BigNumber;
    decimals: number;
    currencyNetworkOfFees: string;
}
export interface PaymentTxObject extends TxObject {
    path: string[];
    feePayer: FeePayer;
    maxFees: Amount;
}
export declare enum FeePayer {
    Sender = "sender",
    Receiver = "receiver"
}
export declare function isFeePayerValue(feePayer: string): boolean;
export interface PathObject {
    path: string[];
    feePayer: FeePayer;
    maxFees: Amount;
    isNetwork?: boolean;
}
export interface PathRaw {
    path: string[];
    feePayer: string;
    fees: string;
    estimatedGas: number;
}
export interface Network {
    name: string;
    abbreviation: string;
    address: string;
}
export interface NetworkDetails extends Network {
    decimals: number;
    numUsers: number;
    defaultInterestRate: Amount;
    interestRateDecimals: number;
    customInterests: boolean;
    preventMediatorInterests: boolean;
    isFrozen: boolean;
}
export interface NetworkDetailsRaw extends Network {
    decimals: number;
    numUsers: number;
    defaultInterestRate: string;
    interestRateDecimals: number;
    customInterests: boolean;
    preventMediatorInterests: boolean;
    isFrozen: boolean;
}
export interface UserOverview {
    balance: Amount;
    frozenBalance: Amount;
    given: Amount;
    received: Amount;
    leftGiven: Amount;
    leftReceived: Amount;
}
export interface UserOverviewRaw {
    leftReceived: string;
    balance: string;
    frozenBalance: string;
    given: string;
    received: string;
    leftGiven: string;
}
export interface DecimalsOptions {
    networkDecimals?: number;
    interestRateDecimals?: number;
}
export interface DecimalsObject {
    networkDecimals: number;
    interestRateDecimals: number;
}
export interface DecimalsMap {
    [networkAddress: string]: DecimalsObject;
}
export interface DeployIdentityResponse {
    identity: string;
    nextNonce: number;
    balance: string;
}
export interface Signature {
    ecSignature: ECSignature;
    concatSig: string;
}
export declare type WalletTypeEthers = 'ethers';
export declare type WalletTypeIdentity = 'identity';
export declare type WalletType = WalletTypeEthers | WalletTypeIdentity;
export interface TLWalletData {
    version: number;
    type: WalletType;
    address: string;
    meta?: any;
}
export interface SigningKey {
    privateKey: string;
    mnemonic: string;
}
export interface TLWalletDataMeta {
    signingKey: SigningKey;
}
export interface EthersWalletData extends TLWalletData {
    type: WalletTypeEthers;
    meta: TLWalletDataMeta;
}
export interface IdentityWalletData extends TLWalletData {
    type: WalletTypeIdentity;
    meta: TLWalletDataMeta;
}
export interface TrustlineObject {
    id: string;
    address: string;
    balance: Amount;
    given: Amount;
    received: Amount;
    leftGiven: Amount;
    leftReceived: Amount;
    interestRateGiven: Amount;
    interestRateReceived: Amount;
    isFrozen: boolean;
    currencyNetwork: string;
}
export interface TrustlineRaw {
    id: string;
    address: string;
    balance: string;
    given: string;
    received: string;
    leftGiven: string;
    leftReceived: string;
    interestRateGiven: string;
    interestRateReceived: string;
    isFrozen: boolean;
    currencyNetwork: string;
}
/**
 * Path object for closing a trustline.
 * Contains all relevant information for closing a trustline.
 */
export interface ClosePathObject {
    /**
     * Close path for triangulation
     */
    path: string[];
    /**
     * Payer of thee for the closing transaction
     */
    feePayer: FeePayer;
    /**
     * Maximal fees that can occur for closing
     */
    maxFees: Amount;
    /**
     * Estimated value to be transferred for closing
     */
    value: Amount;
}
export interface ClosePathRaw {
    path: string[];
    feePayer: string;
    fees: string;
    value: string;
}
export interface CloseTxObject extends TxObject {
    path: string[];
    maxFees: Amount;
}
export interface AccruedInterestsRaw {
    value: string;
    interestRate: string;
    timestamp: number;
}
export interface AccruedInterestsObject {
    value: Amount;
    interestRate: Amount;
    timestamp: number;
}
export interface TrustlineAccruedInterestsRaw {
    accruedInterests: AccruedInterestsRaw[];
    user: string;
    counterparty: string;
}
export interface TrustlineAccruedInterestsObject {
    accruedInterests: AccruedInterestsObject[];
    user: string;
    counterparty: string;
}
export declare type UserAccruedInterestsRaw = TrustlineAccruedInterestsRaw[];
export declare type UserAccruedInterestsObject = TrustlineAccruedInterestsObject[];
export interface Order {
    maker: string;
    taker: string;
    makerFee: Amount;
    takerFee: Amount;
    makerTokenAmount: Amount;
    takerTokenAmount: Amount;
    makerTokenAddress: string;
    takerTokenAddress: string;
    salt: string;
    exchangeContractAddress: string;
    feeRecipient: string;
    expirationUnixTimestampSec: string;
    hash: string;
    filledMakerTokenAmount: Amount;
    filledTakerTokenAmount: Amount;
    cancelledMakerTokenAmount: Amount;
    cancelledTakerTokenAmount: Amount;
    availableMakerTokenAmount: Amount;
    availableTakerTokenAmount: Amount;
}
/**
 * Order object as returned by relay
 */
export interface OrderRaw {
    maker: string;
    taker: string;
    makerFee: string;
    takerFee: string;
    makerTokenAmount: string;
    takerTokenAmount: string;
    makerTokenAddress: string;
    takerTokenAddress: string;
    salt: string;
    exchangeContractAddress: string;
    feeRecipient: string;
    expirationUnixTimestampSec: string;
    filledMakerTokenAmount: string;
    filledTakerTokenAmount: string;
    cancelledMakerTokenAmount: string;
    cancelledTakerTokenAmount: string;
    availableMakerTokenAmount: string;
    availableTakerTokenAmount: string;
}
export interface Orderbook {
    asks: SignedOrder[];
    bids: SignedOrder[];
}
export interface OrderbookRaw {
    asks: SignedOrderRaw[];
    bids: SignedOrderRaw[];
}
export interface SignedOrder extends Order {
    ecSignature: ECSignature;
}
export interface SignedOrderRaw extends OrderRaw {
    ecSignature: ECSignature;
}
export interface ECSignature {
    v: number;
    r: string;
    s: string;
}
export declare type AnyOrder = Order | OrderRaw | SignedOrder | SignedOrderRaw;
export interface FeesRequest {
    exchangeContractAddress: string;
    expirationUnixTimestampSec: BigNumber;
    maker: string;
    makerTokenAddress: string;
    makerTokenAmount: BigNumber;
    salt: BigNumber;
    taker: string;
    takerTokenAddress: string;
    takerTokenAmount: BigNumber;
}
export interface FeesResponse {
    feeRecipient: string;
    makerFee: BigNumber;
    takerFee: BigNumber;
}
export interface ExchangeOptions {
    makerTokenDecimals?: number;
    takerTokenDecimals?: number;
    expirationUnixTimestampSec?: number;
}
export declare type ExchangeTxOptions = TxOptions & ExchangeOptions;
export interface OrderbookOptions {
    baseTokenDecimals?: number;
    quoteTokenDecimals?: number;
}
export interface ExchangeTx extends TxObject {
    makerMaxFees: Amount;
    makerPath: string[];
    takerMaxFees: Amount;
    takerPath: string[];
}
export interface OrderOptions {
    makerTokenDecimals?: number;
    takerTokenDecimals?: number;
}
export interface OrdersQuery {
    exchangeContractAddress?: string;
    tokenAddress?: string;
    makerTokenAddress?: string;
    takerTokenAddress?: string;
    trader?: string;
    maker?: string;
    taker?: string;
    feeRecipient?: string;
}
export declare type ReconnectingWSOptions = ReconnectingOptions & {
    reconnectOnError?: boolean;
};
export {};