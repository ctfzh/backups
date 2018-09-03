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

// 储值卡/码页js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  show_loading_faill:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
     Refresh(this);
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
  //兑换
	getRechargeCode: function (e) {
		var token = Sign.getToken();
		if (token){
			get_recharge_code(this)
	  }else{
			Currency.registerrule(this, function (that) { get_recharge_code(that) }, e);
	  }
  },
  //获取用户储值码
  getCode: function(event) {
    this.setData({
      codeValue: event.detail.value
    });
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
            Currency.visit(that, 4)
            that.setData({
               login: false,
            })
         }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}


/*==================数据请求方法==================*/

// 获取充值卡数据
function get_recharge_code(that) {
  var token = Sign.getToken();
	if (!token) {
		Currency.custom_error(that, '3', '登录失效', '', '3');
	} else {
		console.log(that.data.codeValue);
		var data = {};
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();
		data['token'] = token;
		data['code'] = that.data.codeValue;
		Request.request_data(
			Server.GET_RECHARGECODE(),
			data,
			function (res) {
				wx.showToast({
				title: '兑换成功',
				icon: 'success',
				duration: 1500
				})
			},
			function (res) {
				Currency.show_top_msg(that, res ? res : "兑换码错误");
			},
			function (res) {
				Journal.myconsole('请求兑换码数据');
				Journal.myconsole(res);
			});
	}
}