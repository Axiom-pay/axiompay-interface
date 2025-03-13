import { Drawer, Button } from "antd";
import Icon, { LoadingOutlined } from "@ant-design/icons";
import Copy from "components/Copy";
import Disconnect from "components/Disconnect";
import { useEffect, useState } from "react";
import "./index.less";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useContractRead,
  useNetwork,
  useSignMessage,
} from "wagmi";
import {
  getImgFromHash,
  hashRender,
  toThousands,
  TokenIcons,
  getHasPrivate,
  handleGetAddress,
  ToString,
  getPrivateKey,
  exchangeEth,
  hasStorageData,
} from "utils/help";
import { AccountLogo } from "components/Icon";
import { poolConfig } from "../../server/pool";
import { payConfig } from "../../server/pay";
import { encodeToPoint, decryptFromChainRes } from "utils/ether";

const Item = (props) => {
  const { priceItem } = props;
  const { address } = useAccount();
  const configs = payConfig(priceItem.axiomPay);
  const { data, isLoading } = useContractRead({
    ...configs,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <div className="address-list-item">
      <div className="address-list-item-title">
        <Icon component={TokenIcons[priceItem.originalERC20Name]} />
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
  const { priceItem } = props;
  const { address } = useAccount();
  const [val, setVal] = useState("");
  const { chain } = useNetwork();
  const configs = payConfig(priceItem.axiomPay);
  const privateAddress = handleGetAddress(chain?.id, address);
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useContractRead({
    ...configs,
    functionName: "privateBalanceOf",
    args: [privateAddress],
  });

  const initData = async () => {
    if (data) {
      try {
        setLoading(true);
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
  }, [data?.viewKey]);
  return (
    <div className="address-list-item">
      <div className="address-list-item-title">
        <Icon component={TokenIcons[priceItem.originalERC20Name]} />
        <span style={{ marginLeft: 8 }}>{priceItem.privateERC20Name}</span>
      </div>
      {isLoading || loading ? (
        <LoadingOutlined style={{ marginLeft: 8 }} />
      ) : (
        <div className="price">{exchangeEth(ToString(val)) || 0}</div>
      )}
    </div>
  );
};
export default function DrawerInfo(props) {
  const { open, onClose } = props;
  const { address } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({ address });
  const [show, setShow] = useState(false);
  const hasPrivate = getHasPrivate(chain?.id, address);
  const storageData = hasStorageData(chain?.id, address);
  const privateAddress = handleGetAddress(chain?.id, address);
  const { disconnect } = useDisconnect();
  const { data: signData, isError: signIsError } = useSignMessage();

  const { data: list } = useContractRead({
    ...poolConfig,
    functionName: "showLists",
    watch: true,
  });

  useEffect(() => {
    if (!open) {
      setShow(false);
    }
  }, [open]);

  const handleShow = () => {
    setShow(!show);
  };

  const handleLogout = () => {
    disconnect();
    onClose();
  };

  return (
    <Drawer width={320} placement="right" onClose={onClose} open={open}>
      <div>
        <div className="sub-title">Public address</div>
        <div>
          <div className="user-info">
            <div className="user-info-left">
              <img src={getImgFromHash(address)} alt="" />
              <div style={{ marginLeft: 8 }}>
                <div style={{ lineHeight: "21px" }}>{hashRender(address)}</div>
                <div style={{ marginTop: 4 }} className="sub-title">
                  {balance.data
                    ? `${toThousands(balance.data.formatted)} ${
                        balance.data.symbol
                      }`
                    : `0 AXM`}
                </div>
              </div>
            </div>
            <div className="user-info-right">
              <Copy text={address} />
              <Disconnect onClick={handleLogout} style={{ marginLeft: 8 }} />
            </div>
          </div>

          <div className="address-list">
            {open
              ? (list || []).map((item) => (
                  <div>
                    <Item priceItem={item} />
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="private-box">
          <div className="sub-title">Private address</div>
          <div className={hasPrivate ? "user-account-bg" : "user-account"}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="user-account-icon">
                <Icon component={AccountLogo} />
              </div>
              <div>
                {hasPrivate
                  ? hashRender(privateAddress)
                  : !storageData && (!signData || signIsError)
                  ? "No sign on Metamask yet"
                  : "No private account yet"}
              </div>
            </div>
            {hasPrivate ? <Copy text={privateAddress} /> : null}
          </div>
        </div>
        {hasPrivate ? (
          <div style={{ marginTop: 8 }}>
            <Button className="default-button" onClick={handleShow}>
              {show
                ? "Hide private ERC-20 amount"
                : "Check private ERC-20 amount"}
            </Button>
          </div>
        ) : null}

        {show ? (
          <div>
            <div
              className="address-list"
              style={{ marginTop: 8, background: "rgba(49, 130, 206, 0.20)" }}
            >
              {open
                ? (list || []).map((item) => (
                    <div>
                      <PrivateItem priceItem={item} />
                    </div>
                  ))
                : null}
            </div>
          </div>
        ) : null}
      </div>
    </Drawer>
  );
}
