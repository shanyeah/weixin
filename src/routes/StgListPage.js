import React from 'react';
import './StgListPage.css'
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'
import { Toast } from 'antd-mobile';
import {
    SearchBar
} from 'react-weui';
import queryString from 'query-string'

class StgListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nextPage: 1,
            hasNextPage: false,
            stgList: [],
            searchValue: '',
            back: 0
        }
    }

    componentDidMount(options) {
        document.title = "搜索";
        var params = queryString.parse(this.props.location.search);
        if (params.back) {
            this.state.back = 1;
        }
        this.loadData();
    }

    loadData() {
        var that = this;
        var pageNum = this.state.nextPage;
        var latitude = window.localStorage.getItem("latitude");
        var longitude = window.localStorage.getItem("longitude");
        netbarService.queryNearbyNetbar({ name: this.state.searchValue, pageNum: this.state.nextPage, latitude: latitude, longitude: longitude }, {
            success: function (res) {
                var list = res.data.list;
                var stgList = [];
                if (pageNum <= 1) {
                    stgList = list;
                } else {
                    stgList = Array.prototype.concat.apply(that.state.stgList, list);
                }
                
                if (pageNum <= 1 && stgList.length == 0) {
                    Toast.info("没有该门店信息");
                }
                that.setState({
                        stgList: stgList,
                        hasNextPage: res.data.hasNextPage,
                        nextPage: res.data.nextPage,
                     });
            },
            error: function (error) {
                Toast.fail(error);
            }
        });
    }

    onSearchBarChange(text, e) {
        this.state.searchValue = text;
    }

    onSubmit() {
        this.setState({stgList: []});
        this.loadData();
    }

    onClear() {
        this.setState({stgList: []});
        this.state.searchValue = '';
        this.loadData();
    }

    render() {
        var that = this;
        return (
            <div className='page' style={{overflow: "hidden"}}>
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
                    this.state.stgList.map((item, index) =>
                        <div key={index} data-organid={item.organId} data-organname={item.organName} onClick={e => {
                            var organId = e.currentTarget.getAttribute("data-organid");
                            if (that.state.back == 1) {
                                app.setStgId(organId);
                                that.props.history.goBack();
                            } else {
                                var url = '/stg' + '?organId=' + organId;
                                that.props.history.push(url);
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
        );
    }
}

export default StgListPage;