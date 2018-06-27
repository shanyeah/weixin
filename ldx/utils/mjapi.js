
const BETA = 1;
const domain = (BETA == 1 ? 'https://local.api.liandaxia.com/' : 'https://api.liandaxia.com/');
const webDomain = (BETA == 1 ? 'https://local.mjdj.cn/xcx/' : 'https://mjdj.cn/xcx');
module.exports = {
  server: domain,

  getOpenId: 'jssdk/getOpenId.do',
  login: 'xcx/login.do',
  getCode: 'xcx/sendSms.do',

  queryAppAdList: 'xcx/queryAppAdList.do',
  queryNearbyNetbar: 'xcx/queryNearbyNetbar.do',
  netbarDetail: 'xcx/netbarDetail.do',
  
  reviewList: 'xcx/queryNetbarReviewList.do',
  submitReview: 'xcx/saveNetbarReview.do',
  stgList: 'api/stglist.do',
  cardDetail: 'api/carddetail.do',
  cardList: 'api/carddetaillist.do',
  myInfo: 'xcx/myCenter.do',

  queryMyWallet: 'xcx/queryMyWallet.do',
  queryMyWalletLog: 'xcx/queryMyWalletLog.do',
  queryMyOrderList: 'xcx/queryMyGoodsBill.do',
  followStg: 'xcx/followNetbar.do',

  queryFollowNetbarList: 'xcx/queryFollowNetbarList.do',

  charge: 'xcx/userSelfRechange.do',
  queryChargePresentList: 'xcx/queryChargePresentList.do',

  bookUrl: webDomain + 'mj/page/ESP/booksteas.html',
  foodUrl: webDomain + 'mj/page/order/index.html',
  shopUrl: webDomain + 'mj/page/discover/conversionList.html',
  movieUrl: webDomain + 'mj/page/discover/index.html',

  myBookUrl: webDomain + 'mj/page/my/mybook.html',
  myOrderUrl: webDomain + 'xcx/mj/page/my/myorder.html',
  myExchangeUrl: webDomain + 'mj/page/my/myexchange.html',
  myMovieUrl: webDomain + 'mj/page/my/mymovie.html',

  myAchievementUrl: webDomain + 'mj/page/my/mychengjiu.html',
  myActivityUrl: webDomain + 'mj/page/my/myactivity.html',
  myTaskUrl: webDomain + 'mj/page/my/task.html',

  qrcodepayUrl: webDomain + 'mj/page/vip/rcodepay.html',
  chargeUrl: webDomain + 'mj/page/vip/recharge.html',

  consumerDetailUrl: webDomain + 'mj/page/my/consumerdetails.html',
  magicDetailUrl: webDomain + 'mj/page/my/magicdetails.html',

  renameUrl: webDomain + '/mj/page/login/remeans.html',
  resetpassUrl: webDomain + '/mj/page/login/resetpass.html',

  vipProtocolUrl: webDomain + '/mj/page/vip/protocol.html'
}