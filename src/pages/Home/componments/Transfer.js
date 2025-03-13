import "./index.less";
import SwitchPrivate from "./SwitchPrivate";
import AlertPrivate from "./Alert";
import { useEffect, useState } from "react";
import {
  handleGetAddress,
  hashRender,
  setHasPrivate,
  getHasPrivate,
  TokenIcons,
  exchangeAxm,
  generateOrRetriveKeys,
  getPrivateKey,
  handleErrorMsg,
  hasStorageData,
} from "utils/help";
import {
  getSeed,
  isHexString,
  genPub2PrivInput,
  genPriv2PubInput,
  genPriv2PrivInput,
  encodeToPoint,
  retrievePublicKey,
} from "utils/ether";
import Icon from "@ant-design/icons";
import ModalToken from "./ModalToken";
import ModalAddAccount from "./ModalAddAccount";
import {
  DownArrowIcon,
  TransferDownArrowIcon,
  PrivateIcon,
  ErrorIcon,
} from "components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import { poolConfig } from "server/pool";
import { mockConfig } from "server/mock";
import { payConfig } from "server/pay";
import { InputNumber, Input, message } from "antd";
import { encrypt } from "js-point/src";
import {
  generateWitness,
  generateProof,
  getFile,
  generateGroth16SolidityCallData,
} from "utils/circuit";
import { ethers } from "ethers";
import ModalSuccess from "./ModalSuccess";
import { parseEther } from "viem";
import { readContract } from "@wagmi/core";

const IsPrivateItem = (props) => {
  const {
    onChange,
    transferAddr,
    isErrorAddress,
    isSuccessAddress,
    isPrivate,
    setIsPrivate,
  } = props;
  const { data: isPrivateRead, isLoading } = useContractRead({
    ...poolConfig,
    functionName: "isPrivate",
    args: [transferAddr],
    watch: true,
    onSuccess(data) {
      setIsPrivate(data);
    },
    onError(err) {
      if (isPrivate) {
        setIsPrivate(false);
      }
    },
  });

  return (
    <div
      className={
        isPrivateRead
          ? "transfer-box private-transfer"
          : transferAddr && isErrorAddress
          ? "transfer-box invalid-transfer"
          : "transfer-box public-transfer"
      }
    >
      <div className="transfer-box-header">
        <div className="transfer-box-header-left">
          <div className="transfer-box-label">To</div>
        </div>
      </div>
      <div className="transfer-box-form">
        <Input onChange={onChange} value={transferAddr} placeholder="Address" />
        {isLoading ? <LoadingOutlined style={{ marginLeft: 8 }} /> : null}
        {transferAddr && isErrorAddress ? (
          <div className="error-box">
            <Icon style={{ width: 20, height: 20 }} component={ErrorIcon} />
            <span>Invalid</span>
          </div>
        ) : null}

        {transferAddr && isSuccessAddress && isPrivateRead ? (
          <div className="success-box">
            <Icon component={PrivateIcon} style={{ width: 20, height: 20 }} />
            <div>Private</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default function Transfer(props) {
  const { setChainSign } = props;
  const [isChecked, setIsChecked] = useState(false);
  const [token, setToken] = useState({});
  const [visible, setVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  // const [privateAddr, setPrivateAddr] = useState(false)
  const { isConnected, connector, address } = useAccount();
  const { chain } = useNetwork();
  const {
    signMessageAsync,
    data: signData,
    isError: signIsError,
  } = useSignMessage();
  const [transferAddr, setTransferAddr] = useState("");
  const [isErrorAddress, setIsErrorAddress] = useState(false);
  const [isSuccessAddress, setIsSuccessAddress] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [enterNum, setEnterNum] = useState("");
  const privateAddress = handleGetAddress(chain?.id, address);
  const privateKey = getPrivateKey(chain?.id, address);
  const [isInputPrivate, setIsInputPrivate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const configs = payConfig(token.axiomPay);
  const { disconnect } = useDisconnect();
  const storageData = hasStorageData(chain?.id, address);
  const [loadContract, setLoadContract] = useState(false);

  const handleReset = () => {
    setTransferAddr("");
    setIsChecked(false);
    setIsErrorAddress(false);
    setEnterNum("");
    setToken("");
    setEnterNum("");
  };

  const { data: readPublicData } = useContractRead({
    ...poolConfig,
    functionName: "getPublicKey",
    args: [transferAddr],
    watch: true,
  });

  const { data: readLocalPublicData } = useContractRead({
    ...poolConfig,
    functionName: "getPublicKey",
    args: [privateAddress],
    watch: true,
  });

  useContractRead({
    ...poolConfig,
    functionName: "isPrivate",
    args: [privateAddress],
    onSuccess(data) {
      if (data) {
        setHasPrivate(chain?.id, address, 1);
        setIsSuccessAddress(true);
      } else {
        setHasPrivate(chain?.id, address, 0);
      }
    },
  });

  const mockWrite = useContractWrite({
    ...mockConfig,
    functionName: "approve",
  });

  const payWrite = useContractWrite({
    ...configs,
    functionName: "privateTransfer",
    // account: address,
  });

  const payPublicWrite = useContractWrite({
    ...configs,
    functionName: "transfer",
  });

  const waitForPayPublicTsx = useWaitForTransaction({
    hash: payPublicWrite.data?.hash,
    onSuccess() {
      setSuccess(true);
      setError(false);
    },
    onError(data) {
      setError(true);
      setSuccess(false);
      message.error("error");
    },
  });

  const waitForPayTsx = useWaitForTransaction({
    hash: payWrite.data?.hash,
    onSuccess() {
      setSuccess(true);
    },
    onError(data) {
      setError(true);
      setError(false);
      setSuccess(false);
      message.error("error");
    },
  });

  // const publicKeyRead = useContractWrite({
  //     ...poolConfig,
  //     functionName: 'getPublicKey',
  // });
  // getPublicKey

  const waitForTsx = useWaitForTransaction({
    hash: mockWrite.data?.hash,
    onError(data) {},
  });

  const isLoading =
    waitForTsx?.isLoading ||
    waitForPayTsx?.isLoading ||
    waitForPayPublicTsx?.isLoading ||
    payPublicWrite?.isLoading ||
    payWrite.isLoading;

  const getGenData = async (
    inputPath,
    wtnsPath,
    zkeyPath,
    paillierViewKey,
    accountName
  ) => {
    let { proof, publicSignals } = await generateProof(
      new Uint8Array(zkeyPath.data),
      wtnsPath
    );
    let rawProof = await generateGroth16SolidityCallData(proof, publicSignals);
    const parsedProof = JSON.parse("[" + rawProof + "]");
    let pA = [parsedProof[0][0], parsedProof[0][1]];
    let pB = [
      [parsedProof[1][0][0], parsedProof[1][0][1]],
      [parsedProof[1][1][0], parsedProof[1][1][1]],
    ];
    let pC = [parsedProof[2][0], parsedProof[2][1]];
    let pubSignals = [parsedProof[3][0]];
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const proofBytes = abiCoder.encode(
      ["tuple(uint[2] pA, uint[2][2] pB, uint[2] pC, uint[1] pubSignals)"],
      [
        {
          pA: pA,
          pB: pB,
          pC: pC,
          pubSignals: pubSignals,
        },
      ]
    );
    const data = abiCoder.encode(
      ["tuple(uint[2] C1, uint[2] C2, uint256 viewKey, bytes proof)"],
      [
        {
          C1: [accountName.c1.x.toString(), accountName.c1.y.toString()],
          C2: [accountName.c2.x.toString(), accountName.c2.y.toString()],
          viewKey: paillierViewKey.toString(),
          proof: proofBytes,
        },
      ]
    );
    return data;
  };
  const pub2priv = async () => {
    try {
      setSuccessVisible(true);
      // eslint-disable-next-line
      const amount = BigInt(exchangeAxm(enterNum));
      const bal = token.tokenBal;
      // eslint-disable-next-line
      const pub = retrievePublicKey(readPublicData);
      const c_b_amount = encrypt(amount, pub);
      const paillierPrivateKey = await generateOrRetriveKeys();
      let paillierViewKey = paillierPrivateKey.publicKey.encrypt(c_b_amount.k);
      const inputPath = genPub2PrivInput(
        pub.toAffine(),
        c_b_amount.k.valueOf(),
        bal,
        amount,
        c_b_amount.c1.toAffine(),
        c_b_amount.c2.toAffine()
      );
      const wtnsPath = await generateWitness(
        inputPath,
        "pub2priv",
        "axiompay.wasm"
      );
      const zkeyPath = await getFile("pub2priv", "axiompay1.zkey");
      const data = await getGenData(
        inputPath,
        wtnsPath,
        zkeyPath,
        paillierViewKey,
        c_b_amount
      );
      // console.log('user1', user1)
      await payWrite.writeAsync({
        args: [address, transferAddr, amount, data],
      });
    } catch (e) {
      setError(true);
      setSuccess(false);
      handleErrorMsg(e, payWrite);
    }
  };

  const priv2pub = async () => {
    try {
      setSuccessVisible(true);
      // eslint-disable-next-line
      const amount = BigInt(exchangeAxm(enterNum));
      const balance_amount = encodeToPoint(token.privateVal);
      const pkA = retrievePublicKey(readLocalPublicData);
      const bal = token.tokenBal;
      // const bal = token.tokenBal;

      let c_a_amount = encrypt(amount, pkA);
      const paillierPrivateKey = await generateOrRetriveKeys();
      let paillierViewKey = paillierPrivateKey.publicKey.encrypt(c_a_amount.k);
      // const inputPath = genPriv2PubInput(pkA.toAffine(), c_a_amount.k.valueOf(), bal, amount, balance_amount[0].toAffine() ,balance_amount[1].toAffine(),privateKey, c_a_amount.c1.toAffine(), c_a_amount.c2.toAffine());
      const inputPath = genPriv2PubInput(
        pkA.toAffine(),
        c_a_amount.k.valueOf(),
        bal,
        amount,
        balance_amount[0].toAffine(),
        balance_amount[1].toAffine(),
        privateKey,
        c_a_amount.c1.toAffine(),
        c_a_amount.c2.toAffine()
      );
      const wtnsPath = await generateWitness(
        inputPath,
        "priv2pub",
        "axiompay.wasm"
      );
      const zkeyPath = await getFile("priv2pub", "axiompay1.zkey");
      const data = await getGenData(
        inputPath,
        wtnsPath,
        zkeyPath,
        paillierViewKey,
        c_a_amount
      );
      await payWrite.writeAsync({
        args: [privateAddress, transferAddr, amount, data],
      });
    } catch (e) {
      setError(true);
      setSuccess(false);
      handleErrorMsg(e, payWrite);
    }
  };

  const priv2priv = async () => {
    try {
      setSuccessVisible(true);
      // eslint-disable-next-line
      const amount = BigInt(exchangeAxm(enterNum));
      const bal = token.tokenBal;
      const balance_amount = encodeToPoint(token.privateVal);
      // const pkA = secp256k1.ProjectivePoint.fromPrivateKey(BigInt(privateKey));
      const pkA = retrievePublicKey(readLocalPublicData);
      // eslint-disable-next-line
      const pkB = retrievePublicKey(readPublicData);
      let c_a_amount = encrypt(amount, pkA);
      const paillierPrivateKey = await generateOrRetriveKeys();
      let fromPaillierViewKey = paillierPrivateKey.publicKey.encrypt(
        c_a_amount.k
      );
      let c_b_amount = encrypt(amount, pkB);
      let toPaillierViewKey = paillierPrivateKey.publicKey.encrypt(
        c_b_amount.k
      );
      const inputPath = genPriv2PrivInput(
        pkA.toAffine(),
        pkB.toAffine(),
        0n,
        c_a_amount.k.valueOf(),
        c_b_amount.k.valueOf(),
        bal,
        amount,
        balance_amount[0].toAffine(),
        balance_amount[1].toAffine(),
        privateKey,
        c_a_amount.c1.toAffine(),
        c_b_amount.c1.toAffine(),
        c_a_amount.c2.toAffine(),
        c_b_amount.c2.toAffine()
      );
      // inputPath, type, fileName
      const wtnsPath = await generateWitness(
        inputPath,
        "priv2priv",
        "axiompay.wasm"
      );
      const zkeyPath = await getFile("priv2priv", "axiompay1.zkey");
      let { proof, publicSignals } = await generateProof(
        new Uint8Array(zkeyPath.data),
        wtnsPath
      );
      let rawProof = await generateGroth16SolidityCallData(
        proof,
        publicSignals
      );
      const parsedProof = JSON.parse("[" + rawProof + "]");
      let pA = [parsedProof[0][0], parsedProof[0][1]];
      let pB = [
        [parsedProof[1][0][0], parsedProof[1][0][1]],
        [parsedProof[1][1][0], parsedProof[1][1][1]],
      ];
      let pC = [parsedProof[2][0], parsedProof[2][1]];
      let pubSignals = [parsedProof[3][0]];

      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const proofBytes = abiCoder.encode(
        ["tuple(uint[2] pA, uint[2][2] pB, uint[2] pC, uint[1] pubSignals)"],
        [
          {
            pA: pA,
            pB: pB,
            pC: pC,
            pubSignals: pubSignals,
          },
        ]
      );

      let data = abiCoder.encode(
        [
          "tuple(uint[2] fromC1, uint[2] fromC2, uint[2] toC1, uint[2] toC2, uint256 fromViewKey, uint256 toViewKey, bytes proof)",
        ],
        [
          {
            fromC1: [c_a_amount.c1.x.toString(), c_a_amount.c1.y.toString()],
            fromC2: [c_a_amount.c2.x.toString(), c_a_amount.c2.y.toString()],
            toC1: [c_b_amount.c1.x.toString(), c_b_amount.c1.y.toString()],
            toC2: [c_b_amount.c2.x.toString(), c_b_amount.c2.y.toString()],
            fromViewKey: fromPaillierViewKey.toString(),
            toViewKey: toPaillierViewKey.toString(),
            proof: proofBytes,
          },
        ]
      );
      await payWrite.writeAsync({
        args: [privateAddress, transferAddr, amount, data],
      });
    } catch (e) {
      setError(true);
      setSuccess(false);
      handleErrorMsg(e, payWrite);
    }

    // const data = await getGenData(inputPath, wtnsPath, wasmPath, paillierViewKey, c_b_amount);
  };

  const pub2pub = async () => {
    try {
      setSuccessVisible(true);
      // eslint-disable-next-line
      const amount = BigInt(exchangeAxm(enterNum));
      await payPublicWrite.writeAsync({ args: [transferAddr, amount] });
    } catch (e) {
      setError(true);
      setSuccess(false);
      handleErrorMsg(e, payPublicWrite);
    }
  };

  const handleAddPrivate = () => {
    setAccountVisible(true);
  };

  const handleSign = async () => {
    try {
      const storageData = hasStorageData(chain?.id, address);
      if (isConnected && address && !storageData) {
        const sign = "Welcome to AxiomPay!";
        const res = await signMessageAsync({ message: sign });
        // await isPrivateWrite.writeAsync({ args: [res.address]});
        getSeed(chain?.id, { sign: res, parentAddress: address });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (signData) {
      setChainSign(true);
    } else {
      setChainSign(false);
    }
  }, signData);

  useEffect(() => {
    if (address && chain?.id === window.TransformChainId && connector) {
      handleSign();
      handleReset();
    }
  }, [address, chain?.id, connector]);

  const handleAccountCancel = (addr) => {
    if (addr) {
      setTransferAddr(addr);
    }
    setAccountVisible(false);
  };

  const handleAddressReg = (value) => {
    if (value && value.length === 42) {
      setTransferAddr(value);
      const isCheckedAddr = isChecked ? privateAddress : address;
      if (isHexString(value, true) && value !== isCheckedAddr) {
        setIsErrorAddress(false);
        setIsSuccessAddress(true);
      } else {
        setIsErrorAddress(true);
        setIsSuccessAddress(false);
      }
    } else if (value < 42) {
      setIsSuccessAddress(false);
      setIsErrorAddress(false);
      setTransferAddr(value);
    }
  };

  const handleChangePrivate = (e) => {
    handleAddressReg(e.target.value);
    // if()
  };

  useEffect(() => {
    handleAddressReg(transferAddr);
  }, [isChecked]);

  const handleChangeData = (addr) => {
    if (addr !== privateAddress.toLowerCase()) {
      disconnect();
      handleReset();
      setIsChecked(false);
    }
  };
  const handleSwitchChange = async (e) => {
    const hasPrivate = getHasPrivate(chain?.id, address);
    if (!storageData && (!signData || signIsError)) {
      message.error("Please sign on Metamask first!");
    }
    if (hasPrivate && e) {
      setIsChecked(true);
    } else {
      if (!hasPrivate) {
        handleAddPrivate();
      } else {
        setIsChecked(false);
      }

      // handleAddPrivate();
    }
    setToken({});
  };

  const onChangeInputNum = (value) => {
    setEnterNum(value);
  };

  const getButtonText = () => {
    const isCheckedAddr = isChecked ? privateAddress : address;

    if (!storageData && (!signData || signIsError)) return "Sign first";
    if (!token.originalERC20Name) return "Select a token";
    if (!enterNum) return "Enter an amount";
    if (enterNum > token.price) return `Insufficient token balance`;
    if (!isHexString(transferAddr, true) || transferAddr === isCheckedAddr)
      return `Not a valid address`;
    return "Transfer";
  };

  useEffect(() => {
    if (waitForTsx.isSuccess) {
      if (isInputPrivate) {
        pub2priv();
      } else {
        pub2pub();
      }
    }
  }, [waitForTsx.isSuccess]);

  const handleSubmitTrans = async () => {
    if (!isLoading && !loadContract) {
      setLoadContract(true);
      const amount = parseEther(String(enterNum));
      if (isChecked) {
        try {
          if (isInputPrivate) {
            await priv2priv();
          } else {
            await priv2pub();
          }
        } finally {
          setLoadContract(false);
        }
      } else {
        try {
          const result = await readContract({
            ...mockConfig,
            functionName: "allowance",
            args: [address, window.AxiomPay_Contrct_Address],
          });

          if (amount < result) {
            if (isInputPrivate) {
              pub2priv();
            } else {
              pub2pub();
            }
          } else {
            await mockWrite.writeAsync({ args: [token.axiomPay, amount] });
          }
        } catch (e) {
          setError(true);
          setSuccess(false);
          handleErrorMsg(e, mockWrite);
        } finally {
          setLoadContract(false);
        }
      }

      // payWrite
    }
  };

  const handleSuccessCancel = () => {
    handleReset();
    setSuccess(false);
    setError(false);
    setSuccessVisible(false);
  };

  const handleSignError = () => {
    if (signIsError) {
      handleSign();
    }
  };

  const handleAlertPrivate = () => {
    if (!storageData && (!signData || signIsError)) {
      return (
        <div style={{ marginBottom: 24 }}>
          <AlertPrivate
            onClick={handleSignError}
            text="Please sign on Metamask first!"
          />
        </div>
      );
    }

    if (!getHasPrivate(chain?.id, address) && !isChecked) {
      return (
        <div style={{ marginBottom: 24 }}>
          <AlertPrivate
            onClick={handleAddPrivate}
            text="No private account yet, click to create"
          />
        </div>
      );
    }
    return null;
  };

  function roundFun(value, n) {
    if (value) {
      const data = Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
      setEnterNum(data);
    } else {
      setEnterNum("");
    }
  }

  return (
    <div
      style={{ color: "#fff" }}
      className={
        isChecked
          ? "transfer-container private-container"
          : "transfer-container public-container"
      }
    >
      <div className="transfer-switch" style={{ marginBottom: 24 }}>
        <SwitchPrivate checked={isChecked} onChange={handleSwitchChange} />
        <span className="transfer-switch-title">
          {isChecked ? "Private" : "Public"} transfer
        </span>
      </div>
      {handleAlertPrivate()}
      <div
        className={
          isChecked
            ? "transfer-box private-transfer"
            : "transfer-box public-transfer"
        }
      >
        <div
          className="transfer-box-header"
          style={{ height: 26, lineHeight: "26px" }}
        >
          <div className="transfer-box-header-left">
            <div className="transfer-box-label">from</div>
            {isChecked ? (
              <div className="transfer-box-private">
                <Icon
                  component={PrivateIcon}
                  style={{ width: 20, height: 20 }}
                />
                <div>Private: {hashRender(privateAddress)}</div>
              </div>
            ) : (
              <div className="transfer-box-value">{hashRender(address)}</div>
            )}
          </div>
          {token.price !== undefined && token.price !== null ? (
            <div className="transfer-box-balance">Balance {token.price}</div>
          ) : null}
        </div>
        <div className="transfer-box-form">
          <InputNumber
            onChange={onChangeInputNum}
            onBlur={() => roundFun(enterNum, 2)}
            value={enterNum}
            placeholder="0.00"
          />
          <div className="transfer-box-select" onClick={() => setVisible(true)}>
            {token.originalERC20Name ? (
              <Icon
                style={{ width: 20, height: 20 }}
                component={TokenIcons[token.originalERC20Name]}
              />
            ) : null}
            <div>
              {token.originalERC20Name
                ? isChecked
                  ? token.privateERC20Name
                  : token.originalERC20Name
                : "Select a token"}
            </div>
            <Icon component={DownArrowIcon} />
          </div>
        </div>
      </div>
      <div className="transfer-box-mid">
        <Icon component={TransferDownArrowIcon} />
      </div>
      <IsPrivateItem
        onChange={handleChangePrivate}
        transferAddr={transferAddr}
        isSuccessAddress={isSuccessAddress}
        isErrorAddress={isErrorAddress}
        isPrivate={isInputPrivate}
        setIsPrivate={setIsInputPrivate}
      />
      <div className="transfer-box-btn">
        {/*{*/}
        {/*    getButtonText() !== 'Transfer' ? <button className='disabled-btn' disabled>*/}
        {/*        <span className='btn-text'>{getButtonText()}</span>*/}
        {/*        {isLoading ? <LoadingOutlined style={{marginLeft: 8}} /> :null}*/}
        {/*    </button> : (isChecked || waitForTsx.isSuccess) ? <button className='btn' onClick={handleSubmitTrans}>*/}
        {/*        <span className='btn-text'>Transfer</span>*/}
        {/*        {isLoading ? <LoadingOutlined style={{marginLeft: 8}} /> :null}*/}
        {/*    </button> : <button className='btn' onClick={handleSubmitApprove}>*/}
        {/*        <span className='btn-text'>Approve</span>*/}
        {/*        {mockWrite?.isLoading || waitForTsx.isLoading ? <LoadingOutlined style={{marginLeft: 8}} /> :null}*/}
        {/*    </button>*/}
        {/*}*/}

        <div className="transfer-box-btn">
          <button
            className={getButtonText() !== "Transfer" ? "disabled-btn" : "btn"}
            disabled={getButtonText() !== "Transfer"}
            onClick={handleSubmitTrans}
          >
            {/*<button onClick={handleSubmitTrans}>>*/}
            <span className="btn-text">{getButtonText()}</span>
            {isLoading || loadContract ? (
              <LoadingOutlined style={{ marginLeft: 8 }} />
            ) : null}
          </button>
        </div>
      </div>

      <ModalToken
        setToken={setToken}
        isPrivate={isChecked}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
      <ModalAddAccount
        address={address}
        visible={accountVisible}
        onCancel={handleAccountCancel}
      />
      {successVisible ? (
        <ModalSuccess
          isSuccess={success}
          isError={error}
          loading={payWrite.isLoading || payPublicWrite.isLoading}
          payLoading={
            waitForTsx?.isLoading ||
            waitForPayTsx?.isLoading ||
            waitForPayPublicTsx?.isLoading
          }
          onCancel={handleSuccessCancel}
        />
      ) : null}
    </div>
  );
}
