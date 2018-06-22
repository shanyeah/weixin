import React from 'react';
import './FavoritePage.css'
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'
import { Toast } from 'antd-mobile';
import queryString from 'query-string'


import {
    SearchBar,
    Panel,
    PanelHeader,
    PanelBody,
    Cells,
    Cell,
    CellBody,
    CellFooter
} from 'react-weui';

import IconEmptyPage from '../assets/page.png';

class FavoritePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceCode: '',
            serviceName: '',
            nextPage: 1,
            hasNextPage: false,
            showFollowButton: false,
            back: 0,
            stgList: [],
            searchValue: '',
            showEmptyPage: false
        }
    }

    componentDidMount(options) {
        var params = queryString.parse(this.props.location.search);
        this.state.serviceCode = params.serviceCode;
        var serviceName = '关注';
        if (params.serviceName) {
            serviceName = params.serviceName;
        }
        var title = '选择' + serviceName + '门店';
        document.title = title;
        if (params.back) {
            this.state.back = 1;
        }
        this.loadData();
    }

    onSearchBarChange(text, e) {
        this.state.searchValue = text;
    }

    onSubmit() {
        this.setState({ stgList: [] });
        this.loadData();
    }

    onClear() {
        this.setState({ stgList: [] });
        this.state.searchValue = '';
        this.loadData();
    }

    loadData() {
        var that = this;
        var pageNum = this.state.nextPage;
        var latitude = window.localStorage.getItem("latitude");
        var longitude = window.localStorage.getItem("longitude");
        var params = { name: this.state.searchValue, serviceCode: this.state.serviceCode, pageNum: this.state.nextPage, latitude: latitude, longitude: longitude, orderBy: 1 };
        netbarService.queryNearbyNetbar(params, {
            success: function (res) {
                var list = res.data.list;
                var stgList = [];
                if (pageNum == 1) {
                    stgList = list;
                } else {
                    stgList = Array.prototype.concat.apply(that.state.stgList, list);
                }
                that.setState({
                    stgList: stgList,
                    hasNextPage: res.data.hasNextPage,
                    nextPage: res.data.nextPage,
                    showFollowButton: stgList.length == 0 ? true : false,   
                    showEmptyPage: stgList.length == 0 ? true : false
                });
            },
            error: function (error) {
                Toast.fail(error);
            }
        });
    }

    render() {
        var that = this;
        return (
            <div className='page'>
                <SearchBar
                    onChange={this.onSearchBarChange.bind(this)}
                    onSubmit={this.onSubmit.bind(this)}
                    onClear={this.onClear.bind(this)}
                    defaultValue={this.state.searchValue}
                    placeholder="搜索门店"
                    lang={{
                        cancel: '取消'
                    }}
                />

                {
                    this.state.showEmptyPage ?
                    <div style={{marginTop: "100px", textAlign: "center"}}>
                        <img src={IconEmptyPage}/>
                        <div style={{ marginTop: "20px", color: "grey" }}>暂无门店</div>
                    </div> :
                    null
                }

                <div style={{ overflow: "hidden"}}>
                {
                    this.state.stgList.map((item, index) =>
                        <div key={index} data-organid={item.organId} data-stgid={item.stgId} data-organname={item.organName} onClick={e => {
                            var organId = e.currentTarget.getAttribute("data-organid");
                            var stgId = e.currentTarget.getAttribute("data-stgid");
                            var organName = e.currentTarget.getAttribute("data-organname");
                            if (this.state.back == 1) {
                                app.setStgId(organId);
                                that.props.history.goBack();
                            } else {
                                switch (this.state.serviceCode) {
                                    case 'GOODS': {
                                        // var url = app.getGoodsOrderUrl() + '?stgId=' + organId + '&token=' + app.getToken();
                                        // var url = '/loginWeixin?organId=' + that.state.organId +  '&type=order';
                                        var url = app.getGoodsOrderUrl(organId, organName);
                                        window.location.href = url;
                                    }
                                        break;
                                    case 'RECHARGE': {
                                        // var url = '/charge' + '?organId=' + organId + '&organName=' + organName;
                                        // this.props.history.push(url);
                                        var url = app.getChargeWexinCode(organId, organName);
                                        window.location.href = url;
                                    } 
                                        break;
                                    case 'WALLET': {
                                        var url = '/mywallet';
                                        this.props.history.push(url);
                                    }
                                        break;
                                    case 'CINEMA':
                                        var url = app.getCinemaUrl(organId, organName);
                                        window.location.href = url;
                                        break;
                                    case 'IMOVIE':
                                        var url = '/movieList?organId=' + organId + '&stgId=' + stgId + '&organName=' + organName;
                                        this.props.history.push(url);
                                        break;
                                }
                            }
                            
                        }}>
                            <div className="stg_cell" >
                                <img src={item.coverImg} className="stg_image" mode="aspectFill"></img>
                                <div style={{ width: "80%" }}>
                                    <div className="stg_distance">{item.showDistance}</div>
                                    <div className="stg_name">{item.organName}</div>
                                    <div className="stg_score">{item.score == 0 ? "暂无评分" : "评分:" + item.score + "分" + " | " + item.reviewCount + "条"}</div>
                                    <div className="stg_desc">消费({item.netCostDesc})</div>
                                    <div className="stg_desc">{item.address}</div>
                                </div>

                            </div>
                            <div className='stg_separator'></div>
                        </div>
                    )
                }
                </div>
                {/* {
                    this.state.showFollowButton ? 
                    <div>
                            <div className='favorite_text'>
                                暂未关注门店
                            </div>
                            <div className='favorite_button' onClick={e=>{
                                that.props.history.push("/stglist")
                            }}>
                                马上关注门店
                            </div>
                    </div> : null
                } */}
            </div>
        );
    }
}

export default FavoritePage;