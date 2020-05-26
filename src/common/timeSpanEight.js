// 两次时间间隔是否超过了八小时
const timeSpanEight = function (startDate, startTime,hours) {
  startTime = startTime.padEnd(8, ':00')
  let timeStr = `${startDate} ${startTime}`
  timeStr = timeStr.replace(new RegExp(/-/gm), "/");
  let timeStamp = new Date(timeStr).getTime()
  let nowStamp = new Date().getTime()
  if(Number(hours) >= 0){
    if (nowStamp - timeStamp >= Number(hours) * 3600 * 1000) { // 8小时    2019年6月18日，吴总又将时间调整为了12小时   2019年8月26日，金晓燕又将时间调整为了24小时
      return true
    } else {
      return false
    }
  }else{
    if (nowStamp - timeStamp >= 24.5 * 3600 * 1000) { // 8小时    2019年6月18日，吴总又将时间调整为了12小时   2019年8月26日，金晓燕又将时间调整为了24小时
      return true
    } else {
      return false
    }
  }
}

export default timeSpanEight