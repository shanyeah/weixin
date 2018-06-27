import React from 'react';
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

class WalletPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            walletInfo: {},
            totalBalance: 0,
            totalCashBalance: 0,
            totalPresentBalance: 0,
            walletList: []
        }
    }

    componentDidMount(options) {
        document.title = "我的钱包";
        var param = queryString.parse(this.props.location.search);
        if (param.organId) {
            this.state.organId = param.organId;
        }
        this.loadData();
    }

    loadData() {
        var that = this;
        var param = {};
        if (this.state.organId) {
            param["organId"] = this.state.organId;
        }
        netbarService.queryMyWallet(param, {
            success: function (res) {
                var walletInfo = res.data;
                var walletList = walletInfo.walletList;

                var totalBalance = walletInfo.totalBalance.toFixed(2);
                var totalCashBalance = walletInfo.totalCashBalance.toFixed(2);
                var totalPresentBalance = walletInfo.totalPresentBalance.toFixed(2);

                if (walletList && walletList.length > 0) {
                    for (var i = 0; i < walletList.length; i++) {
                        var wallet = walletList[i];
                        wallet.balance = wallet.balance.toFixed(2);
                        wallet.cashBalance = wallet.cashBalance.toFixed(2);
                        wallet.presentBalance = wallet.presentBalance.toFixed(2);
                    }
                } else {
                    walletList = [];
                }
                

                that.setState({ walletInfo: walletInfo, walletList: walletList, totalBalance: totalBalance, totalCashBalance: totalCashBalance, totalPresentBalance: totalPresentBalance })
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
                
                {
                    this.state.walletList.length == 0 ?
                    <div className='card_empty_view'>
                        <div className='card_empty_text'>你还没有会员卡, 赶快去开通吧!</div>
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
                    this.state.walletList.map((item, index) =>
                        <Panel key={index} >
                            <Cell style={{ fontSize: "16px" }}>
                                <CellBody>门店名称</CellBody>
                                <CellFooter>{item.organName}</CellFooter>
                            </Cell>
                            <Cell style={{ fontSize: "16px" }}>
                                <CellBody>会员等级</CellBody>
                                <CellFooter>{item.className}</CellFooter>
                            </Cell>
                            
                            <Cell style={{ fontSize: "16px" }} access data-walletid={item.walletId} onClick={e=> {
                            var walletId = e.currentTarget.getAttribute("data-walletid");
                            that.props.history.push("./walletlog?walletId=" + walletId);
                            }}>
                                <CellBody>现金金额</CellBody>
                                <CellFooter className="cash_text">{item.cashBalance}</CellFooter>
                            </Cell>
                            <Cell style={{ fontSize: "16px" }} access data-walletid={item.walletId} onClick={e=> {
                                var walletId = e.currentTarget.getAttribute("data-walletid");
                                that.props.history.push("./walletlog?walletId=" + walletId);
                             }}>
                                <CellBody>赠送金额</CellBody>
                                <CellFooter className="cash_text">{item.presentBalance}</CellFooter>
                            </Cell>
                            <Cell style={{ fontSize: "16px" }} access data-walletid={item.walletId} onClick={e => {
                                var walletId = e.currentTarget.getAttribute("data-walletid");
                                that.props.history.push("./walletlog?walletId=" + walletId);
                            }}>
                                <CellBody>钱包余额</CellBody>
                                <CellFooter className="cash_text">{item.balance}</CellFooter>
                            </Cell>
                        </Panel>
                    )
                }

                
            </div>
        );
    }
}

export default WalletPage;