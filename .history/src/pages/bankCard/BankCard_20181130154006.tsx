import * as React from 'react';

import { NavBar, Icon, ListView, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
// import { UserService } from '../../service/UserService';
import { model } from '../../model/model';


interface BankCardProps {
    history: History
}

interface BankCardState {
    height: number,
    isLoading: boolean,
    dataSource: any,
}

export class BankCard extends React.Component<BankCardProps, BankCardState> {
    lv:any
    constructor(props: BankCardProps) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
        this.state = {
            height:  document.documentElement.clientHeight - 200,
            dataSource,
            isLoading: true
        }
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.push("/settings")
    }
    onEndReached = (event:any) => {
        if (this.state.isLoading) {
          return;
        }
    }
    getBankCard = () => {
        UserService.Instance.addPayment(this.bankname, this.bankId).then( () => {
            const alert = Modal.alert
            alert('提示','新增成功')
            this.props.history.push("/bankCard")            
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
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
                <ListView
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
}