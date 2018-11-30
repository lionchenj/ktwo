import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";

interface BankCardAddProps {
    history: History
}

interface BankCardAddState {
}

export class BankCardAdd extends React.Component<BankCardAddProps, BankCardAddState> {
    bankname:string
    bankId: string

    constructor(props: BankCardAddProps) {
        super(props)
        this.state = {
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/settings")
    }

    onBankNameBlur = (value: string) => {
        this.bankname = value
    }

    onBankid = (value: string) => {
        this.bankId = value
    }

    onSubmit = () => {
        const nameInfo = "请输入真实姓名"
        const idInfo = "请输入身份证号"
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
                        <div className="nav-title">忘记交易密码</div>
                </NavBar>
                    <List renderHeader={() => ''} className="content-item-border">
                        <InputItem labelNumber={6} type="text" placeholder="请输入真实姓名" onBlur={this.onBankNameBlur}>银行名</InputItem>
                    
                        <InputItem labelNumber={6} type="text" placeholder="请再次输入身份证号" onBlur={this.onBankid}>银行卡号</InputItem>
                    
                    </List>
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <div className="fans-footer">
                        <Button className="login-button" onClick={this.onSubmit}>修改密码</Button>
                    </div>
            </div>
        )
    }

    public componentWillUnmount() {
        this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
        this.codeCountDownTimer = 0
    }

    private _codeCountDownHander = () =>  {
        const newCodeCount = this.state.codeCountDown - 1
        if (newCodeCount <= 0) {
            this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
            this.codeCountDownTimer = 0
        }
        this.setState({
            ...this.state,
            codeCountDown: newCodeCount
        })
    }
}