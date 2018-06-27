var saleBillId = GetQueryString('saleBillId');
var openId = GetQueryString('openId');
var mobile;
var payType = 2;

//localStorage.setItem('ldx_token', '1004822983-8bd5b77026354d94a8b1124ba8dd6797');

$(function(){
    //判断是否登陆
    if(token == null || token == ''){
        $.alert('会员还未登录');
        return;
    }

    $.showPreloader();
    querySaleBillDetail();

	//选择支付方式
	$('.pay-type-list li').click(function(event){
        $(this).addClass('active').siblings().removeClass('active');
        payType = $(this).attr('data-payType');

        $('.vip-price-div').toggle();
	});

	//确认支付
    $("#payChooseBtn").click(function(event) {
        $.showPreloader();
        $(this).addClass('grey').html("正在支付");
        if (payType == 2) {//会员卡支付
            walletPay()
        }else if (payType == 1) {//微信支付
            wxPay()
        }else{

        }
    });

    //取消订单
    $('.cancel-btn').click(function(event){
        $.confirm('是否确定取消', function(){
            $.showPreloader();
            ajax({
                url:'/xcx/cancelFilmSaleBill.do',
                type: 'POST',
                data:{
                    saleBillId:saleBillId
                },
                success:function(data){
                    location.reload();
                    $.alert('订单取消成功');
                }
            });
        });
	});
});


function querySaleBillDetail(){
    ajax({
        url:'/xcx/queryFilmSaleBillDetail.do',
        type:'POST',
        data:{saleBillId:saleBillId},
        success:function(data){

            $('.filmName').html(data.filmName);
            $('.organName').html(data.organName);
            $('.showDateTime').html(data.showDateTime);
            $('.hallSeats').html(data.hallSeats);
            $('.showStatus').html(data.showStatus);
            $('.createTime').html(data.createTime);
            $('.orderNo').html(data.orderNo);
            $('.mobile').html(data.mobile);
            $('.incomeAmount').html(data.incomeAmount.toFixed(2));
            $('.payInfo').html(data.payInfo);
            mobile = data.mobile;

            if(data.printCode != null){
                $('.printCode').html(data.printCode);
                $('.print-code-li').show();

                $(document).on('click','.qrCode-modal', function () {
                    $.modal({
                        text: '<div class="qrCode"></div>',
                        extraClass: 'modal-class',
                        buttons: [
                            {
                                text: '关闭',
                                bold: true
                            }
                        ]
                    });

                    var winWidth = $(window).width();
                    var modalWidth = 300;
                    $('.modal-class').css('width', modalWidth);

                    $('.qrCode canvas').remove();
                    $(".qrCode").qrcode({
                        render: "canvas", //table方式
                        width: modalWidth-40, //宽度
                        height:modalWidth-40, //高度
                        text: data.printCode //任意内容
                    });

                    //设置居中
                    var modalWidth = $('.modal-class').width();
                    var marginLeft = parseFloat(modalWidth)/2;
                    $('.modal-class').css('margin-left', -marginLeft);
                });
            }

            //判断显示支付选择的支付按钮
            //状态：0待支付，1已支付，2已取消，3已退款
            if(data.status == 0){
                $('.cancel-btn').show();
                $('.lockExpiredTime').html(data.lockExpiredTime);
                $('.lockExpiredTime_div').css('display', '');
            }
            if(data.status > 0){
                if(data.status == 1){
                    $('.payInfo-div').css('display', '');
                }

                var successHtml =
                    '<div class="back-btn">'+
                    '		<a href="javascript:history.go(-1);" class="btn">返回</a>'+
                    '</div>';
                $('.pay-type-list').replaceWith(successHtml);
            }
            $('.pay-type-list').show();

            $.hidePreloader();
        }
    });
}

//钱包支付
function walletPay (){
    var reqParams = {
        saleBillId: saleBillId,
        payType: 2,
        mobile: mobile,
        openId: openId
    };

    ajax({
        url:'/xcx/payFilmSaleBill.do',
        type:"POST",
        data:reqParams,
        success:function(data){
            console.log(data);
            location.href = '/xcx/mj/page/film/filmOrderList.html';
        },
        error:function(data){
            $('#payChooseBtn').removeClass('grey').html("支付失败，点击重试");
        }
    });
}

//微信支付
function wxPay() {
    var miniProgramOpenId = GetQueryString('miniProgramOpenId');

    var reqParams = {
        saleBillId: saleBillId,
        payType: 1,
        mobile: mobile,
        openId: miniProgramOpenId ? miniProgramOpenId : openId
    };

    ajax({
        url: '/xcx/payFilmSaleBill.do',
        type: "POST",
        data: reqParams,
        success: function (data) {
            var tn = data.tn;
            if (window.__wxjs_environment === 'miniprogram') {
                var url = '../pay/pay?type=filmOrder' + '&timestamp=' + tn.timeStamp
                    + '&nonceStr=' + tn.nonceStr
                    + '&prepay_id=' + tn.packageStr.substring(tn.packageStr.indexOf("=") + 1)
                    + '&signType=' + tn.signType
                    + '&paySign=' + tn.paySign;
                wx.miniProgram.navigateTo({ url: url });
            } else {
                var url = window.location.origin + '/weixin/pay/weixinPay.html' + '?type=filmOrder' + '&timestamp=' + tn.timeStamp
                    + '&nonceStr=' + tn.nonceStr
                    + '&prepay_id=' + tn.packageStr.substring(tn.packageStr.indexOf("=") + 1)
                    + '&signType=' + tn.signType
                    + '&paySign=' + tn.paySign
                    + '&appId=' + tn.wxAppId;
                var callbackUrl = window.location.origin + '/xcx/mj/page/film/filmOrderList.html';
                window.localStorage.setItem('wx_pay_callback_url', callbackUrl);
                window.location.href = url;
            }

        },
        error: function (data) {
            $('#payChooseBtn').removeClass('grey').html("支付失败，点击重试")
        }
    });
}

function nullFun(number) {
    if (number == null || number == "null" || number == 'undefined' || number == "") {
        return 0;
    }else{
        return parseInt(number);
    }
}