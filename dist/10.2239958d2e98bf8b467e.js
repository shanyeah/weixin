webpackJsonp([10],{469:function(e,t,l){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=l(64),a=o(n),u=l(185),d=o(u),r=l(9),s=o(r),i=l(5),c=o(i),f=l(8),m=o(f),g=l(6),p=o(g),v=l(7),h=o(v);l(186);var b=l(0),w=o(b);l(550);var _=l(184),y=l(496),C=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&(t[l]=e[l]);return t.default=e,t}(y),E=function(e){function t(e){(0,c.default)(this,t);var l=(0,p.default)(this,(t.__proto__||(0,s.default)(t)).call(this,e));return l.state={mobile:"",password:"",loading:!1,showToast:!1,msg:""},l}return(0,h.default)(t,e),(0,m.default)(t,[{key:"componentDidMount",value:function(){document.title="登录"}},{key:"login",value:function(){var e=this.state.mobile,t=this.state.password;if(0==e.length)return void this.showToast("请输入手机号!");if(0==t.length)return void this.showToast("请输入密码!");var l=this;d.default.loading("登录中...",30,function(){}),C.login({mobile:e,password:t},{success:function(e){var t=e.data,o=t.token,n=window.localStorage;n.setItem("ldx_userInfo",(0,a.default)(t)),n.setItem("ldx_token",o),l.setState({loading:!1}),d.default.success("登录成功!"),l.props.history.goBack()},error:function(e){l.setState({loading:!1}),d.default.fail(e)}})}},{key:"getCode",value:function(){var e=this.state.mobile;if(0==e.length)return void d.default.warn("请输入手机号!");var t=this;this.setState({loading:!0}),C.getCode({mobile:e,type:1},{success:function(e){console.log(e),t.setState({loading:!1}),d.default.success("发送验证码成功!",1)},error:function(e){t.setState({loading:!1}),d.default.fail(e,1)}})}},{key:"render",value:function(){var e=this;return w.default.createElement("div",{className:"page"},w.default.createElement("img",{src:l(551),className:"login_logo"}),w.default.createElement(_.Cells,null,w.default.createElement(_.Cell,null,w.default.createElement(_.CellHeader,null,w.default.createElement(_.Label,null,"手机号")),w.default.createElement(_.CellBody,null,w.default.createElement(_.Input,{type:"tel",placeholder:"输入手机号",onChange:function(t){e.setState({mobile:t.target.value})}}))),w.default.createElement(_.Cell,null,w.default.createElement(_.CellHeader,null,w.default.createElement(_.Label,null,"密码")),w.default.createElement(_.CellBody,null,w.default.createElement(_.Input,{type:"password",placeholder:"输入密码",onChange:function(t){e.setState({password:t.target.value})}})),w.default.createElement(_.CellFooter,null,w.default.createElement(_.Button,{className:"login_send_button",type:"vcode",onClick:function(t){e.getCode()}},"获取验证码")))),w.default.createElement("div",{className:"login_button"},w.default.createElement(_.Button,{onClick:function(t){e.login()}},"登录")))}}]),t}(w.default.Component);t.default=E,e.exports=t.default},496:function(e,t,l){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function n(e,t){var l=e.mobile,o=e.password;window.localStorage.removeItem("ldx_userInfo"),window.localStorage.removeItem("ldx_token"),window.localStorage.removeItem("ldx_stgId");var n={mobile:l,password:o};return(0,i.default)("xcx/login.do",{method:"POST",body:n},t)}function a(e){var t={};return(0,i.default)("xcx/logout.do",{method:"POST",body:t},e)}function u(e,t){var l=e.mobile,o=e.type,n={mobile:l,type:o};return(0,i.default)("xcx/sendSms.do",{method:"POST",body:n},t)}function d(e,t){var l=e.mobile,o=e.code,n=e.password,a={mobile:l,code:o,password:n};return(0,i.default)("xcx/resetPassword.do",{method:"POST",body:a},t)}function r(e,t){var l=e.code,o={code:l};return(0,f.default)("http://api.mjdj.cn/jssdk/getOpenId.do",{method:"POST",body:o},t)}Object.defineProperty(t,"__esModule",{value:!0}),t.login=n,t.logout=a,t.getCode=u,t.resetPassword=d,t.getOpenId=r;var s=l(188),i=o(s),c=l(99),f=o(c)},550:function(e,t){},551:function(e,t,l){e.exports=l.p+"static/login_logo.e747954f.png"}});