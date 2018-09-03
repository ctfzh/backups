// 余额明细js

// 引用日志输出
var MyUtils = require('../base/utils/utils.js');
//引入签名加密商户号
var MySign = require('../base/utils/sign.js');
//网络请求
var MyRequest = require('../base/utils/request_management.js');
//数据接口地址
var MyHttp = require('../base/utils/httpurl.js');
//全局通用js
var Extension = require('../base/utils/Extension_tool.js');

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
				var token = MySign.getToken();
				if (token) {
					//获取余额明细数据
					get_balance_detail(that);
				} else {
					Extension.on_skip(that, function (that) { get_balance_detail(that) });
				}
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


/*==================数据请求方法==================*/

// 获取余额明细数据
function get_balance_detail(that) {
  var token = MySign.getToken();
	var data = {};
	data['sign'] = MySign.sign(data);
	data['mchid'] = MySign.getMchid();
  data['token'] = token;
	MyRequest.request_data(
		MyHttp.BALANCEDETAIL(),
    data,
    function (res) {
      if (res && res.length > 0) {
        that.setData({
          show_loading_faill: true,
          content: res,
        })
      } else {
			//自定义错误提示
			Extension.custom_error(that, '3', '暂无记录', '', '');
      }
    },
		function (res) {
			//错误提示
			Extension.error(that, res);
    },
		function (res) {
			MyUtils.myconsole("请求余额明细的数据：");
			MyUtils.myconsole(res);
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
    });
}