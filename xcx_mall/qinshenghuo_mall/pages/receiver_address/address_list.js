// 收货地址列表
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
	  show_loading_faill:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var goods_info = options.goods_info;
	  goods_info = goods_info ? goods_info : null;
	  this.setData({
		  goods_info,
	  })
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
	  //重新加载页面
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

	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		//重新加载
		Refresh(this)
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
	},

	//编辑地址
	alter_tap (e) {
		var address = JSON.stringify(e.currentTarget.dataset.address);
		wx.navigateTo({
			url: '/pages/receiver_address/address_dispose?address=' + address,
		})
	},
	
	//添加地址
	add_tap (e){
		wx.navigateTo({
			url: '/pages/receiver_address/address_dispose',
		})
	},

	// 设置默认地址
	set_default (e){
		var id = e.currentTarget.dataset.id;
		if(id){
			get_default(this, id)
		}else{
			Extension.show_top_msg(that, '无效地址');
		}
	}
})



//页面加载，重试
function Refresh(that) {
	//获取商户号
	MySign.getExtMchid(
		function () {
			var openid = Extension.getOpenid();
			if (!openid) {
				var login = true;
			} else {
				var login = false;
				if (that.data.goods_info){
					//选择收货地址
					get_address(that);
				}else{
					//收货地址列表
					get_address_list(that);
				}
			}
			that.setData({
				login: login,
			})

		},
		function () {
			Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
	)
}



//获取收货地址列表
function get_address_list(that) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.ADDRESSLIST(),
			data,
			function (res) {
				that.setData({
					usable: res.normal,
					show_loading_faill:true,
				})
			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求收货地址列表的数据：");
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


//提交订单获取收货地址列表
function get_address(that) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		data['goods_info'] = that.data.goods_info;

		MyRequest.request_data(
			MyHttp.ORDERADDRESSLIST(),
			data,
			function (res) {
				that.setData({
					usable: res.effective,
					not_usable: res.invalid,
					show_loading_faill: true,
				})
			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求选择收货地址列表的数据：");
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



//设置默认地址
function get_default(that, id) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		data['id'] = id;

		MyRequest.request_data(
			MyHttp.SETDEFAULT(),
			data,
			function (res) {
				wx.navigateBack({
					delta: 1
				})
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '无效地址');
			},
			function (res) {
				MyUtils.myconsole("请求设置默认地址的数据：");
				MyUtils.myconsole(res);
			})
	}
}