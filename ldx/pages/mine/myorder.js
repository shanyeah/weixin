// pages/mine/myorder.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    nextPage: 1,
    hasNextPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.loadData();
  },


  loadData: function () {
    wx.showNavigationBarLoading();
    var pageNum = this.data.nextPage;
    var that = this;
    common.request({
      url: api.queryMyOrderList,
      data: { pageNum: pageNum },
      method: 'POST',
      success: function (res) {
        var data = res.data;
        if (data && data.list) {
          var orderList = res.data.list;
          var statusArray = ['待支付', '已支付', '已取消', '已退款'];
          for (var i = 0; i < orderList.length; i++) {
            var item = orderList[i];
            item.statusText = statusArray[item.status];
            item.incomeAmount = item.incomeAmount.toFixed(2);
            item.payAmount = item.payAmount.toFixed(2);
          }

          var resultList = [];
          if (pageNum == 1) {
            resultList = orderList;
          } else {
            resultList = Array.prototype.concat.apply(that.data.orderList, orderList);
          }
          var hasNextPage = data.hasNextPage;
          var nextPage = data.nextPage;
          that.setData({
            orderList: resultList,
            nextPage: nextPage,
            hasNextPage: hasNextPage
          });
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({ nextPage: 1});
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})