var organId = GetQueryString('organId');
var mySwiper;

$(function(){
    if(organId == null || organId == ""){
        $.alert("缺失参数：网吧ID");
        return false;
    }

    $.showPreloader();
    mySwiper = new Swiper('.swiper-container', {
        //initialSlide:2,
        //height: 410,
        //width: 100,
        slidesPerView: 3.5,
        spaceBetween: 15,
        centeredSlides: true,
        observer:true,
        on: {
            click: function () {
                var activeIndex = this.activeIndex;
                var clickedIndex = this.clickedIndex;

                if(activeIndex == clickedIndex){
                    var side = this.clickedSlide;
                    var filmCode = $(side).attr('data-film_code');
                    showFilmDetail(organId, filmCode);
                }else{
                    this.slideTo(clickedIndex);
                }
            },
            doubleTap: function(event){
                var side = this.clickedSlide;
                var filmCode = $(side).attr('data-film_code');
                showFilmDetail(organId, filmCode);
            },
            slideChange: function(){
                var activeIndex = this.activeIndex;
                var filmCode = $('.swiper-slide')[activeIndex].dataset.film_code;
                var imdbScore = $('.swiper-slide')[activeIndex].dataset.imdb_score;
                var filmName = $('.swiper-slide')[activeIndex].dataset.film_name;
                queryFilmPlan(filmCode, filmName, imdbScore);
            }
        }
    });

    queryCinemaDetail(organId);
});

function queryCinemaDetail(organId){
    ajax({
        url: '/xcx/queryCinemaDetail.do',
        type: 'POST',
        data:{'organId':organId},
        success:function(data){
            var organInfo = data.organInfo;
            $('title').html(organInfo.organName);
            $('#stgName').html(organInfo.organName);
            $('#address').html(nullF(organInfo.address));
            $('#stgPhone').attr('href','tel:'+organInfo.telephone);

            if(data.filmList){
                $(data.filmList).each(function(index, obj){
                    var filmCode = obj.filmCode;
                    var imdbScore = obj.imdbScore;
                    var filmName = obj.filmName;
                    mySwiper.appendSlide(
                        '<div class="swiper-slide" data-film_code="'+filmCode+'" data-imdb_score="'+imdbScore+'" data-film_name="'+filmName+'">' +
                        '   <img src="'+obj.previewPoster+'" alt="'+obj.filmName+'">' +
                        '</div>');

                    if(index == 0){
                        queryFilmPlan(filmCode, filmName, imdbScore);
                    }
                });
            }else{
                $.hidePreloader();
            }
        }
    });
}

function queryFilmPlan(filmCode, filmName, imdbScore){
    $('#filmName').html(filmName);
    $('#score').html(imdbScore + '分');

    $('#plan-title').empty();
    $('#plan-content').empty();

    if($('body').find('.modal').length == 0){
        $.showPreloader();
    }
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

function selectSeat(showEndTime, url){
    var currDate = new Date();
    var stopDate = new Date(showEndTime.replace(/-/g,"/"));
    if(currDate.getTime() >= stopDate.getTime()){
        $.alert('该场次已停止售票');
        return;
    }
    location.href = url;
}

function showFilmDetail(organId, filmCode){
    location.href = 'filmDetail.html?organId='+organId+'&filmCode='+filmCode;
    //$.router.load('#filmDetail');
}