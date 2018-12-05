import * as React from 'react';
import { NavBar, Icon} from "antd-mobile";
import { History } from "history";
// / <reference path="node.d.ts"/>
// import * as URL from "url";
// let myUrl = URL.parse("http://www.365webcall.com/IMMe2.aspx?settings=mw7mw6bm7PXwX6z3A7NwINz3AINNPz3A66mmPX&LL=0");

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
            <div id="tab_1">
    <iframe src="div.html"
            height="500"
            width="1200"
            scrolling="0"
    ></iframe>
        </div>
        )
    }
}