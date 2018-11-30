import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';

interface saomiaoProps {
    history: History
}

interface saomiaoState {
}

export class saomiao extends React.Component<saomiaoProps, saomiaoState> {
    bankname:string
    bankId: string

    constructor(props: saomiaoProps) {
        super(props)
        this.state = {
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/bankCard")
    }

    onBankNameBlur = (value: string) => {
        this.bankname = value
    }

    onBankid = (value: string) => {
        this.bankId = value
    }

    onSubmit = () => {
        const nameInfo = "请输入银行名"
        const idInfo = "请输入银行卡号"
        if (!this.bankname) {
            Toast.info(nameInfo)
            return
        } 
        if (!this.bankId) {
            Toast.info(idInfo)
            return
        }
        UserService.Instance.addPayment(this.bankname, this.bankId).then( () => {
            const alert = Modal.alert
            alert('提示','新增成功')
            this.props.history.push("/bankCard")            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    public render() {
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">新增银行卡</div>
                </NavBar>
                <div id="bcid">
                    <div style={height:'40%'}></div>
                    <p className="tip">...载入中...</p>
                </div>
                <footer>
                    <div className="fbt" onclick="back()">取　 消</div>
                    <div className="fbt" onclick="scanPicture()">从相册选择二维码</div>
                </footer>
            </div>
        )
    }
}