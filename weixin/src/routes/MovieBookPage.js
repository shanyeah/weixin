import React from 'react';
import * as app from '../utils/app'
import * as dateUtil from '../utils/dateUtil'
import * as movieService from '../services/MovieService';
import queryString from 'query-string'
import {
    Panel,
    Cell,
    CellBody,
    CellFooter
} from 'react-weui';
import { Toast, Picker, Modal } from 'antd-mobile';
import './MovieBookPage.css'


class MovieBookPage extends React.Component {

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
            roomCategoryId: 0,
            roomCategoryName: "",
            price: 0,
            userPrice: 0,
            pickerShow: false,
            pickerValue: [],
            pickerGroup: []
        }
    }

    componentDidMount(options) {
        document.title = "预约观影";
        var params = queryString.parse(this.props.location.search);
        this.setState(params);
    }

    showTimePicker() {
        var pickerGroup = new Array();
        var dayArray = new Array();

        var weeks = ['日','一','二','三','四','五','六','日'];
        for (let i = 0; i < 30; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i );
            var label = (date.getMonth() + 1) + '月' + date.getDate() + '日 周' +  weeks[date.getDay()];
            var value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            dayArray.push({ label: label, value: value});  
        }

        var hourArray = new Array();

        var date = new Date();
        
        for (let i = 0; i < 23; i++) {
            var value = "";
            if (i < 10) {
                value = '0' + i;
            } else {
                value = i;
            }
            label = value + '时';
            hourArray.push({ label: label, value: value});  
        }

        var minArray = new Array();

        for (let i = 0; i < 6; i++) {
            var value = "";
            if (i < 1) {
                value = '00';
            } else {
                value = i * 10;
            }
            label = value + '分';
            minArray.push({ label: label, value: value});  
        }

        pickerGroup.push(dayArray);
        pickerGroup.push(hourArray);
        pickerGroup.push(minArray);

        var selectDay = dayArray[0].value;
        var selectHour =  date.getHours() + 1;
        var selectMins = '00'

        var pickerValue = [selectDay, selectHour, selectMins];
        this.setState({ pickerValue: pickerValue, pickerGroup: pickerGroup});
    }

    book() {

        if (this.state.startTime.length == 0) {
            Toast.info("请选择时间");
            return;
        }

        if (this.state.roomId == 0) {
            Toast.info("请选择影院的主题厅");
            return;
        }

        var that = this;
        var params = {};
        params.organId = this.state.organId;
        params.roomId = this.state.roomId;
        params.roomName = this.state.roomName;
        params.roomCategoryId = this.state.roomCategoryId;
        params.roomCategoryName = this.state.roomCategoryName;
        params.startTime = this.state.startTime;
        params.endTime = this.state.endTime;

        var movie = {};
        movie.movieId = this.state.movieId;
        movie.movieName = this.state.movieName;
        movie.timeLong = this.state.movieRunTime
        movie.price = this.state.price;
        movie.payAmount = this.state.price;
        movie.incomeAmount = this.state.userPrice;

        var movieList = [movie];
        params.movieList = movieList;

        Toast.loading("提交中...", 30);
        movieService.submitMovieSaleBill(params, {
            success: function(res) {
                Toast.hide();
                var saleBillId = res.data.saleBillId;

                // var url = '/movieBookDetail?' + 'saleBillId=' + saleBillId;
                // that.props.history.push(url);

                var url = app.getMovieWeixinCode(that.state.organId, saleBillId);
                window.location.href = url;
            },
            detailError: function(res) {
                Toast.hide();
                if (res.code == 90030) {
                    Modal.alert('提示', res.message, [
                        { text: '取消', onPress: () => { } },
                        {
                            text: '查看', onPress: () => {
                                var saleBillId = res.data.saleBillId;

                                // var url = '/movieBookDetail?' + 'saleBillId=' + saleBillId;
                                // that.props.history.push(url);
                                
                                var url = app.getMovieWeixinCode(that.state.organId, saleBillId);
                                window.location.href = url;
                            }
                        }
                    ]);
                } else {
                    Toast.fail(res.message);
                }
            }
        })
    }

    render() {
        var that = this;
        return (
            <div className='page'>
                <Panel>
                    <Cell> 
                        <CellBody>
                            <div>
                                <div className="movie_book_des">{this.state.movieName}</div>
                                <div className="movie_book_des grey">{this.state.movieDesc}</div>
                            </div>
                            
                        </CellBody>
                    </Cell>
                    <Cell> 
                        <CellBody>
                            <div className="movie_book_des">{this.state.organName}</div>
                        </CellBody>
                    </Cell>
                    <Cell access onClick={e => {
                        that.showTimePicker();
                    }}>
                        <CellBody>
                            <Picker
                                data={this.state.pickerGroup}
                                title="选择时间"
                                value={this.state.pickerValue}
                                cascade={false}
                                onOk={v => {
                                    var startTime = v[0] + ' ' + v[1] + ':' + v[2] + ':00';
                                    var endTime = dateUtil.minsAfter(startTime, this.state.movieRunTime);
                                    console.log(endTime);

                                    this.setState({
                                        startTime: startTime,
                                        endTime: endTime,
                                        roomId: 0,
                                        roomName: "",
                                        roomCategoryId: 0,
                                        roomCategoryName: "",
                                        price: 0,
                                        userPrice: 0,
                                        pickerShow: false
                                    })
                                }}
                            >
                                {
                                    this.state.startTime.length == 0 ?
                                        <div className="movie_book_des grey">请选择观影时间</div> :
                                        <div className="movie_book_des">{this.state.startTime}</div>
                                }
                            </Picker>
                            </CellBody>
                            <CellFooter />
                    </Cell>
                    
                    <Cell access onClick={e=> {
                        var url = './movieBookRoomList?organId=' + this.state.organId + '&stgId=' + this.state.stgId + '&organName=' + this.state.organName + '&movieId=' + this.state.movieId + '&startTime=' + this.state.startTime + '&endTime=' + this.state.endTime + '&movieName=' + this.state.movieName + '&movieDesc=' + this.state.movieDesc + '&movieRunTime=' + this.state.movieRunTime + "&roomId=" + this.state.roomId + "&roomName=" + this.state.roomName + '&price=' + this.state.price + '&userPrice=' + this.state.userPrice;
                        that.props.history.replace(url);
                    }} > 
                        <CellBody>
                            {
                                this.state.roomName.length == 0 ?
                                <div className="movie_book_des grey">请选择影院的主题厅</div> :
                                <div className="movie_book_des">{this.state.roomName}</div>
                            }
                        </CellBody>
                        <CellFooter/>
                    </Cell>
                    <Cell> 
                        <CellBody>
                        {
                            this.state.price > 0 ? 
                                    <div className="movie_book_des">合计: <span style={{ color: "red", paddingRight: "20px" }}> ￥{this.state.price}</span> 会员价: <span style={{ color: "red" }}>￥{this.state.userPrice}</span></div>                            
                            :
                                    <div className="movie_book_des">合计:</div>
                            
                        }
                        </CellBody>
                    </Cell>
                </Panel>

                {/* <div className="movie_book_tips">预约后可以免费取消, 请放心预订!</div> */}
                <div className="movie_book_button" onClick={e => {
                    that.book();
                }}>
                    提交订单
                </div>
            </div>
        );
    }
}

export default MovieBookPage;