
$(function(){
	var Urlname = GetURLname();
	eval('espINI.'+Urlname+"()");
	$(document).on("pageInit", function(e, pageId, $page) {
		appIni.barbottom();			
		if (Urlname == pageId) {
			return
		}
		eval('espINI.'+pageId+"()");
	});
			
});	


var espINI = {
	////////////////////首页///////////////////////
	index:function(){
		var pageNum = 1;	
		var cityID,orderType=1;
        // 加载flag
        var loading = false;

		function espFunc(){				
			if (cityID == "" || cityID == NaN) {
				cityID = undefined;
			}	
			ajaxCGI({
				url:"stglist",
				jsonData:{
					pageNum:pageNum,
					pageSize:10,
                    latitude:getCookieValue('latitude'),
                    longitude:getCookieValue('longitude'),
					cityId:cityID,
					orderType:orderType
				},
				success:function(data){
                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

					for (var i = 0; i < data.list.length; i++) {
						var item = data.list[i];
						var imgurl = '/mj/common/images/userimg.jpg';
						if (item.seatFlag !=0 ) {
							item.seatFlag = '<span class="bacgre tipsbtn">座</span>';
						}else{item.seatFlag = ''}
						if (item.activeFlag !=0 ) {
							item.activeFlag = '<span class="bacgre tipsbtn">活</span>';
						}else{item.activeFlag = ''}
						if (item.taskFlag !=0 ) {
							item.taskFlag = '<span class="bacgre tipsbtn">任</span>';
						}else{item.taskFlag = ''}
						if (item.changeFlag !=0 ) {
							item.changeFlag = '<span class="bacgre tipsbtn">兑</span>';
						}else{item.changeFlag = ''}
						if (item.movieFlag !=0 ) {
							item.movieFlag = '<span class="bacgre tipsbtn">影</span>';
						}else{item.movieFlag = ''}
						if (item.coverImage != null) {
							imgurl = item.coverImage.imageUrl;
						}

						var html = '<li>'+
				                        '<a href="/mj/page/ESP/espdetails.html?stgId='+item.id+'" class="item-link" external>'+
				                            '<img src="'+imgurl+'">'+
				                            '<div class="gradetopis">'+item.rating+'分 <span class="icon iconfont icon-like"></span></div>'+
				                            '<div class="esplist-item">'+
				                                '<div class="item-title">'+item.name+'<div class="item-p">'+item.distance+'公里</div></div>'+
				                                '<div class="item-after">'+
				                                    item.seatFlag+
				                                    item.activeFlag+
				                                    item.taskFlag+
				                                    item.changeFlag+
				                                    item.movieFlag+
				                                '</div>'+
				                            '</div>'+
				                        '</a>'+
				                    '</li>';
				        $('.esplist').append(html);

                        loading = false;
                        pageNum++;
					}
				}
			})
		}
		//初始化列表
		function iniList() {
			pageNum = 1;
			$('.esplist').find('li').remove();
			espFunc();
		}
		//网吧地区列表
		$stgcitylist = $('#stgcitylist');
		$(document).on('click', '.stgcityBtn', function(event) {
			event.preventDefault();
			$(this).siblings('.button').removeClass('active');
			$('.stgcitylist').hide();

			if ($(this).hasClass('active')) {
				$('#stgcitylist').hide();
				$(this).removeClass('active');
			}else{
				$(this).addClass('active')
				$('#stgcitylist').show();
			}
		});

		if ($stgcitylist.hasClass('active')) {
			return;
		}else{
			ajaxCGI({
				url:'stgcitylist',
				jsonData:{},
				success:function(data){
					$stgcitylist.addClass('active');
					$stgcitylist.find('li').remove();
					for (var i = 0; i < data.length; i++) {
						$stgcitylist.append('<li data-id="'+nullF(data[i].id)+'">'+data[i].name+'</li>')
					}
				}
			})
		}

		$(document).on('click', '#stgcitylist li', function(event) {
			event.preventDefault();

			if ($(this).hasClass('active')) {return};
			$(this).addClass('active').siblings().removeClass('active');
		    cityID = $(this).attr('data-id');
		    $('.stgcityBtn').removeClass('active').text($(this).text());
		    $(this).parent().hide();
 			iniList();
		});
		//网吧类型列表
		$stgtypelist = $('#stgtypelist');
		$(document).on('click', '.stgtypeBtn', function(event) {
			event.preventDefault();
			$(this).siblings('.button').removeClass('active');
			$('.stgcitylist').hide();

			if ($(this).hasClass('active')) {
				$('#stgtypelist').hide();
				$(this).removeClass('active');
			}else{
				$(this).addClass('active')
				$('#stgtypelist').show();
			}
		});

		$(document).on('click', '#stgtypelist li', function(event) {
			event.preventDefault();
			$(this).parent().hide();
			$('.stgtypeBtn').removeClass('active')
		});
		//排序方式
		$('.orderType').click(function(event) {
			if ($(this).hasClass('click')) {
				$(this).removeClass('click');
				$(this).html('按评分排');
				orderType = 0;				
				iniList();

			}else{
				$(this).addClass('click');
				$(this).html('按距离排');
				orderType = 1;				
				iniList();
			}
		});

		//定位
		getLonLat(function(){
            espFunc();
		});
		
		// 注册'infinite'事件处理函数
		$(document).on('infinite', '.infinite-scroll-bottom',function() {
		    // 如果正在加载，则退出
		    if (loading) return;
            loading = true;
	        // 添加新条目
            espFunc();
	        //容器发生改变,如果是js滚动，需要刷新滚动
	        $.refreshScroller();
		    
		});
	},
	////////////////////电竞馆详情///////////////////////
	espdetails:function(){
		var stgId = GetQueryString('stgId');
		var stgLatitude = 0;
		var stgLongitude = 0;

		if(stgId == null){
            getLonLat(function(){
                ajaxCGI({
                    url:"nearbystg",
                    jsonData: {
						latitude:getCookieValue('latitude'),
						longitude:getCookieValue('longitude')
					},
                    success:function(data){
                        stgId = data.id;
                        espFunc();
                    }
                })
            })
		}else {
            espFunc();
        }

		function espFunc(){
			ajaxCGI({
                url: "stgdetail",
				jsonData:{stgId:stgId},
				success:function(data){
					stgId = data.id;
                    stgLatitude = data.latitude;
                    stgLongitude = data.longitude

					if (stgId == "8002") {
						$('#booksteasB').hide();
						$('.custom-tab').hide();
					}else{						
						//$('#booksteasB').show();
						//$('.custom-tab').show();
					}


					$('.name').text(data.name);	
					$('#stgDesc').html(data.stgDesc);
					$('#address').text(nullF(data.address));
					$('#cityName').text(nullF(data.cityName));
					$('#espPhone').attr('href','tel:'+data.tel);
					$('#booksteasB').attr('href','/mj/page/ESP/booksteas.html?stgId='+stgId);
					$('.gotoMovie').attr('href','/mj/page/discover/index.html?stgId='+stgId);
                    //$('.gotoMovie').attr('href','/mj/page/film/index.html?stgId='+stgId);
					$('.gotoOrder').attr('href','/mj/page/order/index.html?stgId='+stgId);
					$('.moreleave').attr('href','/mj/page/ESP/leavePage.html?stgId='+stgId);
                    $('.rearHref').attr('href','/mj/page/discover/conversionList.html?stgId='+stgId);
					if (data.images.length != 0) {
						$('#images-big').html('<img src="'+data.images[0].imageUrl+'" />')
					}

						
					for (var i = 0; i < data.rating/2; i++) {
						$('#rating').append('<i class="icon iconfont icon-shixinxingxing"></i>');
					}
					$('#ratingT').html(data.rating+"分")
					//评论
					reviewFunc();
				}
			})
		}

		function reviewFunc(){
			$('.leaveList').find('li').remove(); 
			ajaxCGI({
				url:'reviewlist',
				jsonData:{
					stgId:stgId,
					pageNum:1
				},
				loadIcon:".leaveList",
				success:function(data){		
					$('.totleSEP').html(data.total)	
					if (data.total < 6) {$('.moreleave').hide()}	
					for (var i = 0; i < data.list.length; i++) {
						var item = data.list[i];
						if (item.photoUrl == null) {
							item.photoUrl = '/mj/common/images/userimg.jpg'
						}

						var replyHtml = '';
						if(item.replies != null){
                            var $reply = $('<div class="reply"></div>');
							for(var j=0; j<item.replies.length; j++){
								var oneReply = item.replies[j];
                                $reply.append('<div><span class="reply-name">'+oneReply.name+'</span>：<span>'+oneReply.reviewText+'</span></div>');
							}
                            replyHtml = $reply[0].outerHTML;
						}

						var html = '<li>'+
	                                    '<div class="user-img"><img src="'+item.photoUrl+'"></div>'+
	                                    '<div class="item-main">'+
	                                        '<div class="item-name">'+
	                                            '<div class="fr">'+item.rating+'分 <i class="icon iconfont icon-like corpin"></i></div>'+
	                                            '<div>'+(item.name?item.name:'魔杰会员')+'</div>'+
	                                        '</div>'+
	                                        '<div class="item-text">'+nullF(item.reviewText)+'</div>'+
	                                        '<div class="tips">'+item.createTime +'</div>'+
                            				replyHtml +
	                                    '</div>'+
	                                '</li>';
	                    $('.leaveList').append(html);            
					}

					$('.leaveList li').find('.user-img img').each(function(index, el) {
						var url = $(this).attr('src');
						$(this).attr('src','');
						imgAuto($(this),url);
					});
				}
			})
		}		

		//显示评论
		$(document).on('click', '.espbtn', function(event) {
			event.preventDefault();			
			//判断是否登陆
            if(appIni.login()==null){
                return;
            }
			maskshow();
			$('.remarkbox').show()
		});
		//评分
		var ratingTatle = 20;
		$(document).on('click', '.star .icon', function(event) {
			event.preventDefault();
			var eq = $(this).index();
			var $parent = $(this).parent().find('.icon');
			$(this).parent().attr('data-name',eq+1);

			ratingTatle = 0;
			$('.star').each(function(index, el) {
				ratingTatle += parseInt($(this).attr('data-name'));
			});

			$(this).parent().siblings('.fr').text(eq+1+".0 分");			


			$parent.removeClass('icon-kongxinxingxing').removeClass('icon-shixinxingxing')
			for (var i = 0; i < 6; i++) {
				if (i <= eq) {
					$parent.eq(i).addClass('icon-shixinxingxing')
				}else{
					$parent.eq(i).addClass('icon-kongxinxingxing')
				}
			}
		});
		//提交评论
		$(document).on('click', '#submitreview', function(event) {
			event.preventDefault();
			var reviewText = $('.levetext').val();

			ajaxCGI({
				url:'submitreview',
				clickIcon:'#submitreview',
				jsonData:{
					stgId:stgId,
					reviewText:reviewText,
					rating:ratingTatle/2
				},
				success:function(data){
					$.alert("评论发布成功");
					reviewFunc();
					$('.remarkbox').hide()
					$('.mask').hide()
				}
			})

		});
		//隐藏评论
		$(document).on('click', '.mask', function(event) {
			event.preventDefault();
			$(this).hide();
			$('.remarkbox').hide()
		});

        $(".content-media, #address").bind('click', function(){
            wx.openLocation({
                latitude: stgLatitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: stgLongitude, // 经度，浮点数，范围为180 ~ -180。
                name: $('#stgName').text(), // 位置名
                address: $('#address').text(), // 地址详情说明
                scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            });
        });
	},
	////////////////////评论页面///////////////////////
	leavePage:function(){
		var pageNum = 1;
        var loading = false;

		$('.leaveList').find('li').remove();

        queryReview();

		function queryReview(){
			ajaxCGI({
				url:'reviewlist',
				jsonData:{
					stgId:GetQueryString('stgId'),
					pageNum:pageNum,
					pageSize:20
				},
				success:function(data){
                    if(data.list.length == 0 && pageNum == 1){
                        // 删除无数据的提示
                        $(".leaveList").html('暂时没有评论');
                    }

                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

                    $('#commentTotal').html(data.total);

					for (var i = 0; i < data.list.length; i++) {
						var item = data.list[i];
						if (item.photoUrl == null) {
							item.photoUrl = '/mj/common/images/userimg.jpg'
						}

                        var replyHtml = '';
                        if(item.replies != null){
                            var $reply = $('<div class="reply"></div>');
                            for(var j=0; j<item.replies.length; j++){
                                var oneReply = item.replies[j];
                                $reply.append('<div><span class="reply-name">'+oneReply.name+'</span>：<span>'+oneReply.reviewText+'</span></div>');
                            }
                            replyHtml = $reply[0].outerHTML;
                        }

						var html = '<li>'+
	                                    '<div class="user-img"><img src="'+item.photoUrl+'"></div>'+
	                                    '<div class="item-main">'+
	                                        '<div class="item-name">'+
	                                            '<div class="fr">'+item.rating+'分 <i class="icon iconfont icon-like corpin"></i></div>'+
	                                            '<div>'+(item.name?item.name:'魔杰会员')+'</div>'+
	                                        '</div>'+
	                                        '<div class="item-text">'+nullF(item.reviewText)+'</div>'+
	                                        '<div class="tips">'+item.createTime+'</div>'+
                            				replyHtml+
	                                    '</div>'+
	                                '</li>';
	                    $('.leaveList').append(html);            
					}

					$('.leaveList li').find('.user-img img').each(function(index, el) {
						var url = $(this).attr('src');
						$(this).attr('src','');
						imgAuto($(this),url);
					});

                    loading = false;
                    pageNum++;
				}
			})
		}

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            loading = true;

            // 添加新条目
            queryReview();

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        });

		//显示评论
		$(document).on('click', '.espbtn', function(event) {
			event.preventDefault();
			//判断是否登陆
            if(appIni.login()==null){
                return;
            }
			maskshow();
			$('.remarkbox').show()
		});
		//评分
		var ratingTatle = 20;
		$(document).on('click', '.star .icon', function(event) {
			event.preventDefault();
			var eq = $(this).index();
			var $parent = $(this).parent().find('.icon');
			$(this).parent().attr('data-name',eq+1);

			ratingTatle = 0;
			$('.star').each(function(index, el) {
				ratingTatle += parseInt($(this).attr('data-name'));
			});

			$(this).parent().siblings('.fr').text(eq+1+".0 分");			


			$parent.removeClass('icon-kongxinxingxing').removeClass('icon-shixinxingxing')
			for (var i = 0; i < 6; i++) {
				if (i <= eq) {
					$parent.eq(i).addClass('icon-shixinxingxing')
				}else{
					$parent.eq(i).addClass('icon-kongxinxingxing')
				}
			}
		});
		//提交评论
		$(document).on('click', '#submitreview', function(event) {
			event.preventDefault();
			var reviewText = $('.levetext').val();

			ajaxCGI({
				url:'submitreview',
				clickIcon:'#submitreview',
				jsonData:{
					stgId:GetQueryString('stgId'),
					reviewText:reviewText,
					rating:ratingTatle/2
				},
				success:function(data){
					$.alert("评论发布成功");
					reviewFunc();
					$('.remarkbox').hide()
					$('.mask').hide()
				}
			})

		});
		//隐藏评论
		$(document).on('click', '.mask', function(event) {
			event.preventDefault();
			$(this).hide();
			$('.remarkbox').hide()
		});

		$.init();
	},
	////////////////////订座///////////////////////
	booksteas:function(){	
		//判断是否登陆
        if(appIni.login()==null){
            return;
        }

		var stgName;	
		var stgId = GetQueryString("stgId");
		ajaxCGI({
			url:'netbarDetail',
			dire:'xcx/',
			jsonData:{
				organId:stgId
			},
			success:function(data){
				stgName = data.organName;				
				$('#rating').text(data.score);	
				$('#address').text(nullF(data.address));
				$('#cityName').text(nullF(data.cityName));
				$('#tel').text(nullF(data.telephone));
				$('#booksteasB').attr('href','xcx/mj/page/ESP/booksteas.html?stgId='+stgId);
				if (data.images.length != 0) {
					$('#images-big').html('<img src="'+data.images[0].imageUrl+'" />')
				}				
			}
		});

		if(stgId == 8003){
            bookIMG('/mj/common/images/zwt-shijiazhuang.jpg');
		}else{
			bookIMG('/mj/common/images/zwt-shenzhen.jpg');
        }

		var bookW = bookH = 0,windowW = $(window).width(),windowH = $(window).height(),size = 1;
		function bookIMG(imgurl){
			var qim = new Image();
    		qim.src = imgurl;
    		qim.onload = function() {
    			bookW = qim.width;
    			bookH = qim.height;
    			size  = windowW/bookW;
    			bookHeight = windowH - $('.bookinfo').outerHeight() - $('.updataBook').outerHeight();
    			$('.bookimg').html('<img src="'+imgurl+'" />');
    			$('.booksteasMain').height(bookHeight);
    			$('.bookbox').css({
    				width: bookW,
    				height: bookH,   				
    			});
    			$('.bookbox').css({
		    		'left': (windowW - bookW)/2,
		    		'top': (bookHeight - bookH)/2,
		    		//'transform':'scale('+size+')'
		    		//'transform':'scale(0.7)'
		    	},300);
		    	//$('.booksteasMain').addClass('zoom');
    		}
		}
		bookSeat();
		function bookSeat(){
			ajaxCGI({
				url:'queryNetbarSeats',
				type:'POST',
				dire:'xcx/',
				jsonData:{organId:stgId},
				success:function(data){
					mjareaList = data.areaList;
					for (var i = 0; i < data.coordinateList.length; i++) {
						var item = data.coordinateList[i];
			    		var icon = '<i class="icon iconfont"></i><span class="number" style="color:#000; transform: rotate('+(-item.rotate)+'deg);" data-areaId="'+item.areaId+'" id="'+item.id+'">'+item.name+'</span>';
						var a = '<a data-grade="'+item.grade+'" data-state="'+item.state+'" style="left:'+item.x+'px;top:'+item.y+'px;transform:rotate('+item.rotate+'deg);">'+icon+'</a>'
						$('.hotbox').append(a)
					}
				},
				errorback:function(){

				}
			});

            // for (var i = 0; i < coordinateList.length; i++) {
            //     var item = coordinateList[i];
            //     var icon = '<i class="icon iconfont"></i><span class="number" style="color:#000; transform: rotate(-'+item.rotate+'deg);" data-areaId="'+item.areaId+'" id="'+item.id+'">'+item.termId+'</span>';
            //     var a = '<a data-grade="'+item.grade+'" data-state="'+item.state+'" style="left:'+item.x+'px;top:'+item.y+'px;transform:rotate('+item.rotate+'deg);">'+icon+'</a>'
            //     $('.hotbox').append(a)
            // }
		}
		
		var scale = 1;
		var el = document.querySelector('.booksteasMain');
	    var startPosition, endPosition, deltaX, deltaY,oldX,oldY, moveLength;
		var ofsetY = $('.booksteasMain').offset().top;
		
		var square = document.querySelector('.bookbox');
		square.style.transform = "scale(" + scale+ ")";
		var manager = new Hammer.Manager(square);
		var pinch = new Hammer.Pinch();
		var pan = new Hammer.Pan();

		pinch.recognizeWith(pan);
		manager.add([pinch, pan]);
		manager.get('pan').set({ direction: Hammer.DIRECTION_ALL });

		manager.on("pinch", e => {
			scale = e.scale;
			if (scale < 0.5) {
				scale = 0.5;
			} 
			if (scale > 5) {
				scale = 5;
			}
			square.style.transform = "scale(" + scale + ")";
		});

		manager.on("pinchend", e => {
			var x = $('.bookbox').offset().left;
			var y = $('.bookbox').offset().top;

			var offsetX = x;
			var offsetY = y;

			var minY = -(bookH - bookH * scale) / 2;
			var minX = -(bookW - bookW * scale) / 2;

			var maxY = (bookHeight - bookH) + (bookH - bookH * scale) / 2;
			var maxX = (windowW - bookW) + (bookW - bookW * scale) / 2;

			if (x > minX) { x = minX }
			if (y > minY) { y = minY }
			if (x < maxX) { x = maxX }
			if (y < maxY) { y = maxY }

			if (offsetX != x || offsetY != y) {
				$('.bookbox').offset({
					left: x,
					top: y
				});
			}
			
		});


		manager.on("panstart", e => {
			var touch = e.srcEvent;
			oldX = $('.bookbox').position().left - (bookW - bookW * scale) / 2;
			oldY = $('.bookbox').position().top - (bookH - bookH * scale) / 2;
	
	        startPosition = {
	            x: touch.pageX - oldX,
	            y: touch.pageY - ofsetY - oldY
	        }
		});

		manager.on("panmove", e => {
			
			var touch = e.srcEvent;
			endPosition = {
				x: touch.pageX,
				y: touch.pageY - ofsetY
			}

			deltaX = endPosition.x - startPosition.x;
			deltaY = endPosition.y - startPosition.y;

			var minY = -(bookH - bookH * scale) / 2;
			var minX = -(bookW - bookW * scale) / 2;

			var maxY = (bookHeight - bookH) + (bookH - bookH * scale) / 2;;
			var maxX = (windowW - bookW) + (bookW - bookW * scale) / 2;
			
			if (deltaX > minX) { deltaX = minX }
			if (deltaY > minY) { deltaY = minY }
			if (deltaY < maxY) { deltaY = maxY }
			if (deltaX < maxX) { deltaX = maxX }
			
			$('.bookbox').css({
				left: deltaX,
				top: deltaY
			});

			
		});

		

	    
	    // //按下
		// square.addEventListener('touchstart', function (e) {
	    //     var touch = e.touches[0];
	    //     oldX = $('.bookbox').position().left;
	    //     oldY = $('.bookbox').position().top;
	    //     startPosition = {
	    //         x: touch.pageX - oldX,
	    //         y: touch.pageY-ofsetY - oldY
	    //     }
	    // });
	    // //移动
		// square.addEventListener('touchmove', function (e) {
	    // 	event.preventDefault();
	    // 	if (isPinch) {
	    // 		return;
	    // 	}

	    //     var touch = e.touches[0];
	    //     endPosition = {
	    //         x: touch.pageX,
	    //         y: touch.pageY-ofsetY
	    //     }

	    //     deltaX = endPosition.x - startPosition.x;
	    //     deltaY = endPosition.y - startPosition.y;
	    //     //moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2));
	    //     //console.log(deltaX,deltaY);
	    //     if (deltaX > 0) {deltaX = 0}
	    //     if (deltaY > 0) {deltaY = 0}	
		// 	if (deltaY < bookHeight - bookH) { deltaY = bookHeight * scale - bookH}	
		// 	if (deltaX < bookW * size - bookW) { deltaX = bookW * size * scale - bookW}	
	    //     $('.bookbox').css({
	    //     	left:deltaX,
	    //     	top: deltaY
	    //     });
	    // });
	    //选中座位
	    var timeRange,orderId,orderName;
	    $('.hotbox').on('click','a',function(event) {	    	
	    	if ($(this).attr('data-state') == 0) return;
	    	if ($(this).hasClass('active')) {
	    		$(this).removeClass("active");
	    		return
	    	}
	    	$(this).addClass('active').siblings().removeClass('active');
	    	areaId = $(this).find('.number').attr('data-areaId');
	    	orderId = $(this).find('.number').attr('id');
			orderName = $(this).find('.number').html();
			console.log(areaId);
	    	for (var i = 0; i < mjareaList.length; i++) {
	    		var id = mjareaList[i].id;
	    		if (id == parseInt(areaId)) {
	    			timeRange = mjareaList[i];
	    		}
	    	}
	    	console.log(areaId,mjareaList,timeRange)
	    	if (timeRange == undefined) {
	    		$.alert("未匹配到座位信息");
	    	}
	    	priceTol();
	    });
	    //双击
	    // el.addEventListener('doubleTap',function(e){
	    // 	if ($(this).hasClass('zoom')) {
	    // 		$(this).removeClass('zoom');
	    // 		$('.bookbox').animate({
		//     		//'left':0,
		//     		//'top':0,
		//     		'transform':'scale(1)'
		//     	},400);
	    // 	}else{
	    // 		$('.bookbox').animate({
		//     		'left': (windowW - bookW)/2,
		//     		'top': (bookHeight - bookH)/2,
		//     		'transform':'scale('+size+')'
		//     	},400);
		//     	$(this).addClass('zoom');
	    // 	}
	    // })
	    //选择时间
	    function newTime(num){
	    	var arrary = [];
	    	for (var i = 0; i < num; i++) {
	    		if (i < 10) { newi = '0'+i}else{newi = i}
	    		arrary[i] = newi;
	    	}
	    	return arrary;
	    }

	    var hour = newTime(24);	    
	    var minute = newTime(60);

	    $("#datetime-picker").picker({
			toolbarTemplate: '<header class="bar bar-nav">\
			<button class="button button-link pull-right close-picker">确定</button>\
			<h1 class="title">选择上机时间</h1>\
			</header>',
			cols: [
			    {
			      textAlign: 'center',
			      values: hour
			    },
			    {
			      textAlign: 'center',
			      values: minute
			    }
			],
			onClose:function(){
				$('#datetime-picker').val($('#datetime-picker').val().replace(" ",":"));
				priceTol();

			}
		});
		//价格计算
		var totlePrice,chooseTime;
		function priceTol(){
			$('#bookOrder').removeClass('grey');
			
			var maxtime = timeRange.bookMaxTime.split(":"),
				mintime = timeRange.bookMinTime.split(":");

			chooseTime = $('#datetime-picker').val().split(":");
			if (chooseTime == "") {
				return;
			}
			//console.log(chooseTime,timeRange)
			if (parseInt(maxtime[0])+1 >= parseInt(chooseTime[0]) && parseInt(chooseTime[0]) >= parseInt(mintime[0])) {
				var date = new Date();
				var hour = date.getHours()
				var minute = date.getMinutes();

				if (parseInt(chooseTime[0]) < hour) {
					$.alert("预订时间不能小于当前时间");
					return
				}
				if (parseInt(chooseTime[0]) == hour && parseInt(chooseTime[1]) < minute) {
					$.alert("预订时间不能小于当前时间");
				}else{

					var allminute = (parseInt(chooseTime[0])*60+parseInt(chooseTime[1]))-(hour*60+minute);
					if (allminute > timeRange.bookLongTime) {
						$.alert('抱歉，只能预订'+timeRange.bookLongTime+'分钟内的上机！');
						return
					}
					var num = Math.ceil(allminute/30);
					totlePrice = num*timeRange.deductionAmount/2;
					$('.totlePrice').html((totlePrice/100).toFixed(2))
				}

			}else{
				$.alert('此时间段不可预订，可预订时间段位为 '+ timeRange.bookMinTime + " - " + timeRange.bookMaxTime );
				$('#datetime-picker').val("");
			}	
			
		}
		//预订
		$('#bookOrder').click(function(event) {	
			var that = $(this);		
			if ($(this).hasClass('grey')) {
				return;
			}

			if (totlePrice == undefined) {
				$.alert('请先选择座位或上机时间');
				return
			}
			var thisDate = FormatDate().split("-");
			var thisD = thisDate[1]+'/'+thisDate[2];
			var html = '<div class="list-block confirmSteas">\
                    <ul>\
                        <li>\
                            <div class="item-content">\
                            	<div class="item-media">门店</div>\
                                <div class="item-inner">\
                                	<div class="item-title"></div>\
                                  	<div class="item-after cor999">'+ stgName +'</div>\
                                </div>\
                            </div>\
                        </li>\
                        <li>\
                            <div class="item-content">\
                            	<div class="item-media">订座</div>\
                                <div class="item-inner">\
                                	<div class="item-title"></div>\
                                  	<div class="item-after cor999">'+ orderName +'座位 '+thisD+ ' '+$('#datetime-picker').val()+'上机</div>\
                                </div>\
                            </div>\
                        </li>\
                        <li>\
                            <div class="item-content">\
                            	<div class="item-media">支付金额</div>\
                                <div class="item-inner">\
                                    <div class="item-title"></div>\
                                    <div class="item-after corred">'+ tofixed(totlePrice) +'</div>\
                                </div>\
                            </div>\
                        </li>\
                    </ul>\
                </div>';
			$.confirm(html,'订座确认',function(){
				ajaxCGI({
					url:'userNetbarBookOrder',
					type:'POST',
					dire:'wx/',
					jsonData:{
						stgId:stgId,
						bookTimeStr:FormatDate()+' '+$('#datetime-picker').val()+':00',
						bookAmount:totlePrice,
						mjTerminalId:orderId
					},
					success:function(data){
						location.href = '/mj/page/my/mybook.html';
					},
					error:function(data){

					}
				})
			},function(){
				that.removeClass('grey');
			})

			$(this).addClass('grey');
			
		});
		//订座确认
		function espaffirm(){
			//var html = ''
		}
	}
};

