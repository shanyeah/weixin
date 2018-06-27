var organId = GetQueryString('organId');
var filmCode = GetQueryString('filmCode');

$(function(){
    if(organId == null || filmCode == null){
        $.alert('缺少参数');
        return;
    }

    $('.btn-buy').click(function(){
        location.href = '/xcx/mj/page/film/filmPlan.html?organId='+organId+'&filmCode='+filmCode;
    });

    showHideBar();
    queryFilmDetail();
});

function showHideBar(){

    $('.film-desc').toggleClass('fix-height');
    $('.show-more').hide();

    $('.show-more').click(function(){
        $('.film-desc').toggleClass('fix-height');
        if($('.film-desc').hasClass('fix-height')){
            $(this).find('.iconfont').removeClass('icon-fold');
            $(this).find('.iconfont').addClass('icon-unfold');
        }else{
            $(this).find('.iconfont').removeClass('icon-unfold');
            $(this).find('.iconfont').addClass('icon-fold');
        }
    });
}

function queryFilmDetail(){
    $.showPreloader();
    ajax({
        url:'/xcx/queryFilmDetail.do',
        type: "POST",
        data:{
            'organId':organId,
            'filmCode':filmCode
        },
        success:function(data){
            $('.header-name').html(data.filmName);
            $('.movie-img img').attr('src', data.previewPoster);
            $('.movie-background').css('background-image', 'url('+data.previewPoster+')');
            $('.filmName').html(data.filmName);
            $('.imdbScore').html(data.imdbScore);
            $('.dimensional').html(data.dimensional);
            $('.lang').html(data.lang);
            $('.duration').html(data.duration);
            $('.directors').html(data.directors);
            $('.actors').html(data.actors);
            $('.film-desc').html(data.detailDesc);

            $.hidePreloader();
        }
    });
}