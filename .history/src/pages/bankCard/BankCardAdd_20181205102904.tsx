import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
import { UserStorage } from "../../storage/UserStorage";

interface BankCardAddProps {
    history: History,
    location: Location
}

interface BankCardAddState {
}

export class BankCardAdd extends React.Component<BankCardAddProps, BankCardAddState> {
    bankname:string
    bankId: string
    pages: string

    constructor(props: BankCardAddProps) {
        super(props)
        this.pages = "/bankCard";
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
        UserService.Instance.addPayment(this.bankname, this.bankId).then( (res:any) => {
            const alert = Modal.alert
            alert('提示','新增成功')
            if(this.pages == "/walletQuiet"||this.pages == "/wallet"){
                UserService.Instance.defaultPayment(res.data[0].account).then( () => {
                    UserStorage.setCookie('bankcard',res.data[0].account);
                this.props.history.push(this.pages);
                })
            }else{
            this.props.history.push(this.pages);
            }
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    public componentDidMount (){
        const page = this.props.location.state&&this.props.location.state.page||'';
        if(page == 'wq'){
            this.pages = "/walletQuiet";
        }
        if(page == 'ww'){
            this.pages = "/wallet";
        }
    }
    public render() {
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">新增银行卡</div>
                </NavBar>
                <List renderHeader={() => ''} className="content-item-border">
                    <InputItem type="text" placeholder="请输入银行名" onBlur={this.onBankNameBlur}>银行名</InputItem>
                
                    <InputItem type="digit" placeholder="请输入银行卡号" onBlur={this.onBankid}>银行卡号</InputItem>
                
                </List>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="fans-footer">
                    <Button className="login-button" onClick={this.onSubmit}>提交新增</Button>
                </div>
            </div>
        )
    }
}