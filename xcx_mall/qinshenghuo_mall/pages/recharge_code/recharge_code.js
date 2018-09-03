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

// 储值卡/码页js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  show_loading_faill: true,
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
  getRechargeCode: function(e){
	  var token = MySign.getToken();
	  if (token) {
		  get_recharge_code(this)
	  } else {
		  Extension.registerrule(this, function (that) { get_recharge_code(that) }, e);
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

//页面初始化加载
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

// 获取充值卡数据
function get_recharge_code(that) {
  var token = MySign.getToken();
  console.log(that.data.codeValue);
  var data = {};
  data['sign'] = MySign.sign(data);
  data['mchid'] = MySign.getMchid();
  data['token'] = token;
  data['code'] = that.data.codeValue;
  MyRequest.request_data(
	  MyHttp.GET_RECHARGECODE(),
    data,
    function (res) {
      MyUtils.myconsole('兑换码数据');
      MyUtils.myconsole(res);
      wx.showToast({
        title: '兑换成功',
        icon: 'success',
        duration: 1500
      })
    },
    function (res) {
      Extension.show_top_msg(that, res ? res : "兑换码错误");
    },
	  function (res) {
		  MyUtils.myconsole("请求充值卡的数据：");
		  MyUtils.myconsole(res);
    });
}