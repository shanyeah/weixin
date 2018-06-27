import React from 'react';
import './MineView.css'
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app';
import requestUrl from '../utils/requestUrl';
import { Toast } from 'antd-mobile';
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

import IconUser from '../assets/mine_user.png';
import IconUsrBg from '../assets/mine_bk.jpg'

import IconIdNumber from '../assets/my_id.png';
import IconPhone from '../assets/my_phone.png';
import IconWallet from '../assets/my_wallet.png';
import IconFood from '../assets/my_food.png';
import IconMoive from '../assets/my_movie.png';
import IconSetting from '../assets/setting.png';




class MineView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photoUrl: null,
            userInfo: {},
            totalBalance: 0,
            totalCashBalance: 0,
            totalPresentBalance: 0,
            wx: app.wx()
        }
    }

    componentDidMount() {

        if(app.getUserInfo()) {
            this.loadData();

            var wx = this.state.wx;
            requestUrl('http://api.liandaxia.com/jssdk/getWxConfig.do', { method: "POST", body: { url: window.location.href } }, {
                success: function (res) {
                    var data = res.data;
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: ['chooseWXPay', 'getLocation', 'hideMenuItems', 'scanQRCode', 'openLocation', 'chooseImage',
                            'previewImage']
                    });

                    wx.ready(function () {
                        
                    })
                },
                error: function (error) {

                }
            });
        } else {
            setTimeout(this.login.bind(this), 500);
        }
        
    }

    login() {
        this.props.history.push('./login');
    }

    loadData() {
        var that = this;
        netbarService.queryMyInfo({
            success: function(res) {
                var info = res.data;
                var totalBalance = (new Number(info.totalBalance)).toFixed(2);
                var totalCashBalance = (new Number(info.totalCashBalance)).toFixed(2);
                var totalPresentBalance = (new Number(info.totalPresentBalance)).toFixed(2);
                var photoUrl = info.faceImageUrl ? info.faceImageUrl : IconUser;
                that.setState({ userInfo: info, photoUrl: photoUrl, totalBalance: totalBalance, totalCashBalance: totalCashBalance, totalPresentBalance: totalPresentBalance })
            }, 
            error: function(error) {
                if(error.indexOf("登录") > 0) {
                    setTimeout(that.login.bind(that), 500);
                } else {
                    Toast.fail(error);   
                }
            }
        })
    }

    updateHeader() {
        var that = this;
        var wx = this.state.wx;
        wx.ready(function () {
            wx.chooseImage({
                success: function (res) {
                    console.log(res);
                    var localId = res.localIds[0];
                    wx.getLocalImgData({
                        localId: localId,
                        success: function (res) {
                            Toast.loading("上传中", 30);
                            var localData = res.localData.replace('jgp', 'jpeg');
                            if (localData.indexOf("data:image/jpeg;base64,") < 0) {
                                localData = "data:image/jpeg;base64," + localData;
                            }
                            netbarService.uploadImage({fileBase64: localData, objectType: 0}, {
                                success: function(res) {
                                    that.setState({ photoUrl: localData });
                                    Toast.info("修改头像成功!");
                                },
                                error: function(error) {
                                    Toast.fail(error);
                                }
                            })
                        }
                    });
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        })
    }

    render() {
        var that = this;
        return (
            <div className='page tab'>
                <div className="header_view">
                    <img className='header_background' src={IconUsrBg}></img>
                    <div className='header_content'>
                        <img className='mine_img' src={this.state.photoUrl} onClick={e=> {
                            that.updateHeader();
                        }}></img>
                        <div className='mine_name'>{this.state.userInfo.name ? this.state.userInfo.name :  '魔杰会员'} {this.state.userInfo.nickName ? '(' + this.state.userInfo.nickName + ')' : '' }</div>
                        <div className='mine_class'>

                        </div>
                        <div className='mine_detail_view'>
                        <div className='mine_money_view' onClick={e=>{
                            that.props.history.push("./mywallet");
                        }}>
                            <div>现金余额</div>
                            <div>{this.state.totalCashBalance}</div>
                        </div>
                        <div className='mine_detail_line'></div>
                        <div className='mine_money_view' onClick={e=>{
                            that.props.history.push("./mywallet");
                        }}>
                            <div>赠送余额</div>
                            <div>{this.state.totalPresentBalance}</div>
                        </div>
                        <div className='mine_detail_line'></div>
                        <div className='mine_money_view' onClick={e=>{
                            that.props.history.push("./mywallet");
                        }}>
                            <div>钱包余额</div>
                            <div>{this.state.totalBalance}</div>
                        </div>
                        </div> 
                    </div>
                </div>
                <div className="header_line"></div>

                <Panel>
                        <Cell style={{ fontSize: "16px" }}>
                            <CellHeader>
                                <img src={IconIdNumber} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>证件号</CellBody>
                            <CellFooter>{(this.state.userInfo.idNumber && this.state.userInfo.idNumber.length > 0) ? this.state.userInfo.idNumber : '暂未绑定'}</CellFooter>
                        </Cell>
                        <Cell style={{ fontSize: "16px" }}>
                            <CellHeader>
                                <img src={IconPhone} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>手机号</CellBody>
                            <CellFooter>{(this.state.userInfo.mobile && this.state.userInfo.mobile.length > 0) ? this.state.userInfo.mobile : '暂未绑定'}</CellFooter>
                        </Cell>
                </Panel>

                <Panel>
                        <Cell style={{ fontSize: "16px" }} access onClick={e=>{
                            that.props.history.push("./mywallet");
                        }}>
                            <CellHeader>
                                <img src={IconWallet} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>我的钱包</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>
                        <Cell style={{ fontSize: "16px" }} access onClick={e=>{
                            that.props.history.push("./myorderlist");
                        }}>
                            <CellHeader>
                                <img src={IconFood} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                            </CellHeader>
                            <CellBody>我的点餐</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>

                        <Cell style={{ fontSize: "16px" }} access onClick={e => {
                            window.location.href = app.getMovieOrderListUrl();
                        }}>
                            <CellHeader>
                                <img src={IconMoive} alt="" style={{ display: `block`, width: `20px`, marginRight: `10px` }} />
                            </CellHeader>
                            <CellBody>我的电影</CellBody>
                            <CellFooter></CellFooter>
                        </Cell>
                </Panel>

                <Panel>
                    <Cell style={{ fontSize: "16px" }} access onClick={e=>{
                            that.props.history.push("./setting");
                        }}>
                        <CellHeader>
                            <img src={IconSetting} alt="" style={{display: `block`, width: `20px`, marginRight: `10px`}}/>
                        </CellHeader>
                        <CellBody>设置</CellBody>
                        <CellFooter></CellFooter>
                    </Cell>
                </Panel>
            
            </div>
        );
    }
}

export default MineView;