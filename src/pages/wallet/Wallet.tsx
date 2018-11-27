import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Modal, Tabs, WingBlank, Picker } from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';
import delimg from "../../assets/jftc_18.jpg"
import './Wallet.css'

interface WalletProps {
    history: History
}

interface WalletState {
    assets_move: number,
    selectedCoinId: "1" | "2", // 币ID 1:EOS 2:VETH
    pageIndexData: any,
    service: number,
    sValue: any,
    CoinData?: model.CoinData<model.CoinInfo>,
    coinlist: any,
    exchange_rate: string,
    address: string,
    usable: string,
    setService?: model.Service<model.ServiceData>,
    servicemin: string,
    servicemax: string,
    changeCoin: string,
    gesturePassword:string,
    showKey:boolean,
    service_charge:string,
    assets_move_max:string,
    assets_move_min:string

}
const tabs = [
    { title: '动态通证' },
    { title: '复投' },
    { title: '提现申请' },
];
// const CustomChildren = (props: any) => (
//     <div style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
//         <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
//             <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
//             <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }} onClick={props.onClick}>{props.extra}</div>
//         </div>
//     </div>
// );
const bodyHeight = (window.innerHeight / 100 - 0.9) + 'rem';
export class Wallet extends React.Component<WalletProps, WalletState> {
    codeCountDownTimer: number
    activate: string
    WalletNumber: string
    address: string
    gesturePasswords:string
    interva:any
    constructor(props: WalletProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.gesturePasswords = ''
        this.state = {
            assets_move: 0,
            selectedCoinId: "1",
            pageIndexData: [],
            service: 0,
            sValue: [],
            coinlist: [],
            exchange_rate: '',
            address: '',
            usable: '',
            changeCoin: '0.00',
            servicemin: '0',
            servicemax: '0',
            gesturePassword:'',
            showKey:false,
            service_charge:'0',
            assets_move_max:'0',
            assets_move_min:'0'
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onNumberBlur = (value: string) => {
        this.WalletNumber = value;
        let changeCoin = (parseFloat(value) / parseFloat(this.state.exchange_rate)) + '';
        let service =  parseFloat((parseFloat(changeCoin) * (parseFloat(this.state.service_charge)/100)).toFixed(2));
        if(service == 0){
            service = 0.01;
        }
        this.setState({ 
            changeCoin: changeCoin,
            service: service
        });
    }
    onAddressBlur = (value: string) => {
        // let regex = /^[A-Za-z0-9]+$/;
        // if (regex.test(value)) {
            this.address = value
        // } else {
        //     const addRess = "请输入正确钱包地址";
        //     UIUtil.showInfo(addRess)
        // }
    }
    onActivateBlur = (value: string) => {
        this.activate = value
    }
    //复投
    onActivate = () => {
        const codeInfo = "请输入交易密码"
        const numberInfo = "请输入数量"
        if (!this.WalletNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.state.gesturePassword) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("复投中");
        UserService.Instance.activate_move(this.WalletNumber, this.state.gesturePassword, this.activate, this.state.service).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '复投成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
        })
    }
    //提现
    onSubmit = (event: React.MouseEvent) => {
        event.preventDefault()
        const codeInfo = "请输入交易密码"
        const numberInfo = "请输入数量"
        const add = "请输入提现地址"
        if (!this.address) {
            UIUtil.showInfo(add)
            return
        }
        if (!this.WalletNumber) {
            UIUtil.showInfo(numberInfo)
            return
        }
        if (!this.state.gesturePassword) {
            UIUtil.showInfo(codeInfo)
            return
        }
        UIUtil.showLoading("提取中");
        UserService.Instance.assets_move(this.state.selectedCoinId, this.state.changeCoin, this.WalletNumber, this.state.gesturePassword, this.address, this.state.service).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '提取成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
        })

    }

    log = (name: string) => {
        return (value: number) => {
            console.log(`${name}: ${value}`);
        };
    }
    onGoPage = () => {
        this.props.history.push("/earnings")
    }
    setService = (val: number) => {
        this.setState({
            service: val / 100
        })
    }
    onSetCoinInfo = (val: any) => {
        var list = this.state.CoinData && this.state.CoinData[val];
        console.log(list)
        this.getExchangeRate(list.ticker)
        clearInterval(this.interva);
        this.interva = setInterval(()=>{
            this.getExchangeRate(list.ticker)
        },5000);
        this.setState({
            selectedCoinId: list.id,
            sValue: [list.name],
            address: list.address,
            usable: list.usable,
            service_charge: '0',
        })
        
    }
    getExchangeRate = (ticker:string) => {
        UserService.Instance.tick(ticker).then( datalist => {
            console.log(datalist.close)
            this.setState({
                exchange_rate: datalist.close,
                changeCoin: (parseFloat(this.WalletNumber) / parseFloat(datalist.close)) + ''
            })
        })
    }
    public componentDidMount() {
        UserService.Instance.pageIndex().then(pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        })

        UserService.Instance.moveWallet().then((res:any) => {
            console.log(res)
            this.setState({
                servicemin: res.data.total_move,
                servicemax: res.data.usable_move,
                assets_move: res.data.assets_move,
                assets_move_max: res.data.assets_move_max,
                assets_move_min: res.data.assets_move_min
            })
        })

        UserService.Instance.getCoin().then((res) => {
            var list = []
            for (var i in res) {
                console.log('label:' + res[i].name + ',value:' + i)
                list.push({ label: res[i].name, value: i })
            }
            this.getExchangeRate(res[0].ticker)
            clearInterval(this.interva);
            this.interva = setInterval(()=>{
                this.getExchangeRate(res[0].ticker)
            },5000);
        this.setState({
                CoinData: res,
                coinlist: list,
                selectedCoinId: res[0].id,
                sValue: [res[0].name],
                address: res[0].address,
                usable: res[0].usable,
                service_charge: '0',
            })
            console.log(this.state.CoinData)
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
        return (
            <div className="withdraw-container">
                <NavBar mode="light" icon={<Icon type="left" key="0"/>}
                    onLeftClick={this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="wallet-navbar-right" onClick={this.onGoPage}></div>
                    ]}
                    className="home-navbar" >
                    <div className="nav-title">动态钱包</div>
                </NavBar>
                <Tabs tabs={tabs}>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <div className="withdraw-header-content">
                            <div className="fans-left-section">
                                <div className="fans-section-text">动态通证</div>
                                <div className="fans-section-num">{this.state.servicemin}</div>
                            </div>
                            <div className="fans-middel-line"></div>
                            <div className="fans-right-section">
                                <div className="fans-section-text">可用通证</div>
                                <div className="fans-section-num">{this.state.servicemax}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <List className="wallet-list">
                                <InputItem labelNumber={6} placeholder="请输入激活码" type="text" onBlur={this.onActivateBlur}>激活码</InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className='wallet-list-title'>选择复投通证数量（可复投通证数量：<span>{this.state.servicemax}</span>）</div>
                            <List className="wallet-list">
                                <InputItem placeholder="请输入通证数量" type="number" onBlur={this.onNumberBlur}></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <List className="wallet-list">
                            <div className="am-list-item am-input-item am-list-item-middle">
                                <div onClick={this.showKey} className="am-list-line">
                                    <div className="am-input-label am-input-label-5">交易密码</div>
                                    <div className="am-input-control">
                                    {this.state.gesturePassword}
                                    </div>
                                </div>
                            </div>
                            </List>
                            <WhiteSpace size="lg" />
                            {/* <div className='wallet-list-title'>矿工费</div>
                            <List className="wallet-list">
                                <div className="wallet-text">
                                    <div className="lf">{this.state.servicemin}</div>
                                    <div className="lr">{this.state.servicemax}</div>
                                </div>
                                <div className="wallet-slider">
                                    <Slider
                                        defaultValue={this.state.servicemin}
                                        min={this.state.servicemin}
                                        max={this.state.servicemax * 100}
                                        onChange={this.setService}
                                        onAfterChange={this.log('afterChange')}
                                    />
                                </div>
                                <div className="wallet-text">
                                    <div className="lf">慢</div>
                                    <div className="lr">快</div>
                                </div>
                                <div className="wallet-totle">总计：<span>{this.state.service}</span></div>
                            </List> */}
                            <WhiteSpace size="xl" />
                            <WhiteSpace size="xl" />
                            <div className="fans-footer"><Button onClick={this.onActivate}>确认</Button></div>
                        </WingBlank>
                    </div>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <WingBlank>
                            <WhiteSpace size="sm" />
                            <Picker
                                cols={1}
                                data={this.state.coinlist}
                                title="选择币种"
                                extra={this.state.sValue}
                                value={this.state.sValue}
                                onChange={v => this.onSetCoinInfo(v)}>
                                <List.Item  arrow="horizontal">选择币种</List.Item>
                            </Picker>
                            <div className='wallet-list-title'>提现数量（可提取数量：<span>{this.state.assets_move}</span>）<span className="lr">手续费：<span>{this.state.service||0}</span></span></div>
                            <List className="change-list exchange">
                                <InputItem placeholder={"最少可提取："+ this.state.assets_move_min +"，最多可提取：" + this.state.assets_move_max} type="phone" onBlur={this.onNumberBlur} ></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className='wallet-list-title'>钱包地址</div>
                            <List className="change-list">
                                <InputItem labelNumber={6} placeholder="请输入钱包地址" type="text" onBlur={this.onAddressBlur}></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <List className="wallet-list">
                            <div className="am-list-item am-input-item am-list-item-middle">
                                <div onClick={this.showKey} className="am-list-line">
                                    <div className="am-input-label am-input-label-5">交易密码</div>
                                    <div className="am-input-control">
                                    {this.state.gesturePassword}
                                    </div>
                                </div>
                            </div>
                            </List>
                            <WhiteSpace size="lg" />
                            {/* <div className='wallet-list-title'>矿工费</div>
                            <List className="wallet-list">
                                <div className="wallet-text">
                                    <div className="lf">{this.state.servicemin}</div>
                                    <div className="lr">{this.state.servicemax}</div>
                                </div>
                                <div className="wallet-slider">
                                    <Slider
                                        defaultValue={this.state.servicemin}
                                        min={this.state.servicemin}
                                        max={this.state.servicemax * 100}
                                        onChange={this.setService}
                                        onAfterChange={this.log('afterChange')}
                                    />
                                </div>
                                <div className="wallet-text">
                                    <div className="lf">慢</div>
                                    <div className="lr">快</div>
                                </div>
                                <div className="wallet-totle">总计：<span>{this.state.service}</span></div>
                            </List> */}
                            <WhiteSpace size="xl" />
                            <WhiteSpace size="xl" />
                            <div className="fans-footer"><Button onClick={this.onSubmit}>确认</Button></div>
                        </WingBlank>
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