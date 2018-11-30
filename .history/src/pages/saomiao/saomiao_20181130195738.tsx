import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';

interface saomiaoProps {
    history: History
}

interface saomiaoState {
}

export class saomiao extends React.Component<saomiaoProps, saomiaoState> {
    ws:null,
				wo:null;
			var scan = null,
    constructor(props: saomiaoProps) {
        super(props)
        this.state = {
        }
    }
    
				domready = false;
			// H5 plus事件处理
			function plusReady() {
				if(ws || !window.plus || !domready) {
					return;
				}
				// 获取窗口对象
				ws = plus.webview.currentWebview();
				wo = ws.opener();
				// 开始扫描
				ws.addEventListener('show', function() {
					var styles = {
						frameColor: "#65e102",
						scanbarColor: "#b7e871",
						background: "#000"
					}; //边框属性
					var filter; //扫码格式 空为全类型，不能省略
					scan = new plus.barcode.Barcode('bcid', filter, styles);
					scan.onmarked = onmarked;
					scan.start({
						conserve: true,
						filename: '_doc/barcode/'
					});
				}, false);
				// 显示页面并关闭等待框
				ws.show('pop-in');
				wo.evalJS('closeWaiting()');
			}
			if(window.plus) {
				plusReady();
			} else {
				document.addEventListener('plusready', plusReady, false);
			}
			// 监听DOMContentLoaded事件
			document.addEventListener('DOMContentLoaded', function() {
				domready = true;
				plusReady();
			}, false);
			// 二维码扫描成功
			onmarked = (type:string, result:string, file:string) => {
				switch(type) {
					case plus.barcode.QR:
						type = 'QR';
						break;
					case plus.barcode.EAN13:
						type = 'EAN13';
						break;
					case plus.barcode.EAN8:
						type = 'EAN8';
						break;
					default:
						type = '其它' + type;
						break;
				}
				result = result.replace(/\n/g, '');
				wo.evalJS("scaned('" + type + "','" + result + "','" + file + "');");
				back();
			}
			// 从相册中选择二维码图片 
			scanPicture = () => {
				plus.gallery.pick(function(path) {
					plus.barcode.scan(path, onmarked, function(error) {
						plus.nativeUI.alert('无法识别此图片');
					});
				}, function(err) {
					console.log('Failed: ' + err.message);
				});
			}

    public render() {
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">新增银行卡</div>
                </NavBar>
                <div id="bcid">
                    <div style={{height:'40%'}}></div>
                    <p className="tip">...载入中...</p>
                </div>
                <footer>
                    <div className="fbt" onclick="back()">取　 消</div>
                    <div className="fbt" onclick="scanPicture()">从相册选择二维码</div>
                </footer>
            </div>
        )
    }
}