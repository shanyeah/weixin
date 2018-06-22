import React from 'react';
import * as app from '../utils/app'
import * as movieService from '../services/MovieService';
import queryString from 'query-string'
import {
    Panel,
    CellsTitle,
    Cell,
    CellBody,
    CellFooter,
} from 'react-weui';
import { Modal, Toast } from 'antd-mobile';
import './MovieBookDetailPage.css'
import IconCheck from '../assets/check.png'
import IconEmpty from '../assets/empty.png'
import MoneyValue from '../utils/money';

class MovieBookConfirmPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            saleBillId: 0,
            openId: 0,
            bookInfo: null,
            payType: 1
        }
    }
    
    componentDidMount() {
        document.title = "订单详情";
        var params = queryString.parse(this.props.location.search);
        this.state.saleBillId = params.saleBillId;
        this.state.openId = params.openId;
        this.loadData();
        
    }

    loadData() {
        var that = this;
        movieService.queryMovieSaleBillDetail(this.state.saleBillId, {
            success: function (res) {
                that.setState({
                    bookInfo: res.data
                });
            },
            error: function (error) {
                Toast.fail(error);
            }
        })
    }

    pay() {
        var that = this;
        var params = {};
        params.saleBillId = this.state.bookInfo.saleBillId;
        params.payType = this.state.payType;
        params.payAmount = this.state.bookInfo.payAmount;
        params.incomeAmount = this.state.bookInfo.incomeAmount;
       
        if (params.payType == 1) {
            params.openId = this.state.openId;
        }
        Toast.loading("支付中...", 30);
        movieService.payMovieSaleBill(params, {
            success: function(res) {
                Toast.hide();
                if (res.data.payType == 2) {
                    Toast.info("支付成功!");
                    that.loadData();
                } else {
                    var data = res.data.tn;
                    var url = app.payUrl() + '?type=movie' + '&timestamp=' + data.timeStamp
                        + '&nonceStr=' + data.nonceStr
                        + '&prepay_id=' + data.packageStr.substring(data.packageStr.indexOf("=") + 1)
                        + '&signType=' + data.signType
                        + '&paySign=' + data.paySign
                        + '&appId=' + data.wxAppId;
                    var callbackUrl = window.location.href;
                    window.localStorage.setItem('wx_pay_callback_url', callbackUrl);
                    window.location.href = url;
                }
            },
            error: function(error) {
                Toast.fail(error);
            }
        });
    }

    cancelBook() {
        Modal.alert('提示', '确认取消订单?', [
            { text: '取消', onPress: () => {} },
            { text: '确认', onPress: () => {
                this.cancel();
            }}
        ]);
    }

    cancel() {
        var that = this;
        Toast.loading("取消中...", 30);
        movieService.cancelMovieSaleBill(this.state.saleBillId, {
            success: function(res) {
                Toast.info("订单取消成功!");
                that.loadData();
            }, 
            error: function(error) {
                Toast.fail(error);
            }
        })
    }

    bookStatusText(status) {
        var text = "";
        switch (status) {
            case 0:
                text = "待支付";
                break;
            case 1:
                text = "已支付";
                break;
            case 2:
                text = "已取消";
                break;
            case 3:
                text = "已退款";
                break;
            default:
                break;
        }
        return text;
    }

    render() {
        var that = this;
        var bookInfo = this.state.bookInfo;
        return (
            <div className='page'>
                {
                    bookInfo ?
                        <div>
                            <div className="movie_book_scroll_view">
                                <CellsTitle>电影信息</CellsTitle>
                                <Panel>
                                    <Cell>
                                        <div className="movie_book_des">{bookInfo.organName}</div>
                                    </Cell>
                                    <Cell>
                                        <div className="movie_book_des">{bookInfo.roomName}</div>
                                    </Cell>
                                    <Cell>
                                        <div className="movie_book_des">{bookInfo.movieNames}</div>

                                    </Cell>
                                    <Cell>
                                        <div className="movie_book_des">{bookInfo.showDateTime}</div>
                                    </Cell>
                                    
                                </Panel>

                                <CellsTitle>订单信息</CellsTitle>
                                <Panel>

                                    <Cell>
                                        <CellBody><div className="movie_book_des">订单编号</div></CellBody>
                                        <CellFooter><div className="movie_book_des">{bookInfo.orderNo}</div></CellFooter>
                                    </Cell>

                                    <Cell>
                                        <CellBody><div className="movie_book_des">订单状态</div></CellBody>
                                        <CellFooter><div className="movie_book_des">{this.bookStatusText(bookInfo.status)}</div></CellFooter>
                                    </Cell>

                                    <Cell>
                                        <CellBody><div className="movie_book_des">下单手机</div></CellBody>
                                        <CellFooter><div className="movie_book_des">{bookInfo.mobile}</div></CellFooter>
                                    </Cell>

                                    {
                                        bookInfo.status == 0 ?
                                            <Cell>
                                                <CellBody><div className="movie_book_des">失效时间</div></CellBody>
                                                <CellFooter style={{ color: "red" }}><div className="movie_book_des">{bookInfo.lockExpiredTime}</div></CellFooter>
                                            </Cell>
                                            :
                                            null
                                    }

                                    <Cell>
                                        <CellBody><div className="movie_book_des">下单时间</div></CellBody>
                                        <CellFooter><div className="movie_book_des">{bookInfo.createTime}</div></CellFooter>
                                    </Cell>

                                    <Cell>
                                        <CellBody><div className="movie_book_des">订单金额</div></CellBody>
                                        <CellFooter style={{color: "red"}}><div className="movie_book_des">￥{ MoneyValue(bookInfo.payAmount)}</div></CellFooter>
                                    </Cell>

                                    <Cell>
                                        <CellBody><div className="movie_book_des">实付金额</div></CellBody>
                                        <CellFooter style={{color: "red"}}><div className="movie_book_des">￥{MoneyValue(bookInfo.incomeAmount)}</div></CellFooter>
                                    </Cell>

                                        {
                                        (bookInfo.payInfo && bookInfo.payInfo.length > 0) ?
                                            <Cell>
                                                <CellBody><div className="movie_book_des">支付说明</div></CellBody>
                                                <CellFooter style={{ maxWidth: "200px" }}><div className="movie_book_des">{bookInfo.payInfo}</div></CellFooter>
                                            </Cell>:
                                            null
                                        }

                                    {/* <Cell>
                                        <div className="movie_book_des">合计:<span style={{ color: "red", paddingRight: "20px" }}> ￥{bookInfo.payAmount}</span>  {bookInfo.status == 1 ? "实付:" : "会员价:"} <span style={{ color: "red" }}>￥{bookInfo.incomeAmount}</span></div>
                                    </Cell> */}

                                </Panel>

                                {
                                    bookInfo.status == 0 ?
                                        <div>
                                            <CellsTitle>支付方式</CellsTitle>
                                            <Panel>
                                                <Cell onClick={e => {
                                                    that.setState({ payType: 1 });
                                                }}>
                                                    <CellBody>
                                                        <div className="movie_book_des">微信支付</div>
                                                    </CellBody>
                                                    <CellFooter>
                                                        {
                                                            this.state.payType == 1 ?
                                                                <img className="movie_book_check" src={IconCheck} />
                                                                : <img className="movie_book_check" src={IconEmpty} />
                                                        }
                                                    </CellFooter>
                                                </Cell>
                                                <Cell onClick={e => {
                                                    that.setState({ payType: 2 });
                                                }}>
                                                    <CellBody>
                                                        <div className="movie_book_des">会员卡支付</div>
                                                    </CellBody>
                                                    <CellFooter>
                                                        {
                                                            this.state.payType == 2 ?
                                                                <img className="movie_book_check" src={IconCheck} />
                                                                : <img className="movie_book_check" src={IconEmpty} />
                                                        }
                                                    </CellFooter>
                                                </Cell>

                                            </Panel>

                                            <Panel>
                                                <Cell onClick={e => {
                                                    that.cancelBook();
                                                }}>
                                                    <div className="movie_book_des" style={{ color: "red", textAlign: "center", width: "100%" }}>取消订单</div>
                                                </Cell>
                                            </Panel>
                                        </div>
                                        : null
                                }

                            </div>

                            

                           {
                               bookInfo.status == 0 ?
                                <div className="movie_book_button" onClick={e => {
                                        that.pay();
                                    }}>
                                        确认支付
                                </div> :
                                   null
                           }
                        </div>
                    :
                    null
                }
                
                
            </div>
        );
    }
}

export default MovieBookConfirmPage;