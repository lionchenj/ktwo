import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { UserStorage } from "./storage/UserStorage";
import { UserStorage } from "../appOut";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);
UserStorage.setCookie('gesture','0')
registerServiceWorker();
