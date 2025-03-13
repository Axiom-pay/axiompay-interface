import Navigator from "components/Navigator";
import "./index.less";
import background from "assets/background.jpg";
import metamask from "assets/metamask.svg";
import {switchNetwork} from "utils/help";
import {useAccount, useConnect, useNetwork} from "wagmi";
import Transfer from './componments/Transfer';
import { useState } from "react";


function Home() {
    const { connect, connectors, isLoading } = useConnect();
    const { isConnected, address} = useAccount();
    const { chain } = useNetwork();
    const [changeSign, setChainSign] = useState(false)

    const login = async () => {
        if(!isLoading){
            const eth = window.ethereum;
            if (!window.ethereum || !eth.isMetaMask) {
                window.open('https://metamask.io/')
                return;
            }

            if (!isConnected) {
                try{
                    await switchNetwork()
                    connect({ connector: connectors[0] });
                    // onCancel();
                } catch (e){
                    console.log(e);
                }
            }
        }
    }

    return (
        <div className="Welcome-background">
            <Navigator connected={false} changeSign={changeSign} />
            {address && chain?.id === window.TransformChainId ? <div className="home-transfer">
                <Transfer setChainSign={setChainSign} />
            </div> : <div>
                <div className="Welcome-image">
                    <img src={background} alt="background" />
                </div>
                <div className="Welcome-title">
                    <span>Privacy preserve protocol for stablecoin payment </span>
                </div>
                <div className="Welcome-subtitle">
                    <span>Connect your wallet to access axiompay</span>
                </div>
                <div className="Welcome-btn-container">
                    <button className="btn" onClick={login}>
                        <span className="btn-text" style={{display: 'flex', alignItems: 'center'}}>
                        <img src={metamask} alt="metamask" /> Connect to Metamask
                    </span>
                    </button>
                </div>
            </div>}

        </div >
    );
}

export default Home;
