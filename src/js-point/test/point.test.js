const { generateKeys, generateMap, encrypt, decrypt, view } = require('../dist');
const assert = require('assert');
const { secp256k1 } = require('@noble/curves/secp256k1');
const { expect } = require("chai");

describe("test point", async () => {
    let map;
    let keys;

    before("generate map", async () => {
        map = generateMap();
        keys = generateKeys();
    });

    it("test stack overflow", async () => {
        expect(function () { encrypt(1000000000000000n, keys.publicKey) }).to.throw("decimal error, private message will be truncated at 10^16");
        expect(function () { encrypt(1000000000000000001n, keys.publicKey) }).to.throw("decimal error, private message will be truncated at 10^16");
    })

    it("test encrypt and decrypt", async () => {
        let msg = 1000000000000000000n;
        let { c1, c2, k } = encrypt(msg, keys.publicKey);
        let decrypted = await decrypt(c1, c2, keys.privateKey, map);
        assert.equal(msg, decrypted);
        let viewed = await view(c2, k, keys.publicKey, map);
        assert.equal(msg, viewed);
    });

    it("test homomorphic add", async () => {
        let msg1 = 1000000000000000000n;
        let msg2 = 1000000000000000000n;
        let expected = msg1 + msg2;

        let e1 = encrypt(msg1, keys.publicKey);
        let e2 = encrypt(msg2, keys.publicKey);
        let c1 = e1.c1.add(e2.c1);
        let c2 = e1.c2.add(e2.c2);
        let k = (e1.k + e2.k) % secp256k1.CURVE.n;

        let decrypted = await decrypt(c1, c2, keys.privateKey, map);
        assert.equal(expected, decrypted);

        let viewed = await view(c2, k, keys.publicKey, map);
        assert.equal(expected, viewed);
    });

    it("test homomorphic sub", async () => {
        let msg1 = 1000000000000000000n;
        let msg2 = 100000000000000000n;
        let expected = msg1 - msg2;

        let e1 = encrypt(msg1, keys.publicKey);
        let e2 = encrypt(msg2, keys.publicKey);
        let c1 = e1.c1.subtract(e2.c1);
        let c2 = e1.c2.subtract(e2.c2);
        let k = (e1.k - e2.k + secp256k1.CURVE.n) % secp256k1.CURVE.n;

        let decrypted = await decrypt(c1, c2, keys.privateKey, map);
        assert.equal(expected, decrypted);

        let viewed = await view(c2, k, keys.publicKey, map);
        assert.equal(expected, viewed);
    });

    it("test average time cost for encrypt and decrypt", async () => {
        let rounds = 100;
        let start = performance.now();
        let loadbarLength = 50;
        let loadbar = Array(loadbarLength).fill(" ");
        for (let i = 0; i < rounds; i++) {
            let msg = 1000000000000000000n;
            let { c1, c2 } = encrypt(msg, keys.publicKey);
            let decrypted = await decrypt(c1, c2, keys.privateKey, map);
            assert.equal(msg, decrypted);
            let index = parseInt(i * loadbarLength / rounds);
            loadbar[index] = "=";
            if (index != loadbarLength - 1) {
                loadbar[index + 1] = ">";
            }
            process.stdout.write(`\r[${loadbar.join('')}] ${i + 1}/${rounds} finished`);
        }
        let end = performance.now();
        process.stdout.write(`\rfinished ${rounds} rounds, total time cost ${end - start} ms, average ${(end - start) / rounds} ms\n`);
    });

    it("test decrypt zero point", async () => {
        let msg1 = 1000000000000000000n;

        let e1 = encrypt(msg1, keys.publicKey);
        let e2 = encrypt(msg1, keys.publicKey);
        let c1 = e1.c1.subtract(e2.c1);
        let c2 = e1.c2.subtract(e2.c2);
        let k = (e1.k - e2.k + secp256k1.CURVE.n) % secp256k1.CURVE.n;

        let decrypted = await decrypt(c1, c2, keys.privateKey, map);
        assert.equal(0, decrypted);

        let viewed = await view(c2, k, keys.publicKey, map);
        assert.equal(0, viewed);
    });

    it("test negative", async () => {
        let msg1 = 1000000000000000000n;
        let msg2 = 100000000000000000n;
        let expected = msg1 - msg2;

        let e1 = encrypt(msg1, keys.publicKey);
        let e2 = encrypt(msg2, keys.publicKey);
        let c1 = e1.c1.subtract(e2.c1);
        let c2 = e1.c2.subtract(e2.c2);
        let k = (e1.k - e2.k + secp256k1.CURVE.n) % secp256k1.CURVE.n;

        let decrypted = await decrypt(c1, c2, keys.privateKey, map);
        assert.equal(expected, decrypted);

        let viewed = await view(c2, k, keys.publicKey, map);
        assert.equal(expected, viewed);
    });
})