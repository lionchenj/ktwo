import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { UserStorage } from "./storage/UserStorage";
import appOut from "./utils/appOut";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
UserStorage.getCookie('gesture')?'':UserStorage.setCookie('gesture','0')
registerServiceWorker();
appOut();
