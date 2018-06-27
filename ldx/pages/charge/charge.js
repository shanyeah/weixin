// charge.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp();
Page({

  data: {
    tag: 0,
    emptyText: '',
    inputValue: '',
    chargeValue: 0,
    presentValue: 0,
    focus: false, 
    organid: 0,
    organName: '',
    presentList: [],
    rowList: [],
    
  },

  onLoad: function (options) {
     var organId = options.organId == 'undefined' ?  '' : options.organId;
     var organName = options.organName == 'undefined' ? '' : options.organName;
     this.setData({ organId: organId, organName: organName});
     this.queryChargePresentList();
  },

  switchTag: function(event) {
    var tag = event.currentTarget.dataset.tag;
    this.switchTagAction(tag);
  },

  switchTagAction: function (tag) {
    var item = this.data.presentList[tag];
    var chargeValue = item.chargeAmount;
    var presentValue = item.presentAmount;
    this.setData({ tag: tag, chargeValue: chargeValue, presentValue: presentValue });
  },
  

  queryChargePresentList: function() {
    var that = this;
    common.request({
      url: api.queryChargePresentList + "?organId=" + this.data.organId,
      data: {},
      method: 'GET',
      success: function (res) {
        var presentList = res.data;

        if (presentList.length > 0) {
            var rowList = new Array();
            for (var i = 0; i < presentList.length; i++) {
              var item = presentList[i];
              item.tag = i;
              item.chargeAmount = item.chargeAmount.toFixed(2);
              item.presentAmount = item.presentAmount.toFixed(2);

              var rows = Math.floor(i / 3);
              var array = null;
              if (rowList.length <= rows) {
                array = new Array();
                rowList.push(array);
              } else {
                array = rowList[rows];
              }
              array.push(item);
            }

            that.setData({ presentList: res.data, rowList: rowList });
            that.switchTagAction(0);
        } else {
            that.setData({ presentList: [], rowList: [], emptyText: '门店暂未开通充值业务' });
        }
        
      },
      fail: function (res) {
      }
    })
  },


  bindblur: function (e) {
    this.setData({
      chargeValue: e.detail.value
    });
    this.queryUserChargePresentList();
  },

  charge: function() {
    if(this.data.chargeValue == 0) {
      return;
    }
    wx.showLoading({
      title: '加载中...'
    });

    var openId = wx.getStorageSync("openId");
    var params = { chargeAmount: this.data.chargeValue, organId: this.data.organId, openId: openId};
    console.log(params);
    common.request({
      url: api.charge,
      data: params,
      method: 'POST',
      success: function (res) {
        console.log(res);
        var data = res.data.tn;
        wx.hideLoading();
        var url = '../pay/pay?type=' + 'recharge' + '&timestamp=' + data.timeStamp
          + '&nonceStr=' + data.nonceStr
          + '&prepay_id=' + data.packageStr.substring(data.packageStr.indexOf("=") + 1)
          + '&signType=' + data.signType
          + '&paySign=' + data.paySign;
        console.log(url);
        wx.navigateTo({
          url: url,
        });
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
  }

})