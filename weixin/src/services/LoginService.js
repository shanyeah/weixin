import request from '../utils/request';
import requestUrl from '../utils/requestUrl';

export function login({ mobile, password }, callback) {
    window.localStorage.removeItem("ldx_userInfo");
    window.localStorage.removeItem("ldx_token");
    window.localStorage.removeItem("ldx_stgId");
    var body = {mobile: mobile, password: password};
    return request(`xcx/login.do`, { method: "POST", body }, callback);
}

export function logout(callback) {
    var body = {};
    return request(`xcx/logout.do`, { method: "POST", body }, callback);
}

export function getCode({ mobile, type }, callback) {
    var body = { mobile: mobile, type: type };
    return request(`xcx/sendSms.do`, { method: "POST", body }, callback);
}

export function resetPassword({mobile, code, password}, callback) {
    var body = { mobile: mobile, code: code,  password: password};
    return request(`xcx/resetPassword.do`, { method: "POST", body }, callback);
}

export function getOpenId({code}, callback) {
    var body = { code: code };
    return requestUrl(`http://api.mjdj.cn/jssdk/getOpenId.do`, { method: "POST", body }, callback);
}
