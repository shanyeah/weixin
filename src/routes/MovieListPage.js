import React from 'react';
import * as app from '../utils/app'
import Tloader from 'react-touch-loader';
import * as movieService from '../services/MovieService';
import queryString from 'query-string'
import {
    SearchBar,
    Panel
} from 'react-weui';
import { Toast } from 'antd-mobile';
import './MovieListPage.css'

class MovieListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            stgId: 0,
            organName: "",
            movieList: [],
            nextPage: 1,
            hasNextPage: false,
            searchValue: '',
            condition: null,

            area: -1,
            moviecatId: -1,
            times: -1,
        }
    }

    componentDidMount(options) {
        var params = queryString.parse(this.props.location.search);
        this.state.organId = params.organId;
        this.state.stgId = params.stgId;
        this.state.organName = params.organName;
        document.title = "电影";
        this.reload();
    }

    reload() {
        this.state.nextPage = 1;
        this.loadData();
        this.loadCondition();
    }

    loadData(resolve) {
        var that = this;
        var pageNum = this.state.nextPage;
        var param = { stgIdText: this.state.stgId, pageNum: pageNum};
        if (this.state.area != -1) {
            param.area = this.state.area;
        }
        if (this.state.moviecatId != -1) {
            param.moviecatId = this.state.moviecatId;
        }
        if (this.state.times != -1) {
            param.times = this.state.times;
        }
        if (this.state.searchValue.length > 0) {
            param.keyword = this.state.searchValue;
        }
        if (pageNum == 1) {
            Toast.loading("加载中...", 30);
        }
        movieService.queryMovieList(param, {
            success: function (res) {
                Toast.hide();
                var list = res.dataList;
                var movieList = [];
                if (pageNum == 1) {
                    movieList = list;
                } else {
                    movieList = Array.prototype.concat.apply(that.state.movieList, list);
                }
                if (resolve) {
                    resolve();
                }
                that.setState({
                    movieList: movieList,
                    hasNextPage: res.hasNextPage,
                    nextPage: res.pageNum + 1
                });
            },
            error: function (error) {
                Toast.hide();
                Toast.fail(error);
                if (resolve) {
                    resolve();
                }
            }
        })
    }

    loadMore(resolve) {
        this.loadData(resolve);
    }

    loadCondition() {
        var that = this;
        var param = { stgIdText: this.state.stgId };
        if (this.state.area != -1) {
            param.area = this.state.area;
        }
        if (this.state.moviecatId != -1) {
            param.moviecatId = this.state.moviecatId;
        }
        if (this.state.times != -1) {
            param.times = this.state.times;
        }
        movieService.movieQueryCondition(param, {
            success: function (res) {
                that.setState({ condition: res.data});
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
        this.setState({ movieList: [] });
        this.reload();
    }

    onClear() {
        this.setState({ movieList: [] });
        this.state.searchValue = '';
        this.reload();
    }

    render() {
        var that = this;
        return (
            <div className='page'>
                
                

                <Tloader
                    initializing={0}
                    hasMore={this.state.hasNextPage}
                    onLoadMore={this.loadMore.bind(this)}
                    autoLoadMore={true}
                    className="movie_scroll_view">

                    <Panel>
                        <SearchBar
                            onChange={this.onSearchBarChange.bind(this)}
                            onSubmit={this.onSubmit.bind(this)}
                            onClear={this.onClear.bind(this)}
                            defaultValue={this.state.searchValue}
                            placeholder="搜索影片"
                            lang={{
                                cancel: '取消'
                            }}
                        />
                    </Panel>

                    {
                        this.state.condition ?
                            <div>
                                <div className="movie_condiction_cell" style={{ marginTop: "6px" }} >

                                    <div className={(this.state.area == -1) ? "movie_condiction_item selected" : "movie_condiction_item"} onClick={e => {
                                        that.setState({ area: -1 });
                                        that.reload();
                                    }}>
                                        全部
                                </div>
                                    {
                                        this.state.condition.areaList.map((item, index) =>
                                            <div className={(this.state.area == item) ? "movie_condiction_item selected" : "movie_condiction_item"} key={index} data-index={index} onClick={e => {
                                                var index = e.currentTarget.getAttribute("data-index");
                                                var area = that.state.condition.areaList[index];
                                                that.setState({ area: area });
                                                that.state.area = area;
                                                that.reload();
                                            }}>
                                                {item}
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="movie_condiction_cell">
                                    <div className={(this.state.moviecatId == -1) ? "movie_condiction_item selected" : "movie_condiction_item"} onClick={e => {
                                        that.setState({ moviecatId: -1 });
                                        that.reload();
                                    }}>
                                        全部
                                </div>
                                    {
                                        this.state.condition.moviecatList.map((item, index) =>
                                            <div className={(this.state.moviecatId == item.id) ? "movie_condiction_item selected" : "movie_condiction_item"} key={index} data-index={index} onClick={e => {
                                                var index = e.currentTarget.getAttribute("data-index");
                                                var moviecatId = this.state.condition.moviecatList[index].id;
                                                that.setState({ moviecatId: moviecatId });
                                                that.state.moviecatId = moviecatId;
                                                that.reload();
                                            }}>
                                                {item.name}
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="movie_condiction_cell">
                                    <div className={(this.state.times == -1) ? "movie_condiction_item selected" : "movie_condiction_item"} onClick={e => {
                                        that.setState({ times: -1 });
                                        that.reload();
                                    }}>
                                        全部
                                </div>
                                    {
                                        this.state.condition.timesList.map((item, index) =>
                                            <div className={(this.state.times == item) ? "movie_condiction_item selected" : "movie_condiction_item"} key={index} data-index={index} onClick={e => {
                                                var index = e.currentTarget.getAttribute("data-index");
                                                var times = that.state.condition.timesList[index];
                                                that.setState({ times: times });
                                                that.reload();
                                            }}>
                                                {item}
                                            </div>
                                        )
                                    }
                                </div>



                            </div> : null
                    }

                    {
                        this.state.movieList.map((item, index) =>
                            <div key={index} data-movieid={item.id} onClick={e => {
                                var movieId = e.currentTarget.getAttribute("data-movieid");
                                var url = '/movieDetail?organId=' + this.state.organId + '&stgId=' + this.state.stgId + "&organName=" + this.state.organName + '&movieId=' + movieId;
                                that.props.history.push(url);
                            }}>
                                <div className="movie_cell" >
                                    <img src={item.previewPoster} className="movie_image" mode="aspectFill"></img>
                                    <div style={{ width: "60%" }}>
                                        <div className="movie_name">{item.name}</div>
                                        <div className="movie_desc">{item.aliasName}</div>
                                        <div className="movie_desc">类型: {item.category}</div>
                                        <div className="movie_desc">导演: {item.directors}</div>
                                    </div>
                                    <div>
                                        <div className="movie_book" data-index={index} onClick={e => {
                                            e.stopPropagation();
                                            var index = e.currentTarget.getAttribute("data-index");
                                            var movieInfo = that.state.movieList[index];
                                            var movieName = movieInfo.name;
                                            var movieDesc = movieInfo.prodNation + '/' + movieInfo.lang + '/' + movieInfo.runTime + '分钟';
                                            var url = '/movieBook?organId=' + this.state.organId + '&stgId=' + this.state.stgId + '&organName=' + this.state.organName + '&movieId=' + movieInfo.id + '&movieName=' + movieName + '&movieRunTime=' + movieInfo.runTime + '&movieDesc=' + movieDesc;
                                            that.props.history.push(url);
                                        }}>观影</div>
                                    </div>
                                </div>
                                <div className='movie_separator'></div>
                            </div>
                        )
                    }
                </Tloader>

                
            </div>
        );
    }
}

export default MovieListPage;