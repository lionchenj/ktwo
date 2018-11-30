import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Modal, Tabs, WingBlank, Picker, Toast } from "antd-mobile";
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
    type:string
    bankName: string
    bankId: string
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
    onbankNameBlur = (value: string) => {
        this.bankName = value
    }
    onbankIdBlur = (value: string) => {
        this.bankId = value
    }
    onActivateBlur = (value: string) => {
        this.activate = value
    }
    //复投
    onActivate = () => {
        UIUtil.showLoading("复投中");
        UserService.Instance.activate_move(this.WalletNumber, this.gesturePasswords, this.activate, this.state.service).then(() => {
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
    onSubmit = () => {
        UIUtil.showLoading("提取中");
        UserService.Instance.assets_move(this.state.selectedCoinId, this.state.changeCoin, this.WalletNumber, this.gesturePasswords, this.bankName, this.bankId, this.state.service).then(() => {
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
    onCheckgesturePwd = (e:any) => {
        let type = e.target.getAttribute("data-id");
        console.log('type:'+type)
        if(type == '1'){
            console.log('复投')
            const activateInfo = "请输入激活码"
            if (!this.activate) {
                UIUtil.showInfo(activateInfo)
                return
            }
            const numberInfo = "请输入数量"
            if (!this.WalletNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
        }else{
            console.log('提现')
            const numberInfo = "请输入数量"
            if (!this.WalletNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
            const bankname = "请输入银行名"
            if (!this.bankName) {
                UIUtil.showInfo(bankname)
                return
            }
            const bankid = "请输入银行卡号"
            if (!this.bankId) {
                UIUtil.showInfo(bankid)
                return
            }
        }
        UserService.Instance.check_gesture_password().then( (res:any)=> {
            console.log(res)
            if(res.errno == 0){
                this.type = type;
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
        console.log(event.target.innerHTML)
        let val = this.gesturePasswords + event.target.innerHTML ;
        this.gesturePasswords = val;
        this.setState({
            gesturePassword:val
        })
        console.log('gesturePasswords:'+this.gesturePasswords)
        if(val.length>5){
            this.setState({
                showKey: false
            });
            if(this.type == '1'){
                this.onActivate();
            }else{
                this.onSubmit();
            }
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
        UserService.Instance.listPayment().then( (res:any) => {
            res.data.map((bank:any)=>{
                if(bank.type == '2'){
                    this.bankName = bank.bank_name;
                    this.bankId = bank.account;
                }
            })
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
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
                usable: res[0].usable,
                service_charge: '0',
            })
            console.log(this.state.CoinData)
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
                            <div className="fans-footer"><Button data-id="1" onClick={this.onCheckgesturePwd}>确认</Button></div>
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
                            <div className='wallet-list-title'>银行卡</div>
                            <List className="change-list">
                                <List.Item extra={this.bankName}>银行名称</List.Item>
                                <List.Item extra={this.bankId}>银行卡号</List.Item>
                            </List>
                            <WhiteSpace size="lg" />
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
                            <div className="fans-footer"><Button data-id="2" onClick={this.onCheckgesturePwd}>确认</Button></div>
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