var currPageNum = 0;
var loading = false;

//localStorage.setItem('ldx_token', '1004822983-8bd5b77026354d94a8b1124ba8dd6797');

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

    $.showPreloader();
    queryMyMovie();

});

$.init();

function queryMyMovie(){
    ajax({
        url:'/xcx/queryMyMovieBillList.do',
        type: 'POST',
        data:{
            pageNum:++currPageNum,
            pageSize:20
        },
        success:function(data){
            if(data.total == 0 && currPageNum == 1){
                // 删除无数据的提示
                $(".blankTips").show();
            }

            //当前页数=总记录数，则不可再翻页
            if(data.pageNum == data.pages){
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($('.infinite-scroll'));
                // 删除加载提示符
                $('.infinite-scroll-preloader').remove();
            }

            for (var i = 0; i < data.size; i++) {
                var item = data.list[i];
                var btnHtml = '';
                if(item.status == 0){
                    btnHtml = '<a href="" class="button button-fill button-success cancel-order" data-saleBillId="'+item.saleBillId+'">退订</a>';
                }

                var html =
                    '<li>'+
                    '   <a href="#" onclick="queryBillDetail('+item.saleBillId+','+item.status+','+item.itemType+','+item.organId+')" class="item-content">'+
                    '       <div class="item-media"><img src="'+item.previewPoster+'" style="width: 4rem;"></div>'+
                    '       <div class="item-inner">'+
                    '           <div class="item-title-row">'+
                    '               <div class="item-title">'+item.filmName+'</div>'+
                    '               <div class="item-after incomeAmount">￥ '+item.incomeAmount.toFixed(2)+'</div>'+
                    '           </div>'+
                    '           <div class="item-subtitle">数量：'+item.quantity+'<div class="showStatus">'+item.showStatus+'</div></div>'+
                    '           <div class="item-subtitle">影院：'+item.organName+'</div>'+
                    '           <div class="item-subtitle">影厅：'+item.hallName+'</div>'+
                    '           <div class="item-subtitle">场次：'+item.showStartTime+'</div>'+
                    '       </div>'+
                    '   </a>'+
                    '</li>';
                $('.filmList ul').append(html);
            }

            loading = false;
            $.hidePreloader();
        }
    });
}

/**
 *
 * @param saleBillId 销售单号
 * @param status 状态：0待支付，1已支付，2已取消，3已退款
 * @param itemType 类型：3同步厅,4包房观影
 * @returns {boolean}
 */
function queryBillDetail(saleBillId, status, itemType, organId){
    var url = '/xcx/mj/page/film/filmBillDetail.html?saleBillId=';
    if(itemType == 4){
        url = '/xcx/#/movieBookDetail?saleBillId=';
    }

    if(status == 0){
        if(organId == null || organId == ''){
            $.alert('缺少参数organId');
            return false;
        }

        var url = redirectOpenIdUrl(url + saleBillId, organId);
        window.location.href = url;

    }else{
        window.location.href = url + saleBillId;
    }
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