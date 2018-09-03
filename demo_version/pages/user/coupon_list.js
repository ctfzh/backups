// 优惠券列表JS

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
    //页面初始化加载
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
    //页面初始化加载
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
  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    //初始化页面加载
    Refresh(this);
  },
  //打开优惠券
  openCard: function (e) {
    var card_id = e.currentTarget.dataset.list.card_id;
    var code = e.currentTarget.dataset.list.code;
    wx.openCard({
      cardList: [
        {
          cardId: card_id,
          code: code,
        }
      ],
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
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


//初始化页面
function Refresh(that) {
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
           //获取优惠券列表信息
           getPrefectData(that);
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}


/***************************接口调用***************************/
//获取优惠券列表信息
function getPrefectData(that) {
  var token = Sign.getToken();
	if (!token) {
		Currency.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = Sign.getMchid();
		data['openid'] = Currency.getOpenid();
		data['unionid'] = Currency.getUnionid();
		Request.request_data(
			Server.GETCOUPONLIST(),
			data,
			function (res) {
				if (res && res.length > 0) {
					that.setData({
						show_loading_faill: true,
						content: res
					})
				} else {
					Currency.custom_error(that, '3', '暂无优惠券');
				}
			},
			function (res) {
				Currency.error(that, res);
			},
			function (res) {
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
				Journal.myconsole("请求优惠券列表的数据：");
				Journal.myconsole(res);
			})

	}
}