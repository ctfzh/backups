// pages/payment/paymentsuccess.js
// 支付成功的界面
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    var that = this;
    wx.setNavigationBarTitle({
      title: '支付成功',
    });
    var order_no = options.order_no;
    that.setData({
      order_no: order_no,
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
  //跳转至首页
  home_onclick: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

//跳转至订单详情
  order_onclick:function(){
    var id=this.data.id;
    wx.redirectTo({
      url: '/pages/communal/order_detail?id=' + id,
    })
  },
	//登入完成回调
	login_success: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this);
	},
	//登入
	login_an(e) {
		Extension.registerrule(this, function (that) { Refresh(that) }, e);
	}

})



//页面加载，重试
function Refresh(that) {
  //获取商户号
  MySign.getExtMchid(
    function () {
		 //授权
		 var openid = Extension.getOpenid();
		 if (!openid) {
			 var login = true;
		 } else {
			 var login = false;
			 getPaymentsuccess(that);
		 }
		 that.setData({
			 login: login,
		 })
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}



//储值支付
function getPaymentsuccess(that) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		var order_no = that.data.order_no;
		data['token'] = token;
		data['order_no'] = order_no;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.PAYMENTUCCESS(),
			data,
			function (res) {
				if (res) {
					var order_no = res.order_no;
					var id = res.id;
					var pay_money = res.pay_money;
					var order_type = res.order_type;
					var pay_bonus = res.member_bonus;
					//关闭当前页面跳转至支付界面
					that.setData({
						order_no: order_no,
						id: id,
						pay_money: pay_money,
						pay_bonus: pay_bonus,
						order_type: order_type,
						show_loading_faill: true,
					})
					// wx.redirectTo({
					//   url: '/pages/payment/paymentsuccess?order_no=' + order_no + '&money=' + pay_money+'&id=' + id,
					// })
				} else {
					//自定义错误提示
					Extension.custom_error(that, '3', '支付结果获取失败', '', '');
				}

			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：")
				MyUtils.myconsole(res);
			})
	}
}


