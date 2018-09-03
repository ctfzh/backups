//点餐订单详情

// 引用日志输出
var Journal = require('../JS/tool/journal.js')
//引入签名加密商户号
var Sign = require('../JS/tool/sign.js')
//网络请求
var Request = require("../JS/request/request.js")
//数据接口地址
var Server = require('../JS/request/server_address.js');
//全局通用js
var Currency = require('../JS/tool/currency.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shadow: false,
    // order_type    1 点餐 2 外卖
    order_type: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    if (options.order_no && options.order_no != "undefined") {
		 var bar_code_num = options.order_no.substring(options.order_no.length - 8);
      this.setData({
        order_no: options.order_no,
			bar_code_num: bar_code_num
      });
		//初始化页面
		Refresh(this);
    }else{
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        error_text: "订单不存在",
      })
    }
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
    //初始化页面
    Refresh(this);
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
  //支付
  payment: function (e) {
     var order_no = e.currentTarget.dataset.order_no;
     //微信支付
     Currency.chatPaymen(this, order_no, this.data.order_type, 'nav', 1);
  },
  //支付完成回调
  info: function () {
     //初始化页面
     Refresh(this);
  },
  // 取消订单
  cancel_order: function (e) {
    var that = this;
    var pay_status = that.data.order_detail.pay_status;
    // pay_status 1 待付款 2已付款
    if (pay_status == 1) {
      wx.showModal({
        title: '取消订单',
        content: '是否取消订单?',
        cancelText: '不取消了',
        confirmText: '取消订单',
        success: function (res) {
          if (res.confirm) {
            cancelOrder(that);
          }
        }
      })
    } else if (pay_status == 2) {
      if (that.data.order_detail.is_refund == 1) {
        wx.showModal({
          title: '取消订单并退款',
          content: '退款将原路返回到您的支付账户',
          cancelText: '不取消了',
          confirmText: '取消订单',
          success: function (res) {
            if (res.confirm) {
              cancelOrder(that);
            }
          }
        })
      } else if (that.data.order_detail.is_refund == 2) {
        wx.showModal({
          title: '取消订单提示',
          content: '请联系商家取消订单',
          cancelText: '不取消了',
          confirmText: '联系商家',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: that.data.order_detail.store_telephone,
              })
            }
          }
        })
      }
    }
  },
  // 联系商家
  contact_store: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.order_detail.store_telephone,
    })
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})

/****************普通方法***********************/

//刷新页面
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      // 获取订单详情
      getOrderDetail(that);
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        log: 0,
        error_text: "商户不存在",
      })
    },
  )
}



/****************数据获取********************/
//获取订单详情
function getOrderDetail(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data["token"] = token;
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();
    data['order_no'] = that.data.order_no;
    Request.request_data(
      Server.GET_ORDER_DETAIL(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        if (res) {
          that.setData({
            show: true,
            order_detail: res
          });
		  } else {
          that.setData({
            show: false,
            log: 0,
            retry_an: 0,
            error: 1,
            error_text: "订单不存在",
          })
        }
      },
		function (res) {
        that.setData({
          show: false,
          log: 0,
          retry_an: 1,
          error: 0,
          error_text: res,
        })
      },
      function (res) {
        wx.stopPullDownRefresh();
        Journal.myconsole('订单详情请求的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      error: 1,
      retry_an: 0,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}

//取消订单
function cancelOrder(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data["token"] = token;
    //接口必传
    data['mchid'] = Sign.getMchid();
    //接口必传
    data['sign'] = Sign.sign();
    data['order_no'] = that.data.order_no;

    Request.request_data(
      Server.CANCELORDER(),
      data,
      function (res) {
        that.setData({
          show: true,
        });
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
      },
		 function (res) {
			 wx.showToast({
				 title: res ? res : '请求失败，请稍后重试！！！',
				 icon: 'none',
				 duration: 1000
			 })
      },
		 function (res) {
			 //刷新页面
			 Refresh(that);
        Journal.myconsole("取消订单请求数据");
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      error: 1,
      retry_an: 0,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}

