import * as React from 'react';
import { NavBar, Icon, List, Button, Switch, Modal} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History } from "history";
import "./Settings.css"
import { UserStorage } from "../../storage/UserStorage";

import iconCode from "../../assets/setting_code.png"
import iconMy from "../../assets/setting_my.png"
import iconLogpwd from "../../assets/settint_logpwd.png"
import iconTransaction from "../../assets/settint_transaction.png"
import iconGesture from "../../assets/settint_gesture.png"
import iconChangeG from "../../assets/settint_changegesture.png"

interface SettingsProps {
    history: History,
    
}

interface SettingsState {
    redirectToLogin: boolean,
    checkeds: boolean
}

export class Settings extends React.Component<SettingsProps, SettingsState> {

    constructor(props: SettingsProps) {
        super(props)
        this.state = {
            redirectToLogin: false,
            checkeds: false
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.push('/home')
    }
    
    onLogout = () => {
        UserStorage.delCookie('User.AccessTokenKey');
        UserStorage.delCookie('gesture');
        UserStorage.delCookie("touchpwd");
        this.setState( {
            redirectToLogin: true
        })
    }

    public render() {
        if (this.state.redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />
        }
        
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">设置</div>
                </NavBar>
                <List renderHeader={() => ''} className="my-list">
                    <List.Item thumb={iconCode} arrow="horizontal" onClick={()=>{this.props.history.push("/myCode")}}>我的二维码</List.Item>
                    <List.Item thumb={iconMy} arrow="horizontal" onClick={()=>{this.props.history.push("/idcard")}}>实名认证</List.Item>
                    <List.Item thumb={iconMy} arrow="horizontal" onClick={()=>{this.props.history.push("/bankCard")}}>银行卡</List.Item>
                    <List.Item thumb={iconLogpwd} arrow="horizontal" onClick={()=>{this.props.history.push("/update_pwd")}}>登陆密码</List.Item>
                    <List.Item thumb={iconTransaction} arrow="horizontal" onClick={()=>{this.props.history.push("/transactionPwd")}}>交易密码</List.Item>
                    <List.Item thumb={iconGesture} extra={<Switch
                    checked={UserStorage.getCookie('gesture') == "1" ? true : false}
                    onClick={checked => {
                        let pwd = UserStorage.getCookie("touchpwd");
                        if(!pwd && checked){
                            const alert = Modal.alert
                            alert('提示','是否设置手势密码',[
                                { text:'ok', onPress: () => {
                                    this.props.history.push("/touchPwd")
                                }},
                                { text: 'Cancel', onPress: () => console.log('cancel') }
                            ])
                        }else{
                            UserStorage.setCookie('gesture',checked ? "1" : "0");
                            this.setState({
                                checkeds : checked ? true : false
                            })
                        }
                      return false;
                    }}
                  />}>手势密码</List.Item>
                    <List.Item thumb={iconChangeG} arrow="horizontal" onClick={()=>{this.props.history.push("/touchPwd", {updata: "1"})}}>修改手势密码</List.Item>
                </List>
                <div className="fans-footer">
                    <Button onClick={this.onLogout} >退出账号</Button>
                </div>
            </div>
        )
    }
}