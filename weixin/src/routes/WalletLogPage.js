import React from 'react';
import './WalletLogPage.css'
import './WalletPage.css'
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'
import { Toast } from 'antd-mobile';
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
import queryString from 'query-string'

class WalletLogPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            walletId: 0,
            logList: [],
            nextPage: 1,
            hasNextPage: false
        }
    }

    componentDidMount() {
        document.title = "钱包明细";
        var param = queryString.parse(this.props.location.search);
        this.state.walletId = param.walletId;
        this.loadData();
    }

    loadData() {
        var walletId = this.state.walletId;
        var pageNum = this.state.nextPage;
        var that = this;
        netbarService.queryWalletLog({walletId: walletId, pageNum: pageNum}, {
            success: function (res) {
                var walletInfo = res.data;
                var logList = walletInfo.pageData.list;

                var totalBalance = walletInfo.extData.balance.toFixed(2);
                var totalCashBalance = walletInfo.extData.cashBalance.toFixed(2);
                var totalPresentBalance = walletInfo.extData.presentBalance.toFixed(2);

                // for (var i = 0; i < walletList.length; i++) {
                //     var wallet = walletList[i];
                //     wallet.balance = wallet.balance.toFixed(2);
                //     wallet.cashBalance = wallet.cashBalance.toFixed(2);
                //     wallet.presentBalance = wallet.presentBalance.toFixed(2);
                // }

                that.setState({logList: logList, totalBalance: totalBalance, totalCashBalance: totalCashBalance, totalPresentBalance: totalPresentBalance })

            },
            error: function (error) {
                Toast.fail(error);
            }
        });
    }


    render() {
        var that = this;
        return (
            <div className='page'>
                <Panel>
                {
                    this.state.logList.length == 0 ?
                    <div className='card_empty_view'>
                        <div className='card_empty_text'>暂无记录</div>
                    </div>
                    : 
                    <Panel>
                        <div className='user_detail_view'>
                            <div className='user_money_view'>
                                <div>现金余额</div>
                                <div>{this.state.totalCashBalance}</div>
                            </div>
                            <div className='user_detail_line'></div>
                            <div className='user_money_view'>
                                <div>赠送余额</div>
                                <div>{this.state.totalPresentBalance}</div>
                            </div>
                            <div className='user_detail_line'></div>
                            <div className='user_money_view'>
                                <div>钱包余额</div>
                                <div>{this.state.totalBalance}</div>
                            </div>
                        </div>
                    </Panel>
                }
                {
                    this.state.logList.map((item, index) =>
                    <div className="wallet_log_cell" key={index}>

                        <div className="wallet_log_desc">订单类型: <span className='wallet_log_desc_text'>{item.billTypeName}</span> </div>
                                <div className="wallet_log_desc">订单金额: <span className='wallet_log_desc_text'>{item.amount.toFixed(2)} (现金:{item.afterCashBalance.toFixed(2)}/ 赠送{item.afterPresentBalance.toFixed(2)})</span> </div>
                        
                        <div className="wallet_log_desc">支付说明: <span className='wallet_log_desc_text'>{item.remark}</span> </div>
                        <div className="wallet_log_desc">消费时间: <span className='wallet_log_desc_text'>{item.createTime}</span> </div>
                    </div>
                    )
                }
                </Panel>
                
            </div>
        );
    }
}

export default WalletLogPage;