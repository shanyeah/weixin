import React from 'react';
import * as app from '../utils/app'
import * as netbarService from '../services/NetbarService';
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
    Button
} from 'react-weui';
import './OrderListPage.css'

class OrderListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            nextPage: 1,
            hasNextPage: false
        }
    }

    componentDidMount(options) {
        document.title = "我的点餐";
        this.loadData();
    }

    loadData() {
        var that = this;
        var pageNum = this.state.nextPage;
        netbarService.queryMyOrderList({pageNum: pageNum}, {
            success: function(res) {
                var data = res.data;
                if (data && data.list) {
                var orderList = res.data.list;
                var statusArray = ['待支付', '已支付', '已取消', '已退款'];
                for (var i = 0; i < orderList.length; i++) {
                    var item = orderList[i];
                    item.statusText = statusArray[item.status];
                    item.incomeAmount = item.incomeAmount.toFixed(2);
                    item.payAmount = item.payAmount.toFixed(2);
                }

                var resultList = [];
                if (pageNum == 1) {
                    resultList = orderList;
                } else {
                    resultList = Array.prototype.concat.apply(that.state.orderList, orderList);
                }
                var hasNextPage = data.hasNextPage;
                var nextPage = data.nextPage;
                that.setState({
                    orderList: resultList,
                    nextPage: nextPage,
                    hasNextPage: hasNextPage
                });
                }
            },
            error: function(error) {

            }
        })
    }

    render() {
        var that = this;
        return (
            <div className='page'>

                {
                    this.state.orderList.length == 0 ?
                        <div className='card_order_view'>
                            <div className='card_order_text'>你还没有点餐</div>
                        </div>
                        : null
                }
                <Panel>
                {   
                   
                    this.state.orderList.map((item, index) => 
                        <Cell access key={index} data-salebillid={item.saleBillId} onClick={e=>{
                            var saleBillId = e.currentTarget.getAttribute("data-salebillid");
                            that.props.history.push('/orderDetail?saleBillId='+saleBillId);
                        }}>
                            <CellBody>
                                    <div className="order_organ">门店名称: {item.organName}</div>
                                    <div className="order_desc">应付金额: <span className='order_desc_text'>{item.payAmount}</span> </div>
                                    <div className="order_desc">实付金额: <span className='order_desc_text'>{item.incomeAmount}</span> </div>
                                    <div className="order_desc">支付状态: <span className='order_desc_text'>{item.statusText}</span> </div>
                                    {/* <div className="order_detail">订单详情</div> */}
                            </CellBody>
                            <CellFooter></CellFooter>
                        </Cell>
                    )
                    }
                </Panel>
            </div>
        );
    }
}

export default OrderListPage;