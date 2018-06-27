import React from 'react';
import {
    PullToRefresh,
    Panel,
    PanelHeader,
    PanelBody
} from 'react-weui';
import { Toast } from 'antd-mobile';
import { Swiper, Slide } from 'react-dynamic-swiper'
import 'react-dynamic-swiper/lib/styles.css'

import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'

import IconFood from '../assets/home_food.png';
import IconCharge from '../assets/home_charge.png';
import IconCinema from '../assets/home_cinema.png';
import IconMovie from '../assets/home_movie.png';
import IconBook from '../assets/home_book.png';

import './HomeView.css'

class HomeView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            adList: [],
            stgList: [],
            nextPage: 1,
            hasNextPage: false,
            swiperIndex: 0
        }
    }

    componentDidMount() {
        this.loadAd();
        this.loadData();
    }

    loadAd() {
        var that = this;
        netbarService.loadAd({ type: 0 }, {
            success: function (data) {
                var adList = data.data;
                that.setState({
                    adList: adList
                });
            },
            error: function (error) {
            }
        });
    }

    loadData(resolve) {
        var that = this;
        var latitude = app.getLatitude();
        var longitude = app.getLongitude();
        Toast.loading("加载中...");
        netbarService.queryNearbyNetbar({ pageNum: this.state.nextPage, latitude: latitude, longitude: longitude }, {
            success: function (data) {
                Toast.hide();
                var stgList = data.data.list;
                var hasNextPage = data.data.hasNextPage;
                var nextPage = data.data.nextPage;
                that.setState({
                    stgList: stgList,
                    hasNextPage: hasNextPage,
                    nextPage: nextPage
                });
                if (stgList.length > 0 && !app.getStgId()) {
                    var stg = stgList[0];
                    app.setStgId(stg.organId);
                }
                if (resolve) {
                    resolve();
                }
            },
            error: function (error) {
                Toast.hide();
                Toast.fail(error);
                if (resolve) {
                    resolve();
                }
            }
        });
    }

    render() {
        var that = this;
        return (
            <div className='page tab'>
                <PullToRefresh
                    onRefresh={
                        resolve => {
                            that.loadData(resolve);
                        }
                    }
                >
                <Panel>
                    <PanelBody>
                        <Swiper
                            className="slider"
                            navigation={false}
                            swiperOptions={{
                                slidesPerView: 'auto',
                            }}
                    >
                            {
                                this.state.adList.map((item, index) =>
                                    <Slide key={index} data-index={index} onClick={e => {
                                        var index = e.currentTarget.getAttribute("data-index");
                                        var item = that.state.adList[index];
                                        if (item.objectType == 1) {
                                            window.location.href = item.objectValue;
                                        }
                                    }}>
                                        <img className="slider_item" src={item.imageUrl}></img>
                                    </Slide>
                                )
                            }
                            
                        </Swiper>
                        
                        <div className="nav_cell">
                            <div className="nav_item" onClick={e=>{
                                    if(app.getUserInfo()) {
                                        that.props.history.push("/favorite?serviceCode=GOODS&serviceName=点餐");
                                    } else {
                                        that.props.history.push("/login");
                                    }
                            }}>
                                <img src={IconFood} className='nav_icon'></img>
                                <div className='nav_text'>点餐</div>
                            </div>
                                <div className="nav_item" onClick={e => {
                                    if (app.getUserInfo()) {
                                        that.props.history.push("/favorite?serviceCode=RECHARGE&serviceName=充值");
                                    } else {
                                        that.props.history.push("/login");
                                    }
                                }}>
                                <img src={IconCharge} className='nav_icon'></img>
                                <div className='nav_text'>充值</div>
                            </div>
                            <div className="nav_item" onClick={e => {
                                    if (app.getUserInfo()) {
                                        that.props.history.push("/favorite?serviceCode=CINEMA&serviceName=影院");
                                    } else {
                                        that.props.history.push("/login");
                                    }
                                }}>
                                <img src={IconCinema} className='nav_icon'></img>
                                <div className='nav_text'>同步影院</div>
                            </div>
                            <div className="nav_item" onClick={e => {
                                    if (app.getUserInfo()) {
                                        that.props.history.push("/favorite?serviceCode=IMOVIE&serviceName=包厢");
                                    } else {
                                        that.props.history.push("/login");
                                    }
                                }}>
                                 <img src={IconMovie} className='nav_icon'></img>
                                 <div className='nav_text'>电影包厢</div>
                            </div>
                            <div className="nav_item" onClick={e => {
                                    if (app.getUserInfo()) {
                                        that.props.history.push("/favorite?serviceCode=SEAT&serviceName=订座");
                                    } else {
                                        that.props.history.push("/login");
                                    }
                                }}>
                                <img src={IconBook} className='nav_icon'></img>
                                <div className='nav_text'>订座</div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
                
                <Panel>
                    <PanelHeader>
                        附近的门店
                        </PanelHeader>
                    <PanelBody>
                        {
                            this.state.stgList.map((item, index) =>
                                <div key={index} data-organid={item.organId} onClick={e => {
                                    var organId = e.currentTarget.getAttribute("data-organid");
                                    that.props.history.push("/stg?organId=" + organId);
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
                    </PanelBody>
                </Panel>  
                </PullToRefresh>
            </div>
        );
    }
}

export default HomeView;