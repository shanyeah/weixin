webpackJsonp([19],{485:function(e,t,a){"use strict";function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function s(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(185),r=s(o),m=a(9),n=s(m),d=a(5),l=s(d),c=a(8),u=s(c),v=a(6),f=s(v),h=a(7),p=s(h);a(186);var g=a(0),I=s(g),N=a(183),T=(i(N),a(190)),y=i(T),_=a(187),k=s(_);a(184),a(588);var E=function(e){function t(e){(0,l.default)(this,t);var a=(0,f.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.state={organId:0,stgId:0,organName:"",movieId:0,movieName:"",movieDesc:"",movieRunTime:0,startTime:"",endTime:"",roomId:0,roomName:"",room:"",roomList:[],price:0,userPrice:0,back:!0},a}return(0,p.default)(t,e),(0,u.default)(t,[{key:"componentWillUnmount",value:function(){if(this.state.back){var e="./movieBook?organId="+this.state.organId+"&stgId="+this.state.stgId+"&organName="+this.state.organName+"&movieId="+this.state.movieId+"&movieName="+this.state.movieName+"&movieDesc="+this.state.movieDesc+"&movieRunTime="+this.state.movieRunTime+"&startTime="+this.state.startTime+"&endTime="+this.state.endTime+"&roomId="+this.state.roomId+"&roomName="+this.state.roomName+"&price="+this.state.price+"&userPrice="+this.state.userPrice;this.props.history.push(e)}}},{key:"componentDidMount",value:function(e){document.title="选择影院的主题厅";var t=k.default.parse(this.props.location.search);this.setState(t),this.state.organId=t.organId,this.state.stgId=t.stgId,this.state.startTime=t.startTime,this.state.endTime=t.endTime,this.loadData()}},{key:"loadData",value:function(){var e=this,t={stgId:this.state.stgId,serviceId:1,startTime:this.state.startTime,endTime:this.state.endTime};y.queryMovieRoomList(t,{success:function(t){var a=t.dataList;e.setState({roomList:a})},error:function(e){r.default.fail(e)}})}},{key:"render",value:function(){var e=this,t=this;return I.default.createElement("div",{className:"page"},I.default.createElement("div",{style:{overflow:"hidden"}},this.state.roomList.map(function(a,i){return I.default.createElement("div",{key:i,"data-movieid":a.id},I.default.createElement("div",{className:"movie_cell","data-index":i,onClick:function(a){var i=a.currentTarget.getAttribute("data-index"),s=t.state.roomList[i];if(s.allowOnlineBook){var o=s.id,m=s.name,n=s.price,d=s.userPrice,l=s.categoryId,c=s.categoryName,u="./movieBook?organId="+e.state.organId+"&stgId="+e.state.stgId+"&organName="+e.state.organName+"&movieId="+e.state.movieId+"&movieName="+e.state.movieName+"&movieDesc="+e.state.movieDesc+"&movieRunTime="+e.state.movieRunTime+"&startTime="+e.state.startTime+"&endTime="+e.state.endTime+"&roomId="+o+"&roomName="+m+"&roomCategoryId="+l+"&roomCategoryName="+c+"&price="+n+"&userPrice="+d;t.state.back=!1,t.props.history.replace(u)}else r.default.info("不可预订")}},I.default.createElement("img",{src:a.imageUrl,className:"movie_image",mode:"aspectFill"}),I.default.createElement("div",{style:{width:"60%"}},I.default.createElement("div",{className:"movie_name"},a.name),I.default.createElement("div",{className:"movie_desc"},a.categoryName," | ",a.peopleNumLimit,"人"),I.default.createElement("div",{className:"movie_desc",style:{marginTop:"26px"}},"原价:￥",a.price,"      会员价:￥",a.userPrice)),I.default.createElement("div",null,1==a.allowOnlineBook?I.default.createElement("div",{className:"movie_book"},"预约"):null)),I.default.createElement("div",{className:"movie_separator"}))})))}}]),t}(I.default.Component);t.default=E,e.exports=t.default},588:function(e,t){}});