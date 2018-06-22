import request from '../utils/request';
import requestUrl from '../utils/requestUrl';

export function server() {
    if(window.ldx_dev) {
        return "http://tgxi.imovie.com.cn/";
    }
    return "http://gxi.imovie.com.cn/";
}

export function queryMovieList(params, callback) {
    var body = params;
    return requestUrl(server() + `api/movie/movieList`, { method: "GET", body }, callback);
}

export function queryMovieDetail({movieId}, callback) {
    var body = { movieId: movieId };
    return requestUrl(server() + `api/movie/movieDetail`, { method: "GET", body }, callback);
}

export function movieQueryCondition(params, callback) {
    var body = params;
    return requestUrl(server() + `api/movie/movieQueryCondition`, { method: "GET", body  }, callback);
}

export function queryMovieRoomList(params, callback) {
    var body = params;
    return requestUrl(server() + `api/stg/roomList`, { method: "GET", body  }, callback);
}

export function submitMovieSaleBill(params, callback) {
    var body = params;
    return request(`xcx/submitMovieSaleBill.do`, { method: "POST", body  }, callback);
}

export function payMovieSaleBill(params, callback) {
    var body = params;
    return request(`xcx/payMovieSaleBill.do`, { method: "POST", body  }, callback);
}

export function queryMovieSaleBillDetail(saleBillId, callback) {
    var body = {saleBillId: saleBillId};
    return request(`xcx/queryMovieSaleBillDetail.do`, { method: "POST", body  }, callback);
}

export function cancelMovieSaleBill(saleBillId, callback) {
    var body = {saleBillId: saleBillId};
    return request(`xcx/cancelMovieSaleBill.do`, { method: "POST", body  }, callback);
}

export function queryFilmSaleBillList(pageNum, callback) {
    var body = {pageNum: pageNum};
    return request(`xcx/queryFilmSaleBillList.do`, { method: "POST", body  }, callback);
}