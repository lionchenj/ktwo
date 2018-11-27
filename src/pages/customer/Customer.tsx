import * as React from 'react';
import { NavBar, Icon} from "antd-mobile";
import { History } from "history";
// import { UIUtil } from '../../utils/UIUtil';
// import { UserService } from '../../service/UserService';

// import copy from 'copy-to-clipboard';

// import "./Activate.css"
// import { UserService } from '../../service/UserService';
// import { UIUtil } from '../../utils/UIUtil';
// import { model } from '../../model/model';
// import iconExchange from "../../assets/icon_exchange.png"


interface CustomerProps {
    history: History
}


interface CustomerState {
    types:number,
    address:string,
    cardList:any
}


export class Customer extends React.Component<CustomerProps, CustomerState> {
    customer:string

    constructor(props: CustomerProps) {
        super(props);
        this.state = {
            address:'',
            types:3,
            cardList:[]
        };
        
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    
    componentDidMount() {
        

    }

    public render() {
        return (
            <div className="message-container">
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={ this.onRedirectBack} className="home-navbar"> <div className="nav-title">在线客服</div></NavBar>
                <div><a href="http://www.365webcall.com/">在线客服</a></div>
                <script type='text/javascript' src='http://www.365webcall.com/IMMe2.aspx?settings=mw7mw6bm7PXwX6z3A7NwINz3AINNPz3A66mmPX&LL=0'></script>
                <div style={{position:'absolute',top:'100px',left:'100px'}}><a href="http://www.365webcall.com/">在线客服系统</a></div>
            </div>
        )
    }
}