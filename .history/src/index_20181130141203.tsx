import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
window.localStorage.setItem('gesture','0')
registerServiceWorker();
  window.apiready = function () {
    var timer = 0
    api.addEventListener({
      name: 'keyback'
    }, function (ret, err) {
      var currentTime = +new Date()
      api.historyBack(function (ret, err) {
        if (!ret.status) {
          if ((currentTime - timer) > 2000) {
            timer = currentTime
            api.toast({
              msg: '再按一次返回键退出app',
              duration: 2000,
              location: 'bottom'
            })
          } else {
            api.closeWidget({
              id: 'A6089289836112', //这里改成自己的应用ID
              retData: {name: 'closeWidget'},
              silent: true
            })
          }
        }
      })
    })
  }