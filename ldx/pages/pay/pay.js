// pages/pay/pay.js
var api = require('../../utils/mjapi.js')
Page({
  data: {
  
  },
  onLoad: function (options) {
    var type = options.type;
    wx.requestPayment({
      timeStamp: options.timestamp,
      nonceStr: options.nonceStr,
      package: "prepay_id=" + options.prepay_id + "",
      signType: options.signType,
      paySign: options.paySign,
      success: function (res) {
        console.log(res);
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (type == 'order') {
          // 订餐
          prevPage.setData({
            url: api.myOrderUrl + '?hiddenBar=true'
          })
        } else if (type == 'recharge') {
          // 充值
          prevPage.setData({
            url: api.consumerDetailUrl + '?hiddenBar=true'
          })
        }
        wx.navigateBack({
          
        })
      },
      fail: function (res) {
        console.log(res);
        wx.navigateBack({

        })
      }
    })
  }
})