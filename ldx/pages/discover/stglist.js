// pages/discover/stglist.js
const app = getApp()
const api = require('../../utils/mjapi.js')
const common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stgList: [],
    nextPage: 1,
    hasNextPage: false,
    searchValue: '',
    back: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.back) {
        this.setData({ back: options.back});
      }
      this.loadData();
  },

  handleInput: function(event) {
    var searchValue = event.detail.value;
    this.setData({ searchValue: searchValue});
  },

  search: function() {
    this.loadData();
  },


  stgClick: function(event) {
      var stgId = event.currentTarget.dataset.id;
      if (this.data.back == 1) {
        
        app.setStgId(stgId);
        wx.navigateBack({
          
        })
      } else {
        wx.navigateTo({
          url: './stg?organId=' + stgId,
        })
      }
  },

  loadData: function () {
    wx.showNavigationBarLoading();
    var that = this;

    var params = { pageNum: this.data.nextPage, latitude: app.globalData.latitude, longitude: app.globalData.longitude };
    if (this.data.searchValue.length > 0) {
      params.name = this.data.searchValue;
    }
    common.request({
      url: api.queryNearbyNetbar,
      data: params,
      method: 'POST',
      success: function (res) {
        var stgList = res.data.list;
        that.setData({
          stgList: stgList,
          hasNextPage: res.data.hasNextPage,
          nextPage: res.data.nextPage
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