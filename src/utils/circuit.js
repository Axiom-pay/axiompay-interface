import axios from "axios";
import { groth16 } from "snarkjs";

const wc = require("js-point/witness_calculator.js");

export async function getFile(type, fileName) {
  return axios({
    method: "get",
    url: `/resources/${type}/${fileName}`,
    responseType: "arraybuffer",
  });
}

export async function getJsonFile(url) {
  return axios({
    method: "get",
    url,
  });
}

export async function generateWitness(inputPath, type, fileName) {
  const wasm = await getFile(type, fileName);
  return await wc(wasm.data).then(async (witnessCalculator) => {
    return await witnessCalculator.calculateWTNSBin(inputPath, 0);
  });
}

export async function generateProof(zkeyPath, wtnsPath) {
  // zkey is static resource in public folder
  const { proof, publicSignals } = await groth16.prove(zkeyPath, wtnsPath);
  return { proof, publicSignals };
}

export async function generateGroth16SolidityCallData(proofPath, publicPath) {
  // const pub = JSON.parse(readFileSync(publicPath, "utf8"));
  // const prf = JSON.parse(readFileSync(proofPath, "utf8"));

  return await groth16.exportSolidityCallData(proofPath, publicPath);
}
