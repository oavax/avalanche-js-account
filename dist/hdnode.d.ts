/**
 * @packageDocumentation
 * @module avalanche-account
 */
/// <reference types="bn.js" />
import { BN, Signature } from 'avalanche-js-crypto';
import { ChainID, ChainType } from 'avalanche-js-utils';
import { Messenger, HttpProvider, WSProvider } from 'avalanche-js-network';
import { TransasctionReceipt } from 'avalanche-js-transaction';
import { Account } from './account';
/** @hidden */
export interface WalletsInterfaces {
    [key: string]: Account;
}
/** @hidden */
export interface Web3TxPrams {
    id?: string;
    from?: string;
    to?: string;
    nonce?: number | string;
    gasLimit?: BN | number | string;
    gasPrice?: BN | number | string;
    shardID?: number | string;
    toShardID?: number | string;
    data?: string;
    value?: BN;
    chainId?: number;
    rawTransaction?: string;
    unsignedRawTransaction?: string;
    signature?: Signature | string;
    receipt?: TransasctionReceipt;
}
export declare class HDNode {
    static isValidMnemonic(phrase: string): boolean;
    static generateMnemonic(): string;
    provider: HttpProvider | WSProvider;
    gasLimit: string;
    gasPrice: string;
    messenger: Messenger;
    /** @hidden */
    private shardID;
    /** @hidden */
    private hdwallet;
    /** @hidden */
    private path;
    /** @hidden */
    private index;
    /** @hidden */
    private addressCount;
    /** @hidden */
    private addresses;
    /** @hidden */
    private wallets;
    constructor(provider?: string | HttpProvider | WSProvider, menmonic?: string, index?: number, addressCount?: number, shardID?: number, chainType?: ChainType, chainId?: ChainID, gasLimit?: string, gasPrice?: string);
    normalizePrivateKeys(mnemonic: string | string[]): false | string[];
    setProvider(provider: string | HttpProvider | WSProvider): HttpProvider | WSProvider;
    getHdWallet(mnemonic: string): void;
    getAccounts(cb?: Function): string[];
    getPrivateKey(address: string, cb?: Function): any;
    signTransaction(txParams: any | Web3TxPrams): Promise<string>;
    getAddress(idx?: number): string;
    getAddresses(): string[];
    addByPrivateKey(privateKey: string): string;
    setSigner(address: string): void;
}
