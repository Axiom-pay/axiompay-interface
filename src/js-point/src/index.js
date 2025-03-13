import { secp256k1 } from '@noble/curves/secp256k1';
// import { randomInt } from 'ethers';
import { ProjPointType } from '@noble/curves/abstract/weierstrass';
// import { writeFileSync, readFileSync } from 'fs';
import axios from "axios";
import Worker from "worker-loader!./worker.js";
import { ZERO_POINT_ENCODE, MAX_SIZE, MAX_K_SIZE } from './constant';
import {cpus} from "os";

/**
 * Generates a pair of private and public keys.
 *
 * @return { {privateKey: BigInt, publicKey: ProjPointType<bigint>} } An array containing the private and public keys.
 */
export function generateKeys() {
    let privateKeyBytes = secp256k1.utils.randomPrivateKey();
    let privateKey = secp256k1.utils.normPrivateKeyToScalar(privateKeyBytes);
    let publicKey = secp256k1.ProjectivePoint.BASE.multiply(privateKey);
    return { privateKey: privateKey, publicKey: publicKey }
}

/**
 * Generates a map by reading data from a file or calculates a new map.
 *
 * @return {Map<String, Number>} A Map from xG -> x, a point on the secp256k1 curve to a number.
 */
export async function generateMap() {
    const res =  await axios.get('map.json');
    return new Map(res.data);
}

/**
 * Encodes a message using the secp256k1 algorithm.
 *
 * @param {bigint} msg - The message to be encoded.
 * @return {ProjPointType<bigint>} - The encoded message.
 */
function encode(msg) {
    return secp256k1.ProjectivePoint.BASE.multiply(msg);
}

/**
 * Decodes the inputPoint using the provided map.
 *
 * @param {ProjPointType<bigint>} inputPoint - The point to be decoded.
 * @param {Map<String, Number>} map - The map of high part used for decoding.
 * @return {Promise<number>} - The decoded value.
 */

// async function decode(inputPoint, map) {
//     return new Promise((resolve, reject) => {
//         const numWorkers = navigator.hardwareConcurrency;
//         const data = inputPoint.toHex();
//         const splitSize = parseInt((1 << MAX_SIZE / 2) / numWorkers);
//         let workers = new Map();
//         for (let i = 0; i < numWorkers; i++) {
//             const url = new URL('worker', import.meta.url);
//             const worker = new Worker(url, {type:'module'});
//             workers.set(worker, true);
//             worker.postMessage({
//                 data,
//                 map,
//                 start: i * splitSize,
//                 end: i === numWorkers - 1 ? 1 << MAX_SIZE / 2 : (i + 1) * splitSize
//             });
//
//             worker.onmessage = ({ res, isExist }) => {
//                 if (isExist) {
//                     workers.forEach((_, key) => {
//                         key.terminate();
//                     })
//                     resolve(res);
//                 }
//                 workers.delete(worker);
//                 if (workers.size === 0) {
//                     resolve(0);
//                 }
//             }
//
//             worker.onerror = reject;
//         }
//     })
// }

async function decode(inputPoint, map) {
    return new Promise((resolve, reject) => {
        const numWorkers = navigator.hardwareConcurrency;
        const data = inputPoint.toHex();
        const splitSize = parseInt((1 << MAX_SIZE / 2) / numWorkers);
        let workers = new Map();
        for (let i = 0; i < numWorkers; i++) {
            const url = new URL('worker', import.meta.url);
            const worker = new Worker(url, {type: 'module'});
            workers.set(worker, true);
            worker.postMessage({
                data,
                map,
                start: i * splitSize,
                end: i === numWorkers - 1 ? 1 << MAX_SIZE / 2 : (i + 1) * splitSize
            });
            let resData = 0;
            worker.onmessage = (resData) => {
                const { res, isExist} = resData.data;
                if (isExist) {
                    // if finally get result, then will terminate all other workers
                    workers.forEach((_, key) => {
                        key.terminate();
                    })
                    resolve(res);
                    // resData
                }
                // if not find the result, then delete the worker from worker map
                workers.delete(worker);
                // if finally the worker map is empty, which means all workers don't decode success, then return 0
                if (workers.size === 0) {
                    resolve(0);
                }
            }
            worker.onerror=reject;
        }
    })
}
const randomInt = (max) => {
    return parseInt(Math.random() * max)
}

export function encrypt(msg, publicKey, max_k_size = MAX_K_SIZE, fromDecimal = 18n, toDecimal = 2n) {
    const decimal = 10n ** (fromDecimal - toDecimal);
    if (msg % decimal !== 0n) {
        throw new Error(`decimal error, private message will be truncated at 10^${fromDecimal - toDecimal}`);
    }
    msg = msg / decimal;
    if (msg > 4294967295n) {
        throw new Error(`value overflow, max value is 4294967295`);
    }
    let encoded = encode(msg);
    let k = BigInt(randomInt(max_k_size));
    let lhs = publicKey.multiply(k);
    return { c1: secp256k1.ProjectivePoint.BASE.multiply(k), c2: encoded.add(lhs), k: k }
    // return { c1: publicKey, c2: publicKey, k: k }
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
export async function decrypt(c1, c2, privateKey, map, fromDecimal = 18n, toDecimal = 2n) {
    // eslint-disable-next-line
    let rhs = c1.multiply(BigInt(privateKey));
    let res = c2.subtract(rhs);
    if (res.equals(secp256k1.ProjectivePoint.ZERO)) {
        return new Promise((resolve) => {
            resolve(0n);
            // resolve(BigInt(1) * 10n ** (fromDecimal - toDecimal));
        });
    }
    let before = await decode(res, map);
    return new Promise((resolve) => {
        // eslint-disable-next-line
        resolve(BigInt(before || 0) * 10n ** (fromDecimal - toDecimal));
    });
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
export async function view(c2, viewKey, publicKey, map, fromDecimal = 18n, toDecimal = 2n) {
    if (viewKey === 0n) {
        return new Promise((resolve) => {
            resolve(0n);
        });
    }
    let rhs = publicKey.multiply(viewKey);
    let res = c2.subtract(rhs)
    if (res.equals(secp256k1.ProjectivePoint.ZERO)) {
        return new Promise((resolve) => {
            resolve(0n);
        });
    }
    let before = await decode(res, map);
    return new Promise((resolve) => {
        // eslint-ignore
        resolve(BigInt(before) * 10n ** (fromDecimal - toDecimal));
    });
}

