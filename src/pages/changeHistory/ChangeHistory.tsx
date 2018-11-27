import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List, Tabs} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';

interface ChangeHistoryProps {
    history: History
}


interface ChangeHistoryState {
    tabIndex:number,
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean
}

const tabs = [
    { title: '全部' },
    { title: '转入' },
    { title: '转出' },
];
const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

export class ChangeHistory extends React.Component<ChangeHistoryProps, ChangeHistoryState> {
    rData: any
    lv: any

    constructor(props: ChangeHistoryProps) {
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
      
          this.state = {
            dataSource,
            tabIndex:1,
            isLoading: true,
            hasMore: false,
            height:  document.documentElement.clientHeight - 200,
            visible: false
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    getTransfer = (index:number) => {
        console.log('index:'+index)
        let type = '';
        if(index == 1){
            type = '3'
        }
        if(index == 2){
            type = '2'
        }
        UserService.Instance.transfer(type).then( (transferPageData) => {
            console.log(transferPageData)
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(transferPageData.list),
              isLoading: false,
              hasMore: false,
            });
          }).catch( err => {
            UIUtil.showError(err)
          })
    }
    componentDidMount() {
        UserService.Instance.transfer().then( (transferPageData) => {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(transferPageData.list),
              isLoading: false,
              hasMore: false,
            });
          }).catch( err => {
            UIUtil.showError(err)
          })
    }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
    
      }

    onFilter = () => {

    }

    handleVisibleChange = (visible: boolean) => {
        this.setState({
            ...this.state,
            visible,
          });
    }

    onSelect = (opt: any) => {
        console.log("selected key", opt.key);
        this.setState({
            ...this.state,
            visible: false
        });
    }

    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
                // borderTop: '1px solid #ECECED',
                // borderBottom: '1px solid #ECECED',
              }}
            />
          );
         
          const row = (rowData: model.TransactionItem, sectionID: number, rowID: number) => {
    
            return (
                <List.Item multipleLine extra={rowData.plusminus=='-1'?'-'+rowData.number:'+'+rowData.number} error={rowData.plusminus=='-1'?true:false} align="top" thumb={rowData.head_imgurl} >
                {rowData.userid} <List.Item.Brief>{rowData.time}</List.Item.Brief>
                </List.Item>
            );
          };


        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" 
                  
                    >
                        <div className="nav-title">转入转出记录</div>
                </NavBar>
                <Tabs tabs={tabs} onTabClick={(tab, index) => { this.getTransfer(index)}}>
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }} className='historyAll'>
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
                    </div>
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }} className='historyAll'>
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
                    </div>
                    <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }} className='historyAll'>
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
                    </div>
                </Tabs>
            </div>
        )
    }
}