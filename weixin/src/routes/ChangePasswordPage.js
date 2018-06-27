import React from 'react';
import * as app from '../utils/app'
import * as loginService from '../services/LoginService';
import queryString from 'query-string'
import './ChangePasswordPage.css'

import {
    Panel,
    PanelHeader,
    PanelBody,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Button,
    Label,
    Input
} from 'react-weui';

import { Toast } from 'antd-mobile';



class ChangePasswordPage extends React.Component {

    constructor(props) {
        super(props);
        var userInfo = app.getUserInfo();
        console.log(userInfo);
        
        this.state = {
            mobile: userInfo.mobile,
            code: '',
            password: ''
        }
    }

    componentDidMount() {
        document.title = "修改密码";
    }

    submit() {
        var mobile = this.state.mobile;
        var code = this.state.code;
        var password = this.state.password;
        if (mobile.length == 0) {
            Toast.warn("请输入手机号!");
            return;
        }
        if (code.length == 0) {
            Toast.warn("请输入验证码!");
            return;
        }
        if (password.length == 0) {
            Toast.warn("请输入密码!");
            return;
        }
       
        var that = this;
        loginService.resetPassword({mobile: mobile, code:code, password: password} , {
            success: function (data) {
                Toast.success("密码修改成功!");
                that.props.history.goBack();
            },
            error: function (error) {
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
        loginService.getCode({mobile: mobile, type:3} , {
            success: function (data) {
                console.log(data);
                Toast.success("发送验证码成功!", 1);
            },
            error: function (error) {
                Toast.fail(error, 1);
            }
        });
    }



    render() {
        var that = this;
        return (
            <div className='page'>
                <Cells>
                    <Cell>
                        <CellHeader>
                            <Label>手机号</Label>
                        </CellHeader>
                        <CellBody>
                            {this.state.mobile}
                        </CellBody>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>验证码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" placeholder="输入验证码" onChange={e => {
                                that.setState({ code: e.target.value });
                            }}/>
                        </CellBody>
                        <CellFooter>
                            <Button className="password_send_button" type="vcode" onClick={e => {
                                that.getCode();
                            }}>获取验证码</Button>
                        </CellFooter>
                    </Cell>
                    <Cell>
                        <CellHeader>
                            <Label>密码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="password" placeholder="输入新密码" onChange={e => {
                                that.setState({ password: e.target.value});
                            }}/>
                        </CellBody>
                    </Cell>
                </Cells>

                <div className="password_submit_button">
                    <Button onClick={e => {
                        that.submit();
                        }}>
                        确认
                    </Button>
                </div> 

            </div>
        );
    }
}

export default ChangePasswordPage;