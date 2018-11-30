import * as React from 'react';

import { NavBar, Icon, List, ListView, Button, WhiteSpace, Toast, SwipeAction, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
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
        UserService.Instance.listPayment().then( (res:any) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res.list),
                isLoading: false
            })
            
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
  
          const row = (rowData: model.bankCardItem, sectionID: number, rowID: number) => {
     
            return (
                <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                        {
                        text: '删除',
                        onPress: () => {
                            UserService.Instance.deletePayment(rowData.account).then( (res:any) => {
                                Modal.alert('提示', '删除成功');
                                this.getBankCard();
                            }).catch( err => {
                                const message = (err as Error).message
                                Toast.fail(message)
                            })
                        },
                        style: { backgroundColor: '#F4333C', color: 'white' },
                        },
                    ]}
                    >
                    <List.Item className={rowData.type=='1'?'':'ddress-footer-button-container'} extra={rowData.account} onClick={e => {
                        UserService.Instance.deletePayment(rowData.account).then( () => {
                            Modal.alert('设置默认卡成功', '卡号：'+rowData.account);         
                        }).catch( err => {
                            const message = (err as Error).message
                            Toast.fail(message)
                        })
                    }}>
                        {rowData.type=='1'?'':'* '}+{rowData.bank_name}
                    </List.Item>
                </SwipeAction>
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