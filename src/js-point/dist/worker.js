"use strict";

var _weierstrass = require("@noble/curves/abstract/weierstrass");
var _secp256k = require("@noble/curves/secp256k1");
var _constant = require("./constant");
var _require = require('worker_threads'),
  parentPort = _require.parentPort,
  workerData = _require.workerData;
/**
 * Execute the subroutine work of decode between start and end.
 *
 * @param {ProjPointType<bigint>} inputPoint - The point to search for in the map.
 * @param {Map<String, Number>} map - The map to search in.
 * @param {number} start - The starting index of the search range.
 * @param {number} end - The ending index of the search range.
 * @returns {{res: number, isExist: boolean}} - the decode result
 */
var worker = function worker(inputPoint, map, start, end) {
  for (var low = start; low < end; low++) {
    var point = void 0;
    if (low === 0) {
      point = inputPoint.subtract(_secp256k.secp256k1.ProjectivePoint.ZERO);
    } else {
      var x_low = BigInt(low) % _secp256k.secp256k1.CURVE.n;
      var point_low = _secp256k.secp256k1.ProjectivePoint.BASE.multiply(x_low);
      point = inputPoint.subtract(point_low);
    }
    var encoded = void 0;
    if (point.equals(_secp256k.secp256k1.ProjectivePoint.ZERO)) {
      encoded = _constant.ZERO_POINT_ENCODE;
    } else {
      encoded = point.toHex();
    }
    var hi = map.get(encoded);
    if (hi !== undefined) {
      return {
        res: (hi << _constant.MAX_SIZE / 2) + low,
        isExist: true
      };
    }
  }
  return {
    res: 0,
    isExist: false
  };
};
parentPort.once('message', function (_ref) {
  var data = _ref.data,
    start = _ref.start,
    end = _ref.end;
  var inputPoint = _secp256k.secp256k1.ProjectivePoint.fromHex(data);
  var map = workerData;
  parentPort.postMessage(worker(inputPoint, map, start, end));
});