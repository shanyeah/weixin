// pages/mine/mywallet.js
// pages/mine/myorder.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    walletInfo: {},
    totalBalance: 0,
    totalCashBalance: 0,
    totalPresentBalance: 0,
    walletList: []
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
      url: api.queryMyWallet,
      data: {},
      method: 'GET',
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var walletInfo = res.data;
        var walletList = walletInfo.walletList;

        var totalBalance = walletInfo.totalBalance.toFixed(2);
        var totalCashBalance = walletInfo.totalCashBalance.toFixed(2);
        var totalPresentBalance = walletInfo.totalPresentBalance.toFixed(2);

        for (var i = 0; i < walletList.length; i++) {
            var wallet = walletList[i];
            wallet.balance = wallet.balance.toFixed(2);
            wallet.cashBalance = wallet.cashBalance.toFixed(2);
            wallet.presentBalance = wallet.presentBalance.toFixed(2);
        }

        that.setData({ walletInfo: walletInfo, walletList: walletList, totalBalance: totalBalance, totalCashBalance: totalCashBalance, totalPresentBalance: totalPresentBalance })

        
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})