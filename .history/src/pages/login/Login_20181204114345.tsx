import * as React from 'react';
import { History, Location } from "history";
import { Redirect, Link } from "react-router-dom";
import { Flex, List, InputItem, Button, Toast, WhiteSpace, Modal } from "antd-mobile";

import { UserStorage } from "../../storage/UserStorage";
// import  createForm  from "rc-form";

// import logo from "../../assets/logo.png"


import './Login.css'
import { Util } from '../../utils/Util';
import { UserService } from '../../service/UserService';



export interface LoginProps {
    history: History
    location: Location<any> | undefined
}

interface LoginState {
    redirectToReferrer: boolean,
    redirectToRegister: boolean,
    changeL: boolean,
    activate: boolean
}

export class Login extends React.Component<LoginProps, LoginState> {
    phone: string
    password: string
    activation: string
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            changeL: true,
            redirectToReferrer: false,
            redirectToRegister: false,
            activate: false
        }
    }

    navToRegister = () => {
        this.setState( {
            redirectToReferrer: false,
            redirectToRegister: true
        })
    }

    changeCn = () => {
        this.setState({
            changeL: true
        })
}
changeEn = () => {
    this.setState({
        changeL: false
    })
}
    onPhoneBlur = (value: string) => {
        this.phone = value
    }

    onPasswordBlur = (value: string) => {
        this.password = value
    }
    onActivationBlur = (value: string) => {
        this.activation = value
    }

    onSubmit = () => {
        const info = "请输入11位手机号码"
        const passwordInfo = "请输入不少于6位长度的密码"

        if (!this.phone) {
            Toast.info(info)
            return
        }
        const trimPhone = Util.trim(this.phone)
        if (!Util.validPhone(trimPhone)) {
            Toast.info(info)
            return
        }
        if (!this.password) {
            Toast.info(passwordInfo)
            return
        }
        const trimPassword = Util.trim(this.password)
        if (!Util.validPassword(trimPassword)){
            Toast.info(passwordInfo)
            return
        }
        UserService.Instance.login(trimPhone, trimPassword, this.activation).then( ()=>{
            this.setState({
                ...this.state,
                redirectToReferrer: true
            })
            let pwd = UserStorage.getCookie("touchpwd");
            if(!pwd){
                const alert = Modal.alert
                alert('提示','是否设置手势密码',[
                    { text:'设置', onPress: () => {
                        this.props.history.push("/touchPwd")
                    }},
                    { text: '跳过', onPress: () => UserStorage.setCookie('gesture','0') }
                ])
            }
        }).catch( err => {
            const message = (err as Error).message;
            Toast.fail(message);
            this.setState({
                activate: true
            })
        })
    }

    public componentDidCatch(error: any, info: any) {
        console.log("componentDidCatch", error, info)
    }

    public render() {
        const { redirectToReferrer, redirectToRegister} = this.state
        if (redirectToReferrer) {
            const to = {
                pathname: "/home"
            }
            return <Redirect to={to} />
        }
        if (redirectToRegister) {
            const to = {
                pathname: "/register"
            }
            return <Redirect to={to} />
        }

        
        return (
            <div className="login-container">
                
                <Flex direction="column">
                <div className="change-language">
                        <div className="code-button" onClick={this.changeEn}>English</div>
                        <div className="code-button" onClick={this.changeCn}>中文</div>
                    </div>
                    <div className="header">
                        <div>
                            <div className="logo" ></div>
                        </div>
                        <div className="app-title"></div>
                        <div className="app-subtitle" ></div>
                    </div> 
                    <div className="content">
                        <List className="content-item-border">
                            <InputItem type="phone" placeholder={this.state.changeL?"请输入手机号":"Your phone number"} onBlur={this.onPhoneBlur}></InputItem>
                        </List>
                        <List className="content-item-border">
                            <InputItem type="password" placeholder={this.state.changeL?"请输入登录密码":"Password"} onBlur={this.onPasswordBlur}></InputItem>
                        </List>
                        <List className={this.state.activate?"content-item-border":"content-item-border none"}>
                            <InputItem type="text" placeholder={this.state.changeL?"请输入激活码":"Activation coder"} onBlur={this.onActivationBlur}></InputItem>
                        </List>
                        <List className="content-item">
                            <Link to="/forget_pwd" className="forget-link" >{this.state.changeL?"忘记密码":"Forgot password？"}</Link>
                        </List>
                        <WhiteSpace size="lg" />
                        <WhiteSpace size="lg" />
                        <div className="button">
                            <List className="content-item">
                                <Button className="login-button" onClick={this.onSubmit} >{this.state.changeL?"立即登陆":"Login"}</Button>
                            </List>
                            <List className="content-item">
                                <Button type="ghost" className="register-button" onClick={this.navToRegister} >{this.state.changeL?"立即注册":"Register"}</Button>
                            </List>
                        </div>
                    </div>
                    
                </Flex>
            </div>

        )
    }
}



