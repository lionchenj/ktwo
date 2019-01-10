import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, ActionSheet, Modal, Toast} from "antd-mobile";
import { History, Location } from "history";
import "./activation.css"

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import { Util } from '../../utils/Util';
import delimg from "../../assets/jftc_18.jpg"
// import { number } from 'prop-types';

interface activationProps {
    location: Location,
    history: History
}

interface activationState {
    codeCountDown: number,
    usableCoin?: model.UsableCoin,
    selectedCoinId: "1"|"2", // 币ID 1:EOS 2:VETH,
    text: string,
    phone: string,
    userInfo?: model.User,
    gesturePassword:string,
    showKey:boolean
    mobile: string
}

const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';
export class activation extends React.Component<activationProps, activationState> {
    codeCountDownTimer: number
    activationNumber: string
    name: string
    gesturePasswords:string
    constructor(props: activationProps) {
        super(props);
        this.codeCountDownTimer = 0;
        this.gesturePasswords = '';
        this.state = {
            phone: '',
            codeCountDown: 0,
            selectedCoinId: "1",
            text: '18900000002',
            gesturePassword:'',
            showKey:false,
            mobile:''
        }
    }

    onRedirectBack = () => {
        const history = this.props.history;
        history.push("/home");
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
        this.activationNumber = value
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
        UserService.Instance.activationTransfer(this.activationNumber, this.state.phone, this.gesturePasswords).then( () => {
            UIUtil.hideLoading()
            Modal.alert('提示','转出成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })

    }
    onGolog = () =>{
        this.props.history.push("/activationHistory")
    }
    public componentDidMount () {
        const mobile = this.props.location.state&&this.props.location.state.mobile||'';
        if(mobile){
            this.setState({
                phone : mobile,
                mobile : mobile
            })
        }
    }
    onCheckgesturePwd = () => {
        
        const info = "请输入11位手机号码"
        const numberInfo = "请输入数量"
        if (!this.activationNumber) {
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
        this.setState({
            gesturePassword:val
        })
        if(val.length>5){
            this.setState({
                showKey: false
            })
            this.onSubmit();
        }
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
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="change-navbar-right" onClick={this.onGolog}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">转出激活卡</div>
                </NavBar>
                <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                    <List className="change-list">
                        <InputItem placeholder="请输入个数" type="number"
                            onBlur={this.onNumberBlur}
                            >转出激活卡个数</InputItem>
                        <InputItem placeholder="请输入接收人手机号" value={this.state.phone} type="number" maxLength={11} onChange={this.onPhoneBlur} >收卡人手机号</InputItem>
                    </List>
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <div className="fans-footer"><Button onClick={this.onCheckgesturePwd} >确认</Button></div>
                </div>
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