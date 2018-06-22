import React from 'react';
import * as app from '../utils/app'
import {
  Tab,
  TabBody,
  TabBar,
  TabBarItem,
  TabBarIcon,
  TabBarLabel,
  NavBar,
  NavBarItem
} from 'react-weui';
import styles from './IndexPage.css'
import IconHome from '../assets/tab_home.png';
import IconHomeSelected from '../assets/tab_home_selected.png';
import IconDiscover from '../assets/tab_discover.png';
import IconDiscoverSelected from '../assets/tab_discover_selected.png';
import IconMine from '../assets/tab_mine.png';
import IconMineSelected from '../assets/tab_mine_selected.png';

import HomeView from '../components/HomeView';
import DiscoverView from '../components/DiscoverView';
import MineView from '../components/MineView';

import queryString from 'query-string';


class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        tab: 0
    }
  }

  componentWillMount(options) {
    var params = queryString.parse(this.props.location.search);
    if(params.organId) {
        window.localStorage.setItem("ldx_stgId", params.organId);
        this.props.history.replace('/discover');
    }
  }

  componentDidMount(options) {
    
  }

  currentView() {
    switch(this.state.tab + '') {
        case '0':
           document.title = "首页";
           return <DiscoverView location={this.props.location} history={this.props.history}></DiscoverView>;
        case '1': 
           document.title = "发现";
           return <HomeView location={this.props.location} history={this.props.history}></HomeView>;
        case '2':
           document.title = "我的";
          return <MineView location={this.props.location} history={this.props.history}></MineView>;
    }
    return <div></div>
  }

  render() {
    var that = this;
    return (
      <Tab >
        <TabBody>
          {this.currentView()}
        </TabBody>
        <TabBar>
          <TabBarItem
            active={this.state.tab == 0}
            onClick={e => {}}
          >
            <TabBarIcon>
              <img src={this.state.tab == 0 ? IconHomeSelected : IconHome} />
              
            </TabBarIcon>
            <div className={this.state.tab == 0 ? "tab_title selected" : "tab_title"}>
              首页
            </div>
          </TabBarItem>
          <TabBarItem
            active={this.state.tab == 1}
            onClick={e => that.props.history.push("./home")}
          >
            <TabBarIcon>
              <img src={this.state.tab == 1 ? IconDiscoverSelected : IconDiscover} />
            </TabBarIcon>
            
            <div className={this.state.tab == 1 ? "tab_title selected" : "tab_title"}>
              发现
            </div>
          </TabBarItem>
          <TabBarItem
            active={this.state.tab == 2}
            onClick={e => {
              if (app.getUserInfo()) {
                  that.props.history.push("./mine");
              } else {
                  that.props.history.push('/login');
              }
            }}
          >
            <TabBarIcon>
              <img src={this.state.tab == 2 ? IconMineSelected : IconMine} />
            </TabBarIcon>
            <div className={this.state.tab == 2 ? "tab_title selected" : "tab_title"}>
              我的
            </div>
          </TabBarItem>
        </TabBar>
      </Tab>
      );
    }
}

export default IndexPage;
