import * as React from 'react';
import { NavBar, Icon, List, WhiteSpace, Accordion} from "antd-mobile";
import { History } from "history";


import "./MyTeam.css"
import { UserService } from '../../service/UserService';
import iconVip from "../../assets/icon_vip.png"
import iconVip1 from "../../assets/icon_team_vip.png"
import iconVip2 from "../../assets/icon_team_vip2.png"

interface FansProps {
    history: History
}


interface FansState {
    total: number,
    not_active: number,
    recharge_num: number,
    rData:any,
    rData2:any
}




export class MyTeam extends React.Component<FansProps, FansState> {
    constructor(props: FansProps) {
        super(props);
          this.state = {
            total: 0,
            not_active: 0,
            recharge_num: 0,
            rData: [],
            rData2: [],
          };
        
      }

    onRedirectBack = () => {
        const history = this.props.history
        console.log('onLeftClick', history)
        history.goBack()
    }
    componentDidMount() {
        UserService.Instance.pageMyFans().then( (fansData) => {
            console.log(fansData)
            let list=[''],list2=[''];
            fansData.list.map((data:any)=>{
                data.level==1?list.push(data):list2.push(data)
            })
            list.shift();
            list2.shift();
          this.setState({
            rData:list,
            rData2:list2,
            total: fansData.total,
            recharge_num: fansData.recharge_num,
            not_active: fansData.not_active
          })
        })

      }

      onChange = () => {

      }
    
    public render() {
     
        return (
            <div className="fans-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">我的团队</div>
                </NavBar>
                <div>
                    <div>
                        <div className="fans-top-bg"></div>
                        <div className="fans-top-content">
                            <div className="fans-left-section">
                                <div className="fans-section-text">总粉丝</div>
                                <div className="fans-section-num">{this.state.total }</div>
                            </div>
                            <div className="fans-middel-line"></div>
                            <div className="fans-right-section">
                                <div className="fans-section-text">今天充值粉丝</div>
                                <div className="fans-section-num">{this.state.recharge_num }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <WhiteSpace size="xl" />
                <div className="fans-list-view-container">
                <List>
                    <List.Item thumb={iconVip}>我的会员</List.Item>
                    {/* {<img className="team-vip" src={iconVip1}/>}v1 */}
                </List>
                <Accordion className="my-accordion">
                    <Accordion.Panel header={<div><img className="team-vip-img" src={iconVip1}></img>一级会员</div>}>
                        <List className="my-list">
                        {
                            this.state.rData.map((data:any,index:number)=>{
                                return(
                                <div className="fans-row-item" key={index}>
                                    <div >
                                        <div className="fans-row-item-bold">{data.nickname}</div>
                                    </div>
                                    <div >
                                        <div className="fans-row-item-bold fans-row-item-right">{data.today_order}</div>
                                        <div className="fans-row-item-normal">今日报单量</div>
                                    </div>
                                </div>
                                )
                                
                            })
                        }
                        </List>
                    </Accordion.Panel>
                    <Accordion.Panel header={<div><img className="team-vip-img" src={iconVip2}></img>二级会员</div>} className="pad">
                        <List className="my-list">
                            {
                                this.state.rData2.map((data:any,index:number)=>{
                                    return (
                                        <div className="fans-row-item" key={index}>
                                            <div >
                                                <div className="fans-row-item-bold">{data.userid}</div>
                                            </div>
                                            <div >
                                                <div className="fans-row-item-bold fans-row-item-right">{data.today_order}</div>
                                                <div className="fans-row-item-normal">今日报单量</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </List>
                    </Accordion.Panel>
                </Accordion>
                
                </div>
            </div>
        )
    }
}