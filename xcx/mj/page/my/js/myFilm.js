var hasNextPage = false;
var currPageNum = 0;
var loading = false;

$(function(){
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

    //取消事件
    $('body').on('click','.cancel-order', function(event){
        cancelOrder(this);
    });

    // $('body').on('click', '.bookmovie li', function(event){
    //     var saleBillId = $(this).attr('data-saleBillId');
    //    location.href = '/mj/page/vip/filmPay.html?saleBillId='+saleBillId;
    // });



    $.showPreloader();
    appIni.sinUserShow(function(data){
        queryMyMovie();
    });
});

function queryMyMovie(){
    ajaxCGI({
        dire: "cinema/",
        url:'orderList',
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
                var btnHtml = '';
                if(item.status == 1){
                    btnHtml = '<a href="" class="button button-fill button-success cancel-order" data-saleBillId="'+item.saleBillId+'">退订</a>';
                }

                var html = '<li data-saleBillId="'+item.saleBillId+'">\
                                <div class="code"></div>\
                                <div class="moviename">'+item.film.name+'</div>\
                                <div class="movietext">\
                                    <div><span class="mtleft">影院名称：</span><p>'+item.organName+'</p></div>\
                                    <div><span class="mtleft">影厅名称：</span><p>'+item.hallName+'（'+item.film.dimensional+'）</p></div>\
                                    <div><span class="mtleft">放映开始时间：</span><p>'+item.startTime+'</p></div>\
                                    <div><span class="mtleft">放映结束时间：</span><p>'+item.endTime+'</p></div>\
                                    <div><span class="mtleft">状态：</span><p class="showStatus">'+item.showStatus+'</p></div>\
                                    <div class="detail-a"><a href="/mj/page/vip/filmPay.html?saleBillId='+item.saleBillId+'" external>查看订单详情</a></div>\
                                </div>' + btnHtml + '\
                            </li>';
                $('.bookmovie').append(html);
                $('.bookmovie').find('.code').eq(i).empty().barcode(item.code, "code128",{barWidth:2, barHeight:60,showHRI:false});
            }

            hasNextPage = data.hasNextPage;
            loading = false;
            $.hidePreloader();
        }
    });
}

function cancelOrder(dom){
    $.confirm('是否确定取消', function(){
        $.showPreloader();
        var saleBillId = $(dom).attr('data-saleBillId');
        ajaxCGI({
            dire: "cinema/",
            url:'releaseSeats',
            jsonData:{
                saleBillId:saleBillId
            },
            success:function(data){
                $(dom).parent().find('.showStatus').html('已取消');
                $(dom).hide();
                $.hidePreloader();
            }
        });
    });
}