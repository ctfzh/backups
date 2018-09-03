//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 在需要使用的js文件中，导入js  
var util = require('../../utils/util.js');  

// 限时折扣组件js
var timer; // 计时器
Component({
  //引入组件通用js
  behaviors: [myBehavior],

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  attached: function () {
    clearTimeout(timer);
    var that = this;
    //获取开始时间
    startTime(that);
    //获取活动结束时间
    endTime(that);
    //倒计时
    count_down(that);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})

//获取活动开始时间
function startTime(that){
  var start_time = that.data.list.date.startTime;
  if (start_time) {
    //月日
    var arr1 = start_time.split(" ");
    var sdate = arr1[0].split('-');
    var start_date = sdate[1] + "月" + sdate[2]+"日";
    //时分
    var sdate_time = arr1[1].split(':');
    var start_time = sdate_time[0] + ":" + sdate_time[1];
    that.setData({
      start_date: start_date,
      start_time: start_time,
    })
  } 
}

//获取活动结束时间
function endTime(that) {
  var end_time = that.data.list.date.endTime;
  if (end_time) {
    //月日
    var arr1 = end_time.split(" ");
    var sdate = arr1[0].split('-');
    var end_date = sdate[1] + "月" + sdate[2] + "日";
    //时分
    var sdate_time = arr1[1].split(':');
    var end_time = sdate_time[0] + ":" + sdate_time[1];
    that.setData({
      end_date: end_date,
      end_time: end_time,
    })
  }
}


/* 毫秒级倒计时 */
function count_down(that) {
	// 当前时间
	var current_time = util.Time(new Date());
  if (that.data.list.date.startTime > current_time){
    var expireTime = that.data.list.date.startTime;
  }else{
    var expireTime = that.data.list.date.endTime;
  }
  if (expireTime){
    //2016-12-27 12:47:08 转换日期格式  
    var a = expireTime.split(/[^0-9]/);
    //截止日期：日期转毫秒  
    var expireMs = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    //倒计时毫秒  
    var duringMs = expireMs.getTime() - (new Date()).getTime();
    // 渲染倒计时时钟  
    // that.setData({
    //   clock: date_format(that,duringMs)
    // });
    date_format(that, duringMs);
  }
}

/* 格式化倒计时 */
function date_format(that,micro_second) {
  if (micro_second <= 0) {
    that.setData({
      clock_hr: '00',
      clock_min: '00',
      clock_sec: '00',
    });
    // timeout则跳出递归  
    return;
  }
  // 秒数  
  var second = Math.floor(micro_second / 1000);
  // 小时位  
  var hr = fill_zero_prefix(Math.floor(second / 3600));
  // 分钟位  
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位  
  var sec = fill_zero_prefix(second % 60);// equal to => var sec = second % 60;  
  // return " " + hr + ":" + min + ":" + sec + " ";
  that.setData({
    clock_hr: hr,
    clock_min: min,
    clock_sec: sec,
  });
  //延时调用
  timer = setTimeout(function () {
    // 放在最后--  
    micro_second -= 1000;
    date_format(that, micro_second);
  }, 1000);
}

/* 分秒位数补0 */
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}