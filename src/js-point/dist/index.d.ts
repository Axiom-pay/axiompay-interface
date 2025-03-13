/**
 * Generates a pair of private and public keys.
 *
 * @return { {privateKey: BigInt, publicKey: ProjPointType<bigint>} } An array containing the private and public keys.
 */
export function generateKeys(): {
    privateKey: BigInt;
    publicKey: ProjPointType<bigint>;
};
/**
 * Generates a map by reading data from a file or calculates a new map.
 *
 * @return {Map<String, Number>} A Map from xG -> x, a point on the secp256k1 curve to a number.
 */
export function generateMap(): Map<string, number>;
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
export function encrypt(msg: bigint, publicKey: ProjPointType<bigint>, max_k_size?: number, fromDecimal?: bigint, toDecimal?: bigint): {
    c1: ProjPointType<bigint>;
    c2: ProjPointType<bigint>;
    k: BigInt;
};
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
export function decrypt(c1: ProjPointType<bigint>, c2: ProjPointType<bigint>, privateKey: BigInt, map: Map<string, number>, fromDecimal?: bigint, toDecimal?: bigint): Promise<bigint>;
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
export function view(c2: ProjPointType<bigint>, viewKey: BigInt, publicKey: ProjPointType<bigint>, map: Map<string, number>, fromDecimal?: bigint, toDecimal?: bigint): Promise<bigint>;
import { ProjPointType } from '@noble/curves/abstract/weierstrass';
//# sourceMappingURL=index.d.ts.map