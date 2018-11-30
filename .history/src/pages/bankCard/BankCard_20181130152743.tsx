import * as React from 'react';

import { NavBar, Icon, ListView, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";

interface BankCardProps {
    history: History
}

interface BankCardState {
    isLoading: boolean,    
    dataSource: any,
}

export class BankCard extends React.Component<BankCardProps, BankCardState> {
    codeCountDownTimer: number
    name:string
    userId: string
    phone: string
    code: string
    password: string
    confirmPassword: string

    constructor(props: BankCardProps) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
        this.codeCountDownTimer = 0
        this.state = {
            dataSource,
            isLoading: r
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/settings")
    }

    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
  
          const row = (rowData: model.exChangeRecordItem, sectionID: number, rowID: number) => {
     
            return (
                <div style={{height:".6rem",marginTop:".01rem"}}>
                    <div style={{float:"left",padding:".1rem"}}>{rowData.coid_name}<div style={{marginTop:".1rem"}}>{rowData.number}</div></div>
                    <div style={{float:"right",padding:".1rem"}}>{rowData.orderid}<div style={{marginTop:".1rem"}}>{rowData.time}</div></div>
                </div>
  
            );
          };
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">忘记交易密码</div>
                </NavBar>
                <ListView renderHeader={() => ''}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? 'Loading...' : ''}
                            </div>)}
                            renderRow={row}
                            renderSeparator={separator}
                            className="am-list"
                            pageSize={4}
                            // useBodyScroll
                            onScroll={() => { console.log('scroll'); }}
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                        />
                    <WhiteSpace size="lg" />
                    <WhiteSpace size="lg" />
                    <div className="fans-footer">
                        <Button className="login-button" onClick={()=>{this.props.history.push("/bankCardAdd")}}>新增银行卡</Button>
                    </div>
            </div>
        )
    }

    public componentWillUnmount() {
        this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
        this.codeCountDownTimer = 0
    }

    private _codeCountDownHander = () =>  {
        const newCodeCount = this.state.codeCountDown - 1
        if (newCodeCount <= 0) {
            this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
            this.codeCountDownTimer = 0
        }
        this.setState({
            ...this.state,
            codeCountDown: newCodeCount
        })
    }
}