
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js')
var MyHttp = require('../base/utils/httpurl.js')

//倒计时时间
function COUNTDOWNTIME(){
  return 60;
}

// 获取验证码的请求
function get_code(phone, success, fail) {
  wx.showLoading({
    title: '获取验证码中...',
    mask: true,
  })
  var data = {};

  data['phone'] = phone;
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
    MyHttp.GET_CODE(),
    data,
    function (res) {
      MyUtils.myconsole("获取到的数据：")
      MyUtils.myconsole(res);
      success();
      wx.hideLoading()
    },
    function (res) {
      MyUtils.myconsole("请求失败的数据：")
      MyUtils.myconsole(res);
      fail(res)
      wx.hideLoading()
    })
}

//登录
function wechatappregister(mobile, code, success, fail) {
  wx.showLoading({
    title: '登录中...',
    mask: true,
  })
  var data = {};

  data['mobile'] = mobile;
  data['code'] = code;
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
    MyHttp.LOGIN(),
    data,
    function (res) {
      if(res){
        MyUtils.myconsole("获取到的数据：")
        MyUtils.myconsole(res);
        //储存token
        try {
          wx.setStorageSync('token', res.token)
        } catch (e) {
          
        }
        success();
      }else{
        fail("请求失败")
      }
      wx.hideLoading()
    },
    function (res) {
      MyUtils.myconsole("请求失败的数据：")
      MyUtils.myconsole(res);
      fail(res)
      wx.hideLoading()
    })
}



function startTime(that, second) {
  var time = setTimeout(function () {
    that.setData({
      second: second,
      show_secound: 'block'
    });
    if (second > 0) {
      startTime(that, second - 1);
    } else {
      clearInterval(time);
      that.setData({
        second: '重新获取验证码',
        show_secound: 'none',
        loading_code: false,
      });
    }
  }
    , 1000)
}

//建立调用
module.exports = {
  get_code: get_code,
  wechatappregister: wechatappregister,
  startTime: startTime,
  COUNTDOWNTIME:COUNTDOWNTIME,
}