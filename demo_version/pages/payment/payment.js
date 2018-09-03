// 引用日志输出
var Journal = require('../tool/journal.js')
//引入签名加密商户号
var Sign = require('../tool/sign.js')
//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
//全局通用js
var Currency = require('../tool/currency.js');

// 支付渠道JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixin_pay_type: true,
    chuzhi_pay_type: false,
    chzhi_money: '0.00',
    money: '0.00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    this.setData({
      money: options.money ? options.money:'0.00',
      order_no: options.order_no ? options.order_no : null,
      store_id: options.store_id ? options.store_id: null,
    })
    //初始化页面加载
    Refresh(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //选中微信支付
  weixin_pay: function () {
    this.setData({
      weixin_pay_type: !this.data.weixin_pay_type,
      chuzhi_pay_type: false,
    })

  },
  //选中储值支付
	chuzhi_pay: function () {
		var token = Sign.getToken();
		if (!token) {
			Currency.registerrule(this, function (that) { getMemberStoredValueBalance(that) });
		} else {
			getMemberStoredValueBalance(this);
		}
  },
  //确认支付
  sumbit_pay: function () {
    var weixin_pay_type = this.data.weixin_pay_type;
    var chuzhi_pay_type = this.data.chuzhi_pay_type;
    var chzhi_money = this.data.chzhi_money;
    var money = this.data.money;
    //微信支付
    if (weixin_pay_type && !chuzhi_pay_type) {
      chatPaymen(this)
    }
    //储值支付
    if (!weixin_pay_type && chuzhi_pay_type && chzhi_money - money >= 0) {

      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定要使用储值支付此笔订单？',
        success: function (res) {
          if (res.confirm) {
            setMemberStoredValueBalancePay(that);
          } else if (res.cancel) {
            MyUtils.myconsole('用户点击取消')
          }
        }
      })
    }
  },
  //登入完成回调
  login_success: function () {
     Refresh(this);
  },
})




//页面初始化加载
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
		 //验证登入
		 var openid = Currency.getOpenid();
		 if (!openid) {
          that.setData({
             login: true,
          })
       } else {
          //页面浏览统计
          Currency.visit(that, 4);
          that.setData({
             login: false,
          })
       }
	  },
	  function () {
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
		  //错误提示
		  that.setData({
			  show_loading_faill: false,
			  show: ['2', '页面加载失败（商户不存在）', '2']
		  });
	  },
  )
}




/*==================数据请求方法==================*/

//获取会员储值余额接口
function getMemberStoredValueBalance(that) {
  //获取token
  var token = Sign.getToken();
    var data = {};
    data['token'] = token;
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign(data);

    Request.request_data(
      Server.GETPAYMEMBER(),
      data,
      function (res) {
        if (res) {
          Journal.myconsole('储值余额：' + res.balance);
			  that.setData({
				  weixin_pay_type: false,
				  chzhi_money: parseInt(res.balance).toFixed(2),
				  chuzhi_pay_type: !that.data.chuzhi_pay_type,
          })
        } else {
          Currency.show_top_msg(that, '储值余额获取失败！');
        }

      },
      function (res) {
        Currency.show_top_msg(that, res ? res : '储值余额获取失败！');
      },
		 function (res) {
			 Journal.myconsole("请求会员储值余额的数据：")
			 Journal.myconsole(res);
      })
}


//调取微信支付
function chatPaymen(that) {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  var data = {};
  data['order_no'] = that.data.order_no;
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign(data);
  data['openid'] = Currency.getOpenid();
  data['store_id'] = that.data.store_id;
  Request.request_data(
    Server.PAYMENTSUCCESS(),
    data,
    function (res) {
      if (res) {
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
            Journal.myconsole('支付成功：');
            Journal.myconsole(res1);
            // show_top_msg(that, '微信支付成功')
            wx.showModal({
              title: '提示',
              content: '支付已完成',
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: '../payment/payment_success?order_no=' + that.data.order_no,
                })
              }
            })
          },
          'fail': function (res2) {
            Journal.myconsole('支付失败：');
            Journal.myconsole(res2);
            if (res2.errMsg =="requestPayment:fail cancel"){
              Currency.show_top_msg(that, '支付已取消')
            }else{
              Currency.show_top_msg(that, res2 && res2.err_desc ? res2.err_desc : '支付失败')
            }
          }
        })

      } else {
        Currency.show_top_msg(that, '调取微信支付失败')
      }

      wx.hideLoading()
    },
    function (res) {
      wx.hideLoading()
      Currency.show_top_msg(that, res ? res : '调取微信支付失败')
    },
	 function(res){
      //关闭加载中动画
		 wx.hideLoading()
		 Journal.myconsole("请求支付参数的数据：");
		 Journal.myconsole(res);
    })
}


//储值支付
function setMemberStoredValueBalancePay(that) {
  //获取token
  var token = Sign.getToken();
    var money = (that.data.money + '00').replace(/\.([\d]{2})/, '$1.') * 1;
    var data = {};
    data['token'] = token;
    data['method'] = 'trade.balance.pay';
    data['order_no'] = that.data.order_no;
    data['pay_money'] = money;
    data['type'] = '1';
    data['merchant_id'] = Currency.getmerchant_id();

    Request.request_data(
      Server.SETPAYMEMBER(),
      data,
      function (res) {
        if (res) {
          var order_no = res.order_no;
          wx.showModal({
            title: '提示',
            content: '支付已完成',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../payment/payment_success?order_no=' + that.data.order_no,
              })
            }
          })
        } else {
          Currency.show_top_msg(that, '储值支付失败！');
        }

      },
      function (res) {
        Currency.show_top_msg(that, res ? res : '储值支付失败！');
      },
		 function (res) {
			 Journal.myconsole("请求储值支付的数据：");
			Journal.myconsole(res);
      })
}