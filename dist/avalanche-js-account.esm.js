import _regeneratorRuntime from 'regenerator-runtime';
import { generatePrivateKey, getPubkeyFromPrivateKey, getAddressFromPrivateKey, getAddress, decrypt, encrypt, bip39, hdkey } from 'avalanche-js-crypto';
import { ChainType, ChainID, isPrivateKey, add0xToString, AddressSuffix, hexToNumber, isAddress, isHttp, isWs, HDPath, Unit, isHex } from 'avalanche-js-utils';
import { RLPSign, Transaction, TxStatus } from 'avalanche-js-transaction';
import { Messenger, HttpProvider, RPCMethod, WSProvider } from 'avalanche-js-network';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * @packageDocumentation
 * @module avalanche-account
 * @hidden
 */
var defaultMessenger = /*#__PURE__*/new Messenger( /*#__PURE__*/new HttpProvider('http://localhost:9500'), ChainType.Avalanche, ChainID.HmyLocal);

var Account = /*#__PURE__*/function () {
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
  function Account(key, messenger) {
    if (messenger === void 0) {
      messenger = defaultMessenger;
    }

    /**@hidden */
    this.balance = '0';
    /**@hidden */

    this.nonce = 0;
    /**@hidden */

    this.encrypted = false;
    this.messenger = messenger;

    if (!key) {
      this._new();
    } else {
      this._import(key);
    }

    this.shardID = this.messenger.currentShard || 0;
    this.shards = new Map();
    this.shards.set(this.shardID, {
      address: "" + this.bech32Address + AddressSuffix + "0",
      balance: this.balance || '0',
      nonce: this.nonce || 0
    });
  }
  /**
   * static method create account
   *
   * @example
   * ```javascript
   * const account = new Account();
   * console.log(account);
   * ```
   */


  Account["new"] = function _new() {
    var newAcc = new Account()._new();

    return newAcc;
  }
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
  ;

  Account.add = function add(key) {
    var newAcc = new Account()._import(key);

    return newAcc;
  }
  /**
   * check sum address
   *
   * @example
   * ```javascript
   * console.log(account.checksumAddress);
   * ```
   */
  ;

  var _proto = Account.prototype;

  _proto.toFile = /*#__PURE__*/function () {
    var _toFile = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(password, options) {
      var file;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(this.privateKey && isPrivateKey(this.privateKey))) {
                _context.next = 9;
                break;
              }

              _context.next = 3;
              return encrypt(this.privateKey, password, options);

            case 3:
              file = _context.sent;
              this.privateKey = file;
              this.encrypted = true;
              return _context.abrupt("return", file);

            case 9:
              throw new Error('Encryption failed because PrivateKey is not correct');

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function toFile(_x, _x2) {
      return _toFile.apply(this, arguments);
    }

    return toFile;
  }();

  _proto.fromFile = /*#__PURE__*/function () {
    var _fromFile = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(keyStore, password) {
      var file, decyptedPrivateKey;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (!(typeof password !== 'string')) {
                _context2.next = 3;
                break;
              }

              throw new Error('you must provide password');

            case 3:
              file = JSON.parse(keyStore.toLowerCase());
              _context2.next = 6;
              return decrypt(file, password);

            case 6:
              decyptedPrivateKey = _context2.sent;

              if (!isPrivateKey(decyptedPrivateKey)) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", this._import(decyptedPrivateKey));

            case 11:
              throw new Error('decrypted failed');

            case 12:
              _context2.next = 17;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](0);
              throw _context2.t0;

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 14]]);
    }));

    function fromFile(_x3, _x4) {
      return _fromFile.apply(this, arguments);
    }

    return fromFile;
  }()
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
  ;

  _proto.getBalance =
  /*#__PURE__*/
  function () {
    var _getBalance = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(blockNumber) {
      var balance, nonce;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              _context3.prev = 1;

              if (!this.messenger) {
                _context3.next = 18;
                break;
              }

              _context3.next = 5;
              return this.messenger.send(RPCMethod.GetBalance, [this.address, blockNumber], this.messenger.chainPrefix, this.messenger.currentShard || 0);

            case 5:
              balance = _context3.sent;
              _context3.next = 8;
              return this.messenger.send(RPCMethod.GetTransactionCount, [this.address, blockNumber], this.messenger.chainPrefix, this.messenger.currentShard || 0);

            case 8:
              nonce = _context3.sent;

              if (!balance.isError()) {
                _context3.next = 11;
                break;
              }

              throw balance.error.message;

            case 11:
              if (!nonce.isError()) {
                _context3.next = 13;
                break;
              }

              throw nonce.error.message;

            case 13:
              this.balance = hexToNumber(balance.result);
              this.nonce = Number.parseInt(hexToNumber(nonce.result), 10);
              this.shardID = this.messenger.currentShard || 0;
              _context3.next = 19;
              break;

            case 18:
              throw new Error('No Messenger found');

            case 19:
              return _context3.abrupt("return", {
                balance: this.balance,
                nonce: this.nonce,
                shardID: this.shardID
              });

            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3["catch"](1);
              throw _context3.t0;

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[1, 22]]);
    }));

    function getBalance(_x5) {
      return _getBalance.apply(this, arguments);
    }

    return getBalance;
  }()
  /**
   * @function updateShards
   */
  ;

  _proto.updateBalances =
  /*#__PURE__*/
  function () {
    var _updateBalances = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(blockNumber) {
      var shardProviders, _iterator, _step, _step$value, name, val, balanceObject, currentShard;

      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              // this.messenger.setShardingProviders();
              shardProviders = this.messenger.shardProviders;

              if (!(shardProviders.size > 1)) {
                _context4.next = 15;
                break;
              }

              _iterator = _createForOfIteratorHelperLoose(shardProviders);

            case 4:
              if ((_step = _iterator()).done) {
                _context4.next = 13;
                break;
              }

              _step$value = _step.value, name = _step$value[0], val = _step$value[1];
              _context4.next = 8;
              return this.getShardBalance(val.shardID, blockNumber);

            case 8:
              balanceObject = _context4.sent;
              _context4.next = 11;
              return this.shards.set(name === val.shardID ? name : val.shardID, balanceObject);

            case 11:
              _context4.next = 4;
              break;

            case 13:
              _context4.next = 19;
              break;

            case 15:
              _context4.next = 17;
              return this.getShardBalance(this.messenger.currentShard || 0, blockNumber);

            case 17:
              currentShard = _context4.sent;
              this.shards.set(this.messenger.currentShard || 0, currentShard);

            case 19:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function updateBalances(_x6) {
      return _updateBalances.apply(this, arguments);
    }

    return updateBalances;
  }()
  /**
   * @function signTransaction
   */
  ;

  _proto.signTransaction =
  /*#__PURE__*/
  function () {
    var _signTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(transaction, updateNonce, encodeMode, blockNumber) {
      var _this = this;

      var txShardID, shardNonce, _RLPSign, signature, rawTransaction;

      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (updateNonce === void 0) {
                updateNonce = true;
              }

              if (encodeMode === void 0) {
                encodeMode = 'rlp';
              }

              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              if (!(!this.privateKey || !isPrivateKey(this.privateKey))) {
                _context5.next = 5;
                break;
              }

              throw new Error(this.privateKey + " is not found or not correct");

            case 5:
              if (!updateNonce) {
                _context5.next = 11;
                break;
              }

              // await this.updateBalances(blockNumber);
              txShardID = transaction.txParams.shardID;
              _context5.next = 9;
              return this.getShardNonce(typeof txShardID === 'string' ? Number.parseInt(txShardID, 10) : txShardID, blockNumber);

            case 9:
              shardNonce = _context5.sent;
              transaction.setParams(_extends({}, transaction.txParams, {
                from: this.messenger.chainPrefix === ChainType.Avalanche ? this.bech32Address : this.checksumAddress || '0x',
                nonce: shardNonce
              }));

            case 11:
              if (!(encodeMode === 'rlp')) {
                _context5.next = 16;
                break;
              }

              _RLPSign = RLPSign(transaction, this.privateKey), signature = _RLPSign[0], rawTransaction = _RLPSign[1];
              return _context5.abrupt("return", transaction.map(function (obj) {
                return _extends({}, obj, {
                  signature: signature,
                  rawTransaction: rawTransaction,
                  from: _this.messenger.chainPrefix === ChainType.Avalanche ? _this.bech32Address : _this.checksumAddress || '0x'
                });
              }));

            case 16:
              return _context5.abrupt("return", transaction);

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function signTransaction(_x7, _x8, _x9, _x10) {
      return _signTransaction.apply(this, arguments);
    }

    return signTransaction;
  }()
  /**
   * This function is still in development, coming soon!
   *
   * @param staking
   * @param updateNonce
   * @param encodeMode
   * @param blockNumber
   * @param shardID
   */
  ;

  _proto.signStaking =
  /*#__PURE__*/
  function () {
    var _signStaking = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(staking, updateNonce, encodeMode, blockNumber, shardID) {
      var txShardID, shardNonce, _staking$rlpSign, signature, rawTransaction;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (updateNonce === void 0) {
                updateNonce = true;
              }

              if (encodeMode === void 0) {
                encodeMode = 'rlp';
              }

              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              if (shardID === void 0) {
                shardID = this.messenger.currentShard;
              }

              if (!(!this.privateKey || !isPrivateKey(this.privateKey))) {
                _context6.next = 6;
                break;
              }

              throw new Error(this.privateKey + " is not found or not correct");

            case 6:
              if (!updateNonce) {
                _context6.next = 13;
                break;
              }

              // await this.updateBalances(blockNumber);
              txShardID = shardID;
              _context6.next = 10;
              return this.getShardNonce(typeof txShardID === 'string' ? Number.parseInt(txShardID, 10) : txShardID, blockNumber);

            case 10:
              shardNonce = _context6.sent;
              staking.setFromAddress(this.messenger.chainPrefix === ChainType.Avalanche ? this.bech32Address : this.checksumAddress || '0x');
              staking.setNonce(shardNonce);

            case 13:
              if (!(encodeMode === 'rlp')) {
                _context6.next = 21;
                break;
              }

              _staking$rlpSign = staking.rlpSign(this.privateKey), signature = _staking$rlpSign[0], rawTransaction = _staking$rlpSign[1];
              staking.setRawTransaction(rawTransaction);
              staking.setSignature(signature);
              staking.setFromAddress(this.messenger.chainPrefix === ChainType.Avalanche ? this.bech32Address : this.checksumAddress || '0x');
              return _context6.abrupt("return", staking);

            case 21:
              return _context6.abrupt("return", staking);

            case 22:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function signStaking(_x11, _x12, _x13, _x14, _x15) {
      return _signStaking.apply(this, arguments);
    }

    return signStaking;
  }()
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
  ;

  _proto.setMessenger = function setMessenger(messenger) {
    this.messenger = messenger;
  }
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
  ;

  _proto.getAddressFromShardID = function getAddressFromShardID(shardID) {
    var shardObject = this.shards.get(shardID);

    if (shardObject) {
      return shardObject.address;
    } else {
      return undefined;
    }
  }
  /**
   * Get all shards' addresses from the account
   *
   * @example
   * ```javascript
   * console.log(account.getAddresses());
   * ```
   */
  ;

  _proto.getAddresses = function getAddresses() {
    var addressArray = [];

    for (var _iterator2 = _createForOfIteratorHelperLoose(this.shards), _step2; !(_step2 = _iterator2()).done;) {
      var _step2$value = _step2.value,
          name = _step2$value[0],
          val = _step2$value[1];
      var index = typeof name === 'string' ? Number.parseInt(name, 10) : name;
      addressArray[index] = val.address;
    }

    return addressArray;
  }
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
  ;

  _proto.getShardBalance =
  /*#__PURE__*/
  function () {
    var _getShardBalance = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(shardID, blockNumber) {
      var balance, nonce;
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              _context7.next = 3;
              return this.messenger.send(RPCMethod.GetBalance, [this.address, blockNumber], this.messenger.chainPrefix, shardID);

            case 3:
              balance = _context7.sent;
              _context7.next = 6;
              return this.messenger.send(RPCMethod.GetTransactionCount, [this.address, blockNumber], this.messenger.chainPrefix, shardID);

            case 6:
              nonce = _context7.sent;

              if (!balance.isError()) {
                _context7.next = 9;
                break;
              }

              throw balance.error.message;

            case 9:
              if (!nonce.isError()) {
                _context7.next = 11;
                break;
              }

              throw nonce.error.message;

            case 11:
              return _context7.abrupt("return", {
                address: "" + this.bech32Address + AddressSuffix + shardID,
                balance: hexToNumber(balance.result),
                nonce: Number.parseInt(hexToNumber(nonce.result), 10)
              });

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function getShardBalance(_x16, _x17) {
      return _getShardBalance.apply(this, arguments);
    }

    return getShardBalance;
  }()
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
  ;

  _proto.getShardNonce =
  /*#__PURE__*/
  function () {
    var _getShardNonce = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(shardID, blockNumber) {
      var nonce;
      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              _context8.next = 3;
              return this.messenger.send(RPCMethod.GetAccountNonce, [this.address, blockNumber], this.messenger.chainPrefix, shardID);

            case 3:
              nonce = _context8.sent;

              if (!nonce.isError()) {
                _context8.next = 6;
                break;
              }

              throw nonce.error.message;

            case 6:
              return _context8.abrupt("return", nonce.result);

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function getShardNonce(_x18, _x19) {
      return _getShardNonce.apply(this, arguments);
    }

    return getShardNonce;
  }()
  /**
   * @function _new private method create Account
   * @return {Account} Account instance
   * @ignore
   */
  ;

  _proto._new = function _new() {
    var prv = generatePrivateKey();

    if (!isPrivateKey(prv)) {
      throw new Error('key gen failed');
    }

    return this._import(prv);
  }
  /**
   * @function _import private method import a private Key
   * @param  {string} key - private key
   * @return {Account} Account instance
   * @ignore
   */
  ;

  _proto._import = function _import(key) {
    if (!isPrivateKey(key)) {
      throw new Error(key + " is not PrivateKey");
    }

    this.privateKey = add0xToString(key);
    this.publicKey = getPubkeyFromPrivateKey(this.privateKey);
    this.address = getAddressFromPrivateKey(this.privateKey);
    this.shardID = this.messenger.currentShard || 0;
    this.shards = new Map();
    this.shards.set(this.shardID, {
      address: "" + this.bech32Address + AddressSuffix + "0",
      balance: this.balance || '0',
      nonce: this.nonce || 0
    });
    this.encrypted = false;
    return this;
  };

  _createClass(Account, [{
    key: "checksumAddress",
    get: function get() {
      return this.address ? getAddress(this.address).checksum : '';
    }
    /**
     * Get bech32 Address
     *
     * @example
     * ```javascript
     * console.log(account.bech32Address);
     * ```
     */

  }, {
    key: "bech32Address",
    get: function get() {
      return this.address ? getAddress(this.address).bech32 : '';
    }
    /**
     * get Bech32 TestNet Address
     *
     * @example
     * ```javascript
     * console.log(account.bech32TestNetAddress);
     * ```
     */

  }, {
    key: "bech32TestNetAddress",
    get: function get() {
      return this.address ? getAddress(this.address).bech32TestNet : '';
    }
    /**
     * get Shards number with this Account
     *
     * @example
     * ```javascript
     * console.log(account.getShardsCount);
     * ```
     */

  }, {
    key: "getShardsCount",
    get: function get() {
      return this.shards.size;
    }
  }]);

  return Account;
}();

var Wallet = /*#__PURE__*/function () {
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
  function Wallet(messenger) {
    if (messenger === void 0) {
      messenger = defaultMessenger;
    }

    /**
     * @hidden
     */
    this.accountMap = new Map();
    this.messenger = messenger;
  } // static method generate Mnemonic


  Wallet.generateMnemonic = function generateMnemonic() {
    return bip39.generateMnemonic();
  }
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
  ;

  var _proto = Wallet.prototype;

  /**
   * @function newMnemonic
   * @memberof Wallet
   * @return {string} Mnemonics
   */
  _proto.newMnemonic = function newMnemonic() {
    return Wallet.generateMnemonic();
  }
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
  ;

  _proto.addByMnemonic = function addByMnemonic(phrase, index) {
    if (index === void 0) {
      index = 0;
    }

    if (!this.isValidMnemonic(phrase)) {
      throw new Error("Invalid mnemonic phrase: " + phrase);
    }

    var seed = bip39.mnemonicToSeed(phrase);
    var hdKey = hdkey.fromMasterSeed(seed); // TODO:hdkey should apply to Avalanche's settings

    var path = this.messenger.chainType === ChainType.Avalanche ? '1023' : '60';
    var childKey = hdKey.derive("m/44'/" + path + "'/0'/0/" + index);
    var privateKey = childKey.privateKey.toString('hex');
    return this.addByPrivateKey(privateKey);
  }
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
  ;

  _proto.addByPrivateKey = function addByPrivateKey(privateKey) {
    try {
      var newAcc = Account.add(privateKey);
      newAcc.setMessenger(this.messenger);

      if (newAcc.address) {
        this.accountMap.set(newAcc.address, newAcc);

        if (!this.defaultSigner) {
          this.setSigner(newAcc.address);
        }

        return newAcc;
      } else {
        throw new Error('add account failed');
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   * Add an account using privateKey
   * @param  {string} keyStore - keystore jsonString to add
   * @param  {string} password - password to decrypt the file
   * @return {Account} return added Account
   */
  ;

  _proto.addByKeyStore =
  /*#__PURE__*/
  function () {
    var _addByKeyStore = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(keyStore, password) {
      var newAcc, result;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              newAcc = new Account(undefined);
              _context.next = 4;
              return newAcc.fromFile(keyStore, password);

            case 4:
              result = _context.sent;
              result.setMessenger(this.messenger);

              if (!result.address) {
                _context.next = 12;
                break;
              }

              this.accountMap.set(result.address, result);

              if (!this.defaultSigner) {
                this.setSigner(result.address);
              }

              return _context.abrupt("return", result);

            case 12:
              throw new Error('add account failed');

            case 13:
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              throw _context.t0;

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 15]]);
    }));

    function addByKeyStore(_x, _x2) {
      return _addByKeyStore.apply(this, arguments);
    }

    return addByKeyStore;
  }()
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
  ;

  _proto.createAccount =
  /*#__PURE__*/
  function () {
    var _createAccount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(password, options) {
      var prv, acc, encrypted;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              prv = generatePrivateKey();
              acc = this.addByPrivateKey(prv);

              if (!(acc.address && password)) {
                _context2.next = 9;
                break;
              }

              _context2.next = 5;
              return this.encryptAccount(acc.address, password, options);

            case 5:
              encrypted = _context2.sent;
              return _context2.abrupt("return", encrypted);

            case 9:
              if (!(acc.address && !password)) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt("return", acc);

            case 13:
              throw new Error('create acount failed');

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function createAccount(_x3, _x4) {
      return _createAccount.apply(this, arguments);
    }

    return createAccount;
  }()
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
  ;

  _proto.encryptAccount =
  /*#__PURE__*/
  function () {
    var _encryptAccount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(address, password, options) {
      var foundAcc;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              foundAcc = this.getAccount(address);

              if (!(foundAcc && foundAcc.privateKey && isPrivateKey(foundAcc.privateKey))) {
                _context3.next = 8;
                break;
              }

              _context3.next = 5;
              return foundAcc.toFile(password, options);

            case 5:
              return _context3.abrupt("return", foundAcc);

            case 8:
              if (!(foundAcc && foundAcc.privateKey && !isPrivateKey(foundAcc.privateKey))) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("return", foundAcc);

            case 12:
              throw new Error('encrypt account failed');

            case 13:
              _context3.next = 18;
              break;

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](0);
              throw _context3.t0;

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 15]]);
    }));

    function encryptAccount(_x5, _x6, _x7) {
      return _encryptAccount.apply(this, arguments);
    }

    return encryptAccount;
  }()
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
  ;

  _proto.decryptAccount =
  /*#__PURE__*/
  function () {
    var _decryptAccount = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(address, password) {
      var foundAcc;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              foundAcc = this.getAccount(address);

              if (!(foundAcc && foundAcc.privateKey && !isPrivateKey(foundAcc.privateKey))) {
                _context4.next = 8;
                break;
              }

              _context4.next = 5;
              return foundAcc.fromFile(foundAcc.privateKey, password);

            case 5:
              return _context4.abrupt("return", foundAcc);

            case 8:
              if (!(foundAcc && foundAcc.privateKey && isPrivateKey(foundAcc.privateKey))) {
                _context4.next = 13;
                break;
              }

              foundAcc.encrypted = false;
              return _context4.abrupt("return", foundAcc);

            case 13:
              throw new Error('decrypt account failed');

            case 14:
              _context4.next = 19;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](0);
              throw _context4.t0;

            case 19:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 16]]);
    }));

    function decryptAccount(_x8, _x9) {
      return _decryptAccount.apply(this, arguments);
    }

    return decryptAccount;
  }()
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
  ;

  _proto.getAccount = function getAccount(address) {
    return this.accountMap.get(getAddress(address).basicHex);
  }
  /**
   * @function removeAccount
   * @memberof Wallet
   * @description remove Account using address as param
   * @param  {string} address: - address hex
   */
  ;

  _proto.removeAccount = function removeAccount(address) {
    this.accountMap["delete"](getAddress(address).basicHex);

    if (this.defaultSigner === address) {
      this.defaultSigner = undefined;
    }
  }
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
  ;

  _proto.setMessenger = function setMessenger(messenger) {
    this.messenger = messenger;
  }
  /**
   * Set signer
   *
   * @param address avax of the address in the accounts
   */
  ;

  _proto.setSigner = function setSigner(address) {
    if (!isAddress(address) && !this.getAccount(address)) {
      throw new Error('could not set signer');
    }

    this.defaultSigner = address;
  };

  _proto.signTransaction = /*#__PURE__*/function () {
    var _signTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(transaction, account, // tslint:disable-next-line: no-unnecessary-initializer
    password, updateNonce, encodeMode, blockNumber) {
      var toSignWith, decrypted, signed, _signed;

      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (account === void 0) {
                account = this.signer;
              }

              if (password === void 0) {
                password = undefined;
              }

              if (updateNonce === void 0) {
                updateNonce = true;
              }

              if (encodeMode === void 0) {
                encodeMode = 'rlp';
              }

              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              toSignWith = account || this.signer;

              if (toSignWith) {
                _context5.next = 8;
                break;
              }

              throw new Error('no signer found or did not provide correct account');

            case 8:
              if (!(toSignWith instanceof Account && toSignWith.encrypted && toSignWith.address)) {
                _context5.next = 28;
                break;
              }

              if (password) {
                _context5.next = 11;
                break;
              }

              throw new Error('must provide password to further execution');

            case 11:
              _context5.prev = 11;
              _context5.next = 14;
              return this.decryptAccount(toSignWith.address, password);

            case 14:
              decrypted = _context5.sent;
              _context5.next = 17;
              return decrypted.signTransaction(transaction, updateNonce, encodeMode, blockNumber);

            case 17:
              signed = _context5.sent;
              _context5.next = 20;
              return this.encryptAccount(toSignWith.address, password);

            case 20:
              return _context5.abrupt("return", signed);

            case 23:
              _context5.prev = 23;
              _context5.t0 = _context5["catch"](11);
              throw _context5.t0;

            case 26:
              _context5.next = 42;
              break;

            case 28:
              if (!(toSignWith instanceof Account && !toSignWith.encrypted && toSignWith.address)) {
                _context5.next = 41;
                break;
              }

              _context5.prev = 29;
              _context5.next = 32;
              return toSignWith.signTransaction(transaction, updateNonce, encodeMode, blockNumber);

            case 32:
              _signed = _context5.sent;
              return _context5.abrupt("return", _signed);

            case 36:
              _context5.prev = 36;
              _context5.t1 = _context5["catch"](29);
              throw _context5.t1;

            case 39:
              _context5.next = 42;
              break;

            case 41:
              throw new Error('sign transaction failed');

            case 42:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this, [[11, 23], [29, 36]]);
    }));

    function signTransaction(_x10, _x11, _x12, _x13, _x14, _x15) {
      return _signTransaction.apply(this, arguments);
    }

    return signTransaction;
  }();

  _proto.signStaking = /*#__PURE__*/function () {
    var _signStaking = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(staking, account, // tslint:disable-next-line: no-unnecessary-initializer
    password, updateNonce, encodeMode, blockNumber, shardID) {
      var toSignWith, decrypted, signed, _signed2;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (account === void 0) {
                account = this.signer;
              }

              if (password === void 0) {
                password = undefined;
              }

              if (updateNonce === void 0) {
                updateNonce = true;
              }

              if (encodeMode === void 0) {
                encodeMode = 'rlp';
              }

              if (blockNumber === void 0) {
                blockNumber = 'latest';
              }

              if (shardID === void 0) {
                shardID = this.messenger.currentShard;
              }

              toSignWith = account || this.signer;

              if (toSignWith) {
                _context6.next = 9;
                break;
              }

              throw new Error('no signer found or did not provide correct account');

            case 9:
              if (!(toSignWith instanceof Account && toSignWith.encrypted && toSignWith.address)) {
                _context6.next = 29;
                break;
              }

              if (password) {
                _context6.next = 12;
                break;
              }

              throw new Error('must provide password to further execution');

            case 12:
              _context6.prev = 12;
              _context6.next = 15;
              return this.decryptAccount(toSignWith.address, password);

            case 15:
              decrypted = _context6.sent;
              _context6.next = 18;
              return decrypted.signStaking(staking, updateNonce, encodeMode, blockNumber, shardID);

            case 18:
              signed = _context6.sent;
              _context6.next = 21;
              return this.encryptAccount(toSignWith.address, password);

            case 21:
              return _context6.abrupt("return", signed);

            case 24:
              _context6.prev = 24;
              _context6.t0 = _context6["catch"](12);
              throw _context6.t0;

            case 27:
              _context6.next = 43;
              break;

            case 29:
              if (!(toSignWith instanceof Account && !toSignWith.encrypted && toSignWith.address)) {
                _context6.next = 42;
                break;
              }

              _context6.prev = 30;
              _context6.next = 33;
              return toSignWith.signStaking(staking, updateNonce, encodeMode, blockNumber, shardID);

            case 33:
              _signed2 = _context6.sent;
              return _context6.abrupt("return", _signed2);

            case 37:
              _context6.prev = 37;
              _context6.t1 = _context6["catch"](30);
              throw _context6.t1;

            case 40:
              _context6.next = 43;
              break;

            case 42:
              throw new Error('sign transaction failed');

            case 43:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[12, 24], [30, 37]]);
    }));

    function signStaking(_x16, _x17, _x18, _x19, _x20, _x21, _x22) {
      return _signStaking.apply(this, arguments);
    }

    return signStaking;
  }()
  /**
   * @function isValidMnemonic
   * @memberof Wallet
   * @description check if Mnemonic is valid
   * @param  {string} phrase - Mnemonic phrase
   * @return {boolean}
   * @ignore
   */
  ;

  _proto.isValidMnemonic = function isValidMnemonic(phrase) {
    if (phrase.trim().split(/\s+/g).length < 12) {
      return false;
    }

    return bip39.validateMnemonic(phrase);
  };

  _createClass(Wallet, [{
    key: "accounts",
    get: function get() {
      return [].concat(this.accountMap.keys());
    }
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

  }, {
    key: "signer",
    get: function get() {
      if (this.defaultSigner) {
        return this.getAccount(this.defaultSigner);
      } else if (!this.defaultSigner && this.accounts.length > 0) {
        this.setSigner(this.accounts[0]);
        return this.getAccount(this.accounts[0]);
      } else {
        return undefined;
      }
    }
  }]);

  return Wallet;
}();

var HDNode = /*#__PURE__*/function () {
  function HDNode(provider, menmonic, index, addressCount, shardID, chainType, chainId, gasLimit, gasPrice) {
    if (provider === void 0) {
      provider = 'http://localhost:9500';
    }

    if (index === void 0) {
      index = 0;
    }

    if (addressCount === void 0) {
      addressCount = 1;
    }

    if (shardID === void 0) {
      shardID = 0;
    }

    if (chainType === void 0) {
      chainType = ChainType.Avalanche;
    }

    if (chainId === void 0) {
      chainId = ChainID.Default;
    }

    if (gasLimit === void 0) {
      gasLimit = '1000000';
    }

    if (gasPrice === void 0) {
      gasPrice = '2000000000';
    }

    this.provider = this.setProvider(provider);
    this.shardID = shardID;
    this.messenger = new Messenger(this.provider, chainType, chainId);
    this.messenger.setDefaultShardID(this.shardID);
    this.hdwallet = undefined;
    this.addresses = [];
    this.wallets = {};
    this.path = chainType === ChainType.Avalanche ? HDPath : "m/44'/60'/0'/0/";
    this.index = index;
    this.addressCount = addressCount;
    this.getHdWallet(menmonic || HDNode.generateMnemonic());
    this.gasLimit = gasLimit;
    this.gasPrice = gasPrice;
  }

  HDNode.isValidMnemonic = function isValidMnemonic(phrase) {
    if (phrase.trim().split(/\s+/g).length < 12) {
      return false;
    }

    return bip39.validateMnemonic(phrase);
  };

  HDNode.generateMnemonic = function generateMnemonic() {
    return bip39.generateMnemonic();
  };

  var _proto = HDNode.prototype;

  _proto.normalizePrivateKeys = function normalizePrivateKeys(mnemonic) {
    if (Array.isArray(mnemonic)) {
      return mnemonic;
    } else if (mnemonic && !mnemonic.includes(' ')) {
      return [mnemonic];
    } else {
      return false;
    }
  };

  _proto.setProvider = function setProvider(provider) {
    if (isHttp(provider) && typeof provider === 'string') {
      return new HttpProvider(provider);
    } else if (provider instanceof HttpProvider) {
      return provider;
    } else if (isWs(provider) && typeof provider === 'string') {
      return new WSProvider(provider);
    } else if (provider instanceof WSProvider) {
      return provider;
    } else {
      throw new Error('provider is not recognized');
    }
  };

  _proto.getHdWallet = function getHdWallet(mnemonic) {
    if (!HDNode.isValidMnemonic(mnemonic)) {
      throw new Error('Mnemonic invalid or undefined');
    }

    this.hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

    for (var i = this.index; i < this.index + this.addressCount; i++) {
      if (!this.hdwallet) {
        throw new Error('hdwallet is not found');
      }

      var childKey = this.hdwallet.derive("" + this.path + i);
      var prv = childKey.privateKey.toString('hex');
      var account = new Account(prv);
      var addr = account.checksumAddress;
      this.addresses.push(addr);
      this.wallets[addr] = account;
    }
  } // tslint:disable-next-line: ban-types
  ;

  _proto.getAccounts = function getAccounts(cb) {
    if (cb) {
      cb(null, this.addresses);
    }

    return this.addresses;
  } // tslint:disable-next-line: ban-types
  ;

  _proto.getPrivateKey = function getPrivateKey(address, cb) {
    if (!cb) {
      if (!this.wallets[address]) {
        throw new Error('Account not found');
      } else {
        return this.wallets[address].privateKey;
      }
    }

    if (!this.wallets[address]) {
      return cb('Account not found');
    } else {
      cb(null, this.wallets[address].privateKey);
    }
  } // tslint:disable-next-line: ban-types
  ;

  _proto.signTransaction =
  /*#__PURE__*/
  function () {
    var _signTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(txParams) {
      var from, accountNonce, to, gasLimit, gasPrice, value, nonce, data, prv, signerAccount, tx, signed;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              from = txParams.from ? getAddress(txParams.from).checksum : '0x';
              _context.next = 3;
              return this.messenger.send(RPCMethod.GetAccountNonce, [from, 'latest'], 'hmy', this.shardID);

            case 3:
              accountNonce = _context.sent;
              to = txParams.to ? getAddress(txParams.to).checksum : '0x';
              gasLimit = new Unit('0').asWei().toWei();

              if (txParams.gas !== undefined && isHex(txParams.gas)) {
                gasLimit = new Unit(txParams.gas).asWei().toWei().lt(new Unit(this.gasLimit).asWei().toWei()) ? new Unit(txParams.gas).asWei().toWei() : new Unit(this.gasLimit).asWei().toWei();
              }

              if (txParams.gasLimit !== undefined && isHex(txParams.gasLimit)) {
                gasLimit = new Unit(txParams.gasLimit).asWei().toWei().lt(new Unit(this.gasLimit).asWei().toWei()) ? new Unit(txParams.gasLimit).asWei().toWei() : new Unit(this.gasLimit).asWei().toWei();
              }

              gasPrice = new Unit('0').asWei().toWei();

              if (txParams.gasPrice !== undefined && isHex(txParams.gasPrice)) {
                gasPrice = new Unit(txParams.gasPrice).asWei().toWei().lt(new Unit(this.gasPrice).asWei().toWei()) ? new Unit(txParams.gasPrice).asWei().toWei() : new Unit(this.gasPrice).asWei().toWei();
              }

              value = txParams.value !== undefined && isHex(txParams.value) ? txParams.value : '0';
              nonce = txParams.nonce !== undefined && isHex(txParams.nonce) ? Number.parseInt(hexToNumber(txParams.nonce), 10) : accountNonce.result;
              data = txParams.data !== undefined && isHex(txParams.data) ? txParams.data : '0x';
              prv = this.wallets[from].privateKey;
              signerAccount = new Account(prv, this.messenger);
              tx = new Transaction(_extends({}, txParams, {
                from: from,
                to: to,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                value: value,
                nonce: nonce,
                data: data,
                shardID: this.shardID,
                chainId: this.messenger.chainId
              }), this.messenger, TxStatus.INTIALIZED);
              _context.next = 18;
              return signerAccount.signTransaction(tx);

            case 18:
              signed = _context.sent;
              return _context.abrupt("return", signed.getRawTransaction());

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function signTransaction(_x) {
      return _signTransaction.apply(this, arguments);
    }

    return signTransaction;
  }();

  _proto.getAddress = function getAddress(idx) {
    if (!idx) {
      return this.addresses[0];
    } else {
      return this.addresses[idx];
    }
  };

  _proto.getAddresses = function getAddresses() {
    return this.addresses;
  };

  _proto.addByPrivateKey = function addByPrivateKey(privateKey) {
    var account = new Account(privateKey);
    var addr = account.checksumAddress;
    this.addresses.push(addr);
    this.wallets[addr] = account;
    return addr;
  };

  _proto.setSigner = function setSigner(address) {
    var foundIndex = this.addresses.findIndex(function (value) {
      return value === address;
    });
    this.addresses.slice(foundIndex, foundIndex + 1);
    this.addresses.unshift(address);
  };

  return HDNode;
}();

export { Account, HDNode, Wallet, defaultMessenger };
//# sourceMappingURL=avalanche-js-account.esm.js.map
