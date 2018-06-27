import request from '../utils/request';

export function loadAd({ type }, callback) {
    var body = { type: type };
    return request(`xcx/queryAppAdList.do`, { method: "GET", body }, callback);
}

export function queryNearbyNetbar({ pageNum, name, latitude, longitude, serviceCode, orderBy }, callback) {
    var body = { pageNum: pageNum, latitude: latitude, longitude: longitude, orderBy: 0};
    if (name && name.length > 0) {
        body.name = name;
    }
    if (serviceCode && serviceCode.length > 0) {
        body.serviceCode = serviceCode;
    }
    if (orderBy) {
        body.orderBy = orderBy;
    }

    return request(`xcx/queryNearbyNetbar.do`, { method: "POST", body }, callback);
}

export function queryNetbarDetail({ organId, latitude, longitude }, callback) {
    var body = { latitude: latitude, longitude: longitude };
    if (organId > 0) {
        body.organId = organId;
    }
    return request(`xcx/netbarDetail.do`, { method: "POST", body }, callback);
}

export function queryNetbarReviewList({ organId, pageNum }, callback) {
    var body = { organId: organId, pageNum: pageNum };
    return request(`xcx/queryNetbarReviewList.do`, { method: "POST", body }, callback);
}

export function followNetbar({ organId }, callback) {
    var body = { organId: organId, type: 0 };
    return request(`xcx/followNetbar.do`, { method: "POST", body }, callback);
}

export function unfollowNetbar({ organId }, callback) {
    var body = { organId: organId, type: 1 };
    return request(`xcx/followNetbar.do`, { method: "POST", body }, callback);
}

export function addReview(params, callback) {
    var body = params;
    return request(`xcx/saveNetbarReview.do`, { method: "POST", body }, callback);
}

export function queryChargePresentList({ organId }, callback) {
    var body = {organId: organId};
    return request(`xcx/queryChargePresentList.do`, { method: "GET", body }, callback);
}

export function charge(params, callback) {
    var body = params;
    return request(`xcx/userSelfRechange.do`, { method: "POST", body }, callback);
}

export function queryFollowNetbarList({ serviceCode, pageNum, latitude, longitude }, callback) {
    var body = { serviceCode: serviceCode, pageNum: pageNum, latitude: latitude, longitude: longitude };
    return request(`xcx/queryFollowNetbarList.do`, { method: "POST", body }, callback);
}

export function queryMyInfo(callback) {
    var body = {};
    return request(`xcx/myCenter.do`, { method: "POST", body }, callback);
}

export function queryMyWallet(params, callback) {
    var body = params;
    return request(`xcx/queryMyWallet.do`, { method: "GET", body }, callback);
}

export function queryWalletLog({walletId, pageNum}, callback) {
    var body = {walletId: walletId, pageNum: pageNum};
    return request(`xcx/queryMyWalletLog.do`, { method: "POST", body }, callback);
}

export function queryMyOrderList({pageNum}, callback) {
    var body = {pageNum: pageNum};
    return request(`xcx/queryMyGoodsBill.do`, { method: "POST", body }, callback);
}

export function editUserInfo({nickName}, callback) {
    var body = {nickName: nickName};
    return request(`xcx/editUserInfo.do`, { method: "POST", body }, callback);
}

export function queryGoodsBillDetail({ saleBillId }, callback) {
    var body = {saleBillId: saleBillId};
    return request(`xcx/queryGoodsBillDetail.do`, { method: "GET", body }, callback);
}

export function uploadImage({ fileBase64, objectType}, callback ) {
    var body = { fileBase64: fileBase64, objectType: objectType };
    return request(`xcx/uploadImage.do`, { method: "POST", body }, callback);
}