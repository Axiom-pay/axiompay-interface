"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.generateKeys = generateKeys;
exports.generateMap = generateMap;
exports.view = view;
var _secp256k = require("@noble/curves/secp256k1");
var _crypto = require("crypto");
var _weierstrass = require("@noble/curves/abstract/weierstrass");
var _fs = require("fs");
var _worker_threads = require("worker_threads");
var _constant = require("./constant");
var _os = require("os");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() { } function GeneratorFunction() { } function GeneratorFunctionPrototype() { } var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a; ;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg; else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Generates a pair of private and public keys.
 *
 * @return { {privateKey: BigInt, publicKey: ProjPointType<bigint>} } An array containing the private and public keys.
 */
function generateKeys() {
  var privateKeyBytes = _secp256k.secp256k1.utils.randomPrivateKey();
  var privateKey = _secp256k.secp256k1.utils.normPrivateKeyToScalar(privateKeyBytes);
  var publicKey = _secp256k.secp256k1.ProjectivePoint.BASE.multiply(privateKey);
  return {
    privateKey: privateKey,
    publicKey: publicKey
  };
}

/**
 * Generates a map by reading data from a file or calculates a new map.
 *
 * @return {Map<String, Number>} A Map from xG -> x, a point on the secp256k1 curve to a number.
 */
function generateMap() {
  try {
    var data = (0, _fs.readFileSync)(_constant.FILENAME, 'utf-8');
    // Parse the JSON data into a map
    return new Map(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, initialize the map
      return initMap();
    }
    throw error;
  }
}

/**
 * Initializes the map by performing a series of calculations and operations.
 *
 * @return {Map<String, Number>} The initialized map.
 */
function initMap() {
  var map = new Map();
  for (var i = 1; i < 1 << _constant.MAX_SIZE / 2; i++) {
    var scalar = BigInt(i << _constant.MAX_SIZE / 2 >>> 0);
    var point = void 0;
    point = _secp256k.secp256k1.ProjectivePoint.BASE.multiply(scalar);
    map.set(point.toHex(), i);
  }
  map.set(_constant.ZERO_POINT_ENCODE, 0);
  var json_data = JSON.stringify(_toConsumableArray(map));
  (0, _fs.writeFileSync)(_constant.FILENAME, json_data);
  return map;
}

/**
 * Encodes a message using the secp256k1 algorithm.
 *
 * @param {bigint} msg - The message to be encoded.
 * @return {ProjPointType<bigint>} - The encoded message.
 */
function encode(msg) {
  return _secp256k.secp256k1.ProjectivePoint.BASE.multiply(msg);
}

/**
 * Decodes the inputPoint using the provided map.
 *
 * @param {ProjPointType<bigint>} inputPoint - The point to be decoded.
 * @param {Map<String, Number>} map - The map of high part used for decoding.
 * @return {Promise<number>} - The decoded value.
 */
function decode(_x, _x2) {
  return _decode.apply(this, arguments);
}
/**
 * Encrypts a message using a public key.
 *
 * @param {bigint} msg - The message to be encrypted.
 * @param {ProjPointType<bigint>} publicKey - The public key used for encryption.
 * @param {Number} max_k_size - The max view key size.
 * @param {bigint} [fromDecimal=18n] - The decimal of the message.
 * @param {bigint} [toDecimal=2n] - The decimal of private message.
 * @return {{c1: ProjPointType<bigint>, c2: ProjPointType<bigint>, k: BigInt}} - A tuple containing the encrypted message, ephemeral public key, and a random number.
 */
function _decode() {
  _decode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(inputPoint, map) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var numWorkers = (0, _os.cpus)().length;
            var data = inputPoint.toHex();
            var splitSize = parseInt((1 << _constant.MAX_SIZE / 2) / numWorkers);
            var workers = new Map();
            var _loop = function _loop() {
              var worker = new _worker_threads.Worker("".concat(__dirname, "/worker.js"), {
                workerData: map
              });
              workers.set(worker, true);
              worker.postMessage({
                data: data,
                map: map,
                start: i * splitSize,
                end: i === numWorkers - 1 ? 1 << _constant.MAX_SIZE / 2 : (i + 1) * splitSize
              });
              worker.once('message', function (_ref) {
                var res = _ref.res,
                  isExist = _ref.isExist;
                if (isExist) {
                  // if finally get result, then will terminate all other workers
                  workers.forEach(function (_, key) {
                    key.terminate();
                  });
                  resolve(res);
                }
                // if not find the result, then delete the worker from worker map
                workers["delete"](worker);
                // if finally the worker map is empty, which means all workers don't decode success, then return 0 
                if (workers.size === 0) {
                  resolve(0);
                }
              });
              worker.on('error', reject);
            };
            for (var i = 0; i < numWorkers; i++) {
              _loop();
            }
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _decode.apply(this, arguments);
}
function encrypt(msg, publicKey) {
  var max_k_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _constant.MAX_K_SIZE;
  var fromDecimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 18n;
  var toDecimal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2n;
  var decimal = 10n ** (fromDecimal - toDecimal);
  if (msg % decimal !== 0n) {
    throw new Error("decimal error, private message will be truncated at 10^".concat(fromDecimal - toDecimal));
  }
  msg = msg / decimal;
  if (msg > 4294967295n) {
    throw new Error("value overflow, max value is 4294967295");
  }
  var encoded = encode(msg);
  // console.log(`176, mG = `, encoded.toAffine());
  var k = BigInt((0, _crypto.randomInt)(max_k_size));
  var lhs = publicKey.multiply(k);
  // console.log(`179, kP = `, lhs.toAffine());
  return {
    c1: _secp256k.secp256k1.ProjectivePoint.BASE.multiply(k),
    c2: encoded.add(lhs),
    k: k
  };
}

/**
 * Decrypts a message using a private key.
 *
 * @param {ProjPointType<bigint>} c1 - The message to be encrypted.
 * @param {ProjPointType<bigint>} c2 - The public key used for encryption.
 * @param {BigInt} privateKey - The private key.
 * @param {Map<String, Number>} map - The map of high part used for decoding.
 * @param {bigint} [fromDecimal=18n] - The decimal of the message.
 * @param {bigint} [toDecimal=2n] - The decimal of private message.
 * @return {Promise<bigint>} - The original msg.
 */
function decrypt(_x3, _x4, _x5, _x6) {
  return _decrypt.apply(this, arguments);
}
/**
 * Decrypts a message using a view key.
 *
 * @param {ProjPointType<bigint>} c2 - The message to be encrypted.
 * @param {BigInt} viewKey - The public key used for encryption.
 * @param {ProjPointType<bigint>} publicKey - The public key.
 * @param {Map<String, Number>} map - The map of high part used for decoding.
 * @param {bigint} [fromDecimal=18n] - The decimal of the message.
 * @param {bigint} [toDecimal=2n] - The decimal of private message.
 * @return {Promise<bigint>} - The original msg.
 */
function _decrypt() {
  _decrypt = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(c1, c2, privateKey, map) {
    var fromDecimal,
      toDecimal,
      rhs,
      res,
      before,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          fromDecimal = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : 18n;
          toDecimal = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : 2n;
          rhs = c1.multiply(privateKey);
          res = c2.subtract(rhs);
          if (!res.equals(_secp256k.secp256k1.ProjectivePoint.ZERO)) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", new Promise(function (resolve) {
            resolve(0n);
          }));
        case 6:
          _context2.next = 8;
          return decode(res, map);
        case 8:
          before = _context2.sent;
          return _context2.abrupt("return", new Promise(function (resolve) {
            resolve(BigInt(before) * 10n ** (fromDecimal - toDecimal));
          }));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _decrypt.apply(this, arguments);
}
function view(_x7, _x8, _x9, _x10) {
  return _view.apply(this, arguments);
}
function _view() {
  _view = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(c2, viewKey, publicKey, map) {
    var fromDecimal,
      toDecimal,
      rhs,
      res,
      before,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          fromDecimal = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : 18n;
          toDecimal = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : 2n;
          if (!(viewKey === 0n)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", new Promise(function (resolve) {
            resolve(0n);
          }));
        case 4:
          rhs = publicKey.multiply(viewKey);
          res = c2.subtract(rhs);
          if (!res.equals(_secp256k.secp256k1.ProjectivePoint.ZERO)) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", new Promise(function (resolve) {
            resolve(0n);
          }));
        case 8:
          _context3.next = 10;
          return decode(res, map);
        case 10:
          before = _context3.sent;
          return _context3.abrupt("return", new Promise(function (resolve) {
            resolve(BigInt(before) * 10n ** (fromDecimal - toDecimal));
          }));
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _view.apply(this, arguments);
}