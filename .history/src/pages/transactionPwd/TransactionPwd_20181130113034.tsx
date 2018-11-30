import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";
import { Link } from "react-router-dom";

// import "./UpdatePwd.css"

interface TransactionPwdProps {
    history: History
}

interface TransactionPwdState {
    codeCountDown: number,
    isTP:boolean
}

export class TransactionPwd extends React.Component<TransactionPwdProps, TransactionPwdState> {
    codeCountDownTimer: number
    phone?: string
    code?: string
    password?: string
    confirmPassword?: string

    constructor(props: TransactionPwdProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            isTP:true,
            codeCountDown: 0,
        }
    }
    public componentDidMount() {
        let that = this;
        UserService.Instance.check_gesture_password().then( (res:any)=> {
            console.log(res)
            if(res.errno == 0){
                that.setState({
                    isTP:false
                })
            }
        }).catch( (err)=> {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
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
       
        const passwordInfo = "请输入不少于6位长度的密码"
        const confirmPasswordInfo = "密码与确认密码不一致"
        
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
        UserService.Instance.gesture_password(trimPassword, trimConfrimPassword).then( () => {
            const alert = Modal.alert
            alert('提示','修改交易密码成功')
            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }
    updataPwd = () => {
       
        const passwordInfo = "请输入不少于6位长度的密码"
        const confirmPasswordInfo = "密码与确认密码不一致"
        
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
        UserService.Instance.gesture_password(trimPassword, trimConfrimPassword).then( () => {
            const alert = Modal.alert
            alert('提示','修改交易密码成功')
            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }
    public render() {
        return (
            <div className="fans-container">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">{this.state.isTP?"设置交易密码":"修改交易密码"}</div>
                </NavBar>
                <List renderHeader={() => ''} className={this.state.isTP?"my-list":"my-list none"}>
                    <InputItem type="password" placeholder="请输入交易密码" onBlur={this.onPasswordBlur}>交易密码</InputItem>
                    <InputItem type="password" placeholder="请再次输入交易密码" onBlur={this.onConfirmPasswordBlur}>再次输入</InputItem>
                </List>
                <WhiteSpace size="lg"/>
                <WhiteSpace size="lg"/>
                <div className={this.state.isTP?"fans-footer":"fans-footer none"}>
                    <Button className="login-button" onClick={this.onSubmit}>确认</Button>
                </div>
                <List className={this.state.isTP?"my-list none":"my-list"}>
                    <InputItem type="password" placeholder="请输入原交易密码" onBlur={this.onPasswordBlur}>原交易密码</InputItem>
                
                    <InputItem type="password" placeholder="请输入新交易密码" onBlur={this.onConfirmPasswordBlur}>新交易密码</InputItem>
                
                    <InputItem type="password" placeholder="请再次输入交易密码" onBlur={this.onConfirmPasswordBlur}>再次输入</InputItem>
                </List>
                <Link to="/transactionPwdForget" className={this.state.isTP?"forgetT-link none":"forgetT-link"}>忘记交易密码</Link>
                <WhiteSpace size="lg" />
                <div className={this.state.isTP?"fans-footer none":"fans-footer"}>
                    <Button className="login-button" onClick={this.updataPwd}>修改密码</Button>
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