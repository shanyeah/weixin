//app.js

App({
  globalData: {
    userInfo: null,
    mjUserInfo: null,
    token: null,
    latitude: 0,
    longitude: 0
  },
  onLaunch: function () {
    // 获取定位

    var cacheLatitude = wx.getStorageInfoSync("latitude");
    var cacheLongitude = wx.getStorageInfoSync("longitude");

    if (cacheLatitude > 0 && cacheLongitude > 0) {
      this.globalData.latitude = cacheLatitude;
      this.globalData.longitude = cacheLongitude;
    }

    var that = this;
    wx.getLocation({
      success: function (res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.globalData.latitude = latitude;
        that.globalData.longitude = longitude;
        wx.setStorageSync("latitude", latitude);
        wx.setStorageSync("longitude", longitude);
      }
    })
    
    var mjUserInfo = wx.getStorageSync("ldx_userInfo");

    if (mjUserInfo) {
      this.globalData.mjUserInfo = mjUserInfo;
      this.globalData.token = mjUserInfo.token;
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var cacheOpenId = wx.getStorageSync("openId");
        // wx.setClipboardData({
        //   data: cacheOpenId
        // })
        // console.log(cacheOpenId);
        if (!cacheOpenId || cacheOpenId.length == 0) {

          wx.request({
            url: "https://api.mjdj.cn/jssdk/getOpenId.do",
            data: JSON.stringify({ "code": res.code, "type": 3 }),
            method: "POST",
            header: { 'content-type': 'application/json' },
            success: function (resp) {
              if (resp.data.code == 0) {
                var openId = resp.data.data.openId;
                if (openId) {
                  wx.setStorageSync("ldx_openId", openId);
                  // console.log(openId);
                  // wx.setClipboardData({
                  //   data: openId
                  // })
                }
              }
            },
            fail: function (error) {
              console.log(error);
            }
          })
        }
        
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 获取缓存的魔杰用户信息
  getUserInfo : function () {
    var userInfo = wx.getStorageSync("ldx_userInfo");
    return userInfo;
  },

  getToken: function() {
    var token = wx.getStorageSync("ldx_token");
    return token;
  },

  getOpenId: function () {
    var openId = wx.getStorageSync("ldx_openId");
    return openId;
  },

  getStgId: function () {
    var stgId = wx.getStorageSync("ldx_stgId");
    return stgId;
  },

  setStgId: function (stgId) {
    wx.setStorageSync("ldx_stgId", stgId);
  },

  jumpToLoginIfNeed: function() {
    console.log(this.getUserInfo());
    if (this.getUserInfo().length == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return true;
    }
    return false;
  }
  
})