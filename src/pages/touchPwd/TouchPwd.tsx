import * as React from "react";
var HandLock = require("./lock");
import { History, Location } from "history";
import { NavBar, Icon} from "antd-mobile";
import "./TouchPwd.css";
import { UIUtil } from '../../utils/UIUtil';
import { Util } from '../../utils/Util';
var password = window.localStorage.getItem("checkpwd");
var updata = '';
var status = true//true:修改，false:首次新增

interface TouchPwdProps {
  history: History;
  location: Location
}

interface TouchPwdState {
  message: string;
  nowDate: string;
}
export class TouchPwd extends React.Component<TouchPwdProps, TouchPwdState> {
  newPwd:any
  constructor(props: TouchPwdProps) {
    super(props);
    this.state = {
        nowDate: Util.formatDate('1',4),
        message: "请输手势密码",
    };
  }
  onRedirectBack = () => {
    const history = this.props.history
    history.goBack()
}
  public componentDidMount() {
    updata = this.props.location.state&&this.props.location.state.updata || '';
    if(!password || updata == '1'){
      status = false
        this.setState({
            message:"请输新手势密码"
        })
    }
    let that = this;
    var locker = new HandLock.Locker({
      focusColor: "#00153E", //当前选中的圆的颜色
      fgColor: "#5B8CCD", //未选中的圆的颜色
      bgColor: "#fff", //canvas背景颜色
      container: document.querySelector("#handlock"),
      check: {
        checked: function(res: any) {
          if (res.err) {
              console.log('check')
            console.log(res.err); //密码错误或长度太短
            that.setState({
                message:"密码错误或长度太短"
            })
            locker.clearPath();
        } else {
            console.log(`正确，密码是：${res.records}`);
            that.props.history.push('/home')
          }
        }
      },
      update: {
        beforeRepeat: function(res: any) {
          if (res.err) {
              console.log('update')
            that.setState({
                message:"密码长度太短"
            })
              console.log(res.err); //密码长度太短
            locker.clearPath();
        } else {
            locker.clearPath();
            that.setState({
                message:"请再次输新手势密码"
            })
            console.log(`密码初次输入完成，等待重复输入`);
          }
        },
        afterRepeat: function(res: any) {
          if (res.err) {
            that.setState({
                message:"密码长度太短或者两次密码输入不一致"
            })
            console.log(res.err); //密码长度太短或者两次密码输入不一致
            locker.clearPath();
        } else {
            window.localStorage.setItem("checkpwd", res.records);
            console.log(`密码更新完成，新密码是：${res.records}`);
            console.log(that.changeStr(res.records));
            UIUtil.showInfo("修改成功")
            that.newPwd = that.changeStr(res.records);
            window.localStorage.setItem("touchpwd", that.newPwd);
            that.props.history.goBack()
          }
        }
      }
    });
    if(status){
        console.log('check')
        locker.check(password);
    }else{
        console.log('update')
        locker.update(password);
    }
  }
  //转换密码数字
  changeStr(str:string){
    var m=str.length/2;
    if(m*2<str.length){
        m++;
    }
    var strs=['0'];
    var j=0;
    for(var i=0;i<str.length;i++){
        if(i%2==0){//每隔两个
            strs[j]=""+str.charAt(i);
        }else{
            strs[j]=this.changeNumber(strs[j]+str.charAt(i));//将字符加上两个空格
            j++;
        }           
    }
    return strs;
  }
  changeNumber(str:string){
    var num = '1';
    switch(str){
        case '11':
        num = '1';
        break;
        case '12':
        num = '2';
        break;
        case '13':
        num = '3';
        break;
        case '21':
        num = '4';
        break;
        case '22':
        num = '5';
        break;
        case '23':
        num = '6';
        break;
        case '31':
        num = '7';
        break;
        case '32':
        num = '8';
        break;
        case '33':
        num = '9';
        break;
    }
    return num;
  }
  render() {
    return (
      <div>
        {
          status?<div/>:<NavBar mode="light" icon={<Icon type="left" />} onLeftClick={ this.onRedirectBack} className="home-navbar" >修改手势密码</NavBar>
        }
        <div className={status?"titleDate":"titleDate2"}>{this.state.nowDate}</div>
        <div className="titleMessage">{this.state.message}</div>
        <div className="handlock" id="handlock" />
      </div>
    );
  }
}
