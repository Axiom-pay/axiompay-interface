import { generateFromString } from "generate-avatar";
import { PrivateKey, PublicKey } from "paillier-bigint";
import { message } from "antd";
import { USDCIcon, USDTIcon, LUSDIcon, DAIIcon } from "components/Icon";
import { getJsonFile } from "./circuit";

export const TokenIcons = {
  MockUSDT: USDCIcon,
  USDT: USDTIcon,
  LUSD: LUSDIcon,
  DAI: DAIIcon,
};
export const getImgFromHash = (hash = "") =>
  `data:image/svg+xml;utf8,${generateFromString(hash)}`;
export const hashRender = (text) =>
  text ? `${text.slice(0, 6)}...${text.slice(-4)}` : "";
export const hashPrivateRender = (text) =>
  text ? `${text.slice(0, 9)}...${text.slice(-9)}` : "";

export const toThousands = (num = 0) => {
  const str = num ? String(num) : "0";
  const strList = str.split(".");
  if (strList.length > 1) {
    return `${Number(strList[0]).toLocaleString("en-us")}.${strList[1]}`;
  }

  return Number(strList[0]).toLocaleString("en-us");
};

export const switchNetwork = async () => {
  const eth = window.ethereum;
  if (!eth.isMetaMask) {
    message.error("please download metamask");
  }
  if (eth.chainId !== window.ChainId) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: window.ChainId }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: window.ChainId,
                chainName: window.network,
                nativeCurrency: {
                  name: window.network,
                  symbol: window.symbol,
                  decimals: 18,
                },
                rpcUrls: [window.ST_URL],
                // rpcUrls: window.URL_LIST,
                // blockExplorerUrls: [window.ST_URL],
                blockExplorerUrls: [window.BROWSER_URL],
              },
            ],
          });
        } catch (addError) {
          throw new Error(
            "Operation failed. Choose the Binance Smart Chain on your wallet"
          );
        }
      } else {
        throw new Error(
          "Operation failed. Choose the Binance Smart Chain on your wallet"
        );
      }
    }
  }
};

export const handleGetAddress = (localName, address) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  if (!Array.isArray(data)) return "";
  const filterData = data.filter((item) => item.parentAddress === address);
  if (!filterData.length) return "";
  return filterData[0].address;
};

export const getPrivateKey = (localName, address) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  if (!Array.isArray(data)) return "";
  const filterData = data.filter((item) => item.parentAddress === address);
  if (!filterData.length) return "";
  return filterData[0].privateKey;
};

export const getPublicKey = (localName, address) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  if (!Array.isArray(data)) return "";
  const filterData = data.filter((item) => item.parentAddress === address);
  if (!filterData.length) return "";
  return filterData[0].publicKey;
};

export const hasStorageData = (localName, address) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  if (!Array.isArray(data)) return false;
  const filterData = data.filter((item) => item.parentAddress === address);
  if (!filterData.length) return false;
  return true;
};

export const getHasPrivate = (localName, address) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  if (!Array.isArray(data)) return false;
  const filterData = data.filter((item) => item.parentAddress === address);
  if (!filterData.length) return false;
  if (!filterData[0]?.hasPrivate) return false;
  return true;
};

export const setHasPrivate = (localName, address, val) => {
  const seed = localStorage.getItem(localName);
  const data = JSON.parse(seed || "[]");
  const mapData = data.map((item) => {
    if (item.parentAddress === address) {
      return { ...item, hasPrivate: val };
    }
    return item;
  });
  localStorage.setItem(localName, JSON.stringify(mapData));
};

export const ToString = (val) => {
  if (typeof val === "bigint") {
    return `${val}`;
  } else {
    return val;
  }
};

export const exchangeEth = (num = 0) => {
  const str = String((num / Math.pow(10, 18)).toFixed(2));
  const strList = str.split(".");
  // console.log(strList);
  if (strList.length > 1) {
    return `${Number(strList[0]).toLocaleString("en-us")}.${strList[1]}`;
  }

  return Number(strList[0]).toLocaleString("en-us");
};

// 10 * 18
// eslint-disable-next-line
export const exchangeAxm = (num = 0) => num * Math.pow(10, 18);

export async function getCrypto() {
  const db = await getJsonFile("db.json");
  return db.data.cryptoParams;
}

function convertStringToBigInt(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        // If the property is an object, recursively call the function.
        convertStringToBigInt(obj[key]);
      } else if (typeof obj[key] === "string") {
        // If the property is a BigInt, convert it to a string.
        // eslint-disable-next-line
        obj[key] = BigInt(obj[key]);
      }
    }
  }
}
export async function generateOrRetriveKeys() {
  let crypto = await getCrypto();
  convertStringToBigInt(crypto);
  const publicKey = new PublicKey(crypto.publicKey.n, crypto.publicKey.g);
  crypto = new PrivateKey(
    crypto.lambda,
    crypto.mu,
    publicKey,
    crypto._p,
    crypto._q
  );
  return crypto;
}

export const handleErrorMsg = (e, writeConfig) => {
  let msg = "";
  console.log(writeConfig?.error);
  console.log(writeConfig?.error?.cause);
  console.log(writeConfig?.error?.cause?.code);
  console.log(e?.code);
  if (e?.stack && writeConfig?.error?.cause?.code !== 4001) {
    const strList = e.stack?.split("\n");
    const messageList = strList[0] ? strList[0]?.split(":") : "";
    msg = messageList.length === 2 ? messageList[1] : messageList[0];
  }
  if (msg && writeConfig?.error?.cause?.code !== 4001) {
    message.error(
      writeConfig?.error?.shortMessage ||
        msg ||
        writeConfig?.error?.details ||
        "An error occurred while executing"
    );
  }
};

export const switchNum = (value) => {
  return value ? (value / 10n ** 18n).toString() : 0;
};
