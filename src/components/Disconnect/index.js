import {Tooltip} from 'antd';
import { LogoutLogo } from '../Icon';
import Icon from '@ant-design/icons';
import './index.less'

export default function Disconnect(props){
    return <div className='copy-box' {...props}>
        <Tooltip
            color='#454859'
            title="Disconnected">
          <Icon component={LogoutLogo} />
        </Tooltip>
    </div>
}
