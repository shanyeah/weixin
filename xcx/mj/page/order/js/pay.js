//2016-05-06 by:miker
//点餐系统
function nullFun(number) {
	if (number == null || number == "null" || number == 'undefined' || number == "") {
		return 0;
	}else{
		return parseInt(number);
	}
}
//保存foodArray
var foodArray = new Array();
function seveFoodArray() {
	foodStr = JSON.stringify(foodArray); 
	localStorage.foodStr = foodStr;
}
//删除foodArray
function deleteFoodArray(){
	localStorage.removeItem('foodStr');
}

var orderItem;
$(function(){
	appIni.login();
	var payType = 2,
	saleBillId = GetQueryString('saleBillId');
	var jsonData = { saleBillId: saleBillId};
	ajaxCGI({
		url:'confirmGoodsBill',
		dire:'xcx/',
		type:'GET',
		jsonData:jsonData,
		success:function(data){
			orderItem = data;
			var itemMain = data;
			
			var goodsList = itemMain.goodsList;
			var totalprices = itemMain.payAmount;
			var discountHtml = '折扣减免：￥<span>'+tofixed(itemMain.price-totalprices)+'('+itemMain.discount/10+'折)</span>';
			$('.setspan').text(itemMain.seatName);
			$('.stgNameSpan').text(itemMain.organName);
			$('#price').html(itemMain.payAmount.toFixed(2));
			if (itemMain.discount != 100 ) {
				$('#discount').html(discountHtml);
			}
			$('#idNumber').html(itemMain.orderNo);
			// $('#cashBalance').html(tofixed(itemMain.cashBalance));

			for (var i = 0; i < goodsList.length; i++) {
				var item = goodsList[i];
				var goodsName = (item.goodsTags && item.goodsTags.length > 0) ? (item.name + '(' + item.goodsTags + ')') : item.name;
				var html = '<div class="goods_container">' + 
						   '<div class="goods_name">' + goodsName + '</div>' +
						   '<div class="goods_count">' + 'x' + item.quantity + '</div>' +
						   '<div class="goods_price">' + item.payAmount.toFixed(2) + '</div>' + 
						   '</div>';

				if (item.goodsPackList && item.goodsPackList.length > 0) {
					for (var j = 0; j < item.goodsPackList.length; j++) {
						var child = item.goodsPackList[j];
						var childName = (child.goodsTags && child.goodsName.length > 0) ? child.name + '(' + child.goodsName + ')' : child.name;
						html += '<div class="goods_container child">' +
							'<div class="goods_child_name">' + childName + '</div>' +
							'<div class="goods_count">' + 'x' + child.quantity + '</div>' +
							'</div>';
					}
				}
				html += '<div class="goods_line"></div>';

	            $('.DDdetaiUL').append(html);
			}
			
			if (itemMain.status > 0) {
				$('.paybox').html('<div class="payTotle"><p class="stotlePrace">支付成功</p><a href="javascript:history.go(-1);" class="btn">返回</a></div>')
				//$('.Vdata').hide();
				$('.totlePrace').html(itemMain.incomeAmount.toFixed(2));
				return
			}


			if (totalprices != 0) {
				$('.totlePrace').html(itemMain.incomeAmount.toFixed(2));
				$('.HYpay,.WXpay').removeClass('active');
			}
		}
	});
	//钱包支付
	function walletPay (jsonData){
		var miniProgramOpenId = GetQueryString('miniProgramOpenId');
		var wxOpenId = getCookieValue('openId');
		var seatNo = $("#importSeat").val();
		var remark = $("#remarkText").val();
		var jsonData = {
			saleBillId: GetQueryString('saleBillId'),
			openId: miniProgramOpenId ? miniProgramOpenId : wxOpenId,
			payType: 2,
			payCategoryId: 0,
			incomeAmount: orderItem.incomeAmount,
			seatNo: seatNo,
			remark: remark
		};
		ajaxCGI({
			url: 'paySelfGoodsOrder',
			type: "POST",
			dire: 'xcx/',
			jsonData: jsonData,
			success: function (data) {
				localStorage.removeItem('foodStr');
				// location.href = '/xcx/mj/page/my/myorder.html?hiddenBar=' + hiddenBar;
				var callbackUrl = window.location.origin + '/xcx/#/myorderlist';
				window.location.replace(callbackUrl);
			},
			error: function (data) {
				$('#payChooseBtn').removeClass('grey').html("支付失败，点击重试")
			}
		})
	}
	//微信支付
	function wxpayPre() {
		var miniProgramOpenId = GetQueryString('miniProgramOpenId');
		var wxOpenId = getCookieValue('openId');
		var code = getCookieValue('code');
		var seatNo= $("#importSeat").val();
		var remark = $("#remarkText").val();
		var jsonData = {
			saleBillId: GetQueryString('saleBillId'),
			openId: miniProgramOpenId ? miniProgramOpenId : wxOpenId,
			payType: 1,
			payCategoryId: 3,
			incomeAmount: orderItem.payAmount,
			remark: remark,
			seatNo: seatNo,
			code: code
		};
		
		ajaxCGI({
			url: 'paySelfGoodsOrder',
			type: "POST",
			dire: 'xcx/',
			jsonData: jsonData,
			success: function (data) {
				console.log(data);
				// localStorage.removeItem('foodStr');
				var tn = data.tn;
				// location.href = '/xcx/mj/page/my/myorder.html?hiddenBar=' + hiddenBar;
				if (window.__wxjs_environment === 'miniprogram') {
					var url = '../pay/pay?type=order' + '&timestamp=' + tn.timeStamp
					+ '&nonceStr=' + tn.nonceStr
					+ '&prepay_id=' + tn.packageStr.substring(tn.packageStr.indexOf("=") + 1)
					+ '&signType=' + tn.signType
					+ '&paySign=' + tn.paySign;
					wx.miniProgram.navigateTo({ url: url });
				} else {
					var url = window.location.origin + '/weixin/pay/weixinPay.html' + '?type=recharge' + '&timestamp=' + tn.timeStamp
                    + '&nonceStr=' + tn.nonceStr
                    + '&prepay_id=' + tn.packageStr.substring(tn.packageStr.indexOf("=") + 1)
                    + '&signType=' + tn.signType
                    + '&paySign=' + tn.paySign
					+ '&appId=' + tn.wxAppId;
					var callbackUrl = window.location.origin + '/xcx/#/myorderlist';
               	 	window.localStorage.setItem('wx_pay_callback_url', callbackUrl);
					window.location.replace(url);
				}
				
			},
			error: function (data) {
				$('#payChooseBtn').removeClass('grey').html("支付失败，点击重试")
			}
		})

        // wxPayCommon({
		// 	url:'wxpayprepayid',
		//     datajson:{
		//         goodsOrderId:goodsOrderId,     
		//         openId:openId
		//     },
        //     payType: 'order',
		//     clickIcon:'#payChooseBtn',
		//     success:function(data){ 	
		//     	localStorage.removeItem('foodStr');	        
		//         location.href = '/mj/page/my/myorder.html?hiddenBar='+hiddenBar
		//     },
		//     error:function(data){
		//     	$.alert('error',data)
		//         $('#payChooseBtn').removeClass('grey').html("确认支付")
		//     },
		//     cancel:function(){
		//         $('#payChooseBtn').removeClass('grey').html("确认支付")
		//     }
		// })
	}	
	//选择支付方式
	$(".payList").click(function(event) {
		$(this).addClass('active').siblings().removeClass('active');
		payType = $(this).attr('data-payType');
		payTool = $(this).attr('data-payTool');

		$('.vipshow').toggle();
	});

	$("#payChooseBtn").click(function(event) {		
		if ($(this).hasClass('grey')) {return;}
		$(this).addClass('grey').html("正在支付");				
		if (payType == 2) {//会员卡支付
			walletPay();
		}else if (payType == 1) {//微信支付
			wxpayPre();
		}
	});
});

