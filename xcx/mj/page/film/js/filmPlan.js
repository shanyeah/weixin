var organId = GetQueryString('organId');
var filmCode = GetQueryString('filmCode');

$(function(){
    if(organId == null || filmCode == null){
        $.alert('缺少参数');
        return;
    }

    queryFilmPlan();
});

function queryFilmPlan(){
    $.showPreloader();
    ajax({
        url:'/xcx/queryFilmSchedule.do',
        type: 'POST',
        data:{
            'organId':organId,
            'filmCode':filmCode
        },
        success:function(data){
            //更新排期
            $(data).each(function(index, obj){
                var tabIndex = index;
                var active = '';
                if(tabIndex == 0){
                    active = 'active';
                }

                var tabContentId = 'tab' + tabIndex;
                var dateStr = obj.showDate;

                var tabTitle = '<a href="#'+tabContentId+'" class="tab-link button '+active+'">'+dateStr+'</a>';
                $('#plan-title').append(tabTitle);

                var tabContent =
                    '<div id="tab'+tabIndex+'" class="tab '+active+'">'+
                    '   <div class="list-block">'+
                    '       <ul>'+
                    '       </ul>'+
                    '   </div>'+
                    '</div>';;
                $('#plan-content').append(tabContent);

                var scheduleList = obj.scheduleList;
                $(scheduleList).each(function(index, schedule){
                    var showStartTime = schedule.showStartTime;
                    var showEndTime = schedule.showEndTime;
                    var lang = schedule.lang;
                    var dimensional = schedule.dimensional;
                    var hallName = schedule.hallName;
                    var scheduleId = schedule.scheduleId;
                    var price = schedule.price;

                    var areaList = schedule.areaInfoList;
                    var areaNames = '';
                    $(areaList).each(function(index, area){
                        if(index == 0){
                            areaNames = area.areaName;
                        }else{
                            areaNames += '/' + area.areaName;
                        }
                    });

                    var buyUrl = 'selectSeat.html?organId='+organId
                        +'&filmCode='+filmCode
                        +'&scheduleId='+scheduleId;

                    var li =
                        '<li class="item-content">'+
                        '    <div class="item-inner">'+
                        '        <div class="item-title row">'+
                        '            <div class="div-time">'+
                        '                <div class="startDate">'+showStartTime.substring(11 ,16)+'</div>'+
                        '                <div class="sub-font endDate">'+showEndTime.substring(11 ,16)+' 结束</div>'+
                        '             </div>'+
                        '             <div class="div-add">'+
                        '                <div class="language">'+lang+' '+dimensional+'</div>'+
                        '                <div class="sub-font">'+hallName+'</div>'+
                        '            </div>'+
                        '            <div class="div-price">'+
                        '                <div class="total-price">'+price+'元</div>'+
                        '            </div>'+
                        '        </div>'+
                        '        <div class="item-after">'+
                        '            <div class="buy"><a class="button button-warning" onclick="selectSeat(\''+showEndTime+'\', \''+buyUrl+'\')">选座购票</a></div>'+
                        '        </div>'+
                        '    </div>'+
                        '</li>';
                    $('#tab'+tabIndex+' ul').append(li);

                    $('#plan-title').scrollTop();
                });
            });
            $.hidePreloader();
        }
    });
}

function selectSeat(stopSellingTime, url){
    var currDate = new Date();
    var stopDate = new Date(stopSellingTime.replace(/-/g,"/"));
    if(currDate.getTime() >= stopDate.getTime()){
        $.alert('该场次已停止售票');
        return;
    }
    location.href = url;
}