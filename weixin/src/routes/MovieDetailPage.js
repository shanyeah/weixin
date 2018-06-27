import React from 'react';
import * as app from '../utils/app'
import * as movieService from '../services/MovieService';
import queryString from 'query-string'
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
    Flex,
    FlexItem
} from 'react-weui';
import './MovieDetailPage.css'
import { Toast } from 'antd-mobile';

class MovieDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            stgId: 0,
            organName: "",
            movieId: 0,
            movieInfo: null
        }
    }

    componentDidMount(options) {
        var params = queryString.parse(this.props.location.search);
        this.state.organId = params.organId;
        this.state.stgId = params.stgId;
        this.state.organName = params.organName;
        this.state.movieId = params.movieId;
        document.title = "电影详情";
        this.loadData();
    }

    loadData() {
        var that = this;
        movieService.queryMovieDetail({movieId: this.state.movieId}, {
            success: function (res) {
                var movieInfo = res.data;
                that.setState({ movieInfo: movieInfo});
            },
            error: function (error) {
                Toast.fail(error);
            }
        });
    }

    book() {
        var movieInfo = this.state.movieInfo;
        var movieName = movieInfo.name;
        var movieDesc = movieInfo.prodNation + '/' + movieInfo.lang + '/' + movieInfo.runTime + '分钟';
        var url = '/movieBook?organId=' + this.state.organId + '&stgId=' + this.state.stgId + '&organName=' + this.state.organName + '&movieId=' + this.state.movieId + '&movieName=' + movieName + '&movieRunTime=' + movieInfo.runTime + '&movieDesc=' + movieDesc;
        this.props.history.push(url);
    }

    render() {
        var that = this;
        var movieInfo = this.state.movieInfo;
        return (
            <div className='page'>
                {
                    this.state.movieInfo ? 
                        <div>
                            <Panel>
                            <div className="movie_detail_cell" >
                                <img src={movieInfo.previewPoster} className="movie_detail_image" mode="aspectFill"></img>
                                <div style={{ width: "80%" }}>
                                    <div className="movie_detail_name">{movieInfo.name}</div>
                                    <div className="movie_detail_desc">{movieInfo.aliasName}</div>
                                    <Flex>
                                        <FlexItem>
                                            <div className="movie_detail_desc">类型: {movieInfo.category}</div>
                                        </FlexItem>
                                        <FlexItem>
                                            <div className="movie_detail_desc">地区: {movieInfo.prodNation}</div>
                                        </FlexItem>
                                    </Flex>
                                    <Flex>
                                        <FlexItem>
                                            <div className="movie_detail_desc">时长: {movieInfo.runTime}分钟</div>
                                        </FlexItem>
                                        <FlexItem>
                                            <div className="movie_detail_desc">年代: {movieInfo.times}</div>
                                        </FlexItem>
                                    </Flex>
                                    <div className="movie_detail_desc">语言: {movieInfo.lang}</div>
                                    <div className="movie_detail_desc">导演: {movieInfo.directors}</div>  
                                </div>
                                
                            </div>
                        </Panel>
                        <Panel>
                            <div className="movie_story_title">剧情简介</div>
                            <div className="movie_story_desc">{movieInfo.movieDesc}</div>
                        </Panel>
                            <div className="movie_book_button">
                                <div onClick={e => {
                                    that.book();
                                }}>
                                    预约观影
                            </div>
                            </div> 
                        
                        </div> :
                        null
                }
            </div>
        );
    }
}

export default MovieDetailPage;