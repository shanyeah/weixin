import fetch from 'dva/fetch';

function server() {
  if (window.ldx_dev) {
    return 'http://local.api.liandaxia.com/';
  } 
  return 'http://api.liandaxia.com/';
}

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

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, callback) {
  let requestUrl = server() + url;
  let storage = window.localStorage;
  let token = storage['ldx_token'];
  if (token) {
    requestUrl = requestUrl + '?token=' + token;
  }

  if (options.method === 'GET') {
    if (options.body) {
      var keys =  Object.keys(options.body);
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
      if(window.ldx_dev) {
        console.log(data);
      }
      
      if (data.code == 0) {
        if (callback && callback.success) {
          callback.success(data);
        }
      } else { 
        if (data.code == 90006 || data.code == 90024) {
            window.localStorage.removeItem("ldx_userInfo");
            window.localStorage.removeItem("ldx_token");
            window.localStorage.removeItem("ldx_stgId");
        }
        var error = data.message ? data.message : "网络异常, 请稍候再试!";
        console.log(error);
        if (callback && callback.error) {
          callback.error(error);
        }
        if (callback && callback.detailError) {
          callback.detailError(data);
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




