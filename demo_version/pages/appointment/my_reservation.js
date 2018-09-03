
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

// 我的预约
Page({

  /**
   * 页面的初始数据
   */
  data: {
     show_loading_faill: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
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
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
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
  //详情跳转
  jump: function (e) {
	  var record_id = e.currentTarget.dataset.id
     wx.navigateTo({
		  url: '/pages/appointment/reservation_details?record_id=' + record_id,
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
  //重试事件
  retry_onclick: function () {
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
	  //初始化页面加载
	  Refresh(this);
	},
		//登入
	login_an(e) {
		Currency.registerrule(this, function (that) { Refresh(that) }, e);
	}
})


/*********************************************普通方法****************************************************/
// 页面初始化方法
function Refresh(that) {
   //获取商户号
   Sign.getExtMchid(
		function () {
			var openid = Currency.getOpenid();
			if (!openid) {
                  that.setData({
                     login: true,
                  })
               } else {
                  that.setData({
                     login: false,
                  })
						//预约列表数据
						record(that);
                  //浏览记录
                  Currency.visit(that, 4);
               }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}



/*********************************************获取接口数据方法****************************************************/
// 预约页面数据
function record(that) {
	var data = {};
	data['unionid'] = Currency.getUnionid();
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();

	Request.request_data(
		Server.RECORD(),
		data,
		function (res) {
			if (res && res.list.td.length>0) {
				var time = [];
				for (var i = 0; i < res.list.td.length; i++){
					var time_item = res.list.td[i].create_time;
					time.push(time_item.substr(0, 16));
				}
				that.setData({
					show_loading_faill: true,
					res: res.list,
					time: time,
				})
			} else {
				Currency.custom_error(that, '3', '暂无预约');
			}
		},
		function (res) {
			Currency.error(that, res);
		},
		function (res) {
			//关闭加载中动画
			wx.hideLoading()
			Journal.myconsole("请求预约列表的数据：");
			Journal.myconsole(res);
		});
}