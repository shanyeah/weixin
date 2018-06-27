//04-28 by miker-tom
//Build No 20161121
var idNumber;

//判断服务器地址
var server = window.location.origin+'/';
if(server.startsWith('http://127.0.0.1') || server.startsWith('http://192.168.0.105') || server.startsWith('http://local.mjdj.cn')){
    server = 'http://local.api.liandaxia.com/';
} else {
    server = 'http://api.liandaxia.com/';
}


var openId = GetQueryString('openId');
var code = GetQueryString('code');
var cookieCode = getCookieValue('code');
var hiddenBar = GetQueryString('hiddenBar');

// if(cookieCode != ''){
//     getOpenId(cookieCode);
// } else if (openId == undefined || openId == "" || openId == " ") {
//     if (code) {
//         getOpenId(code);
//     }
// }

var token = GetQueryString('token');
if(token == undefined || token == "") {
    token = localStorage.getItem('ldx_token');
} 

if (token) {
	addCookie('token', token, 360, '/');
}


if(code != undefined && code != ''){
    addCookie('code', code, 360, '/');
}

if(openId != undefined && openId != ''){
    addCookie('openId',openId,360,'/');
}

var miniProgramOpenId = GetQueryString('miniProgramOpenId');
if(miniProgramOpenId != undefined && miniProgramOpenId != ''){
    addCookie('miniProgramOpenId',miniProgramOpenId,360,'/');
}

//获取openId
function getOpenId(code) {
    ajaxCGI({
        url:'http://api.mjdj.cn/jssdk/getOpenId.do',
        jsonData:{code:code},
        success:function(data){
            deleteCookie("code","/");
            addCookie('openId',data.openId,360,'/');
            openId = data.openId;
        },
        error:function(data){
            data.message = "获取openId失败：" + data.message;
        }
    })
}

function getCodeUrl(url){
    var codeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaf9879a2f4c106ce&redirect_uri=http://api.mjdj.cn/wx/redirect.do?uri="
        + window.location.origin + url + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
    return codeUrl;
}

//跳转到带openId参数的地址
function redirectOpenIdUrl(url, organId){
    var url = window.location.origin + url;
    var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + organId;
    codeUrl += ("&uri=" + encodeURIComponent(url));
    return codeUrl;
}

function linkRechargeUrl(stgId){
    window.location.href = "xcx/mj/page/vip/recharge.html?stgId="+stgId;
}

var url = window.location.href;

if (isInclude('jweixin-1.0.0.js') == true || isInclude('jweixin-1.2.0.js') == true || isInclude('jweixin-1.3.0.js') == true) {
    ajaxCGI({//获取wx_config
        url:'https://api.mjdj.cn/jssdk/getWxConfig.do',
        jsonData:{url:url},
        success:function(data){
            //微信调用初始化
            wx.config({
                debug:false,
                appId:data.appId,
                timestamp:data.timestamp,
                nonceStr:data.nonceStr,
                signature:data.signature,
                jsApiList:['chooseWXPay','getLocation','hideMenuItems','scanQRCode','openLocation']
            });
        }
    });
}

function getWeiXinLocation(callback){

    if(!isWeiXinBrowser()){
        //addCookie('latitude',22.374054,1,'/');
        //addCookie('longitude',114.095451,1,'/');
        $('.dingweimask').remove();
        if(callback != null){
            callback();
        }
        return;
    }

    wx.ready(function () {
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                $('.dingweimask').remove();
                addCookie('latitude',res.latitude,1,'/');// 纬度，浮点数，范围为90 ~ -90
                addCookie('longitude',res.longitude,1,'/'); // 经度，浮点数，范围为180 ~ -180。

                if(callback != null){
                    callback();
                }
            },
            fail: function(data){
                console.log("调用 wx.getLocation 失败：" + data.errMsg);

                //非微信浏览器打开，则设置默认值
                //addCookie('latitude',22.374054,1,'/');// 纬度，浮点数，范围为90 ~ -90
                //addCookie('longitude',114.095451,1,'/'); // 经度，浮点数，范围为180 ~ -180。

                $('.dingweimask').remove();
                if(callback != null){
                    callback();
                }
            },
            cancel: function (res) {
                $('.dingweimask').remove();
                //addCookie('latitude',0,1,'/');// 纬度，浮点数，范围为90 ~ -90
                //addCookie('longitude',0,1,'/'); // 经度，浮点数，范围为180 ~ -180。

                $.alert('用户拒绝授权获取地理位置');

                if(callback != null){
                    callback();
                }
            }
        });
    });

    wx.error(function(res){
    });
}

//微信获取经纬度
function getLonLat(callback) {
    //获取地理位置
    var latitude = getCookieValue('latitude');
    var longitude= getCookieValue('longitude');

    //第一次打开页面，cookie还未保存经纬度，则需要一个遮罩层显示“定位中...”
    if(latitude == '' || longitude == ''){
        $('.page').append('<div class="flexbox fixed dingweimask">\
                                <div class="fixedmain">\
                                    <div class="fixedicon">\
                                        <i class="icon iconfont icon-home"></i>\
                                    </div>定位中···\
                                </div>\
                            </div>');

        getWeiXinLocation(callback);
    }else{
        getWeiXinLocation();
        callback();
    }
}

function isWeiXinBrowser(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

////////////////////
var appIni = {
    initialize:function(){
    },
    //js和客户端通讯
    j2c:function(meth){
        
        var MJClient = getCookieValue('MJClient');
        /*if (MJClient) {
            $.alert(MJClient)
        }*/
        if (MJClient == 'ios') {
            window.webkit.messageHandlers.MJMethod.postMessage(meth);
        }else if (MJClient == 'android') {
            JSInterface.J2C(meth)
        }else{
            return false;
        }
    },
    //底部导航
    barbottom:function(){
        /*var bartab = GetQueryString('bartab');
        if (bartab == 'false') {
            $('.bar-tab').hide();
            $('.content').css('bottom', '0');
            return;
        }*/
        //////android和ios头部bar隐藏
        var barlength = $('body').find('.viptop-tab').length;
        if (barlength != 0) {
            appIni.j2c('J2C_HideNavBar');
        }else{
            appIni.j2c('J2C_ShowNavBar');
        }  
        //////android和ios底部bar隐藏      
        if (appIni.j2c() != false) {
            $('.bar-tab').remove();
            return
        }
        
        $('.bar-tab').find('a').remove();
        var phone = getCookieValue('userPhone');
        var phoneP = '?phone='+phone;
        if (phone == "") {
            phoneP = '';
        }

        //判断是否隐藏底部菜单
        var hiddenBar = GetQueryString('hiddenBar');
        if(hiddenBar){
            $(".bar-tab").hide();
            $(".bar-tab ~ .content").css("bottom", 0);
            return;
        }

        var barhtml = '<a class="tab-item external home" href="/mj/page/ESP/espdetails.html?tabname=home">\
                        <span class="icon iconfont  icon-home"></span>\
                        <span class="tab-label">首页</span>\
                    </a>\
                    <a class="tab-item external ESP" href="/mj/page/ESP/index.html">\
                        <span class="icon iconfont icon-djg"></span>\
                        <span class="tab-label">发现</span>\
                    </a>\
                    <a class="tab-item external vip" href="/mj/page/vip/lookcard.html">\
                        <span class="icon iconfont  icon-vipcard"></span>\
                        <span class="tab-label">会员卡</span>\
                    </a>\
                    <a class="tab-item external my" href="/mj/page/my/index.html">\
                        <span class="icon iconfont  icon-people"></span>\
                        <span class="tab-label">我</span>\
                    </a>';
        $('.bar-tab').append(barhtml);
        var tabname = GetQueryString('tabname');
        if (tabname == undefined) {
            var url = window.location.pathname;
            var urlsp = url.split("/");
            tabname = urlsp[urlsp.length-2];
        }
        $('.bar-tab').find('a').removeClass('active');
        $('.bar-tab').find('.'+tabname).addClass('active');
    },

    //保存storage
    saveuserInfo:function(data){
        var userinfo = {
            name:data.member.name,
            photoUrl:data.member.photoUrl,
            cardCategoryName:data.card.cardCategoryName,
            cardNo:data.card.cardNo,
            cashBalance:data.card.cashBalance,
            point:data.card.point,
            balance:data.card.balance,
            presentBalance:data.card.presentBalance,
            idNumber:data.member.idNumber,
            status:data.card.status
        }
        userinfoStr = JSON.stringify(userinfo);
        localStorage.userinfo = userinfoStr;
    },

    //小头像组
    sinUserShow:function(back){              
        appIni.login();
        // ajaxCGI({
        //     url:"my",
        //     jsonData:{},
        //     success:function(data){
        //         var item = $('.sin-consumer');
        //         var itemlength = item.length;
        //         if (item.attr('data-auto') == 'false' && itemlength != 0) {return back(data)}                   
        //         var html = '<div class="user-img"><img src=""></div>'+
        //                     '<div class="user-sin">'+
        //                         '<div class="user-name">'+data.name+'</div>'+
        //                         '<div class="user-vip"><span class="icon iconfont icon-jinpaihuiyuan">'+data.cardCategoryName+'会员</span></div>'+
        //                     '</div>';
        //         item.prepend(html);
        //         item.attr('data-auto',"false")  
        //         imgAuto(item.find('.user-img img'),data.photoUrl);          
        //         if (typeof back === "function") {back(data);}  
                
        //     }
        // });
        
    },

    //登陆判断
    login:function(backFun){

        if (token == undefined || token == "") {
            if (appIni.j2c('J2C_Login') != false) {
                return;
            }

            //客户端登陆
            $('body').html("");
            var weiXinUrl = getCodeUrl("/xcx/mj/page/login/loginsin.html");
            localStorage.setItem('backUrl', url);
            location.replace(weiXinUrl);
            //var href = window.location.origin+"/mj/page/login/loginsin.html";
            //location.href = href;
        }else{
            if (typeof backFun === "function") {backFun();}
            return token;
        }
    }
};

appIni.barbottom();
$.init();
////
$('.rearHref').each(function(index, el) {
    var href = server+'guess/api/redirect.do?token='+token+'&uri='+$(this).attr('data-href');
    $(this).attr('href',href)
});

/////////////////////////////////全屏无内容
function noDetailsFunc(opther) {
    if (!opther.text) {opther.text = '暂无内容！'};
    if (!opther.obj) {opther.obj = '.page'};
    if (!opther.icon) {opther.icon = 'icon-home'};    
    var html = '<div class="flexbox fixed">'+
                    '<div class="fixedmain">'+
                        '<div class="fixedicon">'+
                            '<i class="icon iconfont '+opther.icon+'"></i>'+
                        '</div>'+opther.text+
                    '</div>'+
                '</div>';
    $(opther.obj).append(html);   
    if (opther.func) {opther.func()} 
}
/////////////////////////////////下拉刷新
$(document).on('refresh', '.pull-to-refresh-content',function(e) {
    location.reload()    
    $.pullToRefreshDone('.pull-to-refresh-content');
    
});
function ajaxCGI(ajaxOpther) {
    //判断是否需要页面加载
    if (ajaxOpther.loadIcon) {//加载中
        var preloader = $(ajaxOpther.loadIcon).find('.preloader');
        if (preloader.length == 0) {
            $(ajaxOpther.loadIcon).append('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
        }
    }
    //判断是否需要按钮加载
    if (ajaxOpther.clickIcon) {//点击加载中
        var preloader = $(ajaxOpther.clickIcon).find('.preloader');
        if (preloader.length == 0) {
            $(ajaxOpther.clickIcon).addClass('clickIcon');
            $(ajaxOpther.clickIcon).append('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
            //return;
        }else{
            return;
        }
    }
    //判断是否有type
    if (ajaxOpther.type == undefined) ajaxOpther.type = 'POST';
    if (ajaxOpther.type == 'POST') ajaxOpther.jsonData = JSON.stringify(ajaxOpther.jsonData);
    //url
    var token = getCookieValue('token');
    if (token) {
        token = '?token='+getCookieValue('token');
    }else if (GetQueryString('token')){
        token = '?token='+GetQueryString('token');
    }else{
        token = '';
    }
    
    var organId = GetQueryString('stgId');
    if(!organId) {
        organId = GetQueryString('organId');
    }
    if (organId) {
        organId = '&organId=' + organId;
    } else {
        organId = '';
    }
    //判断是否有url参数
    if (ajaxOpther.urljson == undefined)ajaxOpther.urljson = '';
    
    //判断是否有指定目录
    if (!ajaxOpther.dire)ajaxOpther.dire = 'api/';

    var urlParam = ajaxOpther.urljson;
    if(token == ''){
        if(urlParam != undefined && urlParam != ''){
            if(urlParam.indexOf('?') == 0 || urlParam.indexOf('&') == 0){
                urlParam = urlParam.substring(1);
            }
            urlParam = '?' + urlParam;
        }
    }else{
        if(urlParam != undefined && urlParam != ''){
            if(urlParam.indexOf('?') == 0 || urlParam.indexOf('&') == 0){
                urlParam = urlParam.substring(1);
            }
            urlParam = '&' + urlParam;
        }
    }

    var newurl = server + ajaxOpther.dire+ajaxOpther.url+".do"+ token + organId + urlParam;
    var urlsplit = ajaxOpther.url.split('.');
    if (urlsplit.length !== 1) {
        newurl = ajaxOpther.url;
    }
    $.ajax({
        url: newurl,
        type: ajaxOpther.type,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        datatype:"json",
        data: ajaxOpther.jsonData,
        success: function (data) {
            console.log(newurl, data);
            if(ajaxOpther.handleSelf==true){
                ajaxOpther.success(data);
                return;
            }

            if (data.code == 0) {
                ajaxOpther.success(data.data);
            }else if (data.code == 90018) {
                $.hidePreloader();
                $.alert('您的资料不完整，充值后您的账户资金将无法用于在魔杰电竞旗下的电竞馆上机，请先填写资料。',function(){
                    location.href = '/xcx/mj/page/login/remeans.html?url='+location.href;
                });
                if (ajaxOpther.error) {ajaxOpther.error(data)}
            }else if (data.code == 90020) {
                ajaxOpther.success(data);
            }else{
                if (ajaxOpther.error) {ajaxOpther.error(data)}
                $.hidePreloader();
                $.alert(data.message);
            }
        },
        error: function(XMLHttpRequest,textStatus, errorThrown) {
            //$.alert("连接失败，请重试！"+XMLHttpRequest.status,newurl);
            if (ajaxOpther.error) {ajaxOpther.error()}
        },
        complete:function(XMLHttpRequest, textStatus){
            $(ajaxOpther.clickIcon).find('.infinite-scroll-preloader').remove();
            $(ajaxOpther.loadIcon).find('.infinite-scroll-preloader').remove();
            if(ajaxOpther.complete != null){
                ajaxOpther.complete(XMLHttpRequest, textStatus);
            }
        }
    });
}

function ajax(option) {
    //判断是否需要页面加载
    if (option.loadIcon) {//加载中
        var preloader = $(option.loadIcon).find('.preloader');
        if (preloader.length == 0) {
            $(option.loadIcon).append('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
        }
    }
    //判断是否需要按钮加载
    if (option.clickIcon) {//点击加载中
        var preloader = $(option.clickIcon).find('.preloader');
        if (preloader.length == 0) {
            $(option.clickIcon).addClass('clickIcon');
            $(option.clickIcon).append('<div class="infinite-scroll-preloader"><div class="preloader"></div></div>');
            //return;
        }else{
            return;
        }
    }

    //请求地址
    if(option.url.indexOf('/') == 0) option.url = option.url.substring(1);
    var newUrl = server + option.url;
    if (token) {
        newUrl += '?token=' + token;
    }

    var organId = GetQueryString('stgId');
    if(!organId) {
        organId = GetQueryString('organId');
    }
    if (organId) {
        if(newUrl.indexOf('?') > 0){
            newUrl += '&organId=' + organId;
        }else{
            newUrl += '?organId=' + organId;
        }
    }

    //判断是否有url参数
    var urlParam = option.urlParam;
    if(urlParam){
        if(newUrl.indexOf('?') > 0){
            newUrl += '&' + urlParam;
        }else{
            newUrl += '?' + urlParam;
        }
    }

    //判断是否有type
    if (option.type == undefined) option.type = 'GET';

    var headers;
    if(option.type == 'POST' || option.type == 'post'){
        headers = {'Content-Type': 'application/json'};
    }

    $.ajax({
        url: newUrl,
        type: option.type,
        headers: headers,
        dataType: 'json',
        data: JSON.stringify(option.data),
        success: function (data) {
            console.log(newUrl, data);

            if(option.handleSelf==true){
                option.success(data);
                return;
            }

            if (data.code == 0) {
                option.success(data.data);
            }else{
                $.hidePreloader();
                if (option.error) {option.error(data)}
                $.alert(data.message==''?'访问接口出错':data.message);
            }
        },
        error: function(XMLHttpRequest,textStatus, errorThrown) {
            $.alert("连接失败，请重试！"+XMLHttpRequest.status, newUrl);
            if (option.error) {option.error()}
        },
        complete:function(XMLHttpRequest, textStatus){
            $(option.clickIcon).find('.infinite-scroll-preloader').remove();
            $(option.loadIcon).find('.infinite-scroll-preloader').remove();
            if(option.complete != null){
                option.complete(XMLHttpRequest, textStatus);
            }
        }
    });
}

//价格
function tofixed(number){
    return (number/100).toFixed(2);
}
//头像自动居中
function imgAuto(obj,url){
    obj.parent().append('<div class="fileLoaderIng"></div>');
    if (url == null) {url = server + 'mj/common/images/userimg.jpg'}
    var qim = new Image();
    qim.src = url;
    qim.onload = function() {
        obj.parent().find(".fileLoaderIng").remove();
        obj.attr("src",url).css("width","100%");
        var width = obj.width();
        var height= obj.height();

        if (width > height) {
            Nwidth = width/height*width;
            var margin = -(Nwidth-width)/2;
            obj.css({"width":Nwidth,"margin-left":margin,"margin-top":0})
        }else if(width < height) {
            var margin = -(height-width)/2; 
            obj.css({"margin-top":margin,"margin-left":0})
        }else {
            obj.removeAttr('style');
        }
    };
}
//mask
function maskshow(){
    var mask = $(document).find('.mask');
    if (mask==0) {
        $("body").append('<div class="mask"></div>')
    }
    $('.mask').show();
}
function maskhide(){    
    $(document).find('.mask').remove();
}
//获取url参数 
function GetQueryString(name,url){
    if (!url) {
        url = window.location.search;
    }
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
    var r = url.substr(1).match(reg); 
    //if (r!=null) return unescape(r[2]); return null;
    if (r!=null) return decodeURI(r[2]); return null;
}
//获取url文件名
function GetURLname(name) 
{ 
    var reg = window.location.pathname.split('/');
    var newreg = reg[reg.length-1].split('.');
    var name = newreg[0];
    return name;
}
//判断是否引入某个文件
function isInclude(name){
    var js= /js$/i.test(name);
    var es=document.getElementsByTagName(js?'script':'link');
    for(var i=0;i<es.length;i++) 
    if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
    return false;
}
//
function nullF(obj){
    if (obj == null || obj == undefined) {return ""}else{return obj}
}
var userPhone = getCookieValue("userPhone"),
    cardId    = getCookieValue("cardId"),
    memberId  = getCookieValue("memberId");
var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;//手机号格式  

//MD5
var hexcase=0;function hex_md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72"}function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}function rstr2hex(c){try{hexcase}catch(g){hexcase=0}var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";var b="";var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}return b}function str2rstr_utf8(c){var b="";var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}return b}function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}return a}function binl2rstr(b){var a="";for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}return a}function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}return Array(o,n,m,l)}function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}function bit_rol(a,b){return(a<<b)|(a>>>(32-b))};
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('0 1="2";',3,3,'var|k|yIvBYQjlotXX0iQOc0rHgof9WsD0TQob'.split('|'),0,{}))

//n位随机数
function nonce_str(n) {
    var charactors="ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz";
    var value='',i;
    for(j=1;j<=n;j++){
        i = parseInt(35*Math.random()); 　
        value = value + charactors.charAt(i);
    }
    return value;
}

/**添加设置cookie**/ 
function addCookie(name,value,days,path){   
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
function getCookieValue(name){  /**获取cookie的值，根据cookie的键获取值**/  
    var name = escape(name);  
    var allcookies = document.cookie;         
    name += "=";  
    var pos = allcookies.indexOf(name);      
    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败  
        var start = pos + name.length;                          //cookie值开始的位置  
        var end = allcookies.indexOf(";",start);                //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
        if (end == -1) end = allcookies.length;                 //如果end值为-1说明cookie列表里只有一个cookie  
        var value = allcookies.substring(start,end);            //提取cookie的值  
        return (value);                                         //对它解码        
    }else{  //搜索失败，返回空字符串 
        return "";  
    }  
}  
function deleteCookie(name,path){   /**根据cookie的键，删除cookie，其实就是设置其失效**/  
    var name = escape(name);  
    var expires = new Date(0);  
    path = path == "" ? "" : ";path=" + path;  
    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
}    
 
//补零
function zeroize(string) {
    if (string < 10) return "0"+string;else return string;
}
//时间转化
function FormatDate(strTime) {
    if (strTime == null) {strTime = new Date()}
    var date = new Date(strTime);   
    return date.getFullYear()+"-"+zeroize(date.getMonth()+1)+"-"+zeroize(date.getDate());
}
function FormatDate2(strTime) {
    var date = new Date(strTime);   
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+date.getHours()+":"+zeroize(date.getMinutes());
}

//某天的几天后多少天后日期
function GetDateStr(number,startTime) {  
    if (startTime) {
        var dd = new Date(startTime);
    }else{
        var dd = new Date();
    } 
     
    dd.setDate(dd.getDate()+number);//获取number天后的日期  
    var y = dd.getFullYear();   
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0  
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0  
    return y+"-"+m+"-"+d;   
} 
//计算天数差的函数，通用  
function GetDateDiff(startDate,endDate){  
    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);     
    return  dates;    
}
//日历
function calendarPlugin(pass) {
    if (pass == undefined ) {pass = 0};
    var today  = new Date(),
        todayY = today.getFullYear(), //当日年份
        todayM = today.getMonth(),    //单日月份-比实际月份少1
        todayD = today.getDate(),     //当日日数
        todayW = today.getDay(),      //当日星期
        contrrastToday = new Date(todayY,todayM,todayD+pass),
        checkDay = "1970-01-01";
    function calendar(Y,M,D,dome) {
        var day = new Date(Y,M,D),
            allDay = $(".allDay"),
            starW  = day.getDay(),  
            dayY = day.getFullYear(),   //指定月年份
            dayM = day.getMonth()+1,    //指定月月份             
            dayCount = new Date(Y,M+1,0).getDate(),  //指定月天数
            startDay = 0-starW,
            showDay  = dayCount+starW,
            dayStr = dayY + "年" + dayM + "月";
                //已选择的年月日

        if (dome != undefined) {    
            allDay = dome.siblings('.allDay');
            allDay.attr('data-month',dayM).attr({
                'data-month': dayM,
                'data-year': dayY
            });
            dome.siblings('.CMCtime').find(".CMCtimeT").html(dayStr);
            if (dayM <= todayM+1 && todayY == dayY) {
                dome.parent().find('.lastM').hide();
            }else{
                dome.parent().find('.lastM').show();
            }           
        }else{
            $(".CMCtimeT").html(dayStr);
            allDay.attr('data-month',dayM).attr({
                'data-month': dayM,
                'data-year': dayY
            });
            allDay.find('a').remove();
        }   
        for (var i = startDay; i < 42+startDay; i++) {//日期遍历
            var html,
                newday  = new Date(Y,M,i+1),
                newY    = newday.getFullYear(),
                newdayD = newday.getDate(),
                xdayM   = newday.getMonth()+1,
                dayMer = newY + "-" + zeroize(xdayM) + "-" + zeroize(newdayD);//日期格式
            if (contrrastToday > newday || i<0) {
                html = '<a class="last">'+ newdayD +'</a>';
            }else if(dayMer == checkDay){
                
                html = '<a class="active" data-calendar="'+ dayMer +'" data-month="'+ zeroize(xdayM) +'">'+ newdayD +'</a>';
            }else {
                html = '<a data-calendar="'+ dayMer +'" data-month="'+ zeroize(xdayM) +'">'+ newdayD +'</a>';
            }
            
            allDay.append(html);
        }
    }

    calendar(todayY,todayM,1)

    var newdayM = todayM,newdayY;
    $(".nextM").click(function(event) {
        var thisDome = $(this); 
        thisDome.siblings('.allDay').find('a').remove();
        /*newdayM += 1;*/
        newdayM = parseInt(thisDome.siblings('.allDay').attr("data-month"));
        newdayY = thisDome.siblings('.allDay').attr("data-year");
        checkDayTime = thisDome.siblings('.allDay').attr("data-checkDay");
        if (checkDayTime != undefined || checkDayTime !=null) {
            checkDay = checkDayTime;
        }
        calendar(newdayY,newdayM,1,thisDome)
    });
    $(".lastM").click(function(event) {
        var thisDome = $(this);
        thisDome.siblings('.allDay').find('a').remove();        
        /*newdayM -= 1;*/
        newdayM = parseInt(thisDome.siblings('.allDay').attr("data-month"))-2;
        newdayY = thisDome.siblings('.allDay').attr("data-year");
        calendar(newdayY,newdayM,1,thisDome)
    }); 
}
//退出登陆
function loginOut() {
    deleteCookie("token","/");
    deleteCookie("userPhone","/");
    location.href = "xcx/mj/page/ESP/espdetails.html";
}
//退出登陆
$(".logout").click(function(event) {
    loginOut();
});
//loading
function loadingFunc() {
    var loadingHtml = '<div class="loader-inner ball-clip-rotate-pulse"><div></div><div></div></div>';
    $('body').append(loadingHtml);
}
function removeLoading(){
    $('body').find('.loader-inner').remove();
}
////////////////////////////////////////////////////微信支付
function wxPayCommon(upData) {//支付函数
    if(window.__wxjs_environment === 'miniprogram'){
        //小程序支付
        wxMiniProgramPay(upData);
    }else{
        //公众号支付
        wxPublicPay(upData);
    }
}

/**
 * 微信小程序支付（跳转到小程序原生页面）
 * @param upData
 */
function wxMiniProgramPay(upData){
    miniProgramOpenId = getCookieValue('miniProgramOpenId');
    if(miniProgramOpenId == null){
        $.alert("缺少支付参数openId");
        return;
    }

    loadingFunc();

    upData.datajson.type = 1;
    upData.datajson.ip = "10.7.7.237";
    upData.datajson.openId = miniProgramOpenId;

    ajaxCGI({//获取下单ID
        dire:(upData.dire==null?'pay/public/':upData.dire),
        url:upData.url,
        jsonData:upData.datajson,
        success:function(data){
            var url = '../pay/pay?type='+upData.payType+'&timestamp='+data.timestamp
                +'&nonceStr='+data.nonceStr
                +'&prepay_id='+data.packageStr.substring(data.packageStr.indexOf("=")+1)
                +'&signType='+data.signType
                +'&paySign='+data.paySign
                +'&totalFee='+amount;
            wx.miniProgram.navigateTo({url: url});
        },
        complete:function(XMLHttpRequest, textStatus){
            removeLoading();
        }
    });
}

/**
 * 微信公众号WEB页面调起微信支付
 */
function wxPublicPay(upData) {//支付函数
    debugger;
    console.log('正在调用微信支付公共方法');
    loadingFunc();
    $.getScript('http://pv.sohu.com/cityjson?ie=utf-8',function() {//获取IP地址
        upData.datajson.ip = returnCitySN.cip;
        //$.alert(upData.datajson.ip+" "+upData.datajson.openId+ ' '+upData.datajson.goodsOrderId)
        ajaxCGI({//获取下单ID
            dire:(upData.dire==null?'pay/public/':upData.dire),
            url:upData.url,
            jsonData:upData.datajson,
            success:function(data){
                wx.chooseWXPay({
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    package: data.packageStr,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function (res) {
                        upData.success();
                        removeLoading();
                    },
                    cancel: function () {
                        removeLoading();
                        upData.cancel();
                    },
                    error: function (e) {
                        removeLoading();
                        upData.error();
                        $.alert('支付失败：'+JSON.stringify(e));
                    }
                });
            },
            error:function(data){
                removeLoading();
            }
        });
    });
}