import React from 'react';
import * as app from '../utils/app'
import * as netbarService from '../services/NetbarService';
import queryString from 'query-string'
import './ChangeNickNamePage.css'

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


class ChangeNickNamePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nickName: ''
        }
    }

    componentDidMount() {
        document.title = "修改昵称";
    }

    submit() {
        var nickName = this.state.nickName;
        if (nickName.length == 0) {
            Toast.warn("请输入昵称!");
            return;
        }
       
        var that = this;
        netbarService.editUserInfo({nickName: nickName} , {
            success: function (data) {
                Toast.success("密码昵称成功!");
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
                            <Label>昵称</Label>
                        </CellHeader>
                        <CellBody>
                            <Input placeholder="输入昵称" onChange={e => {
                                that.setState({ nickName: e.target.value});
                            }}/>
                        </CellBody>
                    </Cell>
                </Cells>

                <div className="userinfo_submit_button">
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

export default ChangeNickNamePage;