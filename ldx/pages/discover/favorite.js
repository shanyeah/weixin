// pages/discorver/favorite.js
const app = getApp()
const api = require('../../utils/mjapi.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceCode: '',
    nextPage: 1,
    hasNextPage: false,
    showFollowButton: false,
    back: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var serviceCode = options.serviceCode;
      if (serviceCode) {
         this.setData({ serviceCode: serviceCode });
      }
      
      var serviceName = '关注'
      if (options.serviceName) {
        serviceName = options.serviceName;;
      }

      if (options.back) {
        this.setData({back: options.back});
      }

      var title = '选择' + serviceName + '门店';
      wx.setNavigationBarTitle({
        title: title,
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.setData({ nextPage: 1 })
     this.loadData();
  },

  loadData: function () {
    wx.showNavigationBarLoading();
    var pageNum = this.data.nextPage;
    var serviceCode = this.data.serviceCode;
    var that = this;
    var params = { pageNum: pageNum, latitude: app.globalData.latitude, longitude: app.globalData.longitude };
    if (this.data.serviceCode) {
      params.serviceCode = serviceCode;
    }
    common.request({
      url: api.queryFollowNetbarList,
      data: params,
      method: 'POST',
      success: function (res) {
        var list = res.data.list;
        var stgList = [];
        if (pageNum == 1) {
          stgList = list;
        } else {
          stgList = Array.prototype.concat.apply(that.data.stgList, list);
        }
        that.setData({
          stgList: stgList,
          hasNextPage: res.data.hasNextPage,
          nextPage: res.data.nextPage,
          showFollowButton: stgList.length == 0 ? true : false
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  },


  stgClick: function(event) {
    var organId = event.currentTarget.dataset.id;
    var organName = event.currentTarget.dataset.name;
    if (this.data.back == 1) {
        app.setStgId(organId);
        wx.navigateBack({
          
        });
    } else {
      switch (this.data.serviceCode) {
        case 'GOODS': {
          var url = '../web/web?url=' + api.foodUrl + '&stgId=' + organId;
          wx.navigateTo({
            url: url,
          });
        }
          break;
        case 'RECHARGE': {
          var url = '../charge/charge' + '?organId=' + organId + '&organName=' + organName;
          wx.navigateTo({
            url: url,
          });
        }
          break;
      }
    }
    
  },

  followButtonClick: function () {
      wx.navigateTo({
        url: './stglist',
      })
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