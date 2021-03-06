/**
 * @packageDocumentation
 * @module avalanche-account
 *
 */
import { EncryptOptions } from 'avalanche-js-crypto';
import { Transaction } from 'avalanche-js-transaction';
import { StakingTransaction } from 'avalanche-js-staking';
import { Messenger } from 'avalanche-js-network';
import { Shards } from './types';
export interface Balance {
    balance?: string;
    nonce?: number;
    shardID?: number;
}
declare class Account {
    /**
     * static method create account
     *
     * @example
     * ```javascript
     * const account = new Account();
     * console.log(account);
     * ```
     */
    static new(): Account;
    /**
     * Static Method: add a private key to Account
     * @param  {string} key - private Key
     *
     * @example
     * ```javascript
     * const account = new Account.add(key_1);
     * console.log(account);
     * ```
     */
    static add(key: string): Account;
    /**@hidden */
    privateKey?: string;
    /**@hidden */
    publicKey?: string;
    /**@hidden */
    address?: string;
    /**@hidden */
    balance?: string;
    /**@hidden */
    nonce?: number;
    /**@hidden */
    shardID: number;
    /**@hidden */
    shards: Shards;
    /**@hidden */
    messenger: Messenger;
    /**@hidden */
    encrypted: boolean;
    /**
     * check sum address
     *
     * @example
     * ```javascript
     * console.log(account.checksumAddress);
     * ```
     */
    get checksumAddress(): string;
    /**
     * Get bech32 Address
     *
     * @example
     * ```javascript
     * console.log(account.bech32Address);
     * ```
     */
    get bech32Address(): string;
    /**
     * get Bech32 TestNet Address
     *
     * @example
     * ```javascript
     * console.log(account.bech32TestNetAddress);
     * ```
     */
    get bech32TestNetAddress(): string;
    /**
     * get Shards number with this Account
     *
     * @example
     * ```javascript
     * console.log(account.getShardsCount);
     * ```
     */
    get getShardsCount(): number;
    /**
     * Generate an account object
     *
     * @param key import an existing privateKey, or create a random avax
     * @param messenger you can setMessage later, or set message on `new`
     *
     * @example
     * ```javascript
     * // import the Account class
     * const { Account } = require('avalanche-js-account');
     *
     * // Messenger is optional, by default, we have a defaultMessenger
     * // If you like to change, you will import related package here.
     * const { HttpProvider, Messenger } = require('avalanche-js-network');
     * const { ChainType, ChainID } = require('avalanche-js-utils');
     *
     * // create a custom messenger
     * const customMessenger = new Messenger(
     *   new HttpProvider('http://localhost:9500'),
     *   ChainType.Avalanche, // if you are connected to Avalanche's blockchain
     *   ChainID.HmyLocal, // check if the chainId is correct
     * )
     *
     * // setMessenger later
     * const randomAccount = new Account()
     * randomAccount.setMessenger(customMessenger)
     *
     * // or you can set messenger on `new`
     * const randomAccountWithCustomMessenger = new Account(undefined, customMessenger)
     *
     * // NOTED: Key with or without `0x` are accepted, makes no different
     * // NOTED: DO NOT import `mnemonic phrase` using `Account` class, use `Wallet` instead
     * const myPrivateKey = '0xe19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930'
     * const myAccountWithMyPrivateKey = new Account(myPrivateKey)
     * ```
     */
    constructor(key?: string, messenger?: Messenger);
    toFile(password: string, options?: EncryptOptions): Promise<string>;
    fromFile(keyStore: string, password: string): Promise<Account>;
    /**
     * Get the account balance
     *
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```javascript
     * account.getBalance().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    getBalance(blockNumber?: string): Promise<Balance>;
    /**
     * @function updateShards
     */
    updateBalances(blockNumber?: string): Promise<void>;
    /**
     * @function signTransaction
     */
    signTransaction(transaction: Transaction, updateNonce?: boolean, encodeMode?: string, blockNumber?: string): Promise<Transaction>;
    /**
     * This function is still in development, coming soon!
     *
     * @param staking
     * @param updateNonce
     * @param encodeMode
     * @param blockNumber
     * @param shardID
     */
    signStaking(staking: StakingTransaction, updateNonce?: boolean, encodeMode?: string, blockNumber?: string, shardID?: number): Promise<StakingTransaction>;
    /**
     * @param messenger
     *
     * @example
     * ```javascript
     * // create a custom messenger
     * const customMessenger = new Messenger(
     *   new HttpProvider('http://localhost:9500'),
     *   ChainType.Avalanche, // if you are connected to Avalanche's blockchain
     *   ChainID.HmyLocal, // check if the chainId is correct
     * )
     *
     * // to create an Account with random privateKey
     * // and you can setMessenger later
     * const randomAccount = new Account()
     * randomAccount.setMessenger(customMessenger)
     * ```
     */
    setMessenger(messenger: Messenger): void;
    /**
     * Get account address from shard ID
     * @param shardID
     *
     * @example
     * ```javascript
     * console.log(account.getAddressFromShardID(0));
     *
     * > avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7-0
     * ```
     */
    getAddressFromShardID(shardID: number): string;
    /**
     * Get all shards' addresses from the account
     *
     * @example
     * ```javascript
     * console.log(account.getAddresses());
     * ```
     */
    getAddresses(): string[];
    /**
     * Get the specific shard's balance
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```
     * account.getShardBalance().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    getShardBalance(shardID: number, blockNumber?: string): Promise<{
        address: string;
        balance: string;
        nonce: number;
    }>;
    /**
     * Get the specific shard's nonce
     *
     * @param shardID `shardID` is binding with the endpoint, IGNORE it!
     * @param blockNumber by default, it's `latest`
     *
     * @example
     * ```
     * account.getShardNonce().then((value) => {
     *   console.log(value);
     * });
     * ```
     */
    getShardNonce(shardID: number, blockNumber?: string): Promise<any>;
    /**
     * @function _new private method create Account
     * @return {Account} Account instance
     * @ignore
     */
    private _new;
    /**
     * @function _import private method import a private Key
     * @param  {string} key - private key
     * @return {Account} Account instance
     * @ignore
     */
    private _import;
}
/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 */
export { Account };
