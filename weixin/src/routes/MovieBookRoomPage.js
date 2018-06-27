import React from 'react';
import * as app from '../utils/app'
import * as movieService from '../services/MovieService';
import queryString from 'query-string'
import {
    SearchBar,
    Panel,
    PanelHeader,
    PanelBody,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Flex,
    FlexItem
} from 'react-weui';
import { Toast } from 'antd-mobile';
import './MovieBookRoomPage.css'

class MovieBookRoomPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            stgId: 0,
            organName: "",
            movieId: 0,
            movieName: "",
            movieDesc: "",
            movieRunTime: 0,
            startTime: "",
            endTime: "",
            roomId: 0,
            roomName: "",
            room: "",
            roomList: [],
            price: 0,
            userPrice: 0,
            back: true
        }
    }
    
    componentWillUnmount() {
        if (this.state.back) {
            var url = './movieBook?organId=' + this.state.organId + '&stgId=' + this.state.stgId + '&organName=' + this.state.organName + '&movieId=' + this.state.movieId  + '&movieName=' + this.state.movieName + '&movieDesc=' + this.state.movieDesc + '&movieRunTime=' + this.state.movieRunTime + '&startTime=' + this.state.startTime + '&endTime=' + this.state.endTime + '&roomId=' + this.state.roomId + '&roomName=' + this.state.roomName + '&price=' + this.state.price + '&userPrice=' + this.state.userPrice;
            this.props.history.push(url);
        }
    }

    componentDidMount(options) {
        document.title = "选择影院的主题厅";
        var params = queryString.parse(this.props.location.search);
        this.setState(params);
        this.state.organId = params.organId;
        this.state.stgId = params.stgId
        this.state.startTime = params.startTime;
        this.state.endTime = params.endTime;
        // this.state.organName = params.organName;
        // this.state.movieId = params.movieId;
        this.loadData();
    }

    loadData() {
        var that = this;
        var param = { stgId: this.state.stgId, serviceId: 1, startTime: this.state.startTime, endTime: this.state.endTime };
        movieService.queryMovieRoomList(param, {
            success: function (res) {
                var list = res.dataList;
                that.setState({
                    roomList: list
                });
            },
            error: function (error) {
                Toast.fail(error);
            }
        })
    }



    render() {
        var that = this;
        return (
            <div className='page'>
                <div style={{ overflow: "hidden" }}>
                    {
                        this.state.roomList.map((item, index) =>
                            <div key={index} data-movieid={item.id}>
                                <div className="movie_cell" data-index={index} onClick={e => {
                                    var index = e.currentTarget.getAttribute("data-index");
                                    var room = that.state.roomList[index];
                                    if (room.allowOnlineBook) {
                                        var roomId = room.id
                                        var roomName = room.name;
                                        var price = room.price;
                                        var userPrice = room.userPrice;
                                        var categoryId = room.categoryId;
                                        var categoryName = room.categoryName;
                                        var url = './movieBook?organId=' + this.state.organId + '&stgId=' + this.state.stgId + '&organName=' + this.state.organName + '&movieId=' + this.state.movieId + '&movieName=' + this.state.movieName + '&movieDesc=' + this.state.movieDesc + '&movieRunTime=' + this.state.movieRunTime + '&startTime=' + this.state.startTime + '&endTime=' + this.state.endTime + '&roomId=' + roomId + '&roomName=' + roomName + '&roomCategoryId=' + categoryId + '&roomCategoryName=' + categoryName + '&price=' + price + '&userPrice=' + userPrice;
                                        that.state.back = false;
                                        that.props.history.replace(url);
                                    } else {
                                        Toast.info("不可预订");
                                    }
                                   
                                }} >
                                    <img src={item.imageUrl} className="movie_image" mode="aspectFill"></img>
                                    <div style={{ width: "60%" }}>
                                        <div className="movie_name">{item.name}</div>
                                        <div className="movie_desc">{item.categoryName} | {item.peopleNumLimit}人</div>
                                        <div className="movie_desc" style={{marginTop: "26px"}}>原价:￥{item.price}      会员价:￥{item.userPrice}</div>
                                    </div>
                                    <div>
                                        {
                                            item.allowOnlineBook == 1 ? 
                                             <div className="movie_book">预约</div>
                                            : null
                                        }
                                       
                                    </div>
                                </div>
                                <div className='movie_separator'></div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default MovieBookRoomPage;