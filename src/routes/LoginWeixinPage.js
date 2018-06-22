import React from 'react';
import * as app from '../utils/app'
import * as loginService from '../services/LoginService';
import queryString from 'query-string'

class LoginWeixinPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(options) {
        var param = queryString.parse(this.props.location.search);
        this.state.organId = param.organId;
        this.state.type = param.type;
        if (param.code) {
            // this.getOpenId(param.code);
            var url = '/';
            if (param.type == 'order') {
                url = app.getGoodsOrderUrl() + '?saleBillId=' + param.saleBillId + '&token=' + app.getToken() + "&code" + param.code;
            } else if(param.type == 'charge') {
                url = '/charge?organId=' + param.organId + '&organName=' + param.organName + "&code" + param.code;
            }
            window.location.href = url;
        } else {
            // var uri = window.location.href;
            var uri = 'http://www.liandaxia.com/#/xcx/loginWeixin?type=' + param.type;
            var codeUrl = "http://api.liandaxia.com/wx/code.do?organId=" + param.organId;
            
            if (param.saleBillId) {
                codeUrl += ('&saleBillId=' + param.saleBillId);
            }
            codeUrl += ("&uri=" + encodeURIComponent(uri));
            console.log(codeUrl);
            window.location.replace(codeUrl);
        }
    }

    getOpenId(code) {
        var that = this;
        loginService.getOpenId({code: code}, {
            success: function(data) {
                var openo
                console.log(data);
                app.addCookie('openId', data.data.openId, 360, '/');
                that.props.history.push("/");
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    render() {
        return (
            <div className='page'>

            </div>
        );
    }
}

export default LoginWeixinPage;