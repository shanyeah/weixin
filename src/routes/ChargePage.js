import React from 'react';
import './ChargePage.css';
import queryString from 'query-string';
import {
    Panel,
    PanelHeader,
    PanelBody,
    Cells,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Flex,
    FlexItem,
    Button
} from 'react-weui';
import { Toast } from 'antd-mobile';
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'

class ChargePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: 0,
            emptyText: '',
            inputValue: '',
            chargeValue: 0,
            presentValue: 0,
            focus: false,
            organId: 0,
            organName: '',
            presentList: [],
            rowList: [],
            openId: ''
        }
    }

    componentDidMount(options) {
        document.title = "充值";
        var param = queryString.parse(this.props.location.search);
        var organId = param.organId ? param.organId : 0;
        var organName = param.organName ? param.organName : '';
        var openId = param.openId ? param.openId : '';
        this.state.organId = organId;
        this.state.organName = organName;
        this.state.openId = openId;
        this.loadData();
    }

    switchTag(event) {
        var tag = event.currentTarget.getAttribute("data-tag");
        this.switchTagAction(tag);
    }

    switchTagAction(tag) {
        var item = this.state.presentList[tag];
        var chargeValue = item.chargeAmount;
        var presentValue = item.presentAmount;
        this.setState({ tag: tag, chargeValue: chargeValue, presentValue: presentValue });
    }

    loadData() {
        var that = this;
        netbarService.queryChargePresentList({ organId: this.state.organId }, {
            success: function(res) {
                var presentList = res.data;

                if (presentList.length > 0) {
                    var rowList = new Array();
                    for (var i = 0; i < presentList.length; i++) {
                        var item = presentList[i];
                        item.tag = i;
                        item.chargeAmount = item.chargeAmount.toFixed(0);
                        item.presentAmount = item.presentAmount.toFixed(0);

                        var rows = Math.floor(i / 3);
                        var array = null;
                        if (rowList.length <= rows) {
                            array = new Array();
                            rowList.push(array);
                        } else {
                            array = rowList[rows];
                        }
                        array.push(item);
                    }

                    that.setState({ presentList: res.data, rowList: rowList });
                    that.switchTagAction(0);
                } else {
                    that.setState({ presentList: [], rowList: [], emptyText: '门店暂未开通充值业务' });
                }
            }, error: function(error) {
                Toast.fail(error);
            }
        })
    }

    charge() {
        var that = this;
        Toast.loading("加载中...", 30)
        // var openId = app.getCookieValue("openId");
        var params = { chargeAmount: this.state.chargeValue, organId: this.state.organId, openId: this.state.openId };

        netbarService.charge(params, {
            success: function(res) {
                Toast.hide();
                var data = res.data.tn;
                var url = app.payUrl() + '?type=recharge' + '&timestamp=' + data.timeStamp
                    + '&nonceStr=' + data.nonceStr
                    + '&prepay_id=' + data.packageStr.substring(data.packageStr.indexOf("=") + 1)
                    + '&signType=' + data.signType
                    + '&paySign=' + data.paySign
                    + '&appId=' + data.wxAppId;
                var callbackUrl =  window.location.origin + '/xcx/#/mywallet';
                window.localStorage.setItem('wx_pay_callback_url', callbackUrl);
                window.location.replace(url);
            },
            error: function(error) {
                Toast.fail(error);
            }
        })
    }

    render() {
        return (
            <div className='page'>
                <Panel>
                    <Cell style={{ fontSize: "16px" }}>
                        <CellBody>门店名称</CellBody>
                        <CellFooter>{this.state.organName}</CellFooter>
                    </Cell>
                </Panel>

                <Panel style={{paddingBottom: "12px"}}>
                    {
                        this.state.rowList.length == 0 ?
                            <div className='charge_empty_text'>{this.state.emptyText}</div>
                            :
                            <div>
                                {
                                    this.state.rowList.map((row, index) => 
                                        {
                                            return <Flex key={index}>
                                                {
                                                    row.map((item, i) => {
                                                        return <FlexItem key={i} data-tag={item.tag} className={this.state.tag == item.tag ? "charge_item selected" : "charge_item"} onClick={this.switchTag.bind(this)}>
                                                            {
                                                                item.presentAmount > 0 ? 
                                                                <div>
                                                                    <div className="charge_item_value">{item.chargeAmount}元</div>
                                                                    <div className="charge_item_present">赠送{item.presentAmount}元</div>
                                                                </div>
                                                                : 

                                                                <div className="charge_item_value" style={{marginTop: "20px"}}>{item.chargeAmount}元</div>
                                                            }
                                                            
                                                        </FlexItem>
                                                    }
                                                    )  
                                                }
                                                  
                                            </Flex>
                                            
                                        }
                                    )
                                }
                            </div>                            
                    }
                </Panel>

                <div className='charge_tips'>
                    温馨提示: 您的充值金额只能用于当前网吧消费，赠送金额不能用于购买商品!
                </div>

                <div className='charge_footer'>
                    <Flex>
                        <FlexItem style={{ textAlign: "center"}}>
                            <div className="charge_text">金额: {this.state.chargeValue > 0 ? this.state.chargeValue : '--' } 元</div>
                            <div className="charge_present_text">(赠送 {this.state.presentValue > 0 ? this.state.presentValue : '--' } 元)</div>
                        </FlexItem>
                        <FlexItem className={this.state.chargeValue == 0 ? 'charge_button disable' : 'charge_button'} onClick={this.charge.bind(this)}>
                            充值
                        </FlexItem>
                    </Flex>
                </div>
            </div>
        );
    }
}

export default ChargePage;