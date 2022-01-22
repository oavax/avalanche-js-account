/**
 * @packageDocumentation
 * @module avalanche-account
 * @hidden
 */

import { HttpProvider, Messenger } from 'avalanche-js-network';
import { ChainType, ChainID } from 'avalanche-js-utils';

export const defaultMessenger = new Messenger(
  new HttpProvider('http://localhost:9500'),
  ChainType.Avalanche,
  ChainID.HmyLocal,
);
