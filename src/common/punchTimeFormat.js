function addDate(date, days) {
  if (days == undefined || days == '') {
    days = 1;
  }
  date = date.replace(new RegExp(/-/gm), "/");
  var date = new Date(date);
  date.setDate(date.getDate() + days);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}

function getFormatDate(arg) {
  if (arg == undefined || arg == '') {
    return '';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }

  return re;
}

// 将上下班时间格式化成整点或半点（:00,:30）
function punchTimeFormat(type, schedulingDate, time) {
  let currentdate = time
  let mins = currentdate.split(':')[1]
  let hour = currentdate.split(':')[0]
  // type == 1 表示上班时间    type == 2
  // 上班时间往后推半小时
  // 下班时间往前推半小时
  if (type == 1) {
    if (mins <= 30) {
      mins = '30'
      return schedulingDate + ' ' + hour + ':' + mins
    } else {
      if (hour < 23) {
        mins = '00'
        hour = Number(hour) + 1
        hour = String(hour).padStart(2, '0')
        return schedulingDate + ' ' + hour + ':' + mins
      } else {
        mins = '00'
        hour = '00'
        let date = addDate(schedulingDate)
        return date + ' ' + hour + ':' + mins
      }
    }
  } else {
    if (mins >= 30) {
      mins = '30'
    } else {
      mins = '00'
    }
    return schedulingDate + ' ' + hour + ':' + mins
  }
}

export default punchTimeFormat