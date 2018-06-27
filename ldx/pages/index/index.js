//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/mjapi.js')
const common = require('../../utils/common.js')
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    hasMJUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    stgList: [],
    nextPage: 1,
    hasNextPage: false,
    swiperIndex: 0,
    adList: [],
    bookUrl: api.bookUrl,
    foodUrl: api.foodUrl,
    shopUrl: api.shopUrl,
    movieUrl: api.movieUrl
  },

  onLoad: function () {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.loadAd();
    this.loadData();
  },

  onShow: function() {
    if(app.getToken()) {
      this.setData({ hasMJUserInfo: true });
    } else {
      this.setData({ hasMJUserInfo: false });
    }
  },

  onPullDownRefresh: function () {
    this.setData({ nextPage: 1});
    this.loadAd();
    this.loadData();
  },

  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.loadData();
    }
  },

  swiperChange: function (event) {
    var index = event.detail.current;
    this.data.swiperIndex = index;
  },

  swipClick: function (event) {
    var index = this.data.swiperIndex;
    var ad = this.data.adList[index];
    if (ad.objectType == 1) {
      var url = '../web/web?url=' + encodeURIComponent(ad.objectValue);
        wx.navigateTo({
          url: url,
        })
    }
   
  },

  loadAd: function() {
    
    var that = this;
    common.request({
      url: api.queryAppAdList,
      data: { type: 0 },
      method: 'GET',
      success: function (res) {
        var adList = res.data;
        that.setData({
          adList: adList
        });
        
      },
      fail: function (res) {
     
      }
    });
  },

  loadData: function() {
    wx.showNavigationBarLoading();
    var that = this;
    common.request({
      url: api.queryNearbyNetbar,
      data: { pageNum: this.data.nextPage, latitude: app.globalData.latitude, longitude: app.globalData.longitude},
      method: 'POST',
      success: function (res) {
        var stgList = res.data.list;
        that.setData({
          stgList: stgList,
          hasNextPage: res.data.hasNextPage,
          nextPage: res.data.nextPage
        });


        if (stgList.length > 0 && !app.getStgId()) {
           var stg = stgList[0];
           app.setStgId(stg.organId);
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

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  onShareAppMessage: function () {
    return {
      title: '链大侠',
      path: '/pages/index/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})
