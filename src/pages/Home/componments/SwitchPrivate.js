import React from "react";
import Icon from "@ant-design/icons";
import { UnlockIcon, LockIcon } from "components/Icon";

export default function SwitchPrivate(props) {
    const {checked, onChange} = props;
    const handleChange = (e) => {
        e.stopPropagation()
        onChange(!checked);
    }

    return (
        <div>
            <label>
                <input type="checkbox" className="switch-input"/>
                <span className={checked ? 'switch-container checked-switch' : 'switch-container unchecked-switch'} onClick={handleChange}>
                    <span className="switch-icons">
                        {checked ? <Icon component={LockIcon} /> : <Icon component={UnlockIcon} />}
                    </span>
                </span>
            </label>

        </div>
    );
}

