
import * as React from 'react';

import { NavBar, Icon} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';
import QRCode from "qrcode.react";

interface MyCodeProps {
    history: History
}

interface MyCodeState {
    refUrl:string,
    userInfo?: model.User
}
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';
export class MyCode extends React.Component<MyCodeProps, MyCodeState> {
    constructor(props: MyCodeProps) {
        super(props)
        this.state = {
            refUrl:''
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    public componentDidMount() {
        UserService.Instance.getUserInfo().then( userInfo => {
        this.setState({
                ...this.state,
                userInfo: userInfo,
                refUrl :`http://dev110.weibanker.cn/chenjj/www/ktwo/build/index.html?mobile=${userInfo&&userInfo.mobile}`
            })
            console.log(this.state.refUrl)
        }).catch ( err => {
            if (err.errorCode) {
                if (err.errorCode == "401") {
                    this.props.history.push("/login")
                }
            }
        })
    }
    public render() {
        
        return (
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">我的二维码</div>
                </NavBar>
                <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                    <div className="change-code-title">我的二维码</div>
                    <div className="change-code-img">
                        <QRCode value={this.state.refUrl} size={160} />
                    </div>
                </div>
            </div>
        )
    }
}
