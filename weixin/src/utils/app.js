import requestUrl from './requestUrl';
var wx = require('weixin-js-sdk');

export function wx() {
    return wx;
}

export function getUserInfo() {
    var storage = window.localStorage;
    var userInfo = storage.getItem("ldx_userInfo");
    if (userInfo) {
        return JSON.parse(userInfo);
    }
    return null;
}

export function getToken() {
    var storage = window.localStorage;
    return storage.getItem("ldx_token");
}

export function getStgId() {
    var storage = window.localStorage;
    var stgId = storage.getItem("ldx_stgId");
    if (!stgId) {
        stgId = 0;
    }
    return stgId;
}

export function setStgId(stgId) {
    var storage = window.localStorage;
    storage.setItem("ldx_stgId", stgId);
}

export function getLatitude() {
    var latitude = window.localStorage.getItem("latitude");
    if (!latitude) {
        latitude = 0;
    }
    return latitude;
}

export function getLongitude() {
    var longitude = window.localStorage.getItem("longitude");
    if (!longitude) {
        longitude = 0;
    }
    return longitude;
}

export function webDomain() {
    if (window.ldx_dev) {
        return "http://local.mjdj.cn";
    }
    return "http://www.liandaxia.com";
}

export function payUrl() {
    var url =  webDomain() + "/weixin/pay/weixinPay.html";
    return url;
}

export function getGoodsOrderUrl(organId, organName) {
    var uri = webDomain() + "/xcx/mj/page/order/index.html?token=" + getToken() + "&organId=" + organId +  "&organName=" + organName;
    return uri;
}

export function getCinemaUrl(organId, organName) {
    var uri = webDomain() + "/xcx/mj/page/film/index.html?token=" + getToken() + "&organId=" + organId +  "&organName=" + organName;
    return uri;
}

export function getGoodsWeinxinCode(organId, organName) {
    var uri = webDomain() + "/xcx/mj/page/order/index.html?token=" + getToken() + "&organName=" + organName;
    var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + organId;
    codeUrl += ("&uri=" + encodeURIComponent(uri));
    return codeUrl;
}

export function getChargeWexinCode(organId, organName) {
    var uri = webDomain() + '/xcx/#/charge?' + 'organName=' +  encodeURI(organName);
    var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + organId;
    codeUrl += ("&uri=" + encodeURIComponent(uri));
    return codeUrl;
}

export function getMovieWeixinCode(organId, saleBillId) {
    var uri = webDomain() + '/xcx/#/movieBookDetail?' + 'saleBillId=' + saleBillId;
    var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + organId;
    codeUrl += ("&uri=" + encodeURIComponent(uri));
    return codeUrl;
}

export function getMovieOrderListUrl() {
    return webDomain() + '/xcx/mj/page/film/filmOrderList.html?token=' + getToken();
}

export function getLocation(callback) {
    var now = (new Date()).getTime();
    var timestamp = window.localStorage.getItem("position_timestamp");
    var cacheLatitude = window.localStorage.getItem("latitude");
    var cacheLongitude = window.localStorage.getItem("longitude");
    if (cacheLatitude == undefined) {
        cacheLatitude = 0;
    }
    if (cacheLongitude == undefined) {
        cacheLongitude = 0;
    }
    if (cacheLatitude > 0 && cacheLongitude > 0 && now - timestamp < 1200000) {
        callback(cacheLatitude, cacheLongitude);
    }

    requestUrl('http://api.liandaxia.com/jssdk/getWxConfig.do', { method: "POST", body: { url: window.location.href }} , {
        success: function (res) {
            var data = res.data;
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ['chooseWXPay', 'getLocation', 'hideMenuItems', 'scanQRCode', 'openLocation', 'chooseImage',
                    'previewImage']
            });

            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        if (latitude == undefined) {
                            latitude = 0;
                        }
                        if (longitude == undefined) {
                            longitude = 0;
                        }
                        window.localStorage.setItem("latitude", latitude);
                        window.localStorage.setItem("longitude", longitude);
                        window.localStorage.setItem("position_timestamp", (new Date()).getTime());
                        if (callback) {
                            callback(latitude, longitude);
                        }
                    },
                    fail: function (data) {
                        console.log("调用 wx.getLocation 失败：" + data.errMsg);
                    },
                    cancel: function (res) {

                    }
                });
            });
        },
        error: function (error) {

        }
    });

    // var now = (new Date()).getTime();
    // var timestamp = window.localStorage.getItem("position_timestamp");
    // var cacheLatitude = window.localStorage.getItem("latitude");
    // var cacheLongitude = window.localStorage.getItem("longitude");
    // if (cacheLatitude > 0 && cacheLongitude > 0 && now - timestamp < 1200000) {
    //     // console.log("return cache postion");
    //     callback(cacheLatitude, cacheLongitude);
    // } else {
    //     navigator.geolocation.getCurrentPosition(function (position) {
    //         // console.log(position);
    //         var latitude = position.coords.latitude;
    //         var longitude = position.coords.longitude;
    //         window.localStorage.setItem("latitude", latitude);
    //         window.localStorage.setItem("longitude", longitude);
    //         window.localStorage.setItem("position_timestamp", position.timestamp);
    //         if (callback) {
    //             callback(latitude, longitude);
    //         }
    //     });
    // }
    
}

/**添加设置cookie**/
export function addCookie(name, value, days, path) {
    var name = escape(name);
    //var value = value;  
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 3600000 * 24);
    //path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
    path = path == "" ? "" : ";path=" + path;
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}
export function getCookieValue(name) {  /**获取cookie的值，根据cookie的键获取值**/
    var name = escape(name);
    var allcookies = document.cookie;
    name += "=";
    var pos = allcookies.indexOf(name);
    if (pos != -1) {                                             //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                          //cookie值开始的位置  
        var end = allcookies.indexOf(";", start);                //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;                 //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start, end);            //提取cookie的值  
        return (value);                                         //对它解码        
    } else {  //搜索失败，返回空字符串 
        return "";
    }
}
export function deleteCookie(name, path) {   /**根据cookie的键，删除cookie，其实就是设置其失效**/
    var name = escape(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}  
