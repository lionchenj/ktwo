import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";

interface TransactionPwdForgetProps {
    history: History
}

interface TransactionPwdForgetState {
    codeCountDown: number,
    changeL:boolean
}

export class TransactionPwdForget extends React.Component<TransactionPwdForgetProps, TransactionPwdForgetState> {
    codeCountDownTimer: number
    name:string
    userId: string
    phone: string
    code: string
    password: string
    confirmPassword: string

    constructor(props: TransactionPwdForgetProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            changeL:true,
            codeCountDown: 0,
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onUserid = (value: string) => {
        this.userId = value
    }

    onPhoneBlur = (value: string) => {
        this.phone = value
    }

    onCodeBlur = (value: string) => {
        this.code = value
    }

    onPasswordBlur = (value: string) => {
        this.password = value
    }

    onConfirmPasswordBlur = (value: string) => {
        this.confirmPassword = value
    }

    getCode = () => {
        if (this.state.codeCountDown > 0) {
            return 
        }
        const phone =  this.phone
        const info = "请输入11位手机号码"
        if (!phone) {
            Toast.info(info)
            return
        }
        const trimPhone = Util.trim(phone)
        if (!Util.validPhone(trimPhone)) {
            Toast.info(info)
            return 
        }
        
        UIUtil.showLoading("正在发送验证码")
        UserService.Instance.getMobileMassges(trimPhone).then( ()=> {
            if (this.codeCountDownTimer != 0) {
                window.clearInterval(this.codeCountDownTimer!)
            }
            const info = "验证码发送成功"
            UIUtil.showInfo(info)
            this.setState({
                ...this.state,
                codeCountDown: 60
            }, () => {
                this.codeCountDownTimer = window.setInterval(this._codeCountDownHander, 1000)
            })
        }).catch( (err)=> {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }

    onSubmit = () => {
        const nameInfo = "请输入真实姓名"
        const useridInfo = "请输入身份证号"
        const phoneInfo = "请输入11位手机号码"
        const codeInfo = "请输入验证码"
       
        const passwordInfo = "请输入不少于6位长度的密码"
        const confirmPasswordInfo = "密码与确认密码不一致"
        if (!this.name) {
            Toast.info(nameInfo)
            return
        } 
        if (!this.phone) {
            Toast.info(useridInfo)
            return
        } 
        if (!this.phone) {
            Toast.info(phoneInfo)
            return
        } 
        const trimPhone = Util.trim(this.phone!)
        if (!Util.validPhone(trimPhone)){
            Toast.info(phoneInfo)
            return
        }
        if (!this.code) {
            Toast.info(codeInfo)
            return
        }
        const trimCode = Util.trim(this.code!)
        if (!this.password) {
            Toast.info(passwordInfo)
            return
        }
        const trimPassword = Util.trim(this.password!)
        if (!Util.validPassword(trimPassword)){
            Toast.info(passwordInfo)
            return 
        }
        if (!this.confirmPassword) {
            Toast.info(confirmPasswordInfo)
            return
        }
        const trimConfrimPassword = Util.trim(this.confirmPassword!)
        if (trimPassword !== trimConfrimPassword) {
            Toast.info(confirmPasswordInfo)
            return
        }
        UserService.Instance.forgetGesturePassword(this.name, this.userId, trimPhone, trimCode, trimPassword, trimConfrimPassword).then( () => {
            const alert = Modal.alert
            alert('提示','修改密码成功')
            
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
                        <InputItem labelNumber={6} type="text" placeholder="请输入真实姓名" onBlur={this.onNameBlur}>姓名</InputItem>
                    
                        <InputItem labelNumber={6} type="text" placeholder="请再次输入身份证号" onBlur={this.onUserid}>身份证号</InputItem>
                    
                        <InputItem labelNumber={6} type="phone" placeholder="请输入手机号码" onBlur={this.onPhoneBlur}>手机号码</InputItem>
                    
                        <InputItem labelNumber={6}  type="number" placeholder={this.state.changeL?"请输入短信验证码":"SMS code"} onBlur={this.onCodeBlur}
                            extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: (this.state.changeL?"获取验证码":"Get code")}</Button>}
                            onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}>验证码
                        </InputItem>
                    
                        <InputItem labelNumber={6} type="password" placeholder="请输入新交易密码" onBlur={this.onConfirmPasswordBlur}>新交易密码</InputItem>
                    
                        <InputItem labelNumber={6} type="password" placeholder="请再次输入交易密码" onBlur={this.onConfirmPasswordBlur}>再次输入</InputItem>
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