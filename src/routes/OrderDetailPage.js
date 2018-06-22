import React from 'react';
import * as app from '../utils/app'
import * as netbarService from '../services/NetbarService';
import queryString from 'query-string'
import './OrderDetailPage.css'

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

import { Toast } from 'antd-mobile';

class OrderDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            saleBillId: 0,
            orderInfo: null
        }
        
    }

    componentDidMount() {
        document.title = "订单详情";
        var param = queryString.parse(this.props.location.search);
        this.state.saleBillId = param.saleBillId;
        this.loadData();
    }

    loadData() {
        var that = this;
        netbarService.queryGoodsBillDetail({saleBillId: this.state.saleBillId}, {
            success: function(res) {
                that.setState({orderInfo: res.data});
            }, 
            error: function(error) {
                Toast.fail(error);
            }
        })
    }

    render() {
        var that = this;
        return (
            <div className='page'>
                {
                    this.state.orderInfo ? 

                        <div>
                            {/* {
                                this.state.orderInfo.userInfo ? 
                                <Panel style={{ fontSize: "16px" }}>
                                    <Cell>
                                        <CellBody>会员</CellBody>
                                        <CellFooter>{this.state.orderInfo.userInfo.userName}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>证件号</CellBody>
                                        <CellFooter>{this.state.orderInfo.userInfo.idNumber}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>手机号</CellBody>
                                        <CellFooter>{this.state.orderInfo.userInfo.mobile}</CellFooter>
                                    </Cell>
                                </Panel>
                                : null
                            } */}

                            <Panel style={{ fontSize: "16px" }}>
                                    {
                                        this.state.orderInfo.goodsList.map((item, index) =>

                                            item.type == 14 ? 
                                            <div key={index}> 
                                                <Cell>
                                                    <CellBody>{item.goodsName + 'x' + item.quantity}</CellBody>
                                                    <CellFooter style={{color: "orange"}}>￥{item.incomeAmount.toFixed(2)}</CellFooter>
                                                </Cell>

                                                {
                                                    item.childGoodsList.map((child, i)=> 
                                                    <div key={i}> 
                                                    <Cell style={{height: "6px", lineHeight: "14px", fontSize: "14px"}}>
                                                        <CellBody style={{color: "grey"}}>{child.goodsName + 'x' + child.quantity}</CellBody>
                                                        <CellFooter>￥{child.incomeAmount.toFixed(2)}</CellFooter>
                                                    </Cell>
                                                    </div>
                                                    )
                                                }
                                            </div>

                                            :
                                            <div key={index}> 
                                                <Cell>
                                                        <CellBody>{item.goodsName + 'x' + item.quantity}</CellBody>
                                                        <CellFooter style={{color: "orange"}}>￥{item.incomeAmount.toFixed(2)}</CellFooter>
                                                </Cell>
                                            </div>
                                        )
                                    }
                            </Panel>


                            <Panel style={{ fontSize: "16px" }}>
                                    <Cell>
                                        <CellBody>门店</CellBody>
                                        <CellFooter>{this.state.orderInfo.organName}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>小计</CellBody>
                                        <CellFooter style={{color: "orange"}}>￥{this.state.orderInfo.payAmount.toFixed(2)}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>实付</CellBody>
                                        <CellFooter style={{color: "orange"}}>￥{this.state.orderInfo.incomeAmount.toFixed(2)}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>桌号</CellBody>
                                        <CellFooter>{this.state.orderInfo.seatNo}</CellFooter>
                                    </Cell>
                                    <Cell>
                                        <CellBody>支付信息</CellBody>
                                        <CellFooter style={{ maxWidth: "260px" }}>{this.state.orderInfo.payInfo}</CellFooter>
                                    </Cell>
                            </Panel>
                        </div>

                    : null
                }

                

            </div>
        );
    }
}

export default OrderDetailPage;