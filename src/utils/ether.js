import {ethers} from 'ethers';
import { secp256k1 } from "@noble/curves/secp256k1";
import { decrypt, view, generateMap } from "../js-point/src";
export const getSeed = (localName, res) => {
    const bytes = new Uint8Array(16);
    const mnemonic = ethers.Mnemonic.fromEntropy(bytes, res.sign);
    const seed = ethers.HDNodeWallet.fromSeed(mnemonic.computeSeed(), mnemonic).derivePath("m/44'/60'/0'/0/0");
    let localData = JSON.parse(localStorage.getItem(localName) || '[]');
    if(!Array.isArray(localData)){
        localStorage.setItem(localName, '');
        localData = [];
    }
    const filterData = localData.filter(item => item.parentAddress === res.parentAddress);
    if(filterData.length) return

    const setData = {...seed, privateKey: seed.privateKey, parentAddress: res.parentAddress}
    localData.push(setData)
    localStorage.setItem(localName, JSON.stringify(localData));
}

export const  isHexString = (value, length) => {
    if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false
    }

    if (typeof(length) === "number" && value.length !== 2 + 2 * length) { return false; }
    if (length === true && (value.length % 2) !== 0) { return false; }

    return true;
}

export const encodeToPoint = (balance) => {
    if (balance.c1[0] === 0n && balance.c1[1] === 0n && balance.c2[0] === 0n && balance.c2[1] === 0n) {
        return [secp256k1.ProjectivePoint.ZERO, secp256k1.ProjectivePoint.ZERO];
    }
    let affineC1 = {
        x: balance.c1[0],
        y: balance.c1[1]
    }
    let affineC2 = {
        x: balance.c2[0],
        y: balance.c2[1]
    }
    let projectiveC1 = secp256k1.ProjectivePoint.fromAffine(affineC1);

    projectiveC1.assertValidity();
    let projectiveC2 = secp256k1.ProjectivePoint.fromAffine(affineC2);
    projectiveC2.assertValidity();
    return [projectiveC1, projectiveC2];
}

export const decryptFromChainRes = async (c1, c2, privateKey) =>{
    const map = await generateMap();
    return decrypt(c1, c2, privateKey, map);
}

export  const viewFromChainRes = async (c2, viewKey, publicKey) => {
    const map = await generateMap();
    return view(c2, viewKey, publicKey, map);
}

export function genPriv2PubInput(pa, vk, rawBalance, rawAmount, CABalanceC1, CABalanceC2, privateKey, CAAmountC1, CAAmountC2) {
    return {
        pa: [pa.x.toString(), pa.y.toString()],
        caAmountK:  vk.toString(),
        c1ayAmount: CAAmountC1.y.toString(),
        c2ayAmount: CAAmountC2.y.toString(),
        c1balance: [CABalanceC1.x.toString(), CABalanceC1.y.toString()],
        c2balance: [CABalanceC2.x.toString(), CABalanceC2.y.toString()],
        privateKey: privateKey.toString(),
        balance: (rawBalance / 10n ** 16n).toString(),
        amount: (rawAmount/ 10n**16n).toString(),
    };
}

export function genPriv2PrivInput(pa, pb, vk1, vk2, vk3, rawBalance, rawAmount,
                                  CABalanceC1, CABalanceC2, privateKey, CAAmountC1, CBAmountC1,
                                  CAAmountC2, CBAmountC2) {
    return {
        pa: [pa.x.toString(), pa.y.toString()],
        pb: [pb.x.toString(), pb.y.toString()],
        caAmountK: vk2.toString(),
        cbAmountK: vk3.toString(),
        c1ayAmount: CAAmountC1.y.toString(),
        c1byAmount: CBAmountC1.y.toString(),
        c2ayAmount: CAAmountC2.y.toString(),
        c2byAmount: CBAmountC2.y.toString(),
        c1balance: [CABalanceC1.x.toString(), CABalanceC1.y.toString()],
        c2balance: [CABalanceC2.x.toString(), CABalanceC2.y.toString()],
        privateKey: privateKey.toString(),
        balance: (rawBalance / 10n ** 16n).toString(),
        amount: (rawAmount/ 10n**16n).toString(),
    }
}

export function genPub2PrivInput(pb, vk, rawBalance, rawAmount, CBAmountC1, CBAmountC2) {
    return {
        pb:  [pb.x.toString(), pb.y.toString()],
        cbAmountK:  vk.toString(),
        c1byAmount: CBAmountC1.y.toString(),
        c2byAmount: CBAmountC2.y.toString(),
        balance: (rawBalance / 10n ** 16n).toString(),
        amount: (rawAmount/ 10n**16n).toString(),
    };
}

export function generateOnchainPublicKey(publicKey) {
    return "0x" + publicKey.toHex(false).substring(2);
}

export function retrievePublicKey(publicKey) {
    publicKey = publicKey.substring(2);
    publicKey = "04" + publicKey;
    return secp256k1.ProjectivePoint.fromHex(publicKey);
}

