// pages/login/login.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    password: ''
  },

  onLoad: function (options) {
  
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
      data: { mobile: this.data.mobile, type: 1 },
      method: 'POST',
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '验证码发送成功',
          duration: 2000
        })
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  
  login: function () {
    wx.showLoading({
      title: '登录中...',
    });
    common.request({
      url: api.login,
      data: { 'mobile': this.data.mobile, 'password': this.data.password},
      method: 'POST',
      success: function(res) {
        var userInfo = res.data;
        var token = userInfo.token;     
        app.globalData.mjUserInfo = userInfo;
        wx.setStorageSync("ldx_userInfo", userInfo);
        wx.setStorageSync("ldx_token", token);
        wx.navigateBack({

        });
      },
      fail: function(res) {
        
      }
    })
  }
})