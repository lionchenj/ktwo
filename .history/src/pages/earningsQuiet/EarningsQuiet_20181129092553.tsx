import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List} from "antd-mobile";
import { History } from "history";

import { UserService } from '../../service/UserService';
import { model } from '../../model/model';

interface EarningsQuietProps {
    history: History
}


interface EarningsQuietState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    visible: boolean,
    selectedEarningStyle?: "2"|"3"|"4"|"5"
}





export class EarningsQuiet extends React.Component<EarningsQuietProps, EarningsQuietState> {
    rData: any
    lv: any
    page:number
    constructor(props: EarningsQuietProps) {
        super(props);
        this.page = 1
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
          });
      
          this.state = {
            dataSource,
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

    componentDidMount() {
      this._loadDataWithStyle()
      
      }

      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        this.setState({ isLoading: true });
        this._loadDataWithStyle()
      }



    handleVisibleChange = (visible: boolean) => {
        this.setState({
            ...this.state,
            visible,
          });
          
    }

    onSelect = (opt: any) => {
        console.log("selected key", opt.key);
        this._loadDataWithStyle()
        this.setState({
            ...this.state,
            visible: false,
            selectedEarningStyle: opt.key
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
       
          const row = (rowData: model.ProfitItem, sectionID: number, rowID: number) => {
            return (
                <List.Item multipleLine extra={rowData.number} >
                静态收益 <List.Item.Brief>{rowData.time}</List.Item.Brief>
                </List.Item>
  
            );
          };
          
        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar">
                        <div className="nav-title">收益流水</div>
                </NavBar>
                <div className="earings-filter-type-text">显示昨日收益{this.state.dataSource.getRowCount()}条</div>
                <div className="fans-list-view-container">
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
            </div>
        )
    }

    private _loadDataWithStyle() {
      UserService.Instance.profit('4',this.page).then( (profitData) => {
        const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
        const hei = document.documentElement.clientHeight - offsetTop
        this.page = this.page +1;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(profitData.list),
          isLoading: false,
          hasMore: false,
          height: hei
        });
      })
    }
}