$(function(){
    var Urlname = GetURLname();
    var token = appIni.login();
    if(token == null){
        return false;
    }
    eval('myIni.'+Urlname+"()");
    $(document).on("pageInit", function(e, pageId, $page) {
        appIni.barbottom();
        eval('myIni.'+pageId+"()");
    });      
}); 
var memberId;
var myIni = {    
    //////////////////我的首页//////////////////
    index:function(){
        ajaxCGI({
          	url:"my",
          	jsonData:{},
          	success:function(data){
                addCookie("userPhone",data.mobile,360,"/");
                //数据显示    
                $("#name").text(data.name + (data.nickName==null?'':'（'+data.nickName+'）'));
                $('#phone').text(data.mobile);
                $("#cardCategoryName").text(data.cardCategoryName);

                if (data.idNumber) {
                    $("#idNumber").text(data.idNumber);
                    $("#idTypeName").text(data.idTypeName)
                    var href = $('.ReInfo').attr('href');
                    $('.ReInfo').attr('href',href+'?idNumber='+data.idNumber);
                }else{
                    //$("#idNumber").html('<a href="/mj/page/login/remeans.html" class="external">绑定证件号</a>');
                    $("#idTypeName").text('证件号')
                }

                if (data.photoUrl == null) {
                    $("#photoUrl").attr('src','/mj/common/images/userimg.jpg');
                }else{
                    imgAuto($("#photoUrl"),data.photoUrl);
                }

                $("#cashBalance").text(tofixed(data.cashBalance));
                $("#presentBalance").text(tofixed(data.presentBalance));
                $("#magicCoin").text(tofixed(data.magicCoin));
                $("#coupon").text(data.coupon);

                var passwordLink = "/mj/page/my/password.html?cardId="+data.id;
                if (data.password != null) {
                    $('#password').text('修改支付密码');
                    passwordLink+= "&set=true";
                }
                $("#passwordLink").attr('href',passwordLink);    
          	}
        });
        
    },

    //////////////////设置会员卡密码//////////////////
    password:function(){
        if (GetQueryString('set') == 'true') {
            $('#oldpasswordHtml').show();
        }

        $("#newpassword").keyup(function(){  //keyup事件处理 
            $(this).val($(this).val().replace(/\D|^0/g,''));  
        }).bind("paste",function(){  //CTR+V事件处理 
            $(this).val($(this).val().replace(/\D|^0/g,''));  
        })

        $('#upPassword').click(function(event) {
            var newpassword = $("#newpassword").val();
            var repassword = $("#repassword").val();
            var oldPassword= $("#oldPassword").val();
            if (oldPassword == "") {
                oldPassword = newpassword;
            }
            //console.log(password.length)
            if (newpassword.length !== 6 ) {
                $.alert("请输入6位数密码！");
                return;
            }
            if (newpassword !== repassword) {
                $.alert("两次密码输入不一致！");
                return;
            }
                
            ajaxCGI({
                url:"cardpassword",
                jsonData:{
                    cardId:GetQueryString('cardId'),
                    newPassword:newpassword,
                    oldPassword:oldPassword
                },
                success:function(data){
                    //console.log(data);
                    $.router.back();
                }
            })
        });
    },


    //////////////////我的任务//////////////////
    task:function(){
        appIni.sinUserShow(function(userinfo){
            if (userinfo) { $('#point').text(userinfo.point);}
            ajaxCGI({
                url:'schemelist',
                loadIcon:'#tab1',
                jsonData:{
                    pageSize:100,
                    pageNum:1,
                    type:1,
                    status:1
                },
                success:function(data){
                    $('#tab1').find('.card').remove();                
                    console.log(data);
                    if (data.length == 0) {
                        $('#tab1').append('<div class="card mynodata">\
                            <div class="nomtext">您还没有领取任何任务！</div>\
                        </div>');
                        return;
                    } 
                    for (var i = 0; i < data.length; i++) { 

                        var item = data[i];
                    }
                }
            })
        });
        
    },

    //////////////////我的任务详情//////////////////
    taskdetails:function(){
        var userinfo = appIni.sinUserShow();
    },
    //////////////////余额明细//////////////////
    consumerdetails:function(){
        var stgId = GetQueryString('stgId');

        $('.consumerdetailsCard').find('li').remove();
        var pageNum = 1,totalPage;
        function consumer(){
            ajaxCGI({
                url:'cardaccountlog',
                loadIcon:'.consumerdetailsCard ul',
                jsonData:{
                    stgId: stgId,
                    type: 0,
                    pageNum:pageNum,
                    pageSize:10
                },
                success:function(data){
                    totalPage = data.list.pages;
                    loading = false;

                    $('#cashBalance').text(tofixed(data.cashBalance));
                    $('#presentBalance').text(tofixed(data.presentBalance));
                    $('#magicCoin').text(tofixed(data.magicCoin));
                    console.log(data);
                    if (data.list.list.length == 0) {
                        $('.consumerdetailsCard ul').append('<li class="item-content"><div class="item-center">暂无记录</div></li>')
                        return;
                    }
                    for (var i = 0; i < data.list.list.length; i++) {
                        var item = data.list.list[i];

                        var className = '';
                        var amountHtml = '';

                        if(item.cashAmount != 0){
                            if (item.cashAmount > 0) {
                                className = 'corgre';
                            }else{
                                className = 'corred';
                            }
                            amountHtml += '&nbsp;&nbsp;现金 <i class="'+className+'">'+tofixed(item.cashAmount)+'</i>';
                        }

                        if(item.presentAmount != 0){
                            if (item.presentAmount > 0) {
                                className = 'corgre';
                            }else{
                                className = 'corred';
                            }
                            amountHtml += '&nbsp;&nbsp;赠送 <i class="'+className+'">'+tofixed(item.presentAmount)+'</i>';
                        }

                        var html = '<li class="item-content">'+
                                        '<div class="item-inner">'+
                                            '<div class="item-title"><span>'+item.remark+'</span>'+
                                                '<p class="item-p">'+nullF(item.payCategoryName)+'</p>'+
                                            '</div>'+
                                            '<div class="item-after">'+
                                                '<span>'+ (amountHtml==''?0:amountHtml) +'</span>'+
                                                '<p>'+item.createTime+'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>';
                        $('.consumerdetailsCard ul').append(html);            
                    }
                }
            })
        }

        // 加载flag
        var loading = false;
        consumer();
        function addItems(){
            if (pageNum == totalPage) return;
            loading = true;       
            pageNum += 1;
            consumer();
        }

        // 注册'infinite'事件处理函数
        $(document).die().on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            // 添加新条目
            addItems();
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
            
        });
    },
    //////////////////余额明细//////////////////
    magicdetails:function(){
        var stgId = GetQueryString('stgId');
        var presentBalance = 0;

        $('.consumerdetailsCard').find('li').remove();
        var pageNum = 1,totalPage;
        function consumer(){
            ajaxCGI({
                url:'cardaccountlog',
                loadIcon:'.consumerdetailsCard ul',
                jsonData:{
                    stgId: stgId,
                    type: 1,
                    pageNum:pageNum,
                    pageSize:10
                },
                success:function(data){
                    presentBalance = data.presentBalance;
                    totalPage = data.list.pages;
                    loading = false;

                    $('#cashBalance').text(tofixed(data.cashBalance));
                    $('#presentBalance').text(tofixed(data.presentBalance));
                    $('#magicCoin').text(tofixed(data.magicCoin));
                    console.log(data);
                    if (data.list.list.length == 0) {
                        $('.consumerdetailsCard ul').append('<li class="item-content"><div class="item-center">暂无记录</div></li>')
                        return;
                    }
                    for (var i = 0; i < data.list.list.length; i++) {
                        var item = data.list.list[i];

                        var className = '';
                        var amountHtml = '';

                        if (item.magicCoin > 0) {
                            className = 'corgre';
                        }else if(item.magicCoin < 0){
                            className = 'corred';
                        }
                        amountHtml += '&nbsp;&nbsp;魔元 <i class="'+className+'">'+tofixed(item.magicCoin==null?0:item.magicCoin)+'</i>';

                        var html = '<li class="item-content">'+
                            '<div class="item-inner">'+
                            '<div class="item-title"><span>'+item.remark+'</span>'+
                            '<p class="item-p">'+nullF(item.payCategoryName)+'</p>'+
                            '</div>'+
                            '<div class="item-after">'+
                            '<span>'+ (amountHtml==''?0:amountHtml) +'</span>'+
                            '<p>'+item.createTime+'</p>'+
                            '</div>'+
                            '</div>'+
                            '</li>';
                        $('.consumerdetailsCard ul').append(html);
                    }
                }
            })
        }

        // 加载flag
        var loading = false;
        consumer();
        function addItems(){
            if (pageNum == totalPage) return;
            loading = true;
            pageNum += 1;
            consumer();
        }

        // 注册'infinite'事件处理函数
        $(document).die().on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            // 添加新条目
            addItems();
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();

        });

        $(document).on('click', '#presentExchange', function(){
            if(stgId == null){
                ajaxCGI({
                    url:"carddetaillist",
                    jsonData:{
                        latitude:getCookieValue('latitude'),
                        longitude:getCookieValue('longitude')
                    },
                    success:function(data){
                        var selectHtml = '<select id="stgId">';
                        if(data.list.length == 1){
                            selectHtml = '<select id="stgId" disabled>';
                        }
                        for(var i=0; i<data.list.length; i++){
                            var item = data.list[i];
                            selectHtml += '<option value="'+item.stgId+'">'+item.stgName+'</option>';
                        }
                        selectHtml += '</select>';

                        showExchangeModal(selectHtml);
                    }
                });
            }else{
                ajaxCGI({
                    url:"stgdetail",
                    jsonData:{
                        stgId: stgId,
                    },
                    success:function(data){
                        var selectHtml =
                            '<select id="stgId" disabled>' +
                            '<option value="'+data.id+'">'+data.name+'</option>' +
                            '</select>';
                        showExchangeModal(selectHtml);
                    }
                });
            }

        });

        function showExchangeModal(selectHtml){
            var bodyHtml =
                '<div class="item-row">' +
                '    <div class="item-name">网咖名称：</div>' +
                '    <div class="item-value">' + selectHtml +
                '   </div>' +
                '</div>' +
                '<div class="item-row">' +
                '   <div class="item-name">赠送金额：</span></div>' +
                '   <div class="item-value"><input type="number" id="presentAmount"></div>' +
                '</div>' +
                '<div class="item-row">' +
                '   <div class="item-name">魔元金额：</div>' +
                '   <div class="item-value"><span id="magicAmount">0.00</span> 魔元</div>' +
                '</div>' +
                '<div class="item-row">' +
                '   <div class="item-tips">赠送账户可用于兑换的余额为 <span id="presentBalance">--</span> 元</div>' +
                '</div>';

            $.modal({
                title: '赠送金额兑换魔元',
                text: bodyHtml,
                extraClass: 'modalClass',
                buttons: [{
                    text: '取消'
                },{
                    text: '确定',
                    close: false,
                    onClick: function(){
                        var stgId = $('#stgId').val();
                        var presentAmount = $('#presentAmount').val();

                        if(stgId == ''){
                            alert('网咖名称不可空');
                            return false;
                        }
                        if(presentAmount == '' || presentAmount == 0){
                            alert('赠送金额不可空或0');
                            return false;
                        }

                        var presentAmount = $('#presentAmount').val()*100;
                        if(presentAmount > currStgPresentBalance){
                            alert('兑换的赠送金额不可超过赠送账户余额');
                            return false;
                        }

                        ajaxCGI({
                            url:"present2magic",
                            handleSelf: true,
                            jsonData:{
                                stgId: stgId,
                                amount: presentAmount
                            },
                            success:function(data){
                                if(data.code != 0){
                                    alert(data.message);
                                    return;
                                }

                                $.closeModal();
                                window.location.reload();
                            }
                        });
                    }
                }]
            });

            var currStgPresentBalance = 0; //当前网吧的赠送余额
            var currStgCoinRate; //当前网吧的兑换比例
            var oldValue = 0; //赠送金额，输入前的值，默认0

            $(document).on('change', '#stgId', function(){
                oldValue = 0;
                if($(this).val() == '网咖名称未选择'){
                    console.log();
                    return;
                }
                ajaxCGI({
                    url:"my",
                    jsonData:{stgId: $(this).val()},
                    success:function(data){
                        currStgPresentBalance = parseInt(data.presentBalance/100)*100;
                        currStgCoinRate = data.coinRate;
                        $('#presentBalance').html(currStgPresentBalance/100);
                        $('#presentAmount').val('');
                        $('#presentAmount').attr('placeholder', '可用余额'+(currStgPresentBalance/100) + '元');
                        $('#magicAmount').html('0');
                    }
                });
            });

            $(document).on('input propertychange change', '#presentAmount', function(){
                if($(this).val()==''){
                    $(this).val('');
                    $('#magicAmount').html('0');
                    return;
                }

                var newValue = parseInt($(this).val());
                if(newValue*100 > currStgPresentBalance){
                    $(this).val(oldValue);
                }else{
                    oldValue = newValue;
                    $(this).val('');
                    $(this).val(newValue);
                    var magicAmount = newValue * currStgCoinRate;
                    $('#magicAmount').html(magicAmount);
                }
            });

            $('#stgId').trigger('change');
        }

        if(GetQueryString('clickBtn')=='true'){
            $('#presentExchange').trigger('click');
        }
    },

    //////////////////我的电影//////////////////
    mymovie:function(){
        var hasNextPage = false;
        var currPageNum = 0;
        var loading = false;

        function queryMyMovie(){
            ajaxCGI({
                url:'mymovie',
                jsonData:{
                    pageNum:++currPageNum,
                    pageSize:20
                },
                success:function(data){
                    if(data.size == 0 && currPageNum == 1){
                        // 删除无数据的提示
                        $(".blankTips").show();
                    }

                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

                    for (var i = 0; i < data.size; i++) {
                        var item = data.list[i];
                        var html = '<li>\
                                        <div class="code"></div>\
                                        <div class="moviename">'+item.name+'</div>\
                                        <div class="movietext">\
                                            <div><span class="mtleft">网吧名称：</span><p>'+item.stgName+'</p></div>\
                                            <div><span class="mtleft">房型：</span><p>'+item.roomCategoryName+'</p></div>\
                                            <div><span class="mtleft">预订时间：</span><p>'+item.bookTime+'</p></div>\
                                            <div><span class="mtleft">过期时间：</span><p>'+item.expiredTime+'</p></div>\
                                        </div>\
                                    </li>';
                        $('.bookmovie').append(html);
                        $('.bookmovie').find('.code').eq(i).empty().barcode(item.code, "code128",{barWidth:2, barHeight:60,showHRI:false});
                    }

                    hasNextPage = data.hasNextPage;
                    loading = false;
                }
            });
        }

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            loading = true;

            // 添加新条目
            queryMyMovie();

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        });

        appIni.sinUserShow(function(data){
            queryMyMovie();
        });
        
    },
    //////////////////我的预订//////////////////
    mybook:function(){
        var userId;
        var pageNum = 1;
        var loading = false;

        function queryUserNetbarBook(){
            ajaxCGI({
                url:'queryUserNetbarBook',
                type:'GET',
                dire:'wx/',
                jsonData:{
                    userId:userId,
                    pageNum:pageNum,
                    pageSize:20
                },
                success:function(data){
                    if(data.list.length == 0 && pageNum == 1){
                        // 删除无数据的提示
                        $(".blankTips").show();
                    }

                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i],cancelBtn;
                        if (item.canCancel == 0) {
                            cancelBtn = "";
                        }else{
                            cancelBtn = '<a class="button button-fill button-success cancelBook">取消预订</a>';
                        }
                        var html = '<li data-bookid="'+item.id+'">\
                                        <div class="code"></div>\
                                        <div class="moviename">座位：'+item.name+'</div>\
                                        <div class="movietext">\
                                            <div><span class="mtleft">网咖名称：</span><p>'+item.stgName+'</p></div>\
                                            <div><span class="mtleft">支付价格：</span><p>¥ '+tofixed(item.payAmount)+' 元</p></div>\
                                            <div><span class="mtleft">上机时间：</span><p>'+item.bookTime+'</p></div>\
                                        </div>'+cancelBtn+'\
                                    </li>';
                        $('.bookmovie').append(html);
                    }

                    loading = false;
                    pageNum++;
                }
            });
        }

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            loading = true;

            // 添加新条目
            queryUserNetbarBook();

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        });

        var cancelBtn;
        $('.bookmovie').on('click', '.cancelBook', function(event) {
            event.preventDefault();
            cancelBtn = $(this);
            $.confirm('是否确定取消预订？',function(){
                var bookId = $(cancelBtn).parent().attr('data-bookid');
                ajaxCGI({
                    url:'cancelUserNetbarBook',
                    clickIcon:$(cancelBtn),
                    type:'POST',
                    dire:'wx/',
                    urljson:'&bookId='+bookId,
                    jsonData:{},
                    success:function(data){
                        $.alert('上网预订取消成功');
                        $(cancelBtn).remove();
                    }
                });
            });
        });

        appIni.sinUserShow(function(data){
            userId = data.id;
            queryUserNetbarBook();
        });
    },
    //////////////////我的活动//////////////////
    myactivity:function(){
        if(appIni.login()==null){
            return;
        }

        appIni.sinUserShow(function(){
            ajaxCGI({
                url:'schemelist',
                loadIcon:'#tab1',
                jsonData:{
                    memberId:appIni.login(),
                    pageSize:100,
                    pageNo:1,
                    type:1,
                    status:0
                },
                success:function(data){   
                    $('.tabs').find('.card').remove();    
                    if (data.length == 0) {
                        $('.tabs').append('<div class="card mynodata">\
                            <div class="nomtext">您还没有参加任何活动！</div>\
                        </div>');
                        return;
                    } 
                    for (var i = 0; i < data.length; i++) { 

                        var item = data[i];
                    }
                }
            })
        });
        
    },
    //////////////////我的兑换/////////////////
    myexchange:function(){
        var hasNextPage = false;
        var currPageNum = 0;
        var loading = false;

        function queryUserMagicGoods(){
            ajaxCGI({
                url:'queryUserMagicGoods',
                type:'POST',
                dire:'wx/',
                jsonData:{
                    pageSize:3,
                    pageNum:++currPageNum
                },
                success:function(data){
                    if(data.list.length == 0 && currPageNum == 1){
                        // 删除无数据的提示
                        $(".blankTips").show();
                    }

                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];

                        var unit = "";
                        if(item.payCategoryId == 0){
                            unit = "元";
                        }else if(item.payCategoryId == 2){
                            unit = "魔元";
                        }

                        var html = '<li data="'+item.exchangeCode+'">\
                                        <div class="code"></div>\
                                        <a  class="moviename">'+item.goodsName+'</a>\
                                        <a href="/mj/page/discover/conversiondetails.html?schemeId='+item.goodsMagicId+'&tab=my" class="external movietext">\
                                            <div><span class="mtleft">网咖名称：</span><p>'+item.stgName+'</p></div>\
                                            <div><span class="mtleft">支付价格：</span><p>'+tofixed(item.payAmount)+' '+unit+'</p></div>\
                                            <div style="display:'+(item.exchangeTime?"none":"block")+'"><span class="mtleft">过期日期：</span><p>'+(item.expiredTime?item.expiredTime.split(" ")[0] : '&nbsp;')+'</p></div>\
                                            <div><span class="mtleft">兑换时间：</span><p>'+item.payFinishTime+'</p></div>\
                                            '+(item.exchangeTime ? '<div><span class="mtleft">领取时间：</span><p>'+item.exchangeTime+'</p></div>' : '')+
                                        '</a>'+(item.status == 1 ? '<div class="button button-fill button-success cancelBook">领取</div>' : '')+'\
                                        <div class="barcode"></div>\
                                    </li>';
                        $('.bookmovie').append(html);
                        //$('.bookmovie').find('.code').eq(i).empty().barcode(item.code, "code128",{barWidth:2, barHeight:60,showHRI:false});
                    }

                    $('.bookmovie li').each(function(index, el) {
                        var code = $(this).attr('data');
                        var div = $(this).find('.barcode')
                        div.barcode(code, "code128",{
                            output:'css',       //渲染方式 css/bmp/svg/canvas
                            //bgColor: '#ff0000', //条码背景颜色
                            color: '#000000',   //条码颜色
                            barWidth: 3,        //单条条码宽度
                            barHeight: 60,     //单体条码高度
                            // moduleSize: 5,   //条码大小
                            // posX: 10,        //条码坐标X
                            // posY: 5,         //条码坐标Y
                            addQuietZone: false  //是否添加空白区（内边距）
                        });
                    });

                    hasNextPage = data.hasNextPage;
                    loading = false;
                }
            });
        }

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            loading = true;

            // 添加新条目
            queryUserMagicGoods();

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        });

        $('.bookmovie').on('click', '.cancelBook', function(event) {
            event.preventDefault();
            $(this).parents('li').addClass('codeShow').siblings().removeClass('codeShow');
            
        });

        queryUserMagicGoods();
    },
    mydjg:function(){
        appIni.sinUserShow();
    },

    //////////////////我的成就/////////////////
    mychengjiu:function(){
        appIni.sinUserShow();
    },

    //////////////////我的点餐/////////////////
    myorder:function(){
        var hasNextPage = false;
        var currPageNum = 0;
        var loading = false;

        function queryMyGoodsOrder(){
            ajaxCGI({
                url:'queryMyGoodsBill',
                dire: 'xcx/',
                jsonData:{
                    pageSize:20,
                    pageNum:++currPageNum
                },
                success:function(data){
                    if(data.list.length == 0 && currPageNum == 1){
                        // 删除无数据的提示
                        $(".blankTips").show();
                    }

                    if(data.hasNextPage == false){
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('.infinite-scroll'));
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').remove();
                    }

                    for (var i = 0; i < data.list.length; i++) {
                        var item = data.list[i];
                        var html = '<div class="MBFlist" data-bookGoodsId="' + item.id + '" data-totleFee="' + item.totalFee + '">' + statusFun(item.status, item.saleBillId)+
                            '<p>门店名称：<span class="MBFroomName">' + item.organName+'</span></p>'+
                            '<p>订单总价：<span class="MBFroomName">¥' + item.payAmount.toFixed(2) +'元</span></p>'+
                            '<p>支付总价：<span class="MBFroomName">¥' + item.incomeAmount.toFixed(2) +'元</span></p>'+
                            '<p>支付方式：<span class="MBFroomName">' + item.payInfo +'</span></p>'+
                            '<div class="MBFtime">下单时间：'+item.createTime+'</div>'+
                            '<a class="MBFa external" href="/xcx/mj/page/vip/pay.html?goodsOrderId=' + item.saleBillId+'" >查看订单详情</a>'+
                            '</div>';
                        $(".mybookFood").append(html);
                    }

                    hasNextPage = data.hasNextPage;
                    loading = false;
                }
            });
        }

        // 注册'infinite'事件处理函数
        $(document).on('infinite', '.infinite-scroll-bottom',function() {
            // 如果正在加载，则退出
            if (loading) return;
            loading = true;

            // 添加新条目
            queryMyGoodsOrder();

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        });

        //状态判断
        function statusFun(status,id) { 
            var statusMess = "";
            var colorClass = '';    
            switch(status){
                case 0:
                statusMess = '<a class="btn external " href="/mj/page/vip/pay.html?goodsOrderId='+id+'">现在支付</a>';
                break;
                case 1:
                statusMess = '已支付';
                break;
                case 2:
                statusMess = '已取消';
                colorClass = 'MBFstatusCor1';
                break;
                case 3:
                statusMess = '已完成';
                colorClass = 'MBFstatusCor2';
                break;
            }
            var html = '<p class="MBFstatus '+colorClass+'">'+statusMess+'</p>';
            return html;
        }

        queryMyGoodsOrder();
    }

};

//上传头像
var files = [];
var loadimg = false;
$(document).on("change",".fileLoader",function(event) {    
    files=event.target.files;
    var layout = files[0].name,
        size   = files[0].size;
    var photoExt=layout.substr(layout.lastIndexOf(".")).toLowerCase();
   
    /*if(!/\.(jpg|jpeg|png|JPG|PNG|bmp)$/.test(layout))
    {

      alert("图片类型必须是bmp,jpeg,jpg,png中的一种")
      $(".fileLoader").val("");
      return false;
    }*/

    if (size >= 5*1024000) {
        alert("图片不能超过5M")
        $(".fileLoader").val("");
        return false;
    }
    processUpload();
})
function processUpload(){
    if (loadimg == true) {
        $.alert('头像正在上传，耐心等待哦！');
        return;
    }
    $.alert("头像上传已提交");
    var oMyForm = new FormData();

    oMyForm.append("file", files[0]);
    oMyForm.append("memberId",memberId);

    $(".user-img").append('<div class="fileLoaderIng"></div>');     
    $.ajax({dataType : 'json',
        url : server + 'api/uploadimage.do?token='+getCookieValue('token'),
        data : oMyForm,
        type : "POST",
        enctype: 'multipart/form-data',
        processData: false, 
        contentType:false,
        beforeSend: function() {
            //$(".fileLoaderIng").show();
        },
        uploadProgress: function(event, position, total, percentComplete) {
            /*var percentVal = percentComplete + '%';
            bar.width(percentVal);
            percent.html(percentVal);*/
        },
        success : function(result) {
            console.log(result)

            if (result.code != 0) {
                $.alert(result.message)
                return
            }
            var $photoUrl = $('#photoUrl');
            imgAuto($photoUrl,result.data);
            loadimg = false;
            $.closePanel();
        },
        error : function(result){
            $(".fileLoaderIng").hide();
            $(".fileLoader").val("");
            $.alert("上传失败，请重试！");
        }
    });
}