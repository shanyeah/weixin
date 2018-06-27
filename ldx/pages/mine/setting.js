// pages/mine/setting.js

var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp()

Page({
  data: {
    renameUrl: api.renameUrl,
    resetpassUrl: api.resetpassUrl,
    idNumber: app.getUserInfo().idNumber
  },

  logout: function() {
      wx.showModal({
        title: '提示',
        content: '确定要退出登录吗?',
        success: function(res) {
          if (res.confirm) {
            wx.removeStorageSync("token");
            wx.removeStorageSync("mjUserInfo");
            // wx.removeStorageSync("openId");
            wx.navigateBack({
            });
          }
        }
      })
  }

  
})