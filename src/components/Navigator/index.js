// import "./index.less";
import "./index.less";
import logo from "../../assets/logo.png";
import axiom from "assets/axiom.svg";
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useConnect,
  useSwitchNetwork,
} from "wagmi";
import { useState, useEffect } from "react";
import { switchNetwork, hashRender } from "utils/help";
import Icon from "@ant-design/icons";
import { switchNetworkIcon } from "components/Icon";
import DrawerInfo from "./DrawerInfo";

function Navigator(props) {
  const { changeSign } = props;
  const [address, setAddress] = useState("");
  const { isConnected, ...extra } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { chain } = useNetwork();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [address, chain?.id, changeSign]);

  const handleChangeAccount = async () => {
    if (extra?.address) {
      setAddress(extra.address);
    } else {
      setAddress("");
    }
  };

  useEffect(() => {
    if (extra.address && address !== extra.address) {
      handleChangeAccount();
    } else {
      setAddress("");
    }
  }, [extra?.address]);

  const login = async () => {
    if (!isLoading) {
      const eth = window.ethereum;
      if (!window.ethereum || !eth.isMetaMask) {
        window.open("https://metamask.io/");
        return;
      }

      if (!isConnected) {
        try {
          await switchNetwork();
          connect({ connector: connectors[0] });
          // onCancel();
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  return (
    <div>
      <div className="nav">
        <img src={logo} height="48px" alt="Navigator-Logo" />
        <div className="Connect-btn">
          {!address ? (
            <button onClick={login} className="btn">
              <span className="btn-text">Connect</span>
            </button>
          ) : chain?.id !== window.TransformChainId ? (
            <button className="btn">
              <span className="btn-text" onClick={switchNetwork}>
                Switch network
                <Icon style={{ marginLeft: 4 }} component={switchNetworkIcon} />
              </span>
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => setOpen(true)}
              style={{ fontSize: 16 }}
            >
              <img src={axiom} alt="logo" />
              <span style={{ fontSize: 16, marginLeft: 8 }}>
                {hashRender(address)}
              </span>
            </button>
          )}
        </div>
      </div>
      <DrawerInfo open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default Navigator;
