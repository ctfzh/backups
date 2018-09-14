// 使用须知

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
//base64编码解析
var base64 = require('../JS/tool/base64.js');
//富文本
var WxParse = require('../overall_situation_modular/wxParse/wxParse.js');

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
	  //初始化页面
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
  retry: function () {
	  //初始化页面
	  Refresh(this);
  },
  //登入完成回调
  login_success: function () {
	  //浏览量统计
	  Currency.visit(this);
	  this.setData({
		  login: false,
	  })
  },
})


/******************************************普通方法******************************************/
// 页面初始化
function Refresh(that) {
	//获取商户号
	Sign.getExtMchid(
		function () {
			//首页接口
			instructions(that);
		},
		function () {
			//关闭加载中动画
			setTimeout(function () {
				wx.hideLoading()
			}, 2000)
			that.setData({
				show: false,
				retry_an: 1,
				error: 1,
				error_text: "商户不存在",
			})
		},
	)
}

/*************************获取数据方法*******************************/
// 获取使用须知数据
function instructions(that) {
	var token = Sign.getToken();
	if (token) {
		var data = {};
		data["token"] = token;
		data['mchid'] = Sign.getMchid();
		data['sign'] = Sign.sign();

		Request.request_data(
			Server.INSTRUCTIONS(),
			data,
			function (res) {
				//浏览量统计
				Currency.visit(that);
				if(res){
					that.setData({
						show: true,
						res: res
					});
					if (res.content){
						WxParse.wxParse('article', 'html', res.content, that, 0);
					}
				}else{
					that.setData({
						show: false,
						retry_an: 0,
						error: 1,
						log: 0,
						error_text: "暂无须知",
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
				Journal.myconsole("使用须知请求数据");
				Journal.myconsole(res);
			});
	} else {
		that.setData({
			show: false,
			log: 1,
			retry_an: 0,
			error: 1,
			error_text: '绑定手机号',
		})
	}
}
