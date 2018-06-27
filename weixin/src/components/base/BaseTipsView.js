import React from 'react';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';

var historyStack = new Array();

class BaseTipsView extends React.Component {
  constructor(props) {
    super(props);
  }

  errorListener(event) {
      // 监听加载页面 js 错误
      var reason = event.reason + "";
      if (reason.indexOf('Loading chunk') > 0) {
          Toast.fail("网络异常,请稍候再试!", 3);  
          history.go(-1);
      }
  }

  componentDidMount() {
      if (!window['mjdjErrorListener']) {
          window.addEventListener('unhandledrejection', this.errorListener.bind(this));
          window['mjdjErrorListener'] = 1;
      }
  }

  componentDidUpdate() {
    if (this.props.msg) {
        if (this.props.msgType == 0) {
          Toast.fail(this.props.msg, 3);
        } else if (this.props.msgType == 1) {
          Toast.show(this.props.msg, 3);
        }
      }
  }

  render() {
    return <div timestamp={this.props.timestamp}></div>;
  }
}

function mapStateToProps(state) {
  const { msg, msgType, timestamp} = state.tips;
  return {
    msg,
    msgType,
    timestamp
  };
}

export default connect(mapStateToProps)(BaseTipsView);