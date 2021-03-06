/**
 * @packageDocumentation
 * @module avalanche-account
 */
import { EncryptOptions } from 'avalanche-js-crypto';
import { Messenger } from 'avalanche-js-network';
import { Transaction } from 'avalanche-js-transaction';
import { StakingTransaction } from 'avalanche-js-staking';
import { Account } from './account';
declare class Wallet {
    static generateMnemonic(): string;
    /** @hidden */
    messenger: Messenger;
    /** @hidden */
    protected defaultSigner?: string;
    /**
     * @hidden
     */
    private accountMap;
    /**
     * get acounts addresses
     *
     * @return {string[]} accounts addresses
     *
     * @example
     * ```javascript
     * const wallet = new Wallet(customMessenger);
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     *
     * console.log(wallet.accounts);
     * ```
     */
    get accounts(): string[];
    /**
     * get the signer of the account, by default, using the first account
     *
     * @example
     * ```javascript
     * const wallet = new Wallet(customMessenger);
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     *
     * console.log(wallet.signer)
     * ```
     */
    get signer(): Account | undefined;
    /**
     * @example
     * ```
     * const { Wallet } = require('avalanche-js-account');
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
     * const wallet = new Wallet(customMessenger);
     * ```
     */
    constructor(messenger?: Messenger);
    /**
     * @function newMnemonic
     * @memberof Wallet
     * @return {string} Mnemonics
     */
    newMnemonic(): string;
    /**
     * Add account using Mnemonic phrases
     * @param  {string} phrase - Mnemonic phrase
     * @param  {index} index - index to hdKey root
     *
     * @example
     * ```javascript
     * const mnemonic_1 = 'urge clog right example dish drill card maximum mix bachelor section select';
     * const wallet = new Wallet(customMessenger);
     * wallet.addByMnemonic(mnemonic_1);
     *
     * console.log(wallet.accounts);
     * ```
     */
    addByMnemonic(phrase: string, index?: number): Account;
    /**
     * Add an account using privateKey
     *
     * @param  {string} privateKey - privateKey to add
     * @return {Account} return added Account
     *
     * @example
     * ```javascript
     * const wallet = new Wallet(customMessenger);
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * console.log(wallet.addByPrivateKey(key_1));
     * ```
     */
    addByPrivateKey(privateKey: string): Account;
    /**
     * Add an account using privateKey
     * @param  {string} keyStore - keystore jsonString to add
     * @param  {string} password - password to decrypt the file
     * @return {Account} return added Account
     */
    addByKeyStore(keyStore: string, password: string): Promise<Account>;
    /**
     * create a new account using Mnemonic
     * @return {Account} {description}
     *
     * @example
     * ```javascript
     * console.log(wallet.accounts);
     * wallet.createAccount();
     * wallet.createAccount();
     *
     * console.log(wallet.accounts);
     * ````
     */
    createAccount(password?: string, options?: EncryptOptions): Promise<Account>;
    /**
     * To encrypt an account that lives in the wallet.
     * if encrypted, returns original avax, if not found, throw error
     * @param {string} address - address in accounts
     * @param {string} password - string that used to encrypt
     * @param {EncryptOptions} options - encryption options
     * @return {Promise<Account>}
     *
     * @example
     * ```javascript
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * wallet.encryptAccount('avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345').then((value) => {
     *   console.log(value);
     * })
     * ```
     */
    encryptAccount(address: string, password: string, options?: EncryptOptions): Promise<Account>;
    /**
     * To decrypt an account that lives in the wallet,if not encrypted, return original,
     * if not found, throw error
     * @param {string} address - address in accounts
     * @param {string} password - string that used to encrypt
     * @return {Promise<Account>}
     *
     * @example
     * ```javascript
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * wallet.encryptAccount('avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345')
     * .then(() => {
     *   wallet.decryptAccount('avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', '12345')
     *   .then((value) =>{
     *      console.log(value);
     *   });
     * });
     * ```
     */
    decryptAccount(address: string, password: string): Promise<Account>;
    /**
     * Get Account instance using address as param
     * @param  {string} address - address hex
     * @return {Account} Account instance which lives in Wallet
     *
     * @example
     * ```
     * const key_1 = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e';
     * wallet.addByPrivateKey(key_1);
     * console.log(wallet.getAccount('avax103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7'));
     * ```
     */
    getAccount(address: string): Account | undefined;
    /**
     * @function removeAccount
     * @memberof Wallet
     * @description remove Account using address as param
     * @param  {string} address: - address hex
     */
    removeAccount(address: string): void;
    /**
     * Set Customer Messenage
     * @param messenger
     *
     * @example
     * ```javascript
     * const customMessenger = new Messenger(
     *   new HttpProvider('https://api.s0.b.hmny.io'),
     *   ChainType.Avalanche, // if you are connected to Avalanche's blockchain
     *   ChainID.HmyLocal, // check if the chainId is correct
     * )
     * const wallet = new Wallet();
     * wallet.setMessenger(customMessenger);
     * console.log(wallet.messenger);
     * ```
     */
    setMessenger(messenger: Messenger): void;
    /**
     * Set signer
     *
     * @param address avax of the address in the accounts
     */
    setSigner(address: string): void;
    signTransaction(transaction: Transaction, account?: Account | undefined, password?: string | undefined, updateNonce?: boolean, encodeMode?: string, blockNumber?: string): Promise<Transaction>;
    signStaking(staking: StakingTransaction, account?: Account | undefined, password?: string | undefined, updateNonce?: boolean, encodeMode?: string, blockNumber?: string, shardID?: number): Promise<StakingTransaction>;
    /**
     * @function isValidMnemonic
     * @memberof Wallet
     * @description check if Mnemonic is valid
     * @param  {string} phrase - Mnemonic phrase
     * @return {boolean}
     * @ignore
     */
    private isValidMnemonic;
}
export { Wallet };
