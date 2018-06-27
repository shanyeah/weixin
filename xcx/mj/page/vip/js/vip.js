
$(function(){
	var Urlname = GetURLname();
	eval('vipINI.'+Urlname+"()");
	$(document).on("pageInit", function(e, pageId, $page) {
		appIni.barbottom();
		eval('vipINI.'+pageId+"()");
	});
			
});	
var vippash;
var vipINI = {
	//////////////////vip卡列表//////////////////
	vip:function(){
		if (vippash) {return};
		showlist();
		function showlist(argument) {
			$('.carditembox').find('.cardlist').remove();
			ajaxCGI({
				url:"cardcategorylist",
				loadIcon:".carditembox",
				jsonData:{},
				success:function(data){
					vippash = true;
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var rights = '';
						var html = '<div class="cardlist"><div class="cardbox">'+
				                        '<a class="openCard" href="/mj/page/vip/buycard.html?cardCategoryId='+item.id+'">在线<br/>升级</a>'+
				                        '<div class="cardImgBox">'+
				                            '<a><img src="'+ item.imageUrl +'"></a>'+
				                        '</div>'+
				                    '</div>'+
				                    '<div class="cardQY">'+
				                        '<div class="cardQY-title"><span class="fr">'+tofixed(item.activeAmount)+' 元</span>魔杰电竞'+item.name+'</div>'+
				                        '<div class="displaybox cardQY-list">'+rights+'</div>'+
				                    '</div></div>';
				        $('.carditembox').append(html);
					}
				}
			});
		}	
		
	},

	//////////////////购买会员卡//////////////////
	buycard:function(data){
		$('#phone').text(userPhone);
		var totalFee,body;
		appIni.sinUserShow(function(userInfo){
			if (userInfo.classId != 80) {	
				location.href = '/mj/page/vip/lookcard.html';
				return;
			}
			if (userInfo.idNumber == "" || userInfo.idNumber == undefined) {
				$.alert('您的资料不完整，充值后您的账户资金将无法用于在魔杰电竞旗下的电竞馆上机，请先填写资料。',function(){
					location.href = '/mj/page/login/remeans.html?url='+location.href;
				});
				//
			}
			ajaxCGI({
				url:"cardcategorydetail",
				jsonData:{
					cardCategoryId:GetQueryString('cardCategoryId')
				},
				success:function(data){
					$('#imageUrl').attr('src',data.classImageUrl);
					$('#phone').text(userInfo.mobile)
					$('#activeAmount').text(tofixed(data.activeAmount)+'元');		
					totalFee = data.activeAmount;
					body = '购买'+data.name;
				}
			});
		});
		

		$('#wxpay').click(function(event) {
			wxPayCommon({
                url:'wxpayprepayid',
			    datajson:{
			        body:body,
			        detail:body,
			        totalFee:totalFee,    
			        openId:openId
			    },
			    success:function(data){ 			    	
			        $.router.load('/mj/page/vip/lookcard.html')
			    },
			    error:function(data){
			        //console.log(data)
			    },
			    cancel:function(data){
			        
			    }
			})
		});
	},

	//////////////////查看会员卡//////////////////
	lookcard:function(){
        var token = getCookieValue("token");
        if(appIni.login()==null){
        	return;
		}

        getLonLat(function(){
            //生成操作表
            ajaxCGI({
                url:"stglist",
                jsonData:{
                    orderType: 1,
                    pageNum: 1,
                    pageSize: 100,
                    latitude:getCookieValue('latitude'),
                    longitude:getCookieValue('longitude')
                },
                success:function(data){
                    var stgList = data.list;
                    var btnList = [{text: '请选择店',label: true}];
                    for(var i=0; i<stgList.length; i++){
                        var stgData = stgList[i];
                        btnList.push({text:stgData.name, stgId:stgData.id, onClick: function(){
                            linkRechargeUrl(this.stgId);
                        }});
                    }

                    $(document).on('click','#cardChargeLink', function () {
                        var buttons2 = [
                            {
                                text: '取消',
                                bg: 'danger'
                            }
                        ];
                        var groups = [btnList, buttons2];
                        $.actions(groups);
                    });
                }
            });

			ajaxCGI({
				url:"carddetaillist",
				jsonData:{
                    latitude:getCookieValue('latitude'),
                    longitude:getCookieValue('longitude')
				},
				success:function(data){
					var list = data.list;
                    $(".cardImgBox").html('<img src="'+data.imageUrl+'">');

					if(list.length == 0){
						$(".blankTips").html('您还没有会员卡，赶快去开卡吧');
						return;
					}

					$(".blankTips").hide();

					for(var i=0; i<list.length; i++) {
						var data = list[i];
						var template = $("#template").clone();
						$(template).find("[name='id']").text(data.cardId);
						$(template).find("[name='stgName']").text(data.stgName);
						$(template).find("[name='cashBalance']").text(tofixed(data.cashBalance)+" 元");
                        $(template).find("[name='presentBalance']").text(tofixed(data.presentBalance)+" 元");
						$(template).find("[name='magicCoin']").text(tofixed(data.magicCoin)+" 魔元");
						$(template).find("[name='cardCategoryName']").text(data.className);
						$(template).find("[name='cashAccountLink']").attr("href", "/mj/page/my/consumerdetails.html?stgId="+data.stgId);
						$(template).find("[name='presentAccountLink']").attr("href", "/mj/page/my/consumerdetails.html?stgId="+data.stgId);
                        $(template).find("[name='magicAccountLink']").attr("href", "/mj/page/my/magicdetails.html?stgId="+data.stgId);
                        $(template).find("[name='chargeLink']").bind('click',{stgId:data.stgId},function(event){
                            linkRechargeUrl(event.data.stgId);
						});
						$(template).show();
						$(template).appendTo(".buycarlist");
					}
				}
			});
        });

        ajaxCGI({
            url:"my",
            jsonData:{},
            success:function(data){
                idNumber = data.idNumber;
            }
        });
	},

	//////////////////会员卡升级//////////////////
	upgrade:function(){
		var body,totalFee;
		ajaxCGI({
			url:"carddetail",
			jsonData:{},
			success:function(data){		
				console.log(data)	
				if (data.card.nextLevelCategoryId == null) {
					$('.upgradebox ul').hide();
					$('.uptitle').html('<span class="corred">厉害了！目前您的VIP卡为最高等级！</span>')
				}

				$('#idNumber').text(data.member.idNumber);
				$('#cashBalance').text(data.card.cashBalance+" 元");
				$('#presentBalance').text(data.card.presentBalance+" 元");
				$('#cardCategoryName').text(data.card.cardCategoryName);

				$('#nextLevelCategoryName').text(data.card.nextLevelCategoryName);
				$('#nextLevelCategoryActiveCharge').text(data.card.nextLevelCategoryActiveCharge);
				$('#nextLevelCategoryTotalNeedCharge').text(data.card.nextLevelCategoryTotalNeedCharge);
				$('#leftNeedCharge').text(data.card.leftNeedCharge);
				$('#currentPercentage').text(data.card.currentPercentage*100+"%");
				$(".tasklonging").css('width',data.card.currentPercentage*100+"%");

				body = data.card.nextLevelCategoryName+'升级';
				totalFee = data.card.nextLevelCategoryActiveCharge;		
				$('#wxpay').removeClass('forbid')		
			}
		});

		$('#wxpay').click(function(event) {
			if ($(this).hasClass('forbid')) {return}
			wxPayCommon({
			    datajson:{
			        body:body,
			        detail:body,
			        totalFee:totalFee,    
			        openId:openId
			    },
			    success:function(data){ 			    	
			        location.reload() 
			    },
			    error:function(data){
			        console.log(data)
			    },
			    cancel:function(data){
			        
			    }
			})
		});
	},

	//////////////////会员卡充值//////////////////
	recharge:function(){
        var preData;
        var stgId = GetQueryString('stgId');
        if(appIni.login()==null){
            return;
        }

        //获取充值列表
        ajaxCGI({
            url:'presentlist',
            jsonData:{stgId:stgId},
            success:function(data){
                preData = data;
                $('.rechargeList').find('a').remove();
                for (var i = data.length -1; i > -1; i--) {
                    var item = data[i],presentAmount;
                    if (item.presentAmount != 0) {
                        presentAmount = '<br/><span class="corall">赠送'+item.presentAmount/100+'</span>'
                    }else{
                        presentAmount = '';
                    }
                    var html = '<a class="rechargeLi" data-free="'+item.chargeAmount+'">'+item.chargeAmount/100+presentAmount+'</a>';
                    $('.rechargeList').prepend(html);
                }
            }
        });

        //获取卡详情
		ajaxCGI({
			url:"carddetail",
            jsonData:{stgId:stgId},
			success:function(data){
				userInfo = data;
                $("#stgName").text(userInfo.stgName);
                $("#idTypeName").text(userInfo.idTypeName==null?"证件号":userInfo.idTypeName);
				$('#idNumber').text(data.idNumber);
				$('#cashBalance').text(tofixed(data.cashBalance)+" 元");
				$('#presentBalance').text(tofixed(data.presentBalance)+" 元");
                $('#magicCoin').text(tofixed(data.magicCoin)+" 魔元");
				$('#cardCategoryName').text(data.cardCategoryName);				
			}
		});

		var totalFee = null;
		$('.rechargeMun').on('click', '.rechargeLi', function(event) {
			event.preventDefault();
			totalFee = $(this).attr('data-free');
			$('#other_free').val('');
			$('.ohterRecharge .corall').text('');
			$(this).addClass('active').siblings().removeClass('active');
		});

		$('#other_free').keyup(function(event) {
			$(this).val($(this).val().replace(/\D|^0/g,''));
			totalFee = $(this).val()*100;
			$('.rechargeLi').removeClass('active');
			if (totalFee == '') {
				$('.ohterRecharge .corall').html('');
			}

			for (var i = 0; i < preData.length ; i++) {
				if (totalFee < preData[i].chargeAmount) {
					if (!preData[i-1]) {return}
					$('.ohterRecharge .corall').html('送'+tofixed(preData[i-1].presentAmount)+'元');
					return;
				}else{
					$('.ohterRecharge .corall').html('送'+tofixed(preData[preData.length-1].presentAmount)+'元');
				}
			}
		});

		$('#wxpay').click(function(event) {
			if (totalFee == null) {
				$.alert('请选择充值金额')
				return
			}
			wxPayCommon({
				url: 'wxchargeprepayid',
			    datajson:{
			        body:'会员卡充值',
			        detail:'会员卡充值',
			        totalFee:totalFee,    
			        openId:openId,
			        stgId:stgId
			    },
                payType: 'recharge',
			    success:function(data){ 			    	
			        window.location.href = '/mj/page/vip/lookcard.html';
			    },
			    error:function(data){
			        console.log(data)
			    },
			    cancel:function(data){
			        
			    }
			})
		});


	},
	//////////////////会员卡充值-店员推//////////////////
	adminrecharge:function(){
        if(appIni.login()==null){
            return;
        }
		//获取网吧
		var stgId    = GetQueryString('stgId');
		var stgName    = GetQueryString('stgName');
		var totalFee = GetQueryString('amount');
		var adminId  = GetQueryString('adminId');
		ajaxCGI({
			url:'stgdetail',
			jsonData:{stgId:stgId},
			success:function(data){
				$('#stg').html(data.name)
			}
		});
		
		ajaxCGI({
			url:'presentlist',
			jsonData:{stgId:stgId},
			success:function(data){
				$('.totalFee').html(totalFee/100)
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					if (!data[i+1]) {
						$('.presentAmount').html(0)	
					}else{
						if (i==0 && totalFee >= data[i].chargeAmount) {
							$('.presentAmount').html((data[i].presentAmount)/100)
							return;
						}
						if (totalFee < item.chargeAmount && totalFee >= data[i+1].chargeAmount) {				
					 	
					 		$('.presentAmount').html((data[i+1].presentAmount)/100);
					 		break
					 	}
					}
				}
			}
		});
		
		
		//
		ajaxCGI({
			url:"carddetail",
			jsonData:{},
			success:function(data){
				userInfo = data;
				$('#idNumber').text(data.idNumber);
				$('#cashBalance').text(tofixed(data.cashBalance)+" 元");
				$('#presentBalance').text(tofixed(data.presentBalance)+" 元");
				$('#cardCategoryName').text(data.cardCategoryName);				
			}
		});		
		

		$('#wxpay').click(function(event) {
			if (totalFee == null) {
				$.alert('请选择充值金额');
				return
			}
			wxPayCommon({
                url: 'wxchargeprepayid',
			    datajson:{
			        body:'会员卡充值',
			        detail:'会员卡充值',
			        totalFee:totalFee,    
			        openId:openId,
			        stgId:stgId,
			        adminId:adminId
			    },
                payType: 'recharge',
			    success:function(data){
                    window.location.href = '/mj/page/vip/lookcard.html';
			    },
			    error:function(data){
			        console.log(data)
			    },
			    cancel:function(data){
			        
			    }
			})
		});


	}
};
