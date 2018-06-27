 //discover.js
// pages/discorver/stg.js

const app = getApp()
const api = require('../../utils/mjapi.js')
const common = require('../../utils/common.js')

Page({

  data: {
    organId: 0,
    score: 0,
    stgInfo: {},
    hasMJUserInfo: false,
    reviewList: [],
    nextPage: 1,
    hasNextPage: false,
    services: [],
    currentTab: 0,
    html: ""
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    var organId = app.getStgId();
    if (organId != this.data.organId) {
      this.setData({ organId: organId });
      this.loadData();
    }
  },

  onPullDownRefresh: function () {
    this.loadData();
  },

  onReachBottom: function () {
    if (this.data.hasNextPage) {
      this.loadReviewList();
    }
  },

  loadData: function () {
    var organId = this.data.organId;
    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;
    var that = this;
    common.request({
      url: api.netbarDetail,
      data: { organId: organId, latitude: latitude, longitude: longitude },
      method: 'POST',
      success: function (res) {
        var stgInfo = res.data;

        var services = new Array();
        var serviceCategory = stgInfo.serviceCategory;
        for (var i = 0; i < serviceCategory.length; i++) {
          var item = serviceCategory[i];
          item.tag = i;
          switch (item.code) {
            case 'GOODS':
              item.url = '../web/web?url=' + api.foodUrl + '&stgId=' + organId;
              break;
            case 'RECHARGE':
              item.url = '../charge/charge' + '?organId=' + organId + '&organName=' + stgInfo.organName;
              break;
          }
          services.push(item);
        }
        // var result = stgInfo.description.replace(/<img/g, "<img style='width=100%;overflow: hidden;'");
        // console.log(result);
        var html = stgInfo.description;
        // console.log(html);
        that.setData({
          stgInfo: stgInfo,
          services: services,
          html: html,
          nextPage: 1
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        that.loadReviewList();
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },

  switchStg: function() {
      wx.navigateTo({
        url: './favorite?back=1',
      })
  },

  search: function () {
    wx.navigateTo({
      url: './stglist?back=1',
    })
  },

  serviceClick: function (event) {
    var tag = event.currentTarget.dataset.tag;
    var service = this.data.services[tag];
    if (service.status == 1) {
      wx.navigateTo({
        url: service.url,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '服务暂未开通',
      })
    }
  },

  loadReviewList: function () {
    var organId = this.data.organId;
    var page = this.data.nextPage;
    var that = this;
    common.request({
      url: api.reviewList,
      data: { 'organId': organId, 'pageNum': page },
      method: 'POST',
      success: function (res) {
        var data = res.data;
        if (data && data.list) {
          var reviewList = [];
          if (page == 1) {
            reviewList = data.list;
          } else {
            reviewList = Array.prototype.concat.apply(that.data.reviewList, data.list);
          }
          var hasNextPage = data.hasNextPage;
          var nextPage = data.nextPage;
          that.setData({
            reviewList: reviewList,
            nextPage: nextPage,
            hasNextPage: hasNextPage
          });
        }
      },
      fail: function (res) {

      }
    })
  },

  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.stgInfo.telephone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  openLocation: function () {
    var stgInfo = this.data.stgInfo;
    wx.openLocation({
      latitude: stgInfo.latitude,
      longitude: stgInfo.longitude,
      scale: 30,
      name: stgInfo.name,
      address: stgInfo.address,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  follow: function () {
    if (!app.jumpToLoginIfNeed()) {
      var that = this;
      common.request({
        url: api.followStg,
        data: { 'organId': this.data.organId, 'type': 0 },
        method: 'POST',
        success: function (res) {
          that.loadData();
        },
        fail: function (res) {

        }
      });
    }

  },

  unfollow: function () {

    if (!app.jumpToLoginIfNeed()) {
      var that = this;
      common.request({
        url: api.followStg,
        data: { 'organId': this.data.organId, 'type': 1 },
        method: 'POST',
        success: function (res) {
          that.loadData();
        },
        fail: function (res) {

        }
      });
    }

  },

  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  addReview: function () {
    if (!app.jumpToLoginIfNeed()) {
      wx.navigateTo({
        url: '../index/addReview?organId=' + this.data.organId,
      })
    }
  }

})