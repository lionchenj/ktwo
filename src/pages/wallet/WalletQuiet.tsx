import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Modal, Tabs, WingBlank, Picker, Toast, Grid } from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';
import delimg from "../../assets/jftc_18.jpg"
import './Wallet.css'

interface WalletQuietProps {
    history: History
}

interface WalletQuietState {
    selectedCoinId: "1",
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
    assets_static:number,
    service_charge:string,
    assets_static_min:string,
    assets_static_max:string,
    isTP:boolean,
    ftNumber:string,
    address: string,
    activation:string,
    exChangeAmount:any
}
const tabs = [
    { title: '静态通证' },
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
export class WalletQuiet extends React.Component<WalletQuietProps, WalletQuietState> {
    codeCountDownTimer: number
    // activate: string
    WalletQuietNumber: string
    gesturePasswords:string
    interva:any
    type:string
    bankName: string
    bankId: string
    address: string
    id: string
    constructor(props: WalletQuietProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.gesturePasswords = ''
        this.state = {
            assets_static: 0,
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
            assets_static_min:'0',
            assets_static_max:'0',
            isTP:true,
            ftNumber:'0',
            activation:'0',
            address: '',
            exChangeAmount:[],
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onNumberBlur = (value: string) => {
        this.WalletQuietNumber = value;
        console.log(value)
        console.log(this.state.exchange_rate)
        let changeCoin = (parseFloat(value) / parseFloat(this.state.exchange_rate)) + '';
        console.log(changeCoin)
        let service =  parseFloat((parseFloat(changeCoin) * (parseFloat(this.state.service_charge)/100)).toFixed(2));
        console.log(service)
        if(service == 0){
            service = 0.01;
        }
        console.log(service)
        this.setState({ 
            changeCoin: changeCoin,
            service: service
        });
    }
    onAddressBlur = (value: string) => {
        this.address = value
    }
    onbankNameBlur = (value: string) => {
        this.bankName = value
    }
    onbankIdBlur = (value: string) => {
        this.bankId = value
    }
    // onActivateBlur = (value: string) => {
    //     this.activate = value
    // }
    onActivate = () => {
        UIUtil.showLoading("复投中");
        UserService.Instance.activate_static(this.id, this.gesturePasswords, this.state.service).then(() => {
            UIUtil.hideLoading();
            Modal.alert('提示', '再种成功', [{
                text: 'ok', onPress: () => {
                    this.props.history.goBack()
                }, style: 'default'
            }])
        }).catch(err => {
            UIUtil.showError(err)
        })
    }
    onSubmit = () => {
        UIUtil.showLoading("提取中");
        UserService.Instance.assets_static(this.state.selectedCoinId, this.state.changeCoin, this.WalletQuietNumber, this.gesturePasswords, this.address, this.state.service).then(() => {
        // UserService.Instance.assets_static(this.state.selectedCoinId, this.state.changeCoin, this.WalletQuietNumber, this.gesturePasswords, this.bankId, this.state.service).then(() => {
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
        let type = e.currentTarget.dataset.id;
        console.log('type:'+type)
        if(type == '1'){
            // const activateInfo = "请输入激活码"
            // if (!this.activate) {
            //     UIUtil.showInfo(activateInfo)
            //     return
            // }
            const numberInfo = "请输入数量"
            if (!this.state.ftNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
        }else{
            const numberInfo = "请输入数量"
            if (!this.WalletQuietNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
            const add = "请输入提现地址"
            if (!this.address) {
                UIUtil.showInfo(add)
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
        console.log(event)
        let val = this.gesturePasswords + event.target.innerHTML ;
        this.gesturePasswords = val;
        this.setState({
            gesturePassword:val
        })
        console.log(val)
        console.log(val.length)
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
        this.props.history.push("/earningsQuiet")
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
            address: list.address,
            service_charge:list.service_charge,
        })
    }
    getExchangeRate = (ticker:string) => {
        UserService.Instance.tick(ticker).then( datalist => {
            this.setState({
                exchange_rate: datalist.low,
                changeCoin: (parseFloat(this.WalletQuietNumber) / parseFloat(datalist.low)) + ''
            })
        })
    }
    setUsable = (e:any) =>{
        let data = this.state.exChangeAmount;
        let activation = '';
        data.map((res:any)=>{
            if(res.text == e.target.innerText){
                activation = res.activation;
                this.id = res.id;
                res.isclick = true;
            }else{
                res.isclick = false;
            }
        })
        this.setState({
            exChangeAmount: data,
            activation:activation,
            ftNumber : e.target.innerText
        })
    }
    public componentDidMount() {
        UserService.Instance.pageIndex().then(pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        })
        UserService.Instance.activationSetup().then(data => {
            let exChangeAmount:any = [];
            data.map( (res:any) => {
                exChangeAmount.push({text:res.number,isclick:false,id:res.id,activation:res.activation,status:res.status})
            })
            this.setState({
                exChangeAmount: exChangeAmount
            })
        })
        UserService.Instance.staticWallet().then((res:any) => {
            console.log(res.data)
            this.setState({
                servicemin: res.data.total_static,
                servicemax: res.data.usable_static,
                assets_static: res.data.assets_static,
                assets_static_max: res.data.assets_static_max,
                assets_static_min: res.data.assets_static_min
            })
        })
        // UserService.Instance.listPayment().then( (res:any) => {
        //     if(res.data.length == 0){
        //         UIUtil.showInfo("暂无银行卡,请新增银行卡");
        //         this.props.history.push("/bankCardAdd",{page:'wq'});
        //         return;
        //     }
        //     res.data.map((bank:any)=>{
        //         if(bank.type == '2'){
        //             this.bankName = bank.bank_name;
        //             this.bankId = bank.account;
        //         }
        //     })
        //     if(this.bankName == ''){
        //         UIUtil.showInfo("暂无默认银行卡，请到设置-银行卡")
        //     }
        // }).catch( err => {
        //     const message = (err as Error).message
        //     Toast.fail(message)
        // })
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
                service_charge: res[0].service_charge,
                usable: res[0].usable,
            })
            console.log(this.state.CoinData)
        })
    }

    public render() {
        return (
            <div className="withdraw-container">
                <NavBar mode="light" icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="wallet-navbar-right" onClick={this.onGoPage}></div>
                    ]}
                    className="home-navbar" >
                    <div className="nav-title">静态钱包</div>
                </NavBar>
                <Tabs tabs={tabs}>
                    <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                        <div className="withdraw-header-content">
                            <div className="fans-left-section">
                                <div className="fans-section-text">静态通证</div>
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
                            {/* <List className="wallet-list">
                                <InputItem labelNumber={6} placeholder="请输入激活码" type="text" onBlur={this.onActivateBlur}>激活码</InputItem>
                            </List> */}
                            <WhiteSpace size="lg" />
                            <div className='wallet-list-title'>选择复投通证数量（可复投通证数量：<span>{this.state.servicemax||'0'}</span>）</div>
                            <div className="am-list-item am-input-item am-list-item-middle">
                                <div className="am-list-line"><div className="am-input-label am-input-label-7">复投数量</div>
                                <div className="am-input-control">{this.state.ftNumber}
                                </div></div>
                            </div>
                            <div className="am-list-item am-input-item am-list-item-middle">
                                <div className="am-list-line"><div className="am-input-label am-input-label-7">需要激活卡</div>
                                <div className="am-input-control">{this.state.activation?(this.state.activation + "个"):"0个"}
                                </div></div>
                            </div>
                            <Grid className="exchange" square={false} data={this.state.exChangeAmount} hasLine={false}  columnNum={4}
                                renderItem={(dataItem:any) => (
                                    <div style={{margin: "0 .1rem"}}>
                                        {
                                        dataItem.status == '0'?
                                        <div style={{ textAlign:'center', padding: '.08rem 0.1rem', borderRadius: '.05rem', color: '#D1D1D1', fontSize: '14px', marginTop: '12px',border: '1px solid #D1D1D1' }}>
                                            {dataItem.text}
                                        </div>
                                        :
                                        <div onClick={this.setUsable} style={{textAlign:'center', padding: '.08rem 0.1rem', borderRadius: '.05rem', backgroundColor: dataItem.isclick?'#4A90E2':'#fff', color: dataItem.isclick?'#fff':'#4A90E2', fontSize: '14px', marginTop: '12px',border: '1px solid #4A90E2' }}>
                                            {dataItem.text}
                                        </div>
                                    }
                                    </div>
                                    )}
                                ></Grid>
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
                            <div className='wallet-list-title'>提现数量（可提取数量：<span>{this.state.assets_static||0}</span>）<span className="lr">手续费：<span>{this.state.service||0}</span></span></div>
                            <List className="change-list exchange">
                                <InputItem placeholder={"最少可提取："+ this.state.assets_static_min +"，最多可提取：" + this.state.assets_static_max} type="digit" onBlur={this.onNumberBlur} ></InputItem>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className='wallet-list-title'>钱包地址</div>
                             <List className="change-list">
                                <InputItem labelNumber={6} placeholder="请输入钱包地址" type="text" onBlur={this.onAddressBlur}></InputItem>
                            </List>
                            {/*<div className='wallet-list-title'>银行卡</div>
                             <List className="change-list">
                            <List.Item extra={this.bankName}>银行名称</List.Item>
                                <List.Item extra={this.bankId}>银行卡号</List.Item>
                            </List> */}
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