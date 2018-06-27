// pages/web/web.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url : ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var url = decodeURIComponent(options.url);
      console.log(url);
      if (url.indexOf("?") > 0) {
        url += '&hiddenBar=true';
      } else {
        url += '?hiddenBar=true';
      }
      var token = app.getToken();
      if (token) {
        url = url + '&token=' + token;
      }
      var openId = app.getOpenId();
      if (openId) {
        url = url + '&miniProgramOpenId=' + openId;
      }
      for (var prop in options) {
        if (prop != 'url') {
          url = url + '&' + prop + '=' + options[prop];
        }
      }
      console.log(url);
      this.setData({url: url});
  }
})