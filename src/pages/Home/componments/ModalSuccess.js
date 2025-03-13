import React from "react";
import {SuccessCheckIcon} from "components/Icon";
import Icon from "@ant-design/icons";
import Lottie from 'react-lottie'
import jsonFile from '../../../../public/project.json';
import "./index.less";

export default  function ModalSuccess(props) {
    const {onCancel, loading = true, isSuccess, isError, payLoading} = props;
    const Options = {
        loop: true,
        autoplay: true,
        animationData: jsonFile,
    };

    return (
        <div className="mask">
            <Lottie options={Options} width="100%" isClickToPauseDisabled={true} />
            {loading ? <div className='fadeIn' style={{textAlign: 'center'}}>
                    <div className="success-text"> Hello Fren. Your request is in progress.</div>
                    <div className="success-text"> Please confirm in your wallet</div>
                </div> : payLoading ? <div className='fadeIn' style={{textAlign: 'center'}}>
                <div className="success-text"> Hello Fren. Your request is in progress.</div>
                <div className="success-text"> Please wait for transaction</div>
            </div> : isSuccess ? <div className="successFadeIn">
                <Icon component={SuccessCheckIcon} />
                <div className="success-text">Transaction Success</div>
                <button className="btn" onClick={onCancel}>
                    <span className='btn-text'>Done</span>
                </button>
            </div> : isError ? <div className="successFadeIn">
                <div className="success-text">Transaction Error</div>
                <button className="btn" onClick={onCancel}>
                    <span className='btn-text'>Done</span>
                </button>
            </div> : null}
        </div>
    );
}
