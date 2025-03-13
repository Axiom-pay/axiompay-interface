import React, { useEffect, useState } from "react";
import Icon, { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import {
  exchangeEth,
  getPrivateKey,
  handleGetAddress,
  TokenIcons,
  ToString,
} from "../../../utils/help";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { payConfig } from "../../../server/pay";
import { poolConfig } from "../../../server/pool";
import { decryptFromChainRes, encodeToPoint } from "../../../utils/ether";

const Item = (props) => {
  const { priceItem, onClick } = props;
  // console.log('priceItem.axiomPay', priceItem.axiomPay);
  const configs = payConfig(priceItem.axiomPay);
  const { address } = useAccount();
  const { data, isLoading } = useContractRead({
    ...configs,
    functionName: "balanceOf",
    args: [address],
  });

  const handleClickItem = (item) => {
    onClick(item);
  };

  // return <div>{data}</div>
  return (
    <div
      className="address-list-item token-item"
      onClick={() =>
        handleClickItem({
          ...priceItem,
          price: exchangeEth(ToString(data)),
          tokenBal: data,
        })
      }
    >
      <div className="address-list-item-title ">
        <Icon
          width="20px"
          height="20px"
          component={TokenIcons[priceItem.originalERC20Name]}
        />
        <span style={{ marginLeft: 8 }}>{priceItem.originalERC20Name}</span>
      </div>
      {isLoading ? (
        <LoadingOutlined style={{ marginLeft: 8 }} />
      ) : (
        <div className="price">{exchangeEth(ToString(data)) || 0}</div>
      )}
    </div>
  );
};

const PrivateItem = (props) => {
  const { priceItem, onClick, isPrivate, visible } = props;
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [val, setVal] = useState("");
  const [privateVal, setPrivateVal] = useState("");
  const configs = payConfig(priceItem.axiomPay);
  const [loading, setLoading] = useState(false);
  const privateAddress = handleGetAddress(chain?.id, address);
  // const { address } = useAccount();

  const { data, isLoading } = useContractRead({
    ...configs,
    functionName: "privateBalanceOf",
    args: [privateAddress],
    watch: true,
  });

  const handleClickItem = (item) => {
    if (isLoading || loading) return;
    onClick(item);
  };

  const initData = async () => {
    if (data) {
      try {
        setLoading(true);
        setPrivateVal(data);
        let [c1Point, c2Point] = encodeToPoint(data);
        const privateKey = getPrivateKey(chain?.id, address);
        let decryptRes = await decryptFromChainRes(
          c1Point,
          c2Point,
          privateKey
        );
        setVal(decryptRes);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    initData();
  }, [data?.viewKey, isPrivate, visible]);

  // return <div>{data}</div>
  return (
    <div
      className="address-list-item token-item"
      onClick={() =>
        handleClickItem({
          ...priceItem,
          price: exchangeEth(ToString(val)),
          tokenBal: val,
          privateVal,
        })
      }
    >
      <div className="address-list-item-title ">
        <Icon
          width="20px"
          height="20px"
          component={TokenIcons[priceItem.originalERC20Name]}
        />
        <span style={{ marginLeft: 8 }}>{priceItem.privateERC20Name}</span>
      </div>
      {isLoading || loading ? (
        <LoadingOutlined style={{ marginLeft: 8, color: "#fff" }} />
      ) : (
        <div className="price">{exchangeEth(ToString(val)) || 0}</div>
      )}
    </div>
  );
};

export default function ModalToken(props) {
  const { visible, onCancel, setToken, isPrivate } = props;
  const handleToken = (item) => {
    setToken(item);
    onCancel();
  };
  const { data: list } = useContractRead({
    ...poolConfig,
    functionName: "showLists",
    // account: address,
    watch: true,
  });

  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      visible={visible}
      footer={null}
      style={{ top: 160 }}
      className="token-modal"
      onCancel={onCancel}
      title="Select token"
    >
      {visible ? (
        <div className="address-list">
          {(list || []).map((item) => (
            <div style={{ cursor: "pointer" }}>
              {isPrivate ? (
                <PrivateItem
                  visible={visible}
                  priceItem={item}
                  isPrivate={isPrivate}
                  onClick={handleToken}
                />
              ) : (
                <Item
                  visible={visible}
                  priceItem={item}
                  onClick={handleToken}
                />
              )}
            </div>
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
