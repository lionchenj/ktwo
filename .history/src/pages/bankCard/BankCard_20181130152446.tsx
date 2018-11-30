import * as React from 'react';

import { NavBar, Icon, ListView, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";

interface BankCardProps {
    history: History
}

interface BankCardState {
    codeCountDown: number,
    changeL:boolean
}

export class BankCard extends React.Component<BankCardProps, BankCardState> {
    codeCountDownTimer: number
    name:string
    userId: string
    phone: string
    code: string
    password: string
    confirmPassword: string

    constructor(props: BankCardProps) {
        
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            changeL:true,
            codeCountDown: 0,
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/settings")
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
        if (!this.userId) {
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
            this.props.history.push("/settings")            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
  
          const row = (rowData: model.exChangeRecordItem, sectionID: number, rowID: number) => {
     
            return (
                <div style={{height:".6rem",marginTop:".01rem"}}>
                    <div style={{float:"left",padding:".1rem"}}>{rowData.coid_name}<div style={{marginTop:".1rem"}}>{rowData.number}</div></div>
                    <div style={{float:"right",padding:".1rem"}}>{rowData.orderid}<div style={{marginTop:".1rem"}}>{rowData.time}</div></div>
                </div>
  
            );
          };
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">忘记交易密码</div>
                </NavBar>
                <ListView renderHeader={() => ''}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource1}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading1 ? 'Loading...' : ''}
                            </div>)}
                            renderRow={row1}
                            renderSeparator={separator1}
                            className="am-list"
                            pageSize={4}
                            // useBodyScroll
                            onScroll={() => { console.log('scroll'); }}
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                        />
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <div className="fans-footer">
                        <Button className="login-button" onClick={()=>{this.props.history.push("/bankCardAdd")}}>新增银行卡</Button>
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