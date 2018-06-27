//mine.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    needLogin: false,
    photoUrl: null,
    mjUserInfo: {},
    totalBalance: 0,
    totalCashBalance: 0,
    totalPresentBalance: 0,
    consumerDetailUrl: api.consumerDetailUrl,
    magicDetailUrl: api.magicDetailUrl,

    myBookUrl: api.myBookUrl,
    myOrderUrl: api.myOrderUrl,
    myExchangeUrl: api.myExchangeUrl,
    myMovieUrl: api.myMovieUrl,
    myAchievementUrl: api.myAchievementUrl,
    myActivityUrl: api.myActivityUrl,
    myTaskUrl: api.myTaskUrl
  },
  
  onLoad: function () {
    this.loadUserInfo();
  },

  onShow: function () {
    this.loadUserInfo();
  },

  loadUserInfo: function () {
    if (app.getUserInfo()) {
      this.setData({ needLogin: false }); 
      var that = this;
      common.request({
        url: api.myInfo,
        data: {},
        method: 'POST',
        success: function (res) {
          var info = res.data;
          var totalBalance = (new Number(info.totalBalance)).toFixed(2);
          var totalCashBalance = (new Number(info.totalCashBalance)).toFixed(2);
          var totalPresentBalance = (new Number(info.totalPresentBalance)).toFixed(2);
          var photoUrl = info.photoUrl ? info.photoUrl : '../../images/userimg.jpg';
          that.setData({ needLogin: false, mjUserInfo: info, photoUrl: photoUrl, totalBalance: totalBalance, totalCashBalance: totalCashBalance, totalPresentBalance: totalPresentBalance })
        },
        fail: function (res) {

        }
      })      
    } else {
      var photoUrl = '../../images/userimg.jpg';
      this.setData({ needLogin: true, photoUrl: photoUrl}); 
    }
  },

  bindMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  getCode: function () {
    common.request({
      url: api.getCode,
      data: { 'mobile': this.data.mobile },
      method: 'POST',
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '验证码发送成功',
          duration: 2000
        })
      },
      fail: function (res) {
      }
    })
  },

  login: function () {
    var that = this;
    common.request({
      url: api.login,
      data: { 'mobile': this.data.mobile, 'password': this.data.password },
      method: 'POST',
      success: function (res) {
        var userInfo = res.data;
        var token = userInfo.token;
        app.globalData.mjUserInfo = userInfo;
        wx.setStorageSync("ldx_userInfo", userInfo)
        wx.setStorageSync("ldx_token", token)
        that.loadUserInfo();
      },
      fail: function (res) {

      }
    })
  }
})
