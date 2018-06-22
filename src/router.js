import React from 'react';
import ReactDom from 'react-dom';
import dynamic from 'dva/dynamic';
import { Router, Route, Switch } from 'dva/router';
import { BrowserRouter } from 'react-router-dom'
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import MovieDetailPage from './routes/MovieDetailPage';

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage'),
  });

  const IndexHomePage = dynamic({
    app,
    component: () => import('./routes/IndexHomePage'),
  });

  const IndexMinePage = dynamic({
    app,
    component: () => import('./routes/IndexMinePage'),
  });

  const LoginPage = dynamic({
    app,
    component: () => import('./routes/LoginPage'),
  });

  const LoginWeixinPage = dynamic({
    app,
    component: () => import('./routes/LoginWeixinPage'),
  });

  const StgPage = dynamic({
    app,
    component: () => import('./routes/StgPage'),
  });

  const StgListPage = dynamic({
    app,
    component: () => import('./routes/StgListPage'),
  });

  const ReviewPage = dynamic({
    app,
    component: () => import('./routes/ReviewPage'),
  });

  const ChargePage = dynamic({
    app,
    component: () => import('./routes/ChargePage'),
  });

  const FavoritePage = dynamic({
    app,
    component: () => import('./routes/FavoritePage'),
  });

  const WalletPage = dynamic({
    app,
    component: () => import('./routes/WalletPage'),
  });

  const OrderListPage = dynamic({
    app,
    component: () => import('./routes/OrderListPage'),
  });

  const SettingPage = dynamic({
    app,
    component: () => import('./routes/SettingPage'),
  });


  const WalletLogPage = dynamic({
    app,
    component: () => import('./routes/WalletLogPage'),
  });

  const ChangeNickNamePage = dynamic({
    app,
    component: () => import('./routes/ChangeNickNamePage'),
  });

  const ChangePasswordPage = dynamic({
    app,
    component: () => import('./routes/ChangePasswordPage'),
  });
  
  const OrderDetailPage = dynamic({
    app,
    component: () => import('./routes/OrderDetailPage'),
  });
  
  const MovieListPage = dynamic({
    app,
    component: () => import('./routes/MovieListPage'),
  });

  const MovieDetailPage = dynamic({
    app,
    component: () => import('./routes/MovieDetailPage'),
  });

  const MovieBookPage = dynamic({
    app,
    component: () => import('./routes/MovieBookPage'),
  });

  const MovieBookRoomPage = dynamic({
    app,
    component: () => import('./routes/MovieBookRoomPage'),
  });

  const MovieBookDetailPage = dynamic({
    app,
    component: () => import('./routes/MovieBookDetailPage'),
  });
   
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/discover" component={IndexPage} />
        <Route exact path="/home" component={IndexHomePage} />
        <Route exact path="/mine" component={IndexMinePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/loginWeixin" component={LoginWeixinPage} />
        <Route exact path="/stg" component={StgPage} />
        <Route exact path="/stgList" component={StgListPage} />
        <Route exact path="/review" component={ReviewPage} />
        <Route exact path="/charge" component={ChargePage} />
        <Route exact path="/favorite" component={FavoritePage} />
        <Route exact path="/mywallet" component={WalletPage} />
        <Route exact path="/walletlog" component={WalletLogPage} />
        <Route exact path="/myorderlist" component={OrderListPage} />
        <Route exact path="/movieList" component={MovieListPage} />
        <Route exact path="/movieDetail" component={MovieDetailPage} />
        <Route exact path="/movieBook" component={MovieBookPage} />
        <Route exact path="/movieBookDetail" component={MovieBookDetailPage} />
        <Route exact path="/movieBookRoomList" component={MovieBookRoomPage} />
        <Route exact path="/setting" component={SettingPage} />
        <Route exact path="/changepassword" component={ChangePasswordPage} />
        <Route exact path="/changeuserinfo" component={ChangeNickNamePage} />
        <Route exact path="/orderDetail" component={OrderDetailPage} />
      </Switch>
    </Router>
  );
}

function listen() {
  if (document.readyState == 'complete') { // 资源加载完成
    var div = document.getElementById('mj_loading_mask');
    div.style.display = "none";
  } else { // 资源加载中

  }
}

document.onreadystatechange = listen;

export default RouterConfig;