import React from "react";
import Icon from "@ant-design/icons";
import {AlertIcon} from "components/Icon";

export default  function AlertPrivate(props) {
    const {text, ...extra} = props;

    return (
        <div className="alert-content" {...extra}>
            <Icon component={AlertIcon} />
            <div style={{marginLeft: 8, fontWeight: 500, cursor: 'pointer'}}>{text}</div>
        </div>
    );
}
