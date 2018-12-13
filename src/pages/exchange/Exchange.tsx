import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, WingBlank, Modal, Tabs, Picker, TextareaItem, Grid, Toast} from "antd-mobile";
import { History } from "history";
import "./Exchange.css"

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

import { UIUtil } from '../../utils/UIUtil';
import copy from 'copy-to-clipboard';

import iconRmb from "../../assets/icon_rmb.png"
import delimg from "../../assets/jftc_18.jpg"


interface ChangeProps {
    history: History
}
interface ChangeState {
    CoinData?: model.CoinData<model.CoinInfo>,
    pageIndexData?: model.PageIndexData,
    files: any[],
    selectedCoinId: string,
    redirectToLogin: boolean,
    sValue: any,
    exchange_rate: string,
    address: string,
    usable: string,
    coinlist: any,
    usables?: string,
    radomCode: string,
    changeCoin?: string,
    gesturePassword:string,
    showKey:boolean,
    activation_code:string
}

const tabs = [
    { title: '充币' },
    { title: '币兑换通证' },
];
const exChangeAmount = [
    {
    text:'1000'
    },{
    text:'3000'
    },{
    text:'5000'
    },{
    text:'10000'
    },{
    text:'20000'
    },{
    text:'30000'
    },{
    text:'50000'
    }
]
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

// const CustomChildren = (props:any) => (
//     <div style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
//       <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px' }}>
//         <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
//         <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }} onClick={props.onClick}>{props.extra}</div>
//       </div>
//     </div>
//   );
export class Exchange extends React.Component<ChangeProps, ChangeState> {
    codeCountDownTimer: number
    changeNumber: string
    phone: string
    name: string
    activation_code: string
    voucher: string
    gesturePasswords:string
    interva:any
    onType:number
    constructor(props: ChangeProps) {
        super(props)
        this.gesturePasswords = ''
        this.codeCountDownTimer = 0
        this.state = {
            selectedCoinId: '1',
            files: [],
            redirectToLogin:false,
            sValue: [],
            exchange_rate:'',
            address: '',
            usable: '',
            coinlist: [],
            radomCode: '0',
            showKey:false,
            gesturePassword:'',
            activation_code:''
        }
    }
    onChange = (files: any[], type: any, index: number) => {
        if (!files || files.length == 0) {
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.uploadFile(files[0]).then( fileUrl => {
            // const userInfo = this.state.userInfo
            // if (userInfo) {
            //     userInfo.head_imgurl = avatarUrl
            //     this.setState({
            //         userInfo: userInfo
            //     })
            // }
            this.setState({
                files,
              });
            UIUtil.hideLoading()
        }).catch( err => {
            UIUtil.showError(err)
        })
        

    }
    onRedirectBack = () => {
        this.props.history.push("/home")
    }
    onGoPage = () => {
        this.props.history.push("/withdrawHistory")
    }
    //复制地址
    copyAdd = () => {
        if(copy(this.state.address)){
            UIUtil.showInfo("复制成功");
        }else{
            UIUtil.showInfo("复制失败")
        }
    };
    //复制随机码
    copyRadom = () => {
        if(copy(this.state.radomCode)){
            UIUtil.showInfo("复制成功");
        }else{
            UIUtil.showInfo("复制失败")
        }
    };

    onNumberBlur = (value: string) => {
        this.changeNumber = value;
        this.setState({changeCoin:(parseInt(this.changeNumber) * parseInt(this.state.exchange_rate))+''})
    }
    onActivation = (value: string) => {
        this.activation_code = value;
        this.setState({activation_code:value})
    }
    onVoucher = (value: string) => {
        this.voucher = value
    }

    onRechange = () => {
        UIUtil.showLoading("充币中")
        UserService.Instance.rechange(this.state.selectedCoinId, this.changeNumber, this.gesturePasswords, this.state.radomCode, this.voucher).then( () => {
            UIUtil.hideLoading();
            Modal.alert('提示','充币成功',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    onSubmit = () => {
        UIUtil.showLoading("转币中")
        UserService.Instance.exchange(this.state.selectedCoinId, this.gesturePasswords,this.activation_code, this.state.changeCoin, this.state.usables).then( () => {
            UIUtil.hideLoading();
            Modal.alert('转币成功','提示',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            }, style: 'default' }])
        }).catch( err => {
            UIUtil.showError(err)
        })
    }
    onRadomCode = () => {
        UserService.Instance.randomCode().then( (res:any) => {
            this.setState({
                radomCode: res.data.random_code
            })
        })
    }
    onSetCoinInfo = (val:any) => {
        this.onRadomCode();
        var list = this.state.CoinData&&this.state.CoinData[val];
        console.log(list)
        this.getExchangeRate(list.ticker);
        clearInterval(this.interva);
        this.interva = setInterval(()=>{
            this.getExchangeRate(list.ticker)
        },5000);
        this.setState({
            selectedCoinId: list.id,
            sValue: [list.name],
            address: list.address,
            usable: list.usable,
        })
    }
    getExchangeRate = (ticker:string) => {
        UserService.Instance.tick(ticker).then( datalist => {
            console.log(datalist.close)
            this.setState({
                exchange_rate: datalist.close,
                usables: this.changeNumber?(parseFloat(this.changeNumber) / parseFloat(datalist.close))+'':''
            })
        })
    }
    setUsable = (e:any) =>{
        console.log(e)
        this.changeNumber = e.target.innerText;
        this.setState({
            changeCoin: this.changeNumber,
            usables: (parseFloat(this.changeNumber) / parseFloat(this.state.exchange_rate))+'' 
        })
    }
    public componentDidMount () {
        UserService.Instance.getCoin().then( (res) => {
            var list = []
            for(var i in res){
                list.push({label:res[i].name,value:i})
            }
            this.getExchangeRate(res[0].ticker);
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
            })
            // console.log(this.state.CoinData)
        })
        UserService.Instance.pageIndex().then( pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
        })
        
        this.onRadomCode();
    }
    onCheckgesturePwd = (e:any) => {
        let type = e.target.getAttribute("data-id");
        this.onType = type;
        if(type == '1'){
            const numberInfo = "请输入数量"
            if (!this.changeNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
        }else{
            const numberInfo = "请输入数量"
            const codeInfo = "请输入激活码"
            if (!this.activation_code) {
                UIUtil.showInfo(codeInfo)
                return
            }
            if (!this.changeNumber) {
                UIUtil.showInfo(numberInfo)
                return
            }
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
            if(this.onType == 1){
                this.onRechange();
            }else{
                this.onSubmit();
            }
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
            <div className="change-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="navbar-right" onClick={this.onGoPage}></div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">通证充值</div>
                </NavBar>

                <div className="exchange-body">
                    <Tabs tabs={tabs}>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
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
                            <List className="change-list">
                                <InputItem type="digit" onBlur={ this.onNumberBlur}>充币数量</InputItem>
                                <InputItem type="text" value={this.state.address} onExtraClick={ this.copyAdd}>充币地址</InputItem>
                                <InputItem type="text" value={this.state.radomCode} onExtraClick={ this.copyRadom}>随机码</InputItem>
                                <InputItem disabled>备注</InputItem>
                                <div className="textareaItem-body">
                                    <TextareaItem onBlur={ this.onVoucher} rows={5}/>
                                </div>
                            </List>
                            <WhiteSpace size="lg" />
                            <div className="address-footer-button-container-exchange"><Button data-id="1" onClick={this.onCheckgesturePwd} >确认</Button></div>
                            </WingBlank>
                        </div>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                            <WingBlank>
                            <WhiteSpace size="sm" />
                                <Picker
                                cols={1}
                                data={this.state.coinlist}
                                title="选择币种"
                                extra={this.state.sValue}
                                value={this.state.sValue}
                                onChange={v => this.onSetCoinInfo(v)}>
                                <List.Item  arrow="horizontal" thumb={iconRmb}>选择币种</List.Item>
                                </Picker>
                                <List className="change-list">
                                    <InputItem labelNumber={7} type="text" placeholder="请输入激活码" onBlur={ this.onActivation}>激活码</InputItem>
                                    <div className="am-list-item am-input-item am-list-item-middle">
                                        <div className="am-list-line"><div className="am-input-label am-input-label-7">币兑换数量</div>
                                        <div className="am-input-control">{this.state.usables?this.state.usables:("现有个数" + this.state.usable)}
                                        </div></div>
                                    </div>
                                    <Grid className="exchange" square={false} data={exChangeAmount} hasLine={false}  columnNum={4}
                                    renderItem={(dataItem:any) => (
                                        <div style={{margin: "0 .1rem"}}>
                                          {
                                            dataItem.text>10000?
                                            <div style={{ textAlign:'center', padding: '.08rem 0.1rem', borderRadius: '.05rem', color: '#D1D1D1', fontSize: '14px', marginTop: '12px',border: '1px solid #D1D1D1' }}>
                                                {dataItem.text}
                                            </div>
                                          :
                                            <div onClick={this.setUsable} style={{ textAlign:'center', padding: '.08rem 0.1rem', borderRadius: '.05rem', color: '#4A90E2', fontSize: '14px', marginTop: '12px',border: '1px solid #4A90E2' }}>
                                                {dataItem.text}
                                            </div>
                                        }
                                        </div>
                                      )}
                                    ></Grid>
                                    <div className="am-list-item am-input-item am-list-item-middle">
                                        <div className="am-list-line"><div className="am-input-label am-input-label-7">可兑换为通证数</div>
                                        <div className="am-input-control">{this.state.changeCoin?this.state.changeCoin:("现有通证数：" + (this.state.pageIndexData && this.state.pageIndexData.usable_static)||'0')}
                                        </div></div>
                                    </div>
                                </List>
                                <WhiteSpace size="lg" />
                                <WhiteSpace size="lg" />
                                <WhiteSpace size="lg" />
                                <WhiteSpace size="lg" />
                                <div className="address-footer-button-container-exchange"><Button data-id="2" onClick={this.onCheckgesturePwd} >兑换</Button></div>
                            </WingBlank>
                        </div>
                    </Tabs>
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