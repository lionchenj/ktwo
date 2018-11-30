import * as React from 'react';
import './App.css';
// import { Button } from 'antd-mobile'
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { IdCard } from "./pages/idcard/IdCard";
import { Home } from "./pages/home/Home";
import { MyTeam } from "./pages/myTeam/MyTeam";
import { Settings } from "./pages/settings/Settings";
import { Sales } from "./pages/sales/Sales";
import { Message } from "./pages/message/Message";
import { Community } from "./pages/community/Community";
import { TransactionPwd } from "./pages/transactionPwd/TransactionPwd";
import { TransactionPwdForget } from "./pages/transactionPwd/TransactionPwdforget";
import { TouchPwd } from "./pages/touchPwd/TouchPwd";
import { UpdatePwd } from "./pages/updatePwd/UpdatePwd";
import { ForgetPwd } from "./pages/forgetPwd/ForgetPwd";
import { BankCardAdd } from "./pages/bankCard/BankCardAdd";
import { BankCard } from "./pages/bankCard/BankCard";
import { Feedback } from "./pages/feedback/Feedback";
import { Exchange } from "./pages/exchange/Exchange";
import { ExchangeAgreement } from "./pages/exchangeAgreement/ExchangeAgreement";
import { Change } from "./pages/change/Change"
import { Wallet } from "./pages/wallet/Wallet";
import { WalletQuiet } from "./pages/wallet/WalletQuiet";
import { Deposit } from "./pages/deposit/Deposit"
import { MyCode } from "./pages/myCode/MyCode"
import { Earnings } from "./pages/earnings/Earnings";
import { EarningsQuiet } from "./pages/earningsQuiet/EarningsQuiet";
import { Activate } from "./pages/activate/Activate";
import { Customer } from "./pages/customer/Customer";
import { WithdrawHistory } from "./pages/withdrawHistory/WithdrawHistory";
import { DepositHistory } from "./pages/depositHistory/DepositHistory";
import { ChangeHistory } from "./pages/changeHistory/ChangeHistory";
import { MessageDetail } from "./pages/messageDetail/MessageDetail";
let touch = window.localStorage.getItem('gesture');
let touchPwd = window.localStorage.getItem("touchpwd");
// const NotFound = () => (
//   <div> Sorry, this page does not exist. </div>
// )
class App extends React.Component {

  public render() {
    return (
      <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/home" component={Home} />
          <Route path="/login"  component={Login} />
          <Route path="/register"  component={Register} />
          <Route path="/idcard" component={IdCard} />
          <PrivateRoute path="/myTeam"  component={MyTeam} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute path="/sales" component={Sales} />
          <PrivateRoute path="/myCode" component={MyCode} />
          <PrivateRoute path="/message" component={Message} />
          <PrivateRoute path="/community" component={Community} />
          <PrivateRoute path="/transactionPwd" component={TransactionPwd} />
          <PrivateRoute path="/transactionPwdForget" component={TransactionPwdForget} />
          <PrivateRoute path="/touchPwd" component={TouchPwd} />
          <Route path="/update_pwd" component={UpdatePwd} />
          <Route path="/forget_pwd" component={ForgetPwd} />
          <PrivateRoute path="/bankCardAdd" component={BankCardAdd} />
          <PrivateRoute path="/BankCard" component={BankCard} />
          <PrivateRoute path="/feedback" component={Feedback} />
          <PrivateRoute path="/exchangeAgreement" component={ExchangeAgreement} />
          <PrivateRoute path="/exchange" component={Exchange} />
          <PrivateRoute path="/change" component={Change} />
          <PrivateRoute path="/wallet" component={Wallet} />
          <PrivateRoute path="/walletQuiet" component={WalletQuiet} />
          <PrivateRoute path="/deposit" component={Deposit} />
          <PrivateRoute path="/earnings" component={Earnings} />
          <PrivateRoute path="/earningsQuiet" component={EarningsQuiet} />
          <PrivateRoute path="/activate" component={Activate} />
          <PrivateRoute path="/customer" component={Customer} />
          <PrivateRoute path="/withdrawHistory" component={WithdrawHistory} />
          <PrivateRoute path="/depositHistory" component={DepositHistory} />
          <PrivateRoute path="/changeHistory" component={ChangeHistory} />
          <PrivateRoute path="/messageDetail" component={MessageDetail} />
          <Route component={touchPwd&&touch=='1'?TouchPwd:Home} />
      </Switch>
    );
  }
}

export default App;
