

//补零
export function zeroize(string) {
    if (string < 10) return "0" + parseInt(string); else return string;
}
  //多少分钟后
export function minsAfter(startTime, num) {
    var time = startTime.replace(/-/g, "/");
    var date = new Date(time);
    var min = date.getMinutes();
    date.setMinutes(min + num);
    return exports.formatDate(date)
}

//时间格式转换
export function formatDate(date) {
    return date.getFullYear() + "-" + zeroize(date.getMonth() + 1) + "-" + zeroize(date.getDate()) + " " + zeroize(date.getHours()) + ":" + zeroize(date.getMinutes()) + ":00";
}