import fetch from 'dva/fetch';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    var error = new Error("网络异常, 请稍候再试!");
    error.response = response;
    throw error;
}

export default function requestUrl(url, options, callback) {
    let requestUrl = url;
    if (options.method === 'GET') {
        if (options.body) {
            var keys = Object.keys(options.body);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = options.body[key];
                if (i == 0 && requestUrl.indexOf('?') <= 0) {
                    requestUrl = requestUrl + '?' + key + '=' + value;
                } else {
                    requestUrl = requestUrl + '&' + key + '=' + value;
                }
            }
            delete options.body;
        }
    }
    if (options.method === 'POST') {
        var body = options.body;
        var string = JSON.stringify(body);
        options.body = string;
    }
    return fetch(requestUrl, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
            if (data.code == 0) {
                if (callback && callback.success) {
                    callback.success(data);
                }
            } else {
                var error = data.message ? data.message : "网络异常, 请稍候再试!";
                console.log(error);
                if (callback && callback.error) {
                    callback.error(error);
                }
            }
            return { data };
        })
        .catch(err => {
            console.log(err);
            var error = "网络异常, 请稍候再试!";
            if (callback && callback.error) {
                callback.error(error);
            }
            return { error };
        });
}