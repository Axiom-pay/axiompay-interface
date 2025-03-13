import {Tooltip} from 'antd';
// import { Icon, useColorModeValue, useColorMode } from "@chakra-ui/react"
import CopyToClipboard from 'react-copy-to-clipboard';
import React, { useState } from 'react';
import { CopyIcon } from '../Icon';
import Icon from '@ant-design/icons';
import './index.less'

export default function Copy(props){
    const { text } = props;
    const [copyTooltip, setCopyTooltip] = useState(false);
    return <div className='copy-box'>
        <Tooltip
            color='#454859'
            // overlayInnerStyle={{background: '#454859'}}
            title={copyTooltip ? "Copied" : 'Copy'}>
            <CopyToClipboard
                onCopy={() => {
                    setCopyTooltip(true);
                    setTimeout(() => {
                        setCopyTooltip(false);
                    }, 1000);
                }}
                text={text}
            >
                {/*<div className="copy-box">*/}
                {/*    <Icon component={CopyIcon} />*/}
                {/*</div>*/}
                <Icon component={CopyIcon} />
            </CopyToClipboard>
        </Tooltip>
    </div>
}
