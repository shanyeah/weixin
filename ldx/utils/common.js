const api = require('mjapi.js')
const app = getApp()

//调用接口函数
/*option={
    url:'',
    method:'POST/GET',
    params: {},
    data:{},
    success:function(){

    },
    fail:function(){

    }
}*/

exports.request = function(option) {
  var link = api.server + option.url;
  var token = app.getToken();
  if (token) {
    var connector = link.indexOf("?") > 0 ? "&" : "?";
    link = link + connector + 'token=' + token;
  }
  var jsonData;
  if (option.method == 'POST') {
    jsonData = JSON.stringify(option.data);
  } else {
    jsonData = option.data;
  }
  console.log(link);
  console.log(option.data);
  wx.request({
    url: link,
    data: jsonData,
    header: { 'content-type': 'application/json' },
    method: option.method,
    success: function (res) {
      console.log(option.url, res)
      wx.hideToast()
      if (res.data.code == 0) {
        typeof option.success == "function" && option.success(res.data)
      } else if (res.data.code == 90006) {
        wx.showModal({
          title: res.data.message,
          duration: 2000
        })
      } else if (res.data.code == 90001 || res.data.code == 90002 || res.data.code == 90003) {
        wx.showModal({
          title: res.data.message,
          duration: 2000
        })
        typeof option.fail == "function" && option.fail(res.data)
      } else if (res.data.code == 90024) {
          wx.removeStorageSync("ldx_token");
          wx.removeStorageSync("ldx_userInfo");
          wx.navigateTo({
            url: '../login/login',
          });
      } else {
        wx.showModal({
          title: res.data.message,
          duration: 2000
        })
        typeof option.fail == "function" && option.fail(res.data)
      }

    },
    fail: function (res) {
      wx.showModal({
        title: '数据请求失败，请重试' + res.errMsg,
        duration: 2000
      })
      typeof option.fail == "function" && option.fail(res.data)
    }
  })
}