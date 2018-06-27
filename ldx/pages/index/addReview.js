// pages/index/addReview.js
const app = getApp()
const api = require('../../utils/mjapi.js')
const common = require('../../utils/common.js')
var Zan = require('../../zanui-weapp/dist/index')
Page(Object.assign({}, Zan.Toast, {

  data: {
    organId: 0,
    text: "",
    stars: [1,2,3,4,5],
    serviceScore: 5,
    envScore: 5,
    speedScore: 5,
    configScore: 5
  },

  onLoad: function (options) {
    this.setData({ organId: options.organId });
  },

  bindinput: function(e) {
    this.setData({ text: e.detail.value });
  },

  tapStar: function (e) {
    var tag = e.currentTarget.dataset.tag;
    var rate = e.currentTarget.dataset.rate;
    switch(tag) {
      case '0':
        this.setData({ serviceScore: rate });
        break;
      case '1':
        this.setData({ envScore: rate });
        break;
      case '2':
        this.setData({ speedScore: rate });
        break;
      case '3':
        this.setData({ configScore: rate });
        break;
    }
    
  },

  done: function () {

    if (this.data.text.length == 0) {
      this.showZanToast('请输入评价');
      return;
    }

    var organId = this.data.organId;
    var memberId = app.getUserInfo().userId;
    var content = this.data.text;
    var rating = this.data.rating;

    var params = {
      organId: organId,
      content: content, 
      serviceScore: this.data.serviceScore * 2,
      envScore: this.data.envScore * 2,
      speedScore: this.data.speedScore * 2,
      configScore: this.data.configScore * 2
    }

    var that = this;
    common.request({
      url: api.submitReview,
      data: params,
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '评论成功',
          duration: 2000
        });

        wx.navigateBack({});
        var pages = getCurrentPages();
        if (pages.length > 1) {
          var prePage = pages[pages.length - 2];
          prePage.loadReviewList();
        }
      },
      fail: function (res) {

      }
    })

  }
}))