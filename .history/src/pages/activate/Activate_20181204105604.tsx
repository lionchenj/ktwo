import * as React from 'react';
import { NavBar, Icon, List, InputItem, Button} from "antd-mobile";
import { History } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from '../../service/UserService';

import copy from 'copy-to-clipboard';

import "./Activate.css"
// import { UserService } from '../../service/UserService';
// import { UIUtil } from '../../utils/UIUtil';
// import { model } from '../../model/model';
import iconExchange from "../../assets/icon_exchange.png"


interface ActivateProps {
    history: History
}


interface ActivateState {
    types:number,
    address:string,
    cardList:any
}


export class Activate extends React.Component<ActivateProps, ActivateState> {
    activate:string

    constructor(props: ActivateProps) {
        super(props);
        this.state = {
            address:'',
            types:3,
            cardList:[]
        };
        
    }
    
    
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {
        let that = this;
        UserService.Instance.getUserInfo().then( (res:any) => {
            console.log(res)
            that.setState({
                types: parseInt(res.check_agent)
        })
        }).catch( err => {
            UIUtil.showError(err)
        })
        UserService.Instance.agentActivateCode('1').then( (res:any) => {
            console.log(res)
            this.setState({
                cardList:res.data
            })
        }).catch( err => {
            UIUtil.showError(err)
        })
      }
      //激活码
      onActivate = (value:string) => {
        this.activate = value
      }
      //激活
      onSubmit = () => {

    }
    //生成激活码
    getActivate = () => { 
        UserService.Instance.agentActivateCode('2').then( (res:any) => {
            console.log(res)
            this.setState({
                cardList:res.data
            })
            if(res.data.length == 10){
                this.setState({
                    cardList10:res.data
                })
            }
        }).catch( err => {
            UIUtil.showError(err)
        })
        
      }

    public render() {
        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={ this.onRedirectBack} className="home-navbar"> <div className="nav-title">代理激活</div></NavBar>
                {(() => {
                    switch (this.state.types) {
                        case 0:
                            return (
                                <div className="activate-not">你还没成为我们的代理</div>
                            )
                        case 1:
                            return (
                                <div>
                                    <List renderHeader={() => ''}>
                                        <InputItem labelNumber={6} type="password" placeholder="请输入代理激活码" onBlur={this.onActivate}>代理激活码</InputItem>
                                    </List>
                                    <div className="fans-footer">
                                        <Button className="login-button" onClick={this.onSubmit}>确认</Button>
                                    </div>
                                </div>
                            )
                        case 3:
                            return (
                                <div className="activate-php ">
                                    <div>我的代理人</div>
                                    <div className="activate-php-img">
                                        <img src={iconExchange} alt=""/>
                                    </div>
                                    <div>小猪佩奇</div>
                                    <div>12345678901</div>
                                </div>
                            )
                        case 2:
                            return (
                                <div>
                                    <List renderHeader={() => ''}>
                                    <List.Item>已生成激活码</List.Item>
                                    </List>
                                    {
                                        this.state.cardList.map((data:any,index:number)=>{
                                            return(
                                                <List key={index}>
                                                    <InputItem labelNumber={7} editable={false} type="number"
                                                        value={data.random_code}
                                                        onExtraClick={()=>{
                                                            if(copy(data.random_code)){
                                                                UIUtil.showInfo("复制成功");
                                                            }else{
                                                                UIUtil.showInfo("复制失败")
                                                            }
                                                        }} extra={<div className="address-code-button red" >复制</div>}>
                                                        {data.nickname}
                                                    </InputItem>
                                                </List>
                                            )
                                        })
                                    }
                                    <div className={?"fans-footer none":"fans-footer"}>
                                        <Button onClick={this.getActivate} >生成激活码</Button>
                                    </div>
                                </div>
                            )
                        default:
                            return null
                    }
                })()}
            </div>
        )
    }
}