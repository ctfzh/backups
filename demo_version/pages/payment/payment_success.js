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

// 消费记录详情JS
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
    var that = this;
    that.setData({
      order_no: options.order_no
    });
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
  //完成
  complete_an: function(){
    wx.switchTab({
      url: '../home/home',
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
            // 获取消费记录详情数据
            get_consume_detail(that);
         }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}

/*==================数据请求方法==================*/

// 获取消费记录详情数据
function get_consume_detail(that) {
  var token = Sign.getToken();
	if (!token) {
		Currency.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['order_no'] = that.data.order_no;
		Request.request_data(
			Server.ORDERDETAIL(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						content: res,
					})
				} else {
					Currency.custom_error(that, '3', '暂无记录');
				}
			},
			function (res) {
				Currency.error(that, res);
			},
			function (res) {
				Journal.myconsole("请求消费详情的数据：");
				Journal.myconsole(res);
			});
  }
}