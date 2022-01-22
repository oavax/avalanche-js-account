/**
 * @packageDocumentation
 * @module avalanche-account
 * @hidden
 */
/**
 * test type docs
 */
export declare type ShardID = string | number;
export interface BalanceObject {
    address: string;
    balance: string;
    nonce: number;
}
export declare type Shards = Map<ShardID, BalanceObject>;
