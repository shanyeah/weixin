var organId = GetQueryString('organId');
var filmCode = GetQueryString('filmCode');
var scheduleId = GetQueryString('scheduleId');
var priceMap = {};

//localStorage.setItem('ldx_token', '1004822983-8bd5b77026354d94a8b1124ba8dd6797');

$(function(){
    if(organId == "" || filmCode == '' || scheduleId == ''){
        $.alert("查询请求缺失参数");
        return false;
    }

    //查询座位
    $.showPreloader();
    ajax({
        url:'/xcx/queryHallSeats.do',
        type: 'POST',
        data:{
            organId:organId,
            filmCode:filmCode,
            scheduleId:scheduleId
        },
        success:function(data){

            $('#filmName').html(data.filmName + '(' + data.lang + ')');
            $('#showDateTime').html(data.showStartTime);
            $('#dimensional').html(data.dimensional);
            $('#hallName').html(data.hallName + '(' + data.dimensional + ')');

            showAllSeats(data);
            if(token == null || token == ''){
                $.hidePreloader();
                return;
            }

            //查询是否有未支付的订单
            ajax({
                url: "/xcx/getLockFilmSaleBill.do",
                type: "POST",
                data:{
                    organId:organId
                },
                success:function(data){
                    $.hidePreloader();
                    if(data.saleBillId != null){
                        confirmUnPay(data);
                    }
                }
            });
        }
    });

    //选中座位
    $('body').on('click','.seatArea .seat-active', function(event){
        if($('.selected-seat').length >= 6){
            $.alert('一次最多选择6个座位');
            return;
        }
        $(this).removeClass('icon-kongxianzuowei seat-active');
        $(this).addClass('icon-kongxianzuoweishixin seat-selected');
        selectSeat(this);
    });

    //座席中取消选座
    $('body').on('click','.seatArea .seat-selected', function(event){
        $(this).removeClass('icon-kongxianzuoweishixin seat-selected');
        $(this).addClass('icon-kongxianzuowei seat-active');
        cancelSeat(this);
    });

    //已选列表中取消选座
    $('body').on('click','.div-select-seat .selected-seat', function(event){
        var seat = JSON.parse($(this).data().json);
        var seatCode = seat.seatCode;
        $('#'+seatCode).find('.seat-selected').trigger('click');
    });
});

function cancelSeat(dom){
    var seat = JSON.parse($(dom).parent().data().json);
    var seatCode = seat.seatCode;

    $('.selected-seat').each(function(index, dom){
        var selectedSeat = JSON.parse($(dom).data().json);
        var selectedSeatCode = selectedSeat.seatCode;
        if(selectedSeatCode == seatCode){
            $(dom).remove();
            return false;
        }
    });
    calTotalPrice();
    hideOrShowPrice();

}

function selectSeat(dom){
    var seat = JSON.parse($(dom).parent().data().json);
    var seatName = seat.rowId + '排' + seat.columnId + '座';

    var area = priceMap[seat.areaId];
    var json = {
        seatCode: seat.seatCode,
        areaServiceFee: area.areaServiceFee,
        areaSettlePrice: area.areaSettlePrice,
        totalPrice: area.totalPrice,
        rowId: seat.rowId,
        columnId: seat.columnId
    };
    var jsonData = JSON.stringify(json);
    $('.div-select-seat').append('<div class="selected-seat" data-json=\''+jsonData+'\' ><div>'+seatName+'</div><div class="cancel">×</div></div>');

    calTotalPrice();
    hideOrShowPrice();
}

//计算选座的总价
function calTotalPrice(){
    var totalPrice = 0;

    $('.selected-seat').each(function(index, dom){
        var seat = JSON.parse($(dom).data().json);
        totalPrice += parseInt(seat.totalPrice);
    });

    $('#total-price').html(totalPrice.toFixed(2));
}

//控制价格行是否显示
function hideOrShowPrice(){
    if($('.selected-seat').length > 0){
        $('.seat_price').show();
    }else{
        $('.seat_price').hide();
    }
    var height = $('.film-info').height();
    $('.seats').css('margin-top', (height + 30) + 'px');
}

//显示所有座位
function showAllSeats(data){
    $(data.priceList).each(function(index, map){
        var areaId = map.areaId;
        priceMap[areaId] = map;
    });

    var seatList = data.seatList;
    if(seatList == null || seatList.length == 0){
        $.alert('没有座位信息');
    }

    var maxleft = 0;
    var maxY = 0;

    var unit = 25;
    $(seatList).each(function(index, seat){

        var left = (seat.x-1) * unit;
        var top = (seat.y-1) * unit;

        var seatStatus = seat.status;
        var iconCss = '';
        if(seatStatus == 'open'){
            iconCss = 'icon-kongxianzuowei seat-active';
        }else if(seatStatus == 'locked' || seatStatus == 'booked' || seatStatus == 'selled' || seatStatus == 'damaged'){
            iconCss = 'icon-kongxianzuoweishixin seat-disabled';
        }

        var jsonData = JSON.stringify(seat);
        var seatCode = seat.seatCode;
        $('.seatArea').append('<div id="'+seatCode+'" class="absolute" style="left:'+left+'px; top:'+top+'px" data-json=\''+jsonData+'\'><i class="icon iconfont icon-seat '+iconCss+'"></i></div>');

        if(left > maxleft){
            maxleft = left;
        }

        if(parseInt(seat.y) > parseInt(maxY)){
            maxY = seat.y;
        }
    });

    $('.seats > div').css('width', (maxleft+50) + 'px');

    for(var i=0; i<maxY; i++){
        var numTop = i * unit;
        $('.side').append('<div style="top:'+numTop+'px">'+(i+1)+'</div>');
    }
}

//提交订单
function submit(){
    //判断是否登陆
    if(token == null || token == ''){
        $.alert('会员还未登录');
        return;
    }

    $.showPreloader();

    //座位信息
    var seatCodeList = [];

    $('.selected-seat').each(function(index, dom){
        var seat = JSON.parse($(dom).data().json);

        var seatObj = {
            seatCode: seat.seatCode,
            areaSettlePrice: seat.areaSettlePrice,
            areaServiceFee: seat.areaServiceFee,
            rowId: seat.rowId,
            columnId: seat.columnId
        };
        seatCodeList.push(seatObj);

    });

    var reqParam = {
        organId: organId,
        scheduleId: scheduleId,
        seatCodeList: seatCodeList
    };

    ajax({
        url:'/xcx/lockHallSeats.do',
        type: "POST",
        data: reqParam,
        handleSelf: true,
        success:function(data){
            $.hidePreloader();
            if(data.code == 0){
                var url = redirectOpenIdUrl('/xcx/mj/page/film/filmBillDetail.html?saleBillId='+data.data.saleBillId, organId);
                window.location.href = url;
            }else if(data.code == 90030){ //有未支付的订单
                confirmUnPay();
            }else{
                $.alert(data.message==''?'访问接口出错！':data.message);
            }
        }
    });
}

//弹出提示有未支付的订单
function confirmUnPay(){
    $.confirm('您有未支付的订单，请先完成支付', function() {
        $.showPreloader();
        ajax({
            url:'/xcx/getLockFilmSaleBill.do',
            type: "POST",
            data: { organId: organId },
            success:function(data){
                var url = redirectOpenIdUrl('/xcx/mj/page/film/filmBillDetail.html?saleBillId='+data.saleBillId, organId);
                window.location.href = url;
            }
        });
    });
}