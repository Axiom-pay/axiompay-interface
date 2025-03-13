import React, {useState} from "react";
import Icon from "@ant-design/icons";
import {PrivateIcon, GoIcon} from "components/Icon";
import { Modal } from 'antd'
import {getPublicKey, handleErrorMsg, handleGetAddress, hashPrivateRender, setHasPrivate} from "../../../utils/help";
import { LoadingOutlined } from '@ant-design/icons';
import {useContractWrite, useNetwork, useWaitForTransaction} from "wagmi";
import {poolConfig} from "../../../server/pool";
import { message } from "antd";
import {generateOnchainPublicKey} from "../../../utils/ether";
import {secp256k1} from "@noble/curves/secp256k1";

export default  function ModalAddAccount(props) {
    const {visible, onCancel, address} = props;
    const { chain } = useNetwork();
    const privateAddress = handleGetAddress(chain?.id, address);
    const publicKey = getPublicKey(chain?.id, address);

    const [hasPrivate, sethHasPrivate] = useState(false);
    // const
    const registerAccountWrite = useContractWrite({
        ...poolConfig,
        functionName: 'registerAccount',
    });

    const waitForTsx = useWaitForTransaction({
        hash: registerAccountWrite.data?.hash,
        onSuccess(data) {
            setHasPrivate(chain?.id, address,1);
            sethHasPrivate(true);
        },
        onError(e){
            setHasPrivate(chain?.id, address,0);
            sethHasPrivate(false)
            message.error('create error')
        }
    })

    const handleAccount = async () => {
        try{
            let point = secp256k1.ProjectivePoint.fromHex(publicKey.substring(2));
            const key = generateOnchainPublicKey(point);
            await registerAccountWrite.writeAsync({ args: [privateAddress, key]});
        } catch (e){
            setHasPrivate(chain?.id, address,0);
            sethHasPrivate(false)
            handleErrorMsg(e, registerAccountWrite);
        }
    }

    const handleGoBack = () => {
        onCancel(privateAddress);
    }

    return (
        <Modal
            maskClosable={false}
            keyboard={false}
            destroyOnClose
            visible={visible}
            footer={null}
            style={{ top: hasPrivate ? '30%' : 160 }}
            width="450px"
            className="token-modal"
            onCancel={() => onCancel()}
            title="Private account"
        >
            {hasPrivate ? <div className="account-box-private">
                <div className="account-box-private-account">
                    <Icon component={PrivateIcon} style={{width: 48, height: 48, fontSize: 48}} />
                    <div>
                        {hashPrivateRender(privateAddress)}
                    </div>
                </div>
                <div className="account-box-private-icon" onClick={handleGoBack}>
                    <Icon component={GoIcon}  />
                </div>
            </div> : <div>
               <div className="account-box">
                   <Icon component={PrivateIcon} />
                   <div>No private account yet!</div>
               </div>

               <div className="transfer-box-btn">
                   <button className="btn" onClick={handleAccount}>
                       <span className='btn-text' >Create private account</span>
                       {registerAccountWrite.isLoading || waitForTsx.isLoading ?  <LoadingOutlined style={{marginLeft: 8}} /> : null}
                   </button>
               </div>
           </div>}
        </Modal>
    );
}
