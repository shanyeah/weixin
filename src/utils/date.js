//时间格式转换
function zeroize(string) {
  if (string < 10) return "0" + string; else return string;
}

//清除前后空格
exports.Trim = function(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//为空或全空格
exports.isNull = function(str) {
  if (str == "") return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
}
//补零
exports.zeroize = function (string){
  if (string < 10) return "0" + parseInt(string); else return string;
}
//多少分钟后
exports.minAfter = function(strTime,num){
  var date = new Date(exports.iostime(strTime))
  var min = date.getMinutes();
  date.setMinutes(min + num);
  return exports.formatDate(date)
}
//时间格式转换
exports.formatDate = function (date) {
  return date.getFullYear() + "-" + zeroize(date.getMonth() + 1) + "-" + zeroize(date.getDate()) + " " + zeroize(date.getHours()) + ":" + zeroize(date.getMinutes());
}
//时间格式转换
exports.formatDate2 = function (date) {
  return (date.getMonth() + 1) + "月" + date.getDate() + "日" + " 星期" + date.getDay() +" "+ zeroize(date.getHours()) + ":" + zeroize(date.getMinutes());
}
//某天的几天后多少天后日期
exports.GetDateStr = function(number, startTime) {
  if (startTime) {var dd = new Date(startTime);} else {var dd = new Date();}
  dd.setDate(dd.getDate() + number);//获取number天后的日期  
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0  
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0  
  return y + "-" + m + "-" + d;
} 
//时间差
exports.GetDateDiff = function(day1,day2){  
  var date1 = new Date(day1)
  var date2 = new Date(exports.iostime(day2))

  var s1 = date1.getTime(), s2 = date2.getTime();
  var total = (s2 - s1) / 1000;

  var day = parseInt(total / (24 * 60 * 60));//计算整数天数
  var afterDay = total - day * 24 * 60 * 60;//取得算出天数后剩余的秒数
  var hour = parseInt(afterDay / (60 * 60));//计算整数小时数
  var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60;//取得算出小时数后剩余的秒数
  var min = parseInt(afterHour / 60);//计算整数分
  var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60;//取得算出分后剩余的秒数
  return {
    time: day + "天 " + zeroize(hour) + ":" + zeroize(min)
  }
}