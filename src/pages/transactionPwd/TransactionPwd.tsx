import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { Link } from "react-router-dom";

// import "./UpdatePwd.css"

interface TransactionPwdProps {
    history: History
}

interface TransactionPwdState {
    isTP:boolean
}

export class TransactionPwd extends React.Component<TransactionPwdProps, TransactionPwdState> {
    gesture_password:string
    password: string
    confirmPassword: string

    constructor(props: TransactionPwdProps) {
        super(props)
        this.state = {
            isTP:true,
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
    onRPasswordBlur = (value: string) => {
        this.gesture_password = value
    }
    onPasswordBlur = (value: string) => {
        this.password = value
    }

    onConfirmPasswordBlur = (value: string) => {
        this.confirmPassword = value
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
            alert('提示','设置交易密码成功')
            this.props.history.push("/settings")            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }
    updataPwd = () => {
        const gesture_passwordInfo = "请输入原密码"
        
        const passwordInfo = "请输入不少于6位长度的密码"
        const confirmPasswordInfo = "密码与确认密码不一致"
        
        if (!this.gesture_password){
            Toast.info(gesture_passwordInfo)
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
        UserService.Instance.loginGesturePassword(this.gesture_password, trimPassword, trimConfrimPassword).then( () => {
            const alert = Modal.alert
            alert('提示','修改交易密码成功')
            this.props.history.push("/settings")            
        }).catch( err => {
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
                <WhiteSpace size="lg" className={this.state.isTP?"":"none"}/>
                <WhiteSpace size="lg" className={this.state.isTP?"":"none"}/>
                <div className={this.state.isTP?"fans-footer":"fans-footer none"}>
                    <Button className="login-button" onClick={this.onSubmit}>确认</Button>
                </div>
                <List renderHeader={() => ''} className={this.state.isTP?"my-list none":"my-list"}>
                    <InputItem type="password" placeholder="请输入原交易密码" onBlur={this.onRPasswordBlur}>原交易密码</InputItem>
                
                    <InputItem type="password" placeholder="请输入新交易密码" onBlur={this.onPasswordBlur}>新交易密码</InputItem>
                
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
}