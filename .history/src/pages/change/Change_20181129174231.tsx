import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, ActionSheet, Modal, Tabs, Toast} from "antd-mobile";
import { History, Location } from "history";
import "./Change.css"

import QRCode from "qrcode.react";

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import { Util } from '../../utils/Util';
import delimg from "../../assets/jftc_18.jpg"

interface ChangeProps {
    location: Location,
    history: History
}

interface ChangeState {
    codeCountDown: number,
    usableCoin?: model.UsableCoin,
    selectedCoinId: "1"|"2", // 币ID 1:EOS 2:VETH,
    text: string,
    phone: string,
    userInfo?: model.User,
    gesturePassword:string,
    showKey:boolean
}
const tabs = [
    { title: '转入' },
    { title: '转出' },
];
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';
export class Change extends React.Component<ChangeProps, ChangeState> {
    codeCountDownTimer: number
    changeNumber: string
    name: string
    gesturePasswords:string
    constructor(props: ChangeProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.gesturePasswords = ''
        this.state = {
            phone: '',
            codeCountDown: 0,
            selectedCoinId: "1",
            text: '18900000002',
            gesturePassword:'',
            showKey:false
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onSelectCoinId = () => {
        const buttons = ['EOS', 'VETH', '取消']
        ActionSheet.showActionSheetWithOptions({
            options: buttons,
            cancelButtonIndex: buttons.length - 1,
            maskClosable: true,
        }, (buttonIndex) => {
            if (buttonIndex != 0 && buttonIndex != 1) {
                return 
            }
            this.setState({
                selectedCoinId: (buttonIndex == 0 ) ? "1" : "2"
            })
            console.error("onSelectCoinId", buttonIndex)
        })
    }

    onNumberBlur = (value: string) => {
        this.changeNumber = value
    }
    
    onPhoneBlur = (value: string) => {
        this.setState({
            phone : value
        })
    }

    onNameBlur = (value: string) => {
        this.name = value
    }

    onSubmit = () => {
        UIUtil.showLoading("转换中")
        UserService.Instance.give(this.changeNumber, this.state.phone, this.state.gesturePassword).then( () => {
            UIUtil.hideLoading()
            Modal.alert('提示','转出成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })

    }
    onGolog = () =>{
        this.props.history.push("/changeHistory")
    }
    public componentDidMount () {
        
    }
    onCheckgesturePwd = () => {
        
        const info = "请输入11位手机号码"
        const numberInfo = "请输入数量"
        if (!this.changeNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.state.phone) {
            UIUtil.showInfo(info)
            return
        } 
        const trimPhone = Util.trim(this.state.phone!)
        if (!Util.validPhone(trimPhone)){
            UIUtil.showInfo(info)
            return
        }
        UserService.Instance.check_gesture_password().then( (res:any)=> {
            console.log(res)
            if(res.errno == 0){
                this.showKey();
            }
        }).catch( (err)=> {
            const message = (err as Error).message;
            Toast.fail(message);
            this.props.history.push("/transactionPwd");
        })
    }
    //键盘事件
    showKey = () =>{
        this.setState({
            gesturePassword:'',
            showKey: true
        })
        this.gesturePasswords = ''
    }
    numberClick = (event: any) => {
        console.log(event)
        let val = this.gesturePasswords + event.target.innerHTML ;
        this.gesturePasswords = val;
        if(val.length>5){
            this.setState({
                showKey: false
            })
            this.onSubmit();
        }
        this.setState({
            gesturePassword:val
        })
    }
    delClick = () => {
        console.log('1')
        let val = this.gesturePasswords.substring(0,this.gesturePasswords.length-1)
        console.log(val)
        this.gesturePasswords = val;
        this.setState({
            gesturePassword:val
        })
    }
    public render() {
        let thisMobile = window.localStorage.getItem('mobile');
        // const refUrl = `https://www.bst123456.com/change?mobile=${this.state.userInfo&&this.state.userInfo.mobile}`
        const refUrl = `http://dev110.weibanker.cn/chenjj/www/ktwo/build/index.html?mobile=${thisMobile}`
        const mobile = this.props.location.state.mobile;
        this.setState({
            phone : mobile
        })
        let pageTabs = 0;
        if (mobile) {
            pageTabs = 1;
        }
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="change-navbar-right" onClick={this.onGolog}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">转入转出</div>
                </NavBar>
                <Tabs tabs={tabs} initialPage={pageTabs}>
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <div className="change-code-title">扫描二维码快速对我转账</div>
                        <div className="change-code-img">
                            <QRCode value={refUrl} size={150} />
                        </div>
                    </div>
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <List className="change-list">
                            <InputItem placeholder="请输入个数" type="number"
                                onBlur={this.onNumberBlur}
                                >转出通证个数</InputItem>
                            <InputItem placeholder="请输入接收人手机号" value={this.state.phone} type="phone" onChange={this.onPhoneBlur} >收证人手机号</InputItem>
                            
                        </List>
                        <WhiteSpace size="lg" />
                        <WhiteSpace size="lg" />
                        <div className="fans-footer"><Button onClick={this.onCheckgesturePwd} >确认</Button></div>
                    </div>
                </Tabs>
                <div className={this.state.showKey?'':'none'}>
                    <div style={{position: 'fixed',width: '100%',bottom: '0',backgroundColor: '#fff'}} id="numkey">
                        <ul id="nub_ggg" className="nub_ggg">
                            <li><div onClick={this.numberClick} className='keynum'>1</div></li>
                            <li><div onClick={this.numberClick} className='keynum zj_x'>2</div></li>
                            <li><div onClick={this.numberClick} className='keynum'>3</div></li>
                            <li><div onClick={this.numberClick} className='keynum'>4</div></li>
                            <li><div onClick={this.numberClick} className='keynum zj_x'>5</div></li>
                            <li><div onClick={this.numberClick} className='keynum'>6</div></li>
                            <li><div onClick={this.numberClick} className='keynum'>7</div></li>
                            <li><div onClick={this.numberClick} className='keynum zj_x'>8</div></li>
                            <li><div onClick={this.numberClick} className='keynum'>9</div></li>
                            <li><div className="del"></div></li>
                            <li><div onClick={this.numberClick} className='keynum zj_x'>0</div></li>
                            <li><div onClick={this.delClick} className="del" ><img id="del" src={delimg}/></div></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}