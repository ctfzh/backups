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

// 消费记录js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
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
  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    //初始化页面加载
    Refresh(this);
  },
  // 跳转到我的详情
  jump_details: function (event) {
    var order_no = event.currentTarget.dataset.list.order_no;
    wx.navigateTo({
      url: '/pages/user/consume_details?order_no=' + order_no
    })
  },
  //取消订单
  cancelOrder:function (event){
    var order_no = event.currentTarget.dataset.list.order_no;
    toCancelOrder(this, order_no);
  },
  //确认支付
  confirm_pay: function(event){
    var order_no = event.currentTarget.dataset.list.order_no;
    var total_money = event.currentTarget.dataset.list.total_money;
    var store_id = event.currentTarget.dataset.list.store_id;
    wx.navigateTo({
      url: '/pages/payment/payment?order_no=' + order_no + '&money=' + total_money + '&store_id=' + store_id,
    })
  },
   //登入完成回调
   login_success: function () {
      Refresh(this);
   },
	//登入
	login_an(e) {
		Currency.registerrule(this, function (that) { Refresh(that) }, e);
	}
})


//页面加载，重试
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
           Currency.visit(that, 4)
           that.setData({
              login: false,
           })
           get_order_list(that);
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}


/*==================数据请求方法==================*/

// 获取订单列表数据
function get_order_list(that) {
  var token = Sign.getToken();
	if (!token) {
		Currency.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();
		Request.request_data(
			Server.ORDERLIST(),
			data,
			function (res) {
                if (res && res.length > 0) {
					that.setData({
						show_loading_faill: true,
						content: res,
					})
				} else {
					Currency.custom_error(that, '3', '暂无消费记录');
				}
			},
			function (res) {
				Currency.error(that, res);
			},
			function (res) {
				//关闭加载中动画
				wx.hideLoading()
				Journal.myconsole("请求消费记录的数据：");
				Journal.myconsole(res);
			});
	}
}

//调用取消订单接口
function toCancelOrder(that, order_no) {
  var token = Sign.getToken();
  var data = {};
  data['token'] = token;
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['order_no'] = order_no;
  Request.request_data(
    Server.CANCELORDER(),
    data,
    function (res) {
        Currency.show_top_msg(that, res ? res : "订单已取消");
        get_order_list(that);
    },
    function (res) {
      Currency.show_top_msg(that,res ? res : "订单不存在");
    },
    function (res) {
      //关闭加载中动画
		 wx.hideLoading();
		 Journal.myconsole("请求取消订单接的数据：");
		 Journal.myconsole(res);
    });
}