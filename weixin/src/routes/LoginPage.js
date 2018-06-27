import React from 'react';
import './LoginPage.css'
import {
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Label,
    Input,
    Button
} from 'react-weui';

import { Toast } from 'antd-mobile';

import * as loginService from '../services/LoginService';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: "",
            password: "",
            loading: false,
            showToast: false,
            msg: "",
        };
    }

    componentDidMount() {
        document.title = "登录";
    }

    login() {
        var mobile = this.state.mobile;
        var password = this.state.password;
        if (mobile.length == 0) {
            this.showToast("请输入手机号!");
            return;
        }
        if (password.length == 0) {
            this.showToast("请输入密码!");
            return;
        }
        var that = this;
        Toast.loading("登录中...", 30, () => {
        });
        loginService.login({ mobile: mobile, password: password }, {
            success: function (data) {
                var userInfo = data.data;
                var token = userInfo.token;
                var localStorage = window.localStorage;
                localStorage.setItem("ldx_userInfo", JSON.stringify(userInfo));
                localStorage.setItem("ldx_token", token);
                that.setState({ loading: false });
                Toast.success("登录成功!");
                // that.props.history.push("/loginWeixin");
                // that.props.history.push("/");
                that.props.history.goBack();
            },
            error: function (error) {
                that.setState({ loading: false });
                Toast.fail(error);
            }
        });
    }

    getCode() {
        var mobile = this.state.mobile;
        if (mobile.length == 0) {
            Toast.warn("请输入手机号!");
            return;
        }
        var that = this;
        this.setState({loading: true});
        loginService.getCode({mobile: mobile, type:1} , {
            success: function (data) {
                console.log(data);
                that.setState({ loading: false });
                Toast.success("发送验证码成功!", 1);
            },
            error: function (error) {
                that.setState({ loading: false });
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        var that = this;
        return (
            <div className="page">
                <img src={require('../assets/login_logo.png')} className='login_logo'></img>

                <Cells>
                    <Cell>
                        <CellHeader>
                            <Label>手机号</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="tel" placeholder="输入手机号" onChange={e => {
                                that.setState({ mobile: e.target.value});
                            }}/>
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" placeholder="输入密码" onChange={e => {
                                that.setState({ password: e.target.value });
                            }}/>
                        </CellBody>
                        <CellFooter>
                            <Button className="login_send_button" type="vcode" onClick={e => {
                                that.getCode();
                            }}>获取验证码</Button>
                        </CellFooter>
                    </Cell>
                </Cells>

                <div className="login_button">
                    <Button onClick={e => {
                        that.login();
                        }}>
                        登录
                    </Button>
                </div>    
            </div>

        );
    }
}

export default LoginPage;
