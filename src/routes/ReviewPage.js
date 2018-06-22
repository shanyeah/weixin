import React from 'react';
import './ReviewPage.css'
import queryString from 'query-string'
import {
    Panel,
    PanelHeader,
    PanelBody,
    Cell,
    CellBody,
    TextArea,
    Button
} from 'react-weui';
import { Toast } from 'antd-mobile';
import * as netbarService from '../services/NetbarService';
import * as app from '../utils/app'

import IconStar from '../assets/star.png'
import IconStarEmpty from '../assets/star_empty.png'

class ReviewPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organId: 0,
            text: "",
            stars: [1, 2, 3, 4, 5],
            serviceScore: 5,
            envScore: 5,
            speedScore: 5,
            configScore: 5
        }
    }

    componentDidMount(options) {
        document.title = "评论";
        var param = queryString.parse(this.props.location.search);
        this.state.organId = param.organId;
    }

    tapStar(e) {
        var tag = e.currentTarget.getAttribute("data-tag");
        var rate = e.currentTarget.getAttribute("data-rate");
        switch (tag) {
            case '0':
                this.setState({ serviceScore: rate });
                break;
            case '1':
                this.setState({ envScore: rate });
                break;
            case '2':
                this.setState({ speedScore: rate });
                break;
            case '3':
                this.setState({ configScore: rate });
                break;
        }
    }

    submit() {
        if (this.state.text.length == 0) {
            Toast.info("请输入评价");
            return;
        }

        var params = {
            organId: this.state.organId,
            content: this.state.text,
            serviceScore: this.state.serviceScore * 2,
            envScore: this.state.envScore * 2,
            speedScore: this.state.speedScore * 2,
            configScore: this.state.configScore * 2
        };

        var that = this;
        netbarService.addReview(params, {
            success: function (data) {
                Toast.success("评论成功!");
                that.props.history.goBack();
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
                <div className="review_title">填写您的评价和评分</div>
                <Panel>
                    <Cell>
                        <CellBody>
                            <TextArea rows="5" maxLength={200} onChange={e=>{
                                that.setState({ text: e.target.value});
                            }}>

                            </TextArea>
                        </CellBody>
                        
                    </Cell>
                    <Cell>
                        <CellBody>
                            <div style={{display: "flex", height: "30px", fontSize: "15px"}}>
                                <div style={{marginRight:"6px"}}>服务:</div>
                                {
                                    this.state.stars.map((item, index) => 
                                        <img data-tag="0" key={index} data-rate={item} onClick={this.tapStar.bind(this)} className="review_star_icon" src={this.state.serviceScore >= item ? IconStar : IconStarEmpty} ></img>
                                    )
                                }
                                <div className="marginLeft:6px">{ this.state.serviceScore * 2 }分</div>
                            </div>

                            <div style={{ display: "flex", height: "30px", fontSize: "15px" }}>
                                <div style={{ marginRight: "6px" }}>环境:</div>
                                {
                                    this.state.stars.map((item, index) =>
                                        <img data-tag="1" key={index} data-rate={item} onClick={this.tapStar.bind(this)} className="review_star_icon" src={this.state.envScore >= item ? IconStar : IconStarEmpty} ></img>
                                    )
                                }
                                <div className="marginLeft:6px">{this.state.envScore * 2}分</div>
                            </div>

                            <div style={{ display: "flex", height: "30px", fontSize: "15px" }}>
                                <div style={{ marginRight: "6px" }}>网速:</div>
                                {
                                    this.state.stars.map((item, index) =>
                                        <img data-tag="2" key={index} data-rate={item} onClick={this.tapStar.bind(this)} className="review_star_icon" src={this.state.speedScore >= item ? IconStar : IconStarEmpty} ></img>
                                    )
                                }
                                <div className="marginLeft:6px">{this.state.speedScore * 2}分</div>
                            </div>

                            <div style={{ display: "flex", height: "30px", fontSize: "15px" }}>
                                <div style={{ marginRight: "6px" }}>配置:</div>
                                {
                                    this.state.stars.map((item, index) =>
                                        <img data-tag="3" key={index} data-rate={item} onClick={this.tapStar.bind(this)} className="review_star_icon" src={this.state.configScore >= item ? IconStar : IconStarEmpty} ></img>
                                    )
                                }
                                <div className="marginLeft:6px">{this.state.configScore * 2}分</div>
                            </div>


                        </CellBody>
                    </Cell>
                </Panel>

                <div className="review_submit_button">
                    <Button onClick={this.submit.bind(this)}>
                        提交
                    </Button>
                </div>  
            </div>
        );
    }
}

export default ReviewPage;