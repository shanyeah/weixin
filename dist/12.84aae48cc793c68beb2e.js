webpackJsonp([12],{476:function(e,t,a){"use strict";function l(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(185),d=r(n),o=a(9),u=r(o),c=a(5),i=r(c),s=a(8),f=r(s),m=a(6),y=r(m),v=a(7),h=r(v);a(186);var g=a(0),p=r(g);a(546);var x=a(487),b=l(x),w=a(183),N=(l(w),a(184)),E=a(187),I=r(E),B=function(e){function t(e){(0,i.default)(this,t);var a=(0,y.default)(this,(t.__proto__||(0,u.default)(t)).call(this,e));return a.state={organId:0,walletInfo:{},totalBalance:0,totalCashBalance:0,totalPresentBalance:0,walletList:[]},a}return(0,h.default)(t,e),(0,f.default)(t,[{key:"componentDidMount",value:function(e){document.title="我的钱包";var t=I.default.parse(this.props.location.search);t.organId&&(this.state.organId=t.organId),this.loadData()}},{key:"loadData",value:function(){var e=this,t={};this.state.organId&&(t.organId=this.state.organId),b.queryMyWallet(t,{success:function(t){var a=t.data,l=a.walletList,r=a.totalBalance.toFixed(2),n=a.totalCashBalance.toFixed(2),d=a.totalPresentBalance.toFixed(2);if(l&&l.length>0)for(var o=0;o<l.length;o++){var u=l[o];u.balance=u.balance.toFixed(2),u.cashBalance=u.cashBalance.toFixed(2),u.presentBalance=u.presentBalance.toFixed(2)}else l=[];e.setState({walletInfo:a,walletList:l,totalBalance:r,totalCashBalance:n,totalPresentBalance:d})},error:function(e){d.default.fail(e)}})}},{key:"render",value:function(){var e=this;return p.default.createElement("div",{className:"page"},0==this.state.walletList.length?p.default.createElement("div",{className:"card_empty_view"},p.default.createElement("div",{className:"card_empty_text"},"你还没有会员卡, 赶快去开通吧!")):p.default.createElement(N.Panel,null,p.default.createElement("div",{className:"user_detail_view"},p.default.createElement("div",{className:"user_money_view"},p.default.createElement("div",null,"现金余额"),p.default.createElement("div",null,this.state.totalCashBalance)),p.default.createElement("div",{className:"user_detail_line"}),p.default.createElement("div",{className:"user_money_view"},p.default.createElement("div",null,"赠送余额"),p.default.createElement("div",null,this.state.totalPresentBalance)),p.default.createElement("div",{className:"user_detail_line"}),p.default.createElement("div",{className:"user_money_view"},p.default.createElement("div",null,"钱包余额"),p.default.createElement("div",null,this.state.totalBalance)))),this.state.walletList.map(function(t,a){return p.default.createElement(N.Panel,{key:a},p.default.createElement(N.Cell,{style:{fontSize:"16px"}},p.default.createElement(N.CellBody,null,"门店名称"),p.default.createElement(N.CellFooter,null,t.organName)),p.default.createElement(N.Cell,{style:{fontSize:"16px"}},p.default.createElement(N.CellBody,null,"会员等级"),p.default.createElement(N.CellFooter,null,t.className)),p.default.createElement(N.Cell,{style:{fontSize:"16px"},access:!0,"data-walletid":t.walletId,onClick:function(t){var a=t.currentTarget.getAttribute("data-walletid");e.props.history.push("./walletlog?walletId="+a)}},p.default.createElement(N.CellBody,null,"现金金额"),p.default.createElement(N.CellFooter,{className:"cash_text"},t.cashBalance)),p.default.createElement(N.Cell,{style:{fontSize:"16px"},access:!0,"data-walletid":t.walletId,onClick:function(t){var a=t.currentTarget.getAttribute("data-walletid");e.props.history.push("./walletlog?walletId="+a)}},p.default.createElement(N.CellBody,null,"赠送金额"),p.default.createElement(N.CellFooter,{className:"cash_text"},t.presentBalance)),p.default.createElement(N.Cell,{style:{fontSize:"16px"},access:!0,"data-walletid":t.walletId,onClick:function(t){var a=t.currentTarget.getAttribute("data-walletid");e.props.history.push("./walletlog?walletId="+a)}},p.default.createElement(N.CellBody,null,"钱包余额"),p.default.createElement(N.CellFooter,{className:"cash_text"},t.balance)))}))}}]),t}(p.default.Component);t.default=B,e.exports=t.default},487:function(e,t,a){"use strict";function l(e,t){var a=e.type,l={type:a};return(0,w.default)("xcx/queryAppAdList.do",{method:"GET",body:l},t)}function r(e,t){var a=e.pageNum,l=e.name,r=e.latitude,n=e.longitude,d=e.serviceCode,o=e.orderBy,u={pageNum:a,latitude:r,longitude:n,orderBy:0};return l&&l.length>0&&(u.name=l),d&&d.length>0&&(u.serviceCode=d),o&&(u.orderBy=o),(0,w.default)("xcx/queryNearbyNetbar.do",{method:"POST",body:u},t)}function n(e,t){var a=e.organId,l=e.latitude,r=e.longitude,n={latitude:l,longitude:r};return a>0&&(n.organId=a),(0,w.default)("xcx/netbarDetail.do",{method:"POST",body:n},t)}function d(e,t){var a=e.organId,l=e.pageNum,r={organId:a,pageNum:l};return(0,w.default)("xcx/queryNetbarReviewList.do",{method:"POST",body:r},t)}function o(e,t){var a=e.organId,l={organId:a,type:0};return(0,w.default)("xcx/followNetbar.do",{method:"POST",body:l},t)}function u(e,t){var a=e.organId,l={organId:a,type:1};return(0,w.default)("xcx/followNetbar.do",{method:"POST",body:l},t)}function c(e,t){var a=e;return(0,w.default)("xcx/saveNetbarReview.do",{method:"POST",body:a},t)}function i(e,t){var a=e.organId,l={organId:a};return(0,w.default)("xcx/queryChargePresentList.do",{method:"GET",body:l},t)}function s(e,t){var a=e;return(0,w.default)("xcx/userSelfRechange.do",{method:"POST",body:a},t)}function f(e,t){var a=e.serviceCode,l=e.pageNum,r=e.latitude,n=e.longitude,d={serviceCode:a,pageNum:l,latitude:r,longitude:n};return(0,w.default)("xcx/queryFollowNetbarList.do",{method:"POST",body:d},t)}function m(e){var t={};return(0,w.default)("xcx/myCenter.do",{method:"POST",body:t},e)}function y(e,t){var a=e;return(0,w.default)("xcx/queryMyWallet.do",{method:"GET",body:a},t)}function v(e,t){var a=e.walletId,l=e.pageNum,r={walletId:a,pageNum:l};return(0,w.default)("xcx/queryMyWalletLog.do",{method:"POST",body:r},t)}function h(e,t){var a=e.pageNum,l={pageNum:a};return(0,w.default)("xcx/queryMyGoodsBill.do",{method:"POST",body:l},t)}function g(e,t){var a=e.nickName,l={nickName:a};return(0,w.default)("xcx/editUserInfo.do",{method:"POST",body:l},t)}function p(e,t){var a=e.saleBillId,l={saleBillId:a};return(0,w.default)("xcx/queryGoodsBillDetail.do",{method:"GET",body:l},t)}function x(e,t){var a=e.fileBase64,l=e.objectType,r={fileBase64:a,objectType:l};return(0,w.default)("xcx/uploadImage.do",{method:"POST",body:r},t)}Object.defineProperty(t,"__esModule",{value:!0}),t.loadAd=l,t.queryNearbyNetbar=r,t.queryNetbarDetail=n,t.queryNetbarReviewList=d,t.followNetbar=o,t.unfollowNetbar=u,t.addReview=c,t.queryChargePresentList=i,t.charge=s,t.queryFollowNetbarList=f,t.queryMyInfo=m,t.queryMyWallet=y,t.queryWalletLog=v,t.queryMyOrderList=h,t.editUserInfo=g,t.queryGoodsBillDetail=p,t.uploadImage=x;var b=a(188),w=function(e){return e&&e.__esModule?e:{default:e}}(b)},546:function(e,t){}});