import React from 'react';
import queryString from 'query-string'
import {
    PullToRefresh,
    Panel,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
} from 'react-weui';
import { Toast } from 'antd-mobile';
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'
import './StgPage.css'
import IconLocation from '../assets/location.png'
import IconPhone from '../assets/phone.png'
import IconUser from '../assets/user.png'
import IconLike from '../assets/like.png'

class StgPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            stgInfo: null,
            services: [],
            reviewList: [],
            nextPage: 1,
            hasNextPage: false,
            currentTab: 0,
            html: "",
            wx: app.wx()
        }
    }

    componentDidMount(options) {
        document.title = "门店详情";
        var param = queryString.parse(this.props.location.search);
        this.state.organId = param.organId;
        this.loadData();
    }

    loadData(resolve) {
        var that = this;
        Toast.loading("加载中...");
        netbarService.queryNetbarDetail({ organId: this.state.organId }, {
            success: function (data) {
                Toast.hide();
                var stgInfo = data.data;
                var services = new Array();
                var serviceCategory = stgInfo.serviceCategory;
                for (var i = 0; i < serviceCategory.length; i++) {
                    var item = serviceCategory[i];
                    item.tag = i;
                    switch (item.code) {
                        case 'GOODS':
                            // item.url = '/loginWeixin?organId=' + that.state.organId +  '&type=order';
                            // item.url = app.getGoodsOrderUrl() + '?stgId=' + that.state.organId + '&token=' + app.getToken();
                            item.url = app.getGoodsOrderUrl(stgInfo.organId, stgInfo.organName);
                            break;
                        case 'RECHARGE':
                            item.url = app.getChargeWexinCode(stgInfo.organId, stgInfo.organName);
                            // item.url = '/loginWeixin?organId=' + that.state.organId +  '&type=charge';
                            // item.url = '/charge' + '?organId=' + that.state.organId + '&organName=' + stgInfo.organName;
                            break;
                        case 'WALLET':
                            item.url = '/mywallet?organId=' + stgInfo.organId;
                            break;
                        case 'CINEMA':
                            item.url = app.getCinemaUrl(stgInfo.organId, stgInfo.organName);
                            break;
                        case 'IMOVIE':
                            item.url = '/movieList?organId=' + stgInfo.organId + '&stgId=' + stgInfo.stgId + '&organName=' + stgInfo.organName;
                            break;
                    }
                    services.push(item);
                }
                // var result = stgInfo.description.replace(/<img/g, "<img style='width=100%;overflow: hidden;'");
                // console.log(result);
                var html = stgInfo.description;
                // console.log(html);
                that.setState({
                    stgInfo: stgInfo,
                    services: services,
                    html: html,
                    nextPage: 1
                });
                if (resolve) {
                    resolve();
                }
                that.loadReviewList();
            },
            error: function (error) {
                Toast.hide();
                if (resolve) {
                    resolve();
                }
                Toast.fail(error);
            }
        });
    }

    loadReviewList() {
        var that = this;
        var organId = this.state.organId;
        var page = this.state.nextPage;
        netbarService.queryNetbarReviewList({ organId: organId }, {
            success: function (res) {
                var data = res.data;
                if (data && data.list) {
                    var reviewList = [];
                    if (page == 1) {
                        reviewList = data.list;
                    } else {
                        reviewList = Array.prototype.concat.apply(that.data.reviewList, data.list);
                    }
                    var hasNextPage = data.hasNextPage;
                    var nextPage = data.nextPage;
                    that.setState({
                        reviewList: reviewList,
                        nextPage: nextPage,
                        hasNextPage: hasNextPage
                    });
                }
            },
            error: function (error) {
            }
        });
    }

    render() {
        if (!this.state.stgInfo) {
        return (<div></div>);
        }
        var that = this;
        return (
            <div className="page">
                <PullToRefresh
                    onRefresh={
                        resolve => {
                            that.loadData(resolve);
                        }
                    }
                >
                    {
                        this.state.stgInfo ?
                            <div>
                                <Panel>
                                    <Cell className="info_cell">
                                        <div>
                                            <img className='info_image' src={this.state.stgInfo.coverImg}></img>
                                        </div>
                                        <div className='info_desc_col'>
                                            <div className='info_mid_col'>
                                                <div className='info_title'>{this.state.stgInfo.organName}</div>
                                                <div className='info_desc'> {this.state.stgInfo.score == 0 ? "暂无评分" : "评分:" + this.state.stgInfo.score + "分" + " | " + this.state.stgInfo.reviewCount + "条"}</div>
                                                <div className='info_desc'>消费({this.state.stgInfo.netCostDesc})</div>
                                                <div className='info_member'>{this.state.stgInfo.memberStatus == 0 ? "您还不是门店会员" : "门店会员"}</div>
                                            </div>
                                            <div className='info_last_col'>
                                                {this.state.stgInfo.followStatus == 0 ?
                                                    <div className="follow_btn" onClick={e => {
                                                        netbarService.followNetbar({ organId: that.state.organId }, {
                                                            success: function (data) {
                                                                that.loadData();
                                                            },
                                                            error: function (error) {
                                                                Toast.fail(error);
                                                            }
                                                        })
                                                    }}>+关注</div> :
                                                    <div className="unfollow_btn" onClick={e => {
                                                        netbarService.unfollowNetbar({ organId: that.state.organId }, {
                                                            success: function (data) {
                                                                that.loadData();
                                                            },
                                                            error: function (error) {
                                                                Toast.fail(error);
                                                            }
                                                        })
                                                    }}>已关注</div>}
                                                <div className="info_seatDesc">
                                                    {this.state.stgInfo.seatDesc}
                                                </div>
                                            </div>
                                        </div>
                                    </Cell>
                                    <Cell>
                                        <CellHeader>
                                            <img src={IconLocation} alt="" style={{ display: `block`, width: `20px`, marginRight: `5px` }} />
                                        </CellHeader>
                                        <CellBody onClick={e => {
                                            that.state.wx.openLocation({
                                                latitude: that.state.stgInfo.latitude,
                                                longitude: that.state.stgInfo.longitude,
                                                name: that.state.stgInfo.organName,
                                                address: that.state.stgInfo.address
                                            });
                                        }}>
                                            <div className="info_location">{this.state.stgInfo.address}</div>
                                        </CellBody>
                                        <CellFooter style={{ display: "flex" }} onClick={e => {
                                            var telephone = that.state.stgInfo.telephone;
                                            if (telephone) {
                                                window.location.href = "tel:" + telephone;
                                            } else {
                                                Toast.info("暂无电话");
                                            }
                                        }}>
                                            <div style={{ marginRight: "16px", color: "lightgrey" }}>|</div>
                                            <img src={IconPhone} style={{ width: "16px", height: "16px", marginTop: "8px" }}></img>
                                        </CellFooter>
                                    </Cell>
                                </Panel>

                                <Panel>
                                    <div className="stg_nav_cell">
                                        {
                                            this.state.services.map((item, index) =>
                                                <div className="stg_nav_item" key={index} data-index={index} onClick={e => {

                                                    if (!app.getUserInfo()) {
                                                        that.props.history.push("/login");
                                                        return;
                                                    }

                                                    var index = e.currentTarget.getAttribute("data-index");
                                                    var item = that.state.services[index];
                                                    if (item.status == 0) {
                                                        Toast.info("服务暂未开通");
                                                        return;
                                                    }
                                                    if (item.code == 'GOODS' || item.code == 'RECHARGE' || item.code == 'CINEMA') {
                                                        window.location.href = item.url;
                                                    } else if (item.code == 'WALLET') {
                                                        if (that.state.stgInfo.memberStatus == 0) {
                                                            Toast.info("你还不是门店会员");
                                                            return;
                                                        }
                                                        that.props.history.push(item.url);
                                                    } else {
                                                        that.props.history.push(item.url);
                                                    }


                                                }}>
                                                    <img src={item.imgUrl} className='stg_nav_icon'></img>
                                                    <div className='stg_nav_text'>{item.name}</div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Panel>

                                <Panel>
                                    <div className="swiper-tab">
                                        <div className={this.state.currentTab == 0 ? 'swiper-tab-item selected' : 'swiper-tab-item'} onClick={e => {
                                            that.setState({ currentTab: 0 });
                                        }}>门店简介</div>
                                        <div className={this.state.currentTab == 1 ? 'swiper-tab-item selected' : 'swiper-tab-item'} onClick={e => {
                                            that.setState({ currentTab: 1 });
                                        }}>会员点评({this.state.stgInfo.reviewCount})</div>
                                    </div>

                                    {
                                        this.state.currentTab == 0 ?
                                            <div className="stg_html_desc" dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
                                            :
                                            <div>
                                                <Cell>
                                                    <CellBody>
                                                        <div className="des_cell">{this.state.stgInfo.score == 0 ? "暂无评分" : "评分:" + this.state.stgInfo.score + "分"}</div>
                                                    </CellBody>
                                                    <CellFooter>
                                                        <div className="review_btn" onClick={e => {
                                                            if (app.getUserInfo()) {
                                                                that.props.history.push("/review?organId=" + that.state.organId);
                                                            } else {
                                                                that.props.history.push("/login");
                                                            }
                                                        }}>点评</div>
                                                    </CellFooter>
                                                </Cell>
                                                {
                                                    this.state.reviewList.map((item, index) =>
                                                        <div key={index}>
                                                            <div className="review_cell" >
                                                                <img className="review_img" src={item.photoUrl ? item.photoUrl : IconUser} ></img>
                                                                <div style={{ width: "100%" }}>
                                                                    <div>
                                                                        <div className="review_rating">
                                                                            <div>{item.avgScore}分</div>
                                                                            <img src={IconLike} className='review_like'></img>
                                                                        </div>
                                                                        <div className="review_name">
                                                                            <div>{item.name}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="review_text">
                                                                        <div>{item.content}</div>
                                                                    </div>
                                                                    <div className="review_date">
                                                                        <div>{item.createTime}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="review_line"></div>
                                                        </div>

                                                    )
                                                }
                                            </div>
                                    }
                                </Panel>
                            </div>
                            : null
                    }
                
                
                </PullToRefresh>
                
                
            </div>
        );
    }
}

export default StgPage;
