//card.js
var api = require('../../utils/mjapi.js')
var common = require('../../utils/common.js')
const app = getApp()

Page({
  data: {
    mobile: '',
    password: '',
    needLogin: false,
    imageUrl: '',
    cardList: [],
    stgList: null,
    protocolText: '<<魔杰电竞用户协议>>',
    chargeUrl: api.chargeUrl,
    consumerDetailUrl: api.consumerDetailUrl,
    magicDetailUrl: api.magicDetailUrl
  },
  onLoad: function () {
      this.loadStgList();
  },
  onShow: function() {
      if (app.getToken()) {
        this.setData({needLogin: false});
        this.loadData();
      } else {
        this.setData({needLogin: true});
      }
  },
  loadData: function () {
    var that = this;
    common.request({
      url: api.cardList,
      data: {},
      method: 'POST',
      success: function (res) {
        var imageUrl = res.data.imageUrl;
        var cardList = res.data.list;

        for (var i=0; i<cardList.length; i++) {
           
           var cardInfo = cardList[i];
           var cash = (new Number(cardInfo.cashBalance / 100)).toFixed(2);
           var present = (new Number(cardInfo.presentBalance / 100)).toFixed(2);
           var magicCoin = (new Number(cardInfo.magicCoin / 100)).toFixed(2);
           cardInfo.cash = cash;
           cardInfo.present = present;
           cardInfo.magicCoin = magicCoin;
           console.log(cardInfo);
        }

        that.setData({
          imageUrl: imageUrl,
          cardList: cardList
        });
      },
      fail: function (res) {

      }
    })
  },

  loadStgList: function() {
    var that = this;
    common.request({
      url: api.stgList,
      data: { latitude: app.globalData.latitude, longitude: app.globalData.longitude, cityId: null, orderType:0 },
      method: 'POST',
      success: function (res) {
        var stgList = res.data.list;
        that.setData({
          stgList: stgList
        });
      },
      fail: function (res) {

      }
    })
  },
  
  qrcodepay: function () {
     wx.navigateTo({url:'../web/web?url=' + api.qrcodepayUrl})
  },

  charge: function () {
      this.toggleDialog()
  },

  stgClick: function (e) {
      var stgId = e.currentTarget.dataset.key;
      wx.navigateTo({url:'../web/web?url=' + api.chargeUrl + '&stgId=' + stgId})
      // wx.navigateTo({ url: 'charge?stgId=' + stgId })
      this.toggleDialog();
  },

  toggleDialog: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
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

  vipProtocol: function() {
    wx.navigateTo({ url: '../web/web?url=' + api.vipProtocolUrl })
  },

  login: function () {
    var that = this;
    common.request({
      url: api.login,
      data: { 'mobile': this.data.mobile, 'phoneVerifyCode': this.data.password },
      method: 'POST',
      success: function (res) {
        var userInfo = res.data;
        var token = userInfo.token;
        console.log(userInfo);
        app.globalData.mjUserInfo = userInfo;
        wx.setStorageSync("mjUserInfo", userInfo)
        wx.setStorageSync("token", token)
        that.setData({needLogin:false})
        that.loadData();
      },
      fail: function (res) {

      }
    })
  }
})
