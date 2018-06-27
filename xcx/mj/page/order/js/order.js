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

//获取stgid
var stgId = GetQueryString('stgId');

if (!stgId) {
	stgId = GetQueryString('organId');
}

var organName = GetQueryString('organName');

if (organName) {
	document.title = organName;
}

var Tvipprice = 0;//总支付价格

$(function(){

	if (stgId) {
		categoryListFun();
	}else{
        $.popup('.stg-list-page');
        $("title").html('请选择门店');
        showStgList();
	}

	function showStgList(){
        getLonLat(function(){
            ajaxCGI({
                url:"stglist",
                jsonData:{
                    pageNum:1,
                    pageSize:10,
					orderType:1,
                    latitude:getCookieValue('latitude'),
                    longitude:getCookieValue('longitude')
                },
                success:function(data){
                    loading = false;
                    if (data.list.length < 10) {
                        loading = true;
                    }
                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];
                        var imgurl = '/xcx/mj/common/images/userimg.jpg';
                        if (item.coverImage != null) {
                            imgurl = item.coverImage.imageUrl;
                        }

                        var html = '<li>'+
                            '<a href="#" onclick="selectStg(' + item.id + ')" class="item-link" external>'+
                            '<img src="'+imgurl+'">'+
                            '<div class="gradetopis">'+item.rating+'分 <span class="icon iconfont icon-like"></span></div>'+
                            '<div class="esplist-item">'+
                            '<div class="item-title">'+item.name+'<div class="item-p">'+item.distance+'公里</div></div>'+
                            '<div class="item-after">'+
                            '</div>'+
                            '</div>'+
                            '</a>'+
                            '</li>';
                        $('.esplist').append(html);
                    }
                }
            });
        });
	}

	//获取URL上的foodId
	var goodsId = getGoodsId();
	function getGoodsId(){
		var l = window.location.search.split('goodsId=')[1];
		if (!l) {			
			return null;
		}
		var s = l.split('&')[0];
		return decodeURI(s)
	}
	if (goodsId) {
		if (goodsId == "") {return}
		localStorage.clear();
		ajaxCGI({
			url:"queryOneGoods",
			dire:'wx/',
			type:'GET',
			jsonData:{goodsId:goodsId},
			success:function(data){							
				var	foodmess    = {name:data.name,retailprice:data.price,vipprice:data.price,number:1,foodId:data.id,type:data.type,goodsTagName:'可换口味',goodsTagId:goodsTagId};	
				
				if (data.type == 14) {//套餐明细
					jsonFoodId = {
						goodsId:goodsId
					};
					ajaxCGI({
						url:"queryGoodsBom",
						jsonData:jsonFoodId,
						success:function(data){
							$valuation.slideToggle(300);
							foodmess['details'] = [];
							foodmess.details[0] = data;
							storageFun(foodmess);	
						}
					});
				}else{
					storageFun(foodmess);
					$valuation.slideToggle(300);
				}
					
			}
		});
	}
});

/**
 * 选择门店
 * @param stgId
 */
function selectStg(stgId){
    cleanLocalStorage(stgId);
    $.closeModal('.stg-list-page');
    location.replace("/xcx/mj/page/order/index.html?stgId=" + stgId);
}

//清理本地缓存，切换了店面，则把点餐清单的缓存清空
function cleanLocalStorage(stgId){
    var footStgId = localStorage.foodStgId;
    if(footStgId == ""){
        localStorage.removeItem('foodStr');
    }else{
        if(footStgId != stgId){
            localStorage.removeItem('foodStr');
        }
    }
    localStorage.foodStgId = stgId;
}

//商品种类列表
var $categoryMain = $(".categoryMain"),
	$categoryList = $(".categoryList"),
	$CLbox        = $(".CLbox"),
	$myfoodbtn    = $(".myfoodbtn"),
	$valuation    = $(".valuation"),
	$MFmain       = $(".MFmain"),
	$foodBox      = $(".foodBox"),
	$mun          = $(".mun"),
	$orderListBox = $('.orderListBox'),
	$tasteView = $('.TasteView'),
	$packageView = $('.PackageView')  ;

if(appIni.login()!=null){
	appIni.sinUserShow(function(data){
		userInfo = data;
	});
	//显示列表
	$('.search .list').click(function(event) {
		$('.MainCenter').toggleClass('showlist')
	});
}

function categoryListFun() {
	ajaxCGI({
		url:'queryAllGoods',
		type: 'GET',
		jsonData:{},
		dire:'xcx/',
		success:function(data){
			if (data.categories != null){
				for (let i = 0; i < data.categories.length; i++) {
					const category = data.categories[i];
					var goodsList = category.goodsList;
					for (let j = 0; j < goodsList.length; j++) {
						var item = goodsList[j];
						item.categoryId = category.categoryId;
						item.categoryName = category.categoryName;
						item.changeFlag = 0;
						item.remark = "";
					}
				}

				// 保存商品列表
				storageGoodsList(data.categories);
				for (var i = 0; i < data.categories.length; i++) {
					var item = data.categories[i];
					
					var html = '<div class="categoryList" data-id="' + item.categoryId +'">'+
						'<div class="CLtype WhiteSpace"><span>' + item.categoryName+'</span></div>'+
							'</div>';
					$categoryMain.append(html);
					var list = '';
					var itemlength = item.goodsList.length;
					for (var s = 0; s < itemlength; s++) {
						var items = item.goodsList[s];
						if (items.goodsTagCategories) {
							goodsTagArray[items.goodsId] = items.goodsTagCategories;
						}

						if (items.imageUrl == null) {items.imageUrl = "/xcx/mj/common/images/goods.jpg"}
						if (items.remark == null ) {items.remark = ""}
						var htmls = '<div class="catalogue">'+
										'<div class="cataimg"><img src="'+items.imageUrl+'"></div>'+
							
										'<a class="btn orderbtn icon iconfont icon-add-cart" data-goodsId="' + items.goodsId+'"></a>'+
							
										'<div class="catacen" data-id="' + items.goodsId +'" data-type="'+items.type+'">'+
											'<h2 class="catatitle WhiteSpace">'+items.name+'</h2><h2 class="hidden">'+items.code+'</h2>'+
											'<div class="cataPirse"><span class="vipprice" data="'+items.price+'">价格：'+((items.price).toFixed(2))+'</span></div>'+
										'</div>';
								
						if (items.type == 14 && items.packType == 1) {
							htmls += '<div class="packageSelectBtn" data-goodsId="' + items.goodsId + '">可选套餐</div>';
						} else {
							if (items.existTags == 1) {
								htmls += '<div class="tasteSelectBtn" data-goodsId="' + items.goodsId + '">可选口味</div>';
							}
						}
									
						htmls += '</div>';
						list += htmls;
					}
					$('.orderListBox').append('<div class="CLbox"><div class="stitle tc" data-title="' + item.categoryId + '">' + item.categoryName+'</div>'+list+'</div>')
				}
			}

			myOrderList();
		}
	})
}




//切换到
var movetop = false;
$categoryMain.on('click', '.categoryList', function(event) {
	event.preventDefault();
	if ($(this).hasClass('active')) {return}
	$(this).addClass('active').siblings().removeClass('active');

	movetop = true;
	var boxtop  = $('.orderListBox').scrollTop();
	var id      = $(this).attr('data-id');
	var dome    = $('.orderListBox').find('[data-title="'+id+'"]');
	var listtop = dome.position().top;
	$('.orderListBox').stop().animate({scrollTop:listtop+boxtop},300,function(){
		setTimeout(function(){
			movetop = false
		},100)
	})

});


$('.orderListBox').scroll(function(){
	if (movetop == true) {return}
	var $CLbox = $(this).find('.CLbox');
	for (var i = $CLbox.length-1; i >= 0 ; i--) {
		var listtop = $CLbox.eq(i).position().top;
		if (listtop < 20) {
			var id = $CLbox.eq(i).find('.stitle').attr('data-title')
			$('.categoryMain').find('[data-id="'+id+'"]').addClass('active').siblings().removeClass('active')
			break
		}
	}
});
//口味列表
var goodsTagArray = [];
//选择口味
$(document).on('click', '.TagChange span', function(event) {
	event.preventDefault();
	if ($(this).hasClass('active')) {
        $(this).removeClass('active');
	}else{
        $(this).addClass('active')
	}

    goodsTagName = "";
    goodsTagId = "";
    $(".TagChange span[class='active']").each(function(){
        goodsTagName += "," + $(this).html();
        goodsTagId += "," + $(this).attr('data-id');
	});

	goodsTagName = goodsTagName.substring(1);
	goodsTagId   = goodsTagId.substring(1);
});
//修改已点食品的口味
$(document).on('click', '.amendTaste', function(event) {
	event.preventDefault();

	goodsTagName = $(this).val();
	goodsTagId   = $(this).attr('data-id');
	amedIndex    = $(this).parents(".MFlist").index();
	var foodId = $(this).parents('.MFlist').attr('data-foodid');

	var html = '';
	var arr = goodsTagArray[foodId];
	if (!arr) return;

	var tagIdArray = goodsTagId.split(",");

	for (var i = 0; i < arr.length; i++) {
		var activeClass = "";
		$.each(tagIdArray, function(index, value){
			if(arr[i].id == value){
				activeClass = "active";
			}
		});

		html += '<span data-id="'+arr[i].id+'" class="'+activeClass+'">'+arr[i].name+'</span>'
	}

	$.alert('<div class="TagChange flexbox">'+html+'</div>',"选择口味",function(){
		amendTaste();
	})

});

//点餐
var foodInfo,goodsTagName,goodsTagId;
$orderListBox.on('click', '.orderbtn', function(event) {
	goodsTagName = '';
	goodsTagId   = '';
	$('.tasteBox').attr('data-type','add');//标记为新增
	foodInfo = $(this).parents('.catalogue');
	getFoodInfo();

});



$('.tasteSure').click(function(event) {
	var type = $(this).parents('.tasteBox').attr('data-type');

	if (type == 'add') {//判断是新增还是修改
		getFoodInfo();
	}else{
		amendTaste()
	}
	$('.tasteBG').fadeToggle(400);

});

$('.tasteFalse').click(function(event) {
	$('.tasteBG').fadeToggle(400);
});
//获取点餐动画
function getFoodInfo(dome){
	var $this = foodInfo;
	var $btn = $this.find('.orderbtn');
	$btn.addClass('grey1');
	var $dome = $btn.siblings('.catacen');
	$(this).remove();
	foodmessFun($dome);
}

function storageGoodsList(goodsList) {
	localStorage.setItem("mjGoodsList", JSON.stringify(goodsList));
}

function getStorageGoodsList() {
	return JSON.parse(localStorage.getItem("mjGoodsList"));
}

function updatePriceAndRemark(item) {
	if (item && item.selectGoodsPackList.length > 0) {
		// 重新计算总价
		var price = 0;
		var remark = "";
		for (let i = 0; i < item.selectGoodsPackList.length; i++) {
			const pack = item.selectGoodsPackList[i];
			var selectItems = pack.selectItems;
			var items = Object.values(selectItems);
			items.forEach(item => {
				if (item && item.packPrice) {
					price += item.packPrice;
				}
			});
		}
		item.price = price;

		for (let i = 0; i < item.selectGoodsPackList.length; i++) {
			const pack = item.selectGoodsPackList[i];
			var selectItems = pack.selectItems;
			var items = Object.values(selectItems);
			items.forEach(item => {
				if (item && item.selectTag) {
					var tags = Object.values(item.selectTag);
					if (tags.length > 0) {
						remark += (item.name + '(');
						var tagArray = new Array();
						tags.forEach(tag => {
							var tagItem = item.tags[tag];
							tagArray.push(tagItem.name);
						});
						var tagString = "";
						if (tagArray.length == 1) {
							tagString = tagArray[0];
						} else {
							tagString = tagArray.join(',');
						}
						remark += (tagString + ') ');
					}
				}
			});
		}
		item.staticRemark = remark;
		console.log(item);
	} 

}


var selectItem;
var selectTagCategorys;
// 选择口味
$orderListBox.on('click', '.tasteSelectBtn', function (event) {
	selectItem = null;
	selectTagCategorys = null;
	var goodsId = $(event.currentTarget).attr("data-goodsid");
	ajaxCGI({
		url:"queryGoodsDetail",
		dire:'xcx/',
		type: 'GET',
		jsonData:{goodsId:goodsId},
		success:function(data){
			selectItem = data;
			var tagCategorys = {};
			var array = selectItem.goodsTagsList[0]['categorys'];
			for (var i=0; i<array.length; i++) {
				var tagItem = array[i];
				tagCategorys[tagItem.id] = '';
			}
			selectTagCategorys = tagCategorys
			reloadTasteView();
			$(".TasteView").css("display","block");
		}
	})
});

function reloadTasteView () {

	$(".GoodDetailImageView").empty();
	$(".GoodDetailImageView").append("<img src='" + selectItem.imageUrl + "'/>");
	$(".GoodDetailContent").empty();

	var html = '';

	html += '<div class="GoodDetailTitleView">' +
			'<div class="GoodDetailTitle" >' + selectItem.name + '</div>' + 
			'<div class="GoodDetailPrice" >￥' + selectItem.price.toFixed(2) + '</div>' +
			'<div class="GoodDetailCartBtn">加入购物车</div>' + 
			'</div>';

	var array = selectItem.goodsTagsList[0]['categorys'];

	for (var i=0; i<array.length; i++) {
		var tagItem = array[i];
		var tagId = tagItem.id;
		html += '<div class="GoodDetailTagTitle">' + tagItem.name + '</div>';
		html += '<div class="GoodDetailTagView">';
		for (var j=0; j<tagItem.goodsTags.length; j++) {
			var tag = tagItem.goodsTags[j];
			html += '<div class="GoodDetailTag';
			if (selectTagCategorys[tagId] == tag.name) {
				html += ' selected';
			}
			html += ('" data-tagid="' + tagId + '" data-tagname="' + tag.name +'" >' + tag.name + '</div>');
		}

		html += '</div>';

	}

	$(".GoodDetailContent").append(html);


}

$tasteView.on('click', '.order_close_btn', function (event) {
	$(".TasteView").css("display","none");
});

$tasteView.on('click', '.GoodDetailCartBtn', function (event) {
	var tags = Object.values(selectTagCategorys);
	var tagArray = new Array();

	for(var i=0; i<tags.length; i++) {
		var tag = tags[i];
		if (tag.length > 0) {
			tagArray.push(tag);
		}
	}

	if(tagArray.length > 0) {
		selectItem.goodsTags = tagArray.join(',');
	}
	
	selectItem.remark = '';
	selectItem.count = 1;
	storageFun(selectItem);
});

$tasteView.on('click', '.GoodDetailTag', function (event) {
	var tagId = $(event.currentTarget).attr("data-tagid");
	var tagName = $(event.currentTarget).attr("data-tagname");

	if (selectTagCategorys[tagId] == tagName) {
		selectTagCategorys[tagId] = '';
	} else {
		selectTagCategorys[tagId] = tagName;
	}
	reloadTasteView();
});

var goodsPackList;
var packPrice;
var selectPackItemId;
var selectGoodItemId;
var selectGoodDataId;
var selectedPackChildGoodsInfo;
var packTagCategorys;

// 选择套餐
$orderListBox.on('click', '.packageSelectBtn', function (event) {
	var goodsId = $(event.currentTarget).attr("data-goodsid");
	ajaxCGI({
		url:"queryGoodsDetail",
		dire:'xcx/',
		type: 'GET',
		jsonData:{goodsId:goodsId},
		success:function(data){
			selectPackItem = data;
			var packTagCategorys = {};
			// var array = selectItem.goodsTagsList[0]['categorys'];
			// for (var i=0; i<array.length; i++) {
			// 	var tagItem = array[i];
			// 	tagCategorys[tagItem.id] = '';
			// }
			selectPackItemId = 0;
			packTagCategorys = {};
			selectedPackChildGoodsInfo = {};

			var array = selectPackItem.goodsPackList;
			goodsPackList = new Array();
			packPrice = 0;
			for (var i=0; i<array.length; i++) {
				var packItem = array[i];
				var newItem = {"id": i, "item": packItem};
				goodsPackList.push(newItem);
				packPrice += packItem.price;
			}
			reloadPackageView();
			$packageView.css("display","block");
		}
	})
});

$packageView.on('click', '.order_close_btn', function (event) {
	$packageView.css("display","none");
});

$packageView.on('click', '.GoodDetailCartBtn', function (event) {
	
	var newPackList = new Array();

	for (let i = 0; i < goodsPackList.length; i++) {
		var element = goodsPackList[i];
		newPackList.push(element.item);
	}
	selectPackItem.goodsPackList = newPackList;
	selectPackItem.remark = '';
	selectPackItem.count = 1;
	storageFun(selectPackItem);
});

$packageView.on('click', '.GoodPackageItem', function (event) {
	var groupId = $(event.currentTarget).attr("data-groupid");
	var goodsId = $(event.currentTarget).attr("data-goodsid");
	var id = $(event.currentTarget).attr("data-id");
	selectPackItemId = groupId;
	selectGoodItemId = goodsId;
	selectGoodDataId = id; 
	reloadPackageView();
});

$packageView.on('click', '.GoodPackageChildItem', function (event) {
	var groupId = $(event.currentTarget).attr("data-groupid");
	var goodsId = $(event.currentTarget).attr("data-goodsid");
	var id = $(event.currentTarget).attr("data-id");

	var array = selectPackItem.packReplaceList;
	var itemSelected = null;
	for (var i=0; i<array.length; i++) {
		var packItem = array[i];
		if (packItem.packGroupId == groupId) {
			for(var j=0; j<packItem.replaceList.length; j++) {
				var goodsItem = packItem.replaceList[j];
				if (goodsItem.goodsId == goodsId) {
					itemSelected = goodsItem;
					break;
				}
			}
			break;
		}				
	}

	packPrice = 0;
	for (let i = 0; i < goodsPackList.length; i++) {
		var element = goodsPackList[i];
		if (element.id == id) {
			element.item = itemSelected;
			selectGoodItemId = itemSelected.goodsId;
		}
		packPrice += element.item.packPrice;
	}

	reloadPackageView();
});



function reloadPackageView() {
	$(".GoodDetailImageView").empty();
	// $(".GoodDetailImageView").append("<img src='" + packItem.imageUrl + "'/>");
	$(".GoodDetailContent").empty();

	var html = '';

	html += '<div class="GoodDetailTitleView">' +
			'<div class="GoodDetailTitle" >' + selectPackItem.name + '</div>' + 
			'<div class="GoodDetailPrice" >￥' + packPrice.toFixed(2) + '</div>' +
			'<div class="GoodDetailCartBtn">加入购物车</div>' + 
			'</div>';
	html += '<div class="GoodPackageView">';
	var expandPackGroupId = 0;
	var expandId = 0;
	var expandGoodsItem = null;
	for (var i = 0; i < goodsPackList.length; i++) {
		var packItem = goodsPackList[i];
		var id = packItem.id;
		var goodsItem = packItem.item;
		html += '<div data-groupid=' + goodsItem.packGroupId + ' data-goodsid=' + goodsItem.goodsId + ' data-id=' + id + ' class="GoodPackageItem">';
		html += '<div class="GoodPackageItemImageView';
		if (selectGoodItemId == goodsItem.goodsId && selectGoodDataId == id) {
			html += ' selected';
			expandId = id;
			expandPackGroupId = goodsItem.packGroupId;
			expandGoodsItem = goodsItem;
		}
		html += '">';
		
		html += '<img src="' + goodsItem.imageUrl + '"/>';

		for (let j = 0; j < selectPackItem.packReplaceList.length; j++) {
			var element = selectPackItem.packReplaceList[j];
			if (element.packGroupId == goodsItem.packGroupId) {
				html += '<div class="GoodPackageItemChange">换</div>';
				break;
			}
		}
		html += '</div>';
		html += '<div class="GoodPackageItemTitle">' + goodsItem.name + " X" + goodsItem.quantity + '</div>';
		
		html += '</div>';
	}

	html += '</div>';

	if (expandPackGroupId > 0) {
		var replaceArray = [];
		for (let i = 0; i < selectPackItem.packReplaceList.length; i++) {
			var element = selectPackItem.packReplaceList[i];
			if (element.packGroupId == expandPackGroupId) {
				replaceArray = element.replaceList;
				break;
			}
		}
		if (replaceArray.length > 0) {
			html += '<div class="GoodPackageChildView">';
			for (var i = 0; i < replaceArray.length; i++) {
				var goodsItem = replaceArray[i];
				html += '<div data-groupid=' + goodsItem.packGroupId + ' data-goodsid=' + goodsItem.goodsId + ' data-id=' + expandId + ' class="GoodPackageChildItem">';
				html += '<div class="GoodPackageChildItemImageView';
				if (expandGoodsItem && expandGoodsItem.goodsId == goodsItem.goodsId) {
					html += ' selected';
				}
				html += '">';
				html += '<img src="' + goodsItem.imageUrl + '"/></div>';
				html += '<div class="GoodPackageItemChildTitle">' + goodsItem.name + " X" + goodsItem.quantity + '</div>';
				html += '</div>';
			}
			html += '</div>';
		}
	}

	$(".GoodDetailContent").append(html);
}

//获取点餐信息同时处理成数组
function foodmessFun(dome) {
	// var name        = dome.find(".catatitle").html(),
	// 	retailprice = dome.find('.retailprice').attr("data"),
	// 	vipprice    = dome.find('.vipprice').attr('data'),
	// 	foodId      = dome.attr("data-id"),
	// 	type        = dome.attr("data-type"),
	// 	foodmess    = {name:name,retailprice:retailprice,vipprice:vipprice,number:1,foodId:foodId,type:type,goodsTagName:goodsTagName,goodsTagId:goodsTagId};
	// console.log(dome);

	var goodsId = dome.attr("data-id");
	var goodsList = getStorageGoodsList();
	var item = null;

	for (let i = 0; i < goodsList.length; i++) {
		const goodItem = goodsList[i];
		for (let j = 0; j < goodItem.goodsList.length; j++) {
			var element = goodItem.goodsList[j];
			if (element.goodsId == goodsId) {
				item = element;
				break;
			}
		}
		if (item) {
			break;
		}
	}	

	if (item) {
		item.remark = '';
		item.count = 1;
		storageFun(item);
	}
	
}

function storageFun(ArrayMess) {//写入storage
	var foodStr = localStorage.foodStr;

	if (foodStr == undefined) {//判断是否点过餐
		setStorage(ArrayMess, 0)
	}else{

		foodArray = JSON.parse(foodStr);
		
		var length = foodArray.length,newLength;
		for (var i = 0; i < foodArray.length; i++) {//判断是否存在已经点过的餐
			if (foodArray[i].goodsId == ArrayMess.goodsId) {//匹配口味和ID如果能匹配到直接修改匹配到的否则在最后一个添加
				newLength = i;//匹配eq
			}
		}
		if (newLength == undefined) {
			if (goodsTagArray[ArrayMess.foodId]) {//判断是否可选口味
				var html = '';
				var arr = goodsTagArray[ArrayMess.foodId];
				for (var i = 0; i < arr.length; i++) {
					html += '<span data-id="'+arr[i].id+'">'+arr[i].name+'</span>'
				}
				$.alert('<div class="TagChange flexbox">'+html+'</div>',"选择口味",function(){
					ArrayMess.goodsTagId   = goodsTagId
					ArrayMess.goodsTagName = goodsTagName
					setStorage(ArrayMess,length);
				})
			}else{
				setStorage(ArrayMess,length);
			}
		}else{
			amendFun(newLength,+1);
		}


	}

	function setStorage(ArrayMess,length) {
		foodArray[length] = ArrayMess;
		seveFoodArray();
		myOrderList();
	}

	myOrderList();//初始化点餐列表
}

//我的点餐列表
function myOrderList() {
	var foodStr = localStorage.foodStr;

	if (foodStr == undefined || foodStr == "[]") {
		$('.MFmain').find('.MFlist').remove()
		noOrder();
		return;
	}
	$("#submitOrder").css('display', 'block').removeClass('grey');
	$(".Vdata").show();
	foodArray = JSON.parse(foodStr);
	$MFmain.find(".MFlist").remove();
	$('.lnumber').remove();
	Tvipprice = 0;
	var number = 0;	
	var totleRP = 0;
	for (var i = 0; i < foodArray.length; i++) {
		var item     = foodArray[i];
		var revamp   = "btn grey1";
		var mealList = '';
		var totalprices = 0;
		
		if (item.type == 14) {//套餐
			revamp = "btn revamp";
			var details = item.goodsPackList;
			for (var z = 0; z < details.length; z++) {
				var detailsI = details[z];
				
				totleRP += detailsI.packPrice;
				totalprices += detailsI.packPrice;
				mealList += '<div class="mealList displaybox">'+
					'<p class="foodname WhiteSpace boxflex1">' + detailsI.name+ ' X1' + '</p>'+
					'<div class="foodprices WhiteSpace boxflex1">' + (detailsI.packPrice).toFixed(2)+'</div>'+
							'</div>';
			}
		} else {
			totalprices = item.price * item.count;//单个订单支付总价
		}
		var goodsTagNameTips = item.goodsTagName;
		if (!item.goodsTagName) {
			goodsTagNameTips = '<input class="foodprices WhiteSpace boxflex1 amendTaste" value="" readonly></input>'
		}else{
			goodsTagNameTips = '<input class="foodprices WhiteSpace boxflex1 amendTaste" value="'+item.goodsTagName+'" data-id="'+item.goodsTagId+'" readonly></input>'
		}
		var html = '<div class="MFlist" data-foodid="' + item.goodsId +'" data-type="'+item.type+'">'+
						'<div class="displaybox">'+
							'<div class="foodname WhiteSpace boxflex1">'+item.name+'</div>'+goodsTagNameTips+
			'<div class="foodprices WhiteSpace boxflex1">' + (totalprices).toFixed(2)+'</div>'+
							'<div class="regulation boxflex1"><span class="minus">-</span><span>'+item.count+'</span><span class="plus">+</span></div>'+
							'<div class="modify boxflex1"><span class="btn deletefood">删除</span></div>'+
						'</div><div class="details">'+mealList+
					'</div></div>';
		$MFmain.append(html);
		Tvipprice += totalprices;
		number += 1;

		//列表上显示数量
		var listId     = $('.orderListBox').find('[data-goodsid="'+item.foodId+'"]').parents('.CLbox').find('.stitle').attr('data-title')
		var listNumber = $('.categoryMain').find('[data-id="'+listId+'"]').find('.lnumber');
		if (listNumber.length != 0) {
			listNumber.html(parseInt(listNumber.html())+item.number)
		}else{
			$('.categoryMain').find('[data-id="'+listId+'"]').append('<span class="lnumber">'+item.number+'</span>')
		}
	}
	$(".totalprices").html((Tvipprice).toFixed(2));
	$('[name="totalFee"]').val((Tvipprice).toFixed(2));
	$('.number').show().html(number)
	$mun.html((Tvipprice).toFixed(2));
	$('#submitOrder').html('立即下单');

	function noOrder(){
		$MFmain.append('<div class="MFlist nofood">您还没有点过餐哦</br>看看有什么好吃的吧n(*≧▽≦*)n</div>');
		$mun.html(0);
		$('.number').hide();
		$(".Vdata").hide();
		$("#submitOrder").hide();
		$('.lnumber').remove();
	}
}


//加量
$MFmain.on('click', '.plus', function(event) {
	plusOrMinusFun($(this),+1);
});
//减量
$MFmain.on('click', '.minus', function(event) {
	if ($(this).next().html() <= 1) {return};
	plusOrMinusFun($(this),-1);
});

function plusOrMinusFun(thisDom,num) {
	var $this = thisDom,
		$MFlist = $this.parents(".MFlist"),
		index = $MFlist.index();
	amendFun(index,num);
}
function amendFun(index,num) {
	var Arrayindex = foodArray[index];
	// if (Arrayindex.type == '14' & num == +1) {
	// 	var length = Arrayindex.goodsPackList.length;
	// 	Arrayindex.details[length] = Arrayindex.goodsPackList[0];
	// }else if(Arrayindex.type == '14' & num == -1){
	// 	Arrayindex.goodsPackList.splice(length-1,1);
	// }
	Arrayindex.count = foodArray[index].count+num;
	seveFoodArray();
	myOrderList();
}
//

function isNull( str ){
	if ( str == "" ) return true;
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
}
function amendTaste() {
	var Arrayindex = foodArray[amedIndex];//获取食物数组
	if (isNull(goodsTagName)) {goodsTagName = "可换口味"}

	Arrayindex.goodsTagName = goodsTagName;
	Arrayindex.goodsTagId   = goodsTagId;
	seveFoodArray();
	myOrderList();
}
//弹出我的点餐列表
$('.GWCleft').click(function(event) {
	$valuation.slideToggle(300);
});
$('.close').click(function(event) {
	$valuation.slideToggle(300);
});
//删除点单
var foodId,$MFlist;
$MFmain.on('click', '.deletefood', function(event) {
	var $this = $(this);

	$MFlist      = $this.parents(".MFlist");
	foodId       = $this.parents(".MFlist").attr("data-foodid");
	detailsIndex = $MFlist.index();
	if ($this.hasClass('domdelete')) {
		var $mealList = $this.parents(".mealList");
		domIndex  = $mealList.index();
		deleteDomFun();
	}else{
		deletefoodFun();
	}
});
//删除索引，某食物
function deletefoodFun() {
	$('[data-id="'+foodId+'"]').parent().find('.orderbtn').removeClass('grey1');
	foodArray.splice(detailsIndex,1);
	seveFoodArray();
	myOrderList();

}
//删除某套餐
function deleteDomFun() {
	foodArray[detailsIndex].details.splice(domIndex,1);
	foodArray[detailsIndex].number = foodArray[detailsIndex].number-1;
	if (foodArray[detailsIndex].details.length == 0) {
		deletefoodFun();
		return;
	}
	seveFoodArray();
	myOrderList();
}
//删除全部
$(".deleteAll").click(function(event) {

	deleteFoodArray();
	foodArray = new Array();
	myOrderList();
});

//弹出套餐修改列表
var domIndex,detailsIndex;//分套，总套
$MFmain.on('click', '.revamp', function(event) {
	var title = $(this).parent().siblings('.foodname').html(),
		foodId = $(this).parents(".MFlist").attr("data-foodid"),
		$EPbox = $('.EPbox');

	domIndex = $(this).parents('.mealList').index();
	detailsIndex = $(this).parents('.MFlist').index();
	$EPbox.find('.EDli').remove();
	var bomDetails = foodArray[detailsIndex].details[domIndex];

	for (var i = 0; i < bomDetails.length; i++) {
		var item = bomDetails[i];
		var bomFoodList = '',
			bomFoodBox  = '',
			wardbox     = '';
		if (item.bomReplaceList.length > 1) {

			for (var z = 0; z < item.bomReplaceList.length; z++) {
				var itemF    = item.bomReplaceList[z];
				var replaceTips = '<span>需加价'+(itemF.replacePrice).toFixed(2)+'元</span>';
				if (itemF.replacePrice == 0) {
					replaceTips = "<span>无须加价</span>";
				}
				bomFoodList += '<div class="EDPli" data-foodid="'+itemF.goodsId+'" data-replacePrice="'+nullFun(itemF.replacePrice)+'"><p>'+itemF.name+'</p>'+replaceTips+'</div>';
				bomFoodBox   = '<div class="EDpull">'+ bomFoodList +'</div>';
				wardbox      = '<span class="wardbox"><em class="ward"></em></span>';
			}
		}

		var html =  '<li class="EDli" data-foodid="'+item.goodsId+'"  data-replacePrice="'+nullFun(item.replacePrice)+'">'+wardbox+
						'<div class="EDname WhiteSpace">'+item.name+'</div>'+bomFoodBox+
					'</li>';

		$EPbox.append(html);
	}

	$(".PBtitle").html(title).attr("data-foodid",foodId);
	$(".editPackage").show();
	$('.mask').remove();
	$('body').append('<a class="mask"></a>');
	$('.mask').show();
	//ErrorBoxHenght('.editPackage');

});
//选择修改的套餐
$(".editPackage").on('click', '.EDli ', function(event) {
	event.stopPropagation();
	var $this = $(this);
	var $EDpull=$this.find('.EDpull');
	$EDpull.toggle();
	$this.siblings().find('.EDpull').hide();
	$this.toggleClass('animate');
});
$(".editPackage").on('click', '.EDPli', function(event) {
	event=event||window.event;
	event.stopPropagation();
	var $this = $(this),
		$EDli = $this.parents('.EDli');
	var name         = $this.find('p').html(),
		foodId       = $this.attr('data-foodid'),
		replacePrice = $this.attr('data-replacePrice');

	$EDli.attr({
		'data-foodid': foodId,
		'data-replacePrice': replacePrice
	});;
	$this.parent().siblings('.EDname').html(name);
	$(".EDpull").hide();
	$this.parents(".EDli").removeClass('animate');
});
$(document).click(function(event) {
	$('.EDpull').hide();
});
//确定修改
$(".modificationBTN").click(function(event) {
	$(".editPackage").hide();
	$(".mask").remove();
	modificationFun();
	myOrderList();
});
function modificationFun() {
	var lengthF = $('.EPbox').find('.EDli').length;
	for (var i = 0; i < lengthF; i++) {
		var item = $('.EPbox').find('.EDli').eq(i);
		var goodsId       = item.attr('data-foodid'),
			name         = item.find('.EDname').html(),
			replacePrice = item.attr('data-replacePrice');
		var detailsItem  = foodArray[detailsIndex].details[domIndex];
		var arrayItem    = detailsItem[i];
		arrayItem.goodsId       = goodsId;
		arrayItem.name         = name;
		arrayItem.replacePrice = parseInt(replacePrice);
		detailsItem += nullFun(replacePrice)
	}
	seveFoodArray();
}
//取消修改
$('.PBfalse').click(function(event) {
	$('.editPackage').hide();
	$('.mask').hide();
});
//立即下单
$("#submitOrder").click(function() {
	if ($(this).hasClass('grey')) return;
	saveOrder();
	// if (!seatName || seatName == "") {
	// 	$valuation.slideDown();
	// 	error("importSeat", 4);

	// }else{
    // $('body').append('<div class="modal-overlay modal-overlay-visible"></div>');
	// $(".seatPup").show().addClass('modal-in');
	// }
});

function normal(id,times)
{
    var obj=$("#"+id);
    obj.css("background-color","#FFF");
    if(times<0)
    {
        return;
    }
    times=times-1;
    setTimeout("error('"+id+"',"+times+")",200);
}
function error(id,times)
{
    var obj=$("#"+id);
    obj.css("background-color","#F6CECE");
    times=times-1;
    setTimeout("normal('"+id+"',"+times+")",200);
}

$('body').on('click', '#paymask', function(event) {
	$(".paybox").slideUp(300);
	$(this).remove();
	$("#submitOrder").removeClass('grey').html('立即下单')
});
//扫码
function WXQRcode() {
	wx.scanQRCode({
		// 默认为0，扫描结果由微信处理，1则直接返回扫描结果
		needResult : 1,
		scanType:["qrCode","barCode"],
		success : function(res) {
			seatName = getSeatName(res.resultStr)
			$('#importSeat').val(seatName)

		}
	});
}
//////////////////////
function hideSeat(){
	$('.seatPup').hide().removeClass('modal-in');
	$('.modal-overlay').remove();
}
//关闭座位确认
$('.seatPup .closes').click(function(event) {
	hideSeat();
});
//换座位
$('.seatL').click(function(event) {
	hideSeat();
	WXQRcode();
});
//不换座位
$('.seatR').click(function(event) {
	hideSeat();
	saveOrder(seatName)
});
//获取url上的seatName
var seatName = getUrlSeat();
function getUrlSeat(){
	var l = window.location.search.split('seatName=')[1]
	if (!l) {
		return null;
	}
	var s = l.split('&')[0];
	return decodeURI(s)
}
function getlogindesk(){
	if (!seatName) {
		ajaxCGI({
			url:"logindesk",
			dire:'api/',
			jsonData:{stgId:stgId},
			success:function(data){
				if (data.seatName) {
					seatName = data.seatName;
					$('#importSeat').val(seatName);
					$('#seatName').html(seatName);
				}

			}

		})
	}
}

$('#seatName').text(seatName);
$('#importSeat').val(seatName);
function getSeatName(url) {
	var l = url.split("seatName=")[1];
	if (!l) {
		$('#seatName').text(url);
		return url;
	}
	var s = l.split('&')[0];
	$('#seatName').text(s);
	return s;
}
$('.seatScan').click(function(event) {
	WXQRcode();
});
$('#importSeat').change(function(event) {
	seatName = $(this).val();
	$('#seatName').text(seatName);
}).keyup(function(event) {
	$(this).change();
}).bind('input propertychange', function() {
	$(this).change()
});
////////////////////
function saveOrder(){
	jsonData = {
		organId: stgId,
		goodsList:subArrayFun(),
		remark:""
	};

	ajaxCGI({
		url:'saveSelfGoodsOrder',
		jsonData:jsonData,
		dire:'xcx/',
		type:"POST",
		success:function(data){
			$(".paybox").slideUp(300);
			$(".mask").hide(300);
			var url = '/xcx/mj/page/vip/pay.html?' + 'saleBillId=' + data.saleBillId;
			var miniProgramOpenId = GetQueryString('miniProgramOpenId');
			if (miniProgramOpenId) {
				url += ('&miniProgramOpenId=' + miniProgramOpenId);
			}
			if (hiddenBar) {
				url += ('&hiddenBar=' + hiddenBar);
			}
			// location.href = url;

			var uri = window.location.origin + "/xcx/mj/page/vip/pay.html?saleBillId=" + data.saleBillId;
			var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + GetQueryString('organId');
			codeUrl += ("&uri=" + encodeURIComponent(uri));
			window.location.href = codeUrl;
		},
		error:function(data){
			$("#submitOrder").removeClass('grey').html("立即下单");
		}
	});
}


////////////////
function subArrayFun(){
	
	var subArray = new Array();
	for (var i = 0; i < foodArray.length; i++) {
		var item = foodArray[i];
		delete item.goodsTagList;
		delete item.imageUrl;
		item.quantity = item.count;
		item.payAmount = item.price;
		item.incomeAmount = item.price;
		subArray[subArray.length] = item;
	}
	
	return subArray;
}
////搜索匹配
jQuery.expr[':'].Contains = function(a,i,m){
	return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};
function filterList(header, list) {
	var $input = $('.filterinput');
	$input.change( function () {
			var filter = $(this).val();
			if(filter) {
				$matches = $(list).find('h2:Contains(' + filter + ')').parents('.catalogue');
				$('.catalogue', list).not($matches).slideUp();
				$matches.slideDown();
				$('.stitle').slideUp();
			} else {
				$(list).find(".catalogue").slideDown();
				$('.stitle').slideDown();
			}
			return false;
	})
	.bind('input propertychange', function() {
		$(this).change()
	})
	.keyup(function(event) {
		$(this).change()
	});
}

filterList($("#form"), $(".orderListBox"));

$(".remark-input").bind('input propertychange', function(){
    $.each($(".remark-input"), function(i, n){
    	if(n.textLength > 50){
			$.alert("备注信息不可超过50个字");
            $(n).val($(n).val().substring(0,50));
            $(n).blur();
		}

        if(n.scrollHeight == 0){
            //$(n).attr("cols",1);
        }else{
            $(n).css("height", n.scrollHeight + "px");
        }
    });
});


