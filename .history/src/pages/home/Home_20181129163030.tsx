import * as React from 'react';
import { TabBar, List, Grid,Carousel, Picker } from "antd-mobile";
import ReactEcharts from 'echarts-for-react';
import { History } from "history";
import "./Home.css"
import Banner from "../../assets/banner.jpg"
import imageTabHome from "../../assets/icon_index_no.png"
import imageTabHomeSelected from "../../assets/icon_index.png"
import imageTabProfile from "../../assets/icon_my_no.png"
import imageTabProfileSelected from "../../assets/icon_my.png"

import iconExchange from "../../assets/icon_exchange.png"
import iconLive from "../../assets/icon_live.png"
import iconChange from "../../assets/icon_change.png"
import iconCustomer from "../../assets/icon_customer.png"
import iconScan from "../../assets/icon_scan.png"
import iconSetting from "../../assets/icon_setting.png"

import iconWallet from "../../assets/icon_wallet.png"
import iconWalletS from "../../assets/icon_wallet_s.png"
import iconActivation from "../../assets/icon_activation.png"
import iconTeam from "../../assets/icon_team.png"
import iconMessage from "../../assets/icon_message.png"
import iconShop from "../../assets/icon_shop.png"

import { UserService } from '../../service/UserService';

import { model } from '../../model/model';
import { UIUtil } from '../../utils/UIUtil';


interface HomeProps {
    history: History
}

interface HomeState {
    selectedTab: "HomeTab"|"PropertyTab"|"ProfileTab",
    showQRCode: boolean,
    isSignIn: boolean,
    userInfo?: model.User,
    pageIndexData?: model.PageIndexData,
    pageAssetsData?: model.PageAssetsData,
    remove:boolean,
    list:any,
    index:number,
    xstr:any,
    ystr:any,
    banners:any,
    imgHeight:string,
    coinlist: any,
    CoinData:any,
    sValue: any,
    klinesList:any,
}
// interface MenuItem {
//     icon: string,
//     text: string
// }
const homeBottomMenuData = [
    {
        icon: iconExchange,
        text: '通证充值'
    },
    {
        icon: iconChange,
        text: '转入转出'
    },
    {
        icon: iconCustomer,
        text: '客服'
    },
    {
        icon: iconShop,
        text: "商城"
    },
    {
        icon: iconLive,
        text: "生活服务"
    },
    {
        icon: iconScan,
        text: "扫一扫"
    }
]
const myBottomMenuData = [
    {
        icon: iconWallet,
        text: '静态钱包'
    },
    {
        icon: iconWalletS,
        text: '动态钱包'
    },
    {
        icon: iconActivation,
        text: '代理激活'
    },
    {
        icon: iconTeam,
        text: "我的团队"
    },
    {
        icon: iconMessage,
        text: "平台公告"
    },
    {
        icon: iconSetting,
        text: "设置"
    }
]
let browser = {
    version: function() {
        var u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
            iPad: u.indexOf('iPad') > -1, //是否iPad
        };
    }(),
}
console.log(browser);
// //扫描结果回调方法，content是扫描到的内容，status是个表示状态的数字，0表示成功扫描，1表示取消扫描
var link = window.parent.location.href;
link = link.substring(0, link.lastIndexOf('/') + 1);
console.log(link)

export class Home extends React.Component<HomeProps, HomeState> {
    rData: any
    lv: any
    avatarInput: any
    inapp?: string
    min:number
    max:number
    interva: any
    constructor(props: HomeProps) {
        super(props)
        this.state = {
            selectedTab: "HomeTab",
            showQRCode: false,
            isSignIn: false,
            remove:false,
            list:[],
            index:-1,
            xstr:null,
            ystr:null,
            banners:[],
            imgHeight:'1',
            coinlist: [],
            CoinData: [],
            sValue: [],
            klinesList:[]
        }
    }

    onTapHomeMenu = (el: object, index: number) => {
        console.log("onTapHomeMenu", el, index)
        if (index == 0) {
            this.props.history.push("/exchange")
        } else if (index == 1) {
            this.props.history.push("/change")
        } else if (index == 2) {
            window.location.href = "https://ziker-talk.yun.pingan.com/appIm?style=H5&channel=APPIM&authorizerAppid=appimc283aec44342e0a&eid=8b30534669fa6be7b9ff9fa790ff4c4e"
        } else if (index == 3) {
            UIUtil.showInfo("暂未开通")
        } else if (index == 4) {
            UIUtil.showInfo("暂未开通")
        }else if (index == 5) {
            UIUtil.showInfo("暂未开通")
        }
    }
    onTapMyMenu = (el: object, index: number) => {
        console.log("onTapMyMenu", el, index)
        if (index == 0) {
            this.props.history.push("/walletQuiet")
        } else if (index == 1) {
            this.props.history.push("/wallet")
        } else if (index == 2) {
            this.props.history.push("/activate")
        } else if (index == 3) {
            this.props.history.push("/myTeam")
        } else if (index == 4) {
            this.props.history.push("/message", {messageType: "1"})
        }else if (index == 5) {
            this.props.history.push("/settings")
        }
    }

    onCloseQRCode = () => {
        this.setState({
            ...this.state,
            showQRCode: false
        })
    }



    onGotoWithdraw = () => {
        this.props.history.push("/withdraw")
    }

    onGotoDeposit = () => {
        this.props.history.push("/deposit")
    }

    onGotoSettingPage = () => {
    }

    onGotoMessagePage = () => {
    }

    onGotoMailPage = () => {
        this.props.history.push("/message", {messageType: "2"})
    }

    onGotoAddressPage = () => {
        this.props.history.push("/address")
    }

    onGotoUpdatePwdPage = () => {
        this.props.history.push("/update_pwd")
    }

    onGotoFeedbackPage = () => {
        this.props.history.push("/feedback")
    }

    //扫一扫
    // scanCallback = (content:string, status:number) => {
    //     //alert("conent:"+content + ", status:" +status);
    //     if(status == 0) {
    //         var x_link = content.substring(0, link.lastIndexOf('/') + 1);
    //         //alert("content"+x_link+"link"+link)
    //         if(x_link == link) {
    //             window.location.href = content;
    //         };
    //     } else {
    //         UIUtil.showInfo("扫码出错");
    //     }
    // }

    // scan = () => {
    //     if(browser.version.android) {
    //         Aitechain.scanQRCode('scanCallback'); // 调用扫描二维码
    //     } else if(browser.version.ios || browser.version.iPad || browser.version.iPhone) {
    //         window.webkit.messageHandlers.scanQRCode.postMessage({
    //             scanCallback: 'scanCallback'
    //         });
    //     }
    // }
    getBanner = () => {
        UserService.Instance.banner().then( (res) => {
            console.log(res)
            this.setState({
                banners:res.data?res.data:Banner
            })
        }).catch( err => {
            UIUtil.showError(err)
            this.setState({
                banners:Banner
            })
        })
    }
    onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const files = event.target.files
        if (!files || files.length == 0) {
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.updateHead(files[0]).then( avatarUrl => {
            const userInfo = this.state.userInfo
            if (userInfo) {
                userInfo.head_imgurl = avatarUrl
                this.setState({
                    userInfo: userInfo
                })
            }
            UIUtil.hideLoading()
        }).catch( err => {
            UIUtil.showError(err)
        })
    }

    getExchangeRate = (ticker:string) => {
        UserService.Instance.tick(ticker).then( datalist => {
            let list = this.state.klinesList;
            let max = Math.max(...list)+"";
            let min = Math.min(...list)+"";
            window.localStorage.setItem('exchange_rate',datalist.close)
            this.max = Math.ceil(parseFloat(max));
            this.min = Math.floor(parseFloat(min));
            console.log(max)
            console.log(this.max)
            list[4] = datalist.close;
            this.setState({
                klinesList:list
            })
        })
    }
    public componentDidUpdate() {

    }
    public componentWillMount() {
        this.getBanner()
        console.log("componentDidUpdate", this.props.history.location.hash)
        const hash = this.props.history.location.hash
        let selectedTab: "HomeTab"|"PropertyTab"|"ProfileTab" = "HomeTab"
        if (hash.length > 0) {
            if (hash == "#PropertyTab") {
                selectedTab = "PropertyTab"
            } else if (hash == "#ProfileTab") {
                selectedTab = "ProfileTab"
            }
        }
        this.setState({
            selectedTab: selectedTab
        })
    }
    public componentDidMount() {
        const userAgentItemList = window.navigator.userAgent.split(" ")
        for (const item of userAgentItemList) {
            if (item.startsWith("inapp/")) {
                this.inapp = item
                break
            }
        }
        let that = this;
        UserService.Instance.getUserInfo().then( userInfo => {
            if (userInfo.errmsg) {
                if (userInfo.errmsg == "缺少参数：access_token") {
                    this.props.history.push("/login")
                }
            }else{
                this.setState({
                    ...this.state,
                    userInfo: userInfo
                })
            }
            
        }).catch ( err => {
            
        })
        UserService.Instance.pageIndex().then( pageIndexData => {
            this.setState({
                pageIndexData: pageIndexData
            })
            console.log(this.state.pageIndexData)
        })
        UserService.Instance.getCoin().then((res) => {
            this.getExchangeRate(res[0].ticker)
            clearInterval(this.interva);
            this.interva = setInterval(()=>{
                this.getExchangeRate(res[0].ticker)
            },5000);
            var list = []
            console.log(res)
            for(var i in res){
                let ticker = res[i].ticker.split(':')[1]
                list.push({label:ticker,value:i})
            }
            console.log(list[0].label)
            this.setState({
                CoinData: res,
                coinlist: list,
                sValue: [list[0].label],
            })
            UserService.Instance.klines(res[0].ticker).then( datalist => {
                let list:any = [];
                list[0] = datalist[4].close;
                list[1] = datalist[3].close;
                list[2] = datalist[2].close;
                list[3] = datalist[1].close;
                list[4] = datalist[0].close;
                that.setState({
                    klinesList:list,
                })
            })
        })
        const a=[];const b=[];
        for(let i=0; i<this.state.list.length;i++){
            const num1= Math.random()*200 + 1;
            const num2= Math.random()*90 + 5;
            const X= String(num1)+'px';
            const Y=String(num2)+'px';
            
            a.push(X)
            b.push(Y)
            this.setState({
                xstr:a,
                ystr:b
            })
           
        }
    }
    onSetCoinInfo = (val:any) => {
        var ticker = this.state.coinlist&&this.state.coinlist[val];
        var tickers = this.state.CoinData[val];
        console.log(tickers.ticker)
        UserService.Instance.klines(tickers.ticker).then( datalist => {
        if(datalist.result==false){UIUtil.showInfo(tickers.ticker+"行情暂未开通"); return}
        console.log('0')
        let list:any = [];
            list[0] = datalist[4].close;
            list[1] = datalist[3].close;
            list[2] = datalist[2].close;
            list[3] = datalist[1].close;
            list[4] = datalist[0].close;
            console.log(list)
            this.setState({
                klinesList:list,
            })
            this.getExchangeRate(tickers.ticker);
            clearInterval(this.interva);
            this.interva = setInterval(()=>{
                this.getExchangeRate(tickers.ticker)
            },5000);
            this.setState({
                sValue: [ticker.label],
            })
        })
        
    }
    bubbleReomove(e:any){
        console.log(e)
       var index=e.target.getAttribute("data-index");
       var lists=this.state.list;
       lists.splice(index,1);
       this.setState({list:lists})
    }
    echarts = () => {
        let y = new Date().getFullYear();
        let m = (new Date().getMonth()==12)?1:new Date().getMonth() + 1;
        let d = new Date().getDate()-4;
        let dd = [];
        let nd = 1;
        nd = new Date(y,m,0).getDate();
        dd.push(m + "-" + (d!=-3?d!=-2?d!=-1?d!=0?d:nd:nd-1:nd-2:nd-3));
        dd.push(m + "-" + (d!=-3?d!=-2?d!=-1?d!=0?d+1:d+1:nd:nd-1:nd-2));
        dd.push(m + "-" + (d!=-3?d!=-2?d!=-1?d!=0?d+2:d+2:d+2:nd:nd-1));
        dd.push(m + "-" + (d!=-3?d!=-2?d!=-1?d!=0?d+3:d+3:d+3:d+3:nd));
        dd.push(m + "-" + (d+4));
        const option = {
            grid: {
                height:200,
                borderWidth: '0',
                y: 25,
                y2: 100,
                x: 50,
                x2: 20,
            },
            xAxis: [{
                type: 'category',
                data: dd,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: "#1169E8",
                    lineStyle: {
                        color: "#999999"
                    }
                },
                axisTick: {
                    length: 5,
                    alignWithLabel: true,
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }],
            yAxis: [{
                min: this.min,
                max: this.max,
                splitNumber:4,
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: "#999999"
                },
                splitLine: {
                    lineStyle: {
                        color: '#0f4fa8'
                    }
                },
                axisTick: {
                    length: 4,
                    lineStyle: {
                        color: '#999999'
                    }
                }
            }],
            series: [{
                symbol: 'circle', //拐点样式
                symbolSize: 8, //拐点大小
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#000000',
                            width: 1
                        },
                        borderColor: '#FFF',
                        color: '#000000'

                    }
                },
                data: this.state.klinesList,
                type: 'line',
                label:{ normal:{show:true}}
            }]
        };
        return option;
    }

    public render() {
          let conment=[];
          for(let i=0; i<this.state.list.length;i++){
           
            const num1= Math.random()*200 + 1;
            const num2= Math.random()*90 + 5;
            const X= String(num1)+'px';
            const Y=String(num2)+'px';
            conment.push(<div className="bubble-item" style={{left:X,top:Y,display:this.state.index==i?'none':''}} onClick={(e) => this.bubbleReomove(e)}>
                <div className="bubble" data-index={i}>+15</div>
                <div style={{color:'#fff',textShadow:'0 0 5px #39C687',fontSize:'14px'}}>{this.state.list[i].name}</div>
            </div>)
          }
          let banners = [];
          if(this.state.banners.length != 0 ){
            for(let i of this.state.banners){
                banners.push(<div><img className="banner-img" src={i.img_path} /></div>)
            }
          }else{
            banners.push(<div><img className="banner-img" src={Banner} /></div>)
          }
        return (
            <div className="home-container">
                {/* <NavBar mode="light"  className="home-navbar" ><div className="nav-title">寳树通</div></NavBar> */}
                {/* <Flex direction="column"> */}
                    
                    <div className="tab-bar-container margin-t0">
                        <TabBar unselectedTintColor="#B8B8BA" tintColor="#1FA4FC" barTintColor="#fff">
                            <TabBar.Item title="首页" key="HomeTab" 
                                selected={this.state.selectedTab === 'HomeTab'}
                                onPress={
                                    () => {
                                        this.setState({
                                            ...this.state,
                                            selectedTab: "HomeTab"
                                        })
                                        this.props.history.push("#HomeTab")
                                    }
                                }
                                icon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url('+ imageTabHome + ') center center /  21px 21px no-repeat' }}
                                  />
                                  }
                                selectedIcon={<div style={{
                                    width: '22px',
                                    height: '22px',
                                    color: '#1FA4FC',
                                    background: 'url('+ imageTabHomeSelected +') center center /  21px 21px no-repeat' }}
                                /> }
                            >
                                <div className="home-banner">
                                    <Carousel autoplay dots>
                                        {/* {banners} */}
                                        {this.state.banners.map((val:any, index:string) => (
                                            <a
                                            key={index}
                                            href={val.link}
                                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                                            >
                                            <img
                                                src={val.img_path}
                                                alt={val.title}
                                                style={{ width: '100%',height: '1.5rem' , verticalAlign: 'top' }}
                                                onLoad={() => {
                                                // fire window resize event to change height
                                                window.dispatchEvent(new Event('resize'));
                                                this.setState({ imgHeight: 'auto' });
                                                }}
                                            />
                                            </a>
                                        ))}
                                    </Carousel>
                                </div>
                               
                                <div className="profile-list">
                                    <Grid data={homeBottomMenuData} itemStyle={{background:'#00153E',height:'undefined'}} hasLine={false} onClick={this.onTapHomeMenu} columnNum={3}></Grid>
                                </div>
                                <List>
                                    <Picker
                                        cols={1}
                                        data={this.state.coinlist}
                                        title='当前价格'
                                        extra={this.state.sValue}
                                        value={this.state.sValue}
                                        onChange={v => this.onSetCoinInfo(v)}>
                                    <List.Item>当前价格:{this.state.klinesList[4]}</List.Item>
                                    </Picker>
                                    {/* <span>

                                        <select>{this.symbol}</select>
                                        <option>{this.symbol}</option>
                                    </span>
                                    <span>当前价格</span> */}
                                </List>
                                <div className="backGroundImg">
                                    <ReactEcharts className='home-top-main-container' option={this.echarts()} />
                                </div>
                            </TabBar.Item>
                            
                            <TabBar.Item title="个人中心" key="ProfileTab"
                                selected={this.state.selectedTab === 'ProfileTab'}
                                onPress={
                                    () => {
                                        this.props.history.push("#ProfileTab")
                                        this.setState({
                                            ...this.state,
                                            selectedTab: "ProfileTab"
                                        })
                                    }
                                }
                                icon={
                                    <div style={{
                                      width: '22px',
                                      height: '22px',
                                      background: 'url(' + imageTabProfile + ') center center /  21px 21px no-repeat' }}
                                    />
                                  }
                                  selectedIcon={
                                    <div style={{
                                      width: '22px',
                                      height: '22px',
                                      color: '#1FA4FC',
                                      background: 'url(' + imageTabProfileSelected + ') center center /  21px 21px no-repeat' }}
                                    />
                                  }
                            >
                                <div>
                                <div className="profile-header">

                                    <div className="profile-header-content">
                                        <div className="avatar-container">
                                            <input className="avatar-input" type="file"  ref={el => this.avatarInput = el} onChange={this.onAvatarChange}/>
                                            <img className="profile-header-logo" src={this.state.userInfo && this.state.userInfo.head_imgurl}/>
                                        </div>
                                        
                                        <div className="profile-header-info-container">
                                            <div className="profile-header-nickname">{this.state.userInfo && this.state.userInfo.nickname}</div>
                                            <div className="profile-header-phone">{this.state.userInfo && this.state.userInfo.mobile}</div>
                                        </div>
                                    </div>
                                    <div className="home-top-box-body">
                                        <div className="home-top-box">
                                            <div className="home-top-item fs-26"> 
                                                <div className="home-top-title">在投通证</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.lock}</div>
                                            </div>
                                            <div className="home-top-item fs-22"> 
                                                <div className="home-top-title">昨日收益</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.profit}</div>
                                            </div>
                                        </div>
                                        <div className="home-top-box fs-22">
                                            <div className="home-top-item"> 
                                                <div className="home-top-title">可提现静态通证</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.usable_static}</div>
                                            </div>
                                            <div className="home-top-item"> 
                                                <div className="home-top-title">可提现动态通证</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.usable_move}</div>
                                            </div>
                                            <div className="home-top-item"> 
                                                <div className="home-top-title">7日内复投通证</div><div className="home-top-num">{this.state.pageIndexData && this.state.pageIndexData.activate}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <List renderHeader={() => ''} className="my-profile-list">
                                    <Grid data={myBottomMenuData} hasLine={false} onClick={this.onTapMyMenu} columnNum={3}></Grid>
                                </List>
                                </div>
                            </TabBar.Item>
                        </TabBar>
                    </div>
                {/* </Flex> */}
            </div>
        )
    }
}