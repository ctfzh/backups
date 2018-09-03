//全局工具js

//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
// 引用日志输出
var Journal = require('../tool/journal.js');
//引入签名加密商户号
var Sign = require('../tool/sign.js');

// 加载窗口
function show_loading_faill(that, loading_type, remind_text) {
  var img_url = '';
  var retry_text = '';
  if (loading_type == 0) {
    img_url = '../img/banner/loading.gif'
  } else if (loading_type == 1) {
    img_url = '../img/banner/faill_img.png'
    retry_text = '重试'
  } else if (loading_type == 2) {
    img_url = '../img/banner/faill_img.png'
  }
  that.setData({
    show_loading_faill: false,
    remind_text: remind_text,
    img_url: img_url,
    loading_type: loading_type,
    retry_text: retry_text,
  })

}

//弹窗窗口
function show_top_msg(that, content) {
  that.setData({
    isTopTips: true,
    TopTipscontent: content
  });

  setTimeout(function () {
    that.setData({
      isTopTips: false
    });
  }, 1500);
}

//全局存储openid
function getOpenid() {
  try {
    var openid = wx.getStorageSync('openid')
    if (openid) {
      return openid;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

//全局存储unionid
function getUnionid() {
  try {
    var unionid = wx.getStorageSync('unionid')
    if (unionid) {
      return unionid;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

//全局存储userInfo
function getuserInfo() {
  try {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      return userInfo;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}


//微信支付
function chatPaymen(that, order_no, function_type, nav, info) {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  var data = {};
  data['order_no'] = order_no;
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['openid'] = getOpenid();
  Request.request_data(
    Server.PAYMENTSUCCESS(),
    data,
    function (res) {
        //关闭加载中动画
        wx.hideLoading()
        //微信支付api
        wx.requestPayment({
          'appId': res.appId,
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res1) {
             if (info == 1) {
                that.info()
             }
          },
          'fail': function (res2) {
            if (res2.errMsg == "requestPayment:fail cancel") {
              wx.showToast({
                title: "已取消支付",
                icon: 'none',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: res2 && res2.err_desc ? res2.err_desc : '支付失败，请稍后重试',
                icon: 'none',
                duration: 1000
              })
				 }
          },
			  'complete': function (res) {
				  var time = 1000;
				  if (res.errMsg=="requestPayment:ok"){
					  time = 0;
				  }
				  jump_details(info, nav, function_type, order_no, time);
          }
        })
    },
    function (res) {
		 //支付接口调起失败
      wx.showToast({
        title: res ? res : "支付失败，请稍后重试",
        icon: 'none',
        duration: 2000
       })
		 //跳转详情
		 jump_details(info, nav, function_type, order_no, 1000);
    },
    function (res) {
      Journal.myconsole("获取到的支付参数：")
      Journal.myconsole(res);
    })
}
function jump_details(info, nav, function_type, order_no, tiem){
	if (info != 1) {
		var url = '/pages/order/takeout_order_details?order_no=' + order_no;
		if (function_type == 1) {
			url = '/pages/order/forthwith_order_details?order_no=' + order_no;
		}
		setTimeout(function () {
			if (nav) {
				wx.navigateTo({
					url: url,
				})
			} else {
				wx.redirectTo({
					url: url,
				})
			}
		}, tiem)
	}
}


//去登入
function log_in() {
  wx.navigateTo({
    url: '/pages/account_number/bind_account',
  })
}

// 页面访问统计
function visit(that) {
   var data = {};
   data['mchid'] = Sign.getMchid();
   data['sign'] = Sign.sign();
   data['openid'] = getOpenid();
   data['channel'] = "1";
   
   Request.request_data(
      Server.VISIT(),
      data,
      function (res) {
      },
      function (res) {
      },
      function (res) {
         Journal.myconsole("浏览统计返回数据")
         Journal.myconsole(res);
      })
}


//建立调用
module.exports = {
  //加载中，加载失败提示
  show_loading_faill: show_loading_faill,
  //弹窗窗口
  show_top_msg: show_top_msg,
  //全局存储openid
  getOpenid: getOpenid,
  //全局存储unionid
  getUnionid: getUnionid,
  //全局存储userInfo
  getuserInfo: getuserInfo,
  //微信支付
  chatPaymen: chatPaymen,
  //去登入
  log_in: log_in,
//   页面访问统计
  visit: visit,
}