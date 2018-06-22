import React from 'react';
import * as app from '../utils/app'
import * as loginService from '../services/LoginService'
import queryString from 'query-string'
import IconEdit from '../assets/edit.png'
import IconLock from '../assets/lock.png'
import IconLogout from '../assets/logout.png'

import { Modal,Toast } from 'antd-mobile';
import {
    Panel,
    PanelHeader,
    PanelBody,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Button
} from 'react-weui';

class SettingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "设置";
    }

    logout() {
        var that = this;
        loginService.logout({
            success: function(res) {
                window.localStorage.removeItem("ldx_userInfo");
                window.localStorage.removeItem("ldx_token");
                window.localStorage.removeItem("ldx_stgId");
                Toast.success("退出登录成功!");
                that.props.history.push("/");
            }, 
            error: function(error) {
                Toast.fail(error);
            }
        })
    }

    render() {
        var that = this;
        return (
            <div className='page'>
                <Panel>
                        <Cell style={{ fontSize: "16px" }} access onClick={e=>{

                            that.props.history.push("./changeuserinfo");
                        }}>
                            <CellHeader>
                                <img src={IconEdit} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>修改昵称</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>
                        <Cell style={{ fontSize: "16px" }} access onClick={e=>{
                            that.props.history.push("./changepassword");
                        }}>
                            <CellHeader>
                                <img src={IconLock} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>重设密码</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>

                        <Cell style={{ fontSize: "16px" }} access onClick={e=>{
                                Modal.alert('提示', '确认退出登录?', [
                                    { text: '取消', onPress: () => {}, style: 'default' },
                                    { text: '确定', onPress: () => {
                                         that.logout();
                                    }},
                                  ]);
                        }}>
                            <CellHeader>
                                <img src={IconLogout} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>退出登录</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>
                </Panel>

            </div>
        );
    }
}

export default SettingPage;