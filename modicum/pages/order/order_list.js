// pages/order/order_list.js

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
    // tab切换
    curNavIndex: 1,
    // order_type    1 点餐 2 外卖
    order_type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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
    //初始化页面
    Refresh(this)
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
  tab: function (e) {
    var dataId = e.currentTarget.dataset.id;
    this.setData({
      curNavIndex: dataId,
      order_type: dataId
    });
    Refresh(this);
  },
  // 取消订单
  cancel_order: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order_no;
    var pay_status = e.currentTarget.dataset.pay_status;
    var order_status = e.currentTarget.dataset.order_status;
	 var telephone = e.currentTarget.dataset.telephone;
	 var is_refund = e.currentTarget.dataset.is_refund;

    that.setData({
      order_no: order_no
    });
    // pay_status 1 待付款 2已付款 
    if (pay_status == 1) {   //支付状态  1（未支付）
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
    }  else {
		 if (is_refund == 1) {
			 wx.showModal({
				 title: '取消订单并退款',
				 content: '退款将原路返回到您的支付账户',
				 cancelText: '不取消了',
				 confirmText: '取消订单',
				 success: function (res) {
					 if (res.confirm) {
						 cancelOrder(that);
						 Refresh(that);
					 }
				 }
			 })
		 } else if (is_refund == 2) {
			 wx.showModal({
				 title: '取消订单提示',
				 content: '请联系商家取消订单',
				 cancelText: '不取消了',
				 confirmText: '联系商家',
				 success: function (res) {
					 if (res.confirm) {
						 wx.makePhoneCall({
							 phoneNumber: telephone,
						 })
					 }
				 }
			 })
		 }
	 }
  },
  // 订单详情
  to_detail: function (e) {
    var order_no = e.currentTarget.dataset.order_no;
    wx.getExtConfigSync()
    // order_type
    if (this.data.order_type == 1) {
      wx.navigateTo({
        url: '/pages/order/forthwith_order_details?order_no=' + order_no,
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/order/takeout_order_details?order_no=' + order_no,
      })
    }

  },
  //支付
  payment: function (e) {
    var order_no = e.currentTarget.dataset.order_no;
    //微信支付
    Currency.chatPaymen(this, order_no, this.data.order_type, 'nav');
  },
  // 去评论
  to_discuss: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order_no;
    var order_id = e.currentTarget.dataset.order_id;
    if (that.data.order_type == 1) {
      wx.navigateTo({
        url: '/pages/grade/forthwith_grade?order_id=' + order_id + '&order_no=' + order_no,
      });
    } else if (that.data.order_type == 2) {
      wx.navigateTo({
        url: '/pages/grade/takeout_grade?order_id=' + order_id + '&order_no=' + order_no,
      });
    }
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})


/****************普通方法***********************/
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      //订单列表
      getOrderList(that);
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        log: 0,
        retry_an: 1,
        error: 1,
        error_text: "商户不存在",
      })
    },
  )
}

/****************数据获取********************/

//获取订单列表
function getOrderList(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data["token"] = token;
    //接口必传
    data['mchid'] = Sign.getMchid();
    //接口必传
    data['sign'] = Sign.sign();
    data['order_type'] = that.data.order_type;

    Request.request_data(
      Server.GET_ORDER_LIST(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        that.setData({
          show: true,
          order_lits: res
        });
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
        Journal.myconsole("订单列表请求数据");
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      log: 1,
      retry_an: 0,
      error: 1,
      error_text: '请绑定手机号后，查看订单',
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
          icon:'success',
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
      log: 1,
      retry_an: 0,
      error: 1,
      error_text: '请绑定手机号后，查看订单',
    })
  }
}