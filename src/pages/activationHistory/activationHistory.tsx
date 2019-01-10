import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView } from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';






interface activationHistoryProps {
    history: History
}


interface activationHistoryState {
    tabIndex:number,
    height: number,
    visible: boolean,
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    page: number,
    total_num: number,
    list_num: number,
    tabs:any,
    coins:any
}

const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

export class activationHistory extends React.Component<activationHistoryProps, activationHistoryState> {
    rData: any
    lv: any

    constructor(props: activationHistoryProps) {
        super(props);
          const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
          this.state = {
            height:  document.documentElement.clientHeight - 200,
            visible: false,
            dataSource,
            isLoading: true,
            hasMore: false,
            page: 1,
            total_num: 1,
            list_num: 1,
            tabs:[],
            coins:[],
            tabIndex:0
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.go(-1)
    }
    //交易记录
    getActivationRecord = () => {
        UserService.Instance.activationRecord(this.state.page).then( (res:any) => {
            var list = res.data.list;
            if(list.length < 1){
                this.setState({isLoading: false})
                return
            }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(list),
            isLoading: false,
            hasMore: false,
            total_num: res.total_num,
            list_num: this.state.list_num + list.length*1,
            page: this.state.page*1+1
        });
        }).catch( err => {
        UIUtil.showError(err)
        })
    }
    componentDidMount() {
        this.getActivationRecord();
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        this.getActivationRecord();        
      }

    onFilter = () => {

    }

    handleVisibleChange = (visible: boolean) => {
        this.setState({
            ...this.state,
            visible,
          });
    }
    changetab = (tab: any, index: number) => {
        
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
              }}
            />
          );
  
          const row = (rowData: model.exChangeRecordItem, sectionID: number, rowID: number) => {
            let type = '';
            let title = '';
            switch (rowData.type) {
                case '1':
                    title='系';
                    type = '系统修改';
                break;
                case '2':
                    title='兑';
                    type = '兑换币';
                break;
                case '3':
                    title='静';
                    type = '静态复投';
                break;
                case '4':
                    title='动';
                    type = '动态复投';
                break;
                case '5':
                    title = rowData.plusminus == '1'?'入':'出';
                    type = rowData.plusminus == '1'?'转入':'转出';
                break;
                default:
                    break;
            }
            return (
                <div style={{height:".6rem",marginTop:".01rem"}}>
                    <div style={{margin:"0.1rem 0 0 0.1rem",textAlign:"center",lineHeight:"0.4rem",fontSize:"0.2rem",borderRadius:'50%',height:'.4rem',width:'.4rem',float:"left",background:rowData.plusminus == '1'?'red':'green',color:'#fff'}}>{title}</div>
                    <div style={{float:"left",padding:".1rem"}}>{type}<div style={{marginTop:".1rem"}}>{rowData.time}</div></div>
                    <div style={{float:"right",padding:".1rem",color:rowData.plusminus == '1'?'red':''}}>{(rowData.plusminus == '1'?'+':'-') + rowData.number}<div style={{marginTop:".1rem"}}>{}</div></div>
                </div>
  
            );
          };
        return (
            <div className="message-container">
                <NavBar icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    className="home-navbar" >
                    <div className="nav-title">激活码交易记录</div>
                </NavBar>
                <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
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
                <div className="fans-list-view-container">
                
                </div>
            </div>
        )
    }
}