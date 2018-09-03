// pages/refund/consultation_record.js
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
    array: [
      {
        "message": "http://img1.3lian.com/2015/a1/84/d/95.jpg",
        "id": 1,
        "name": "商品名称",
      },
      {
        "message": "http://img1.3lian.com/2015/a1/84/d/95.jpg",
        "id": 2,
        "name": "商品名称商品名称"
      },
      {
        "message": "http://img1.3lian.com/2015/a1/84/d/95.jpg",
        "id": 3,
        "name": "商品名称商品名称商品名称商品名称"
      },
      {
        "message": "http://img1.3lian.com/2015/a1/84/d/95.jpg",
        "id": 4,
        "name": "商品名称商品名称商品名称商品名称商品名称"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
    wx.setNavigationBarTitle({
      title: '退款协商记录',
    })
    this.setData({
      order_sku_id: options.order_sku_id,
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
    //初始化页面加载
    Refresh(this) 
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
    //初始化页面加载
    Refresh(this) 
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
  //关闭当前界面
  close_onclick:function(){
    wx.navigateBack({
      delta: 1
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
			  var refund_record_data = that.data.refund_record_data;
			  if (refund_record_data) {
				  getRefund_Record(that, 0);
			  } else {
				  getRefund_Record(that, 1);
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

function getRefund_Record(that, inTo) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var order_sku_id = that.data.order_sku_id;
		var data = {};
		data['order_sku_id'] = order_sku_id;
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data_new(
			MyHttp.REFUNDRECORD(),
			data,
			function (res) {
				MyUtils.myconsole("获取到的数据：")
				MyUtils.myconsole(res);
				if (res) {
					that.setData({
						refund_record_data: res,
						show_loading_faill: true,
					})

				} else {
					//自定义错误提示
					Extension.custom_error(that, '3', '协商记录为空', '', '');
				}
				wx.stopPullDownRefresh();
			},
			function (code, msg) {
				MyUtils.myconsole("返回失败的数据：")
				MyUtils.myconsole('code:' + code);
				MyUtils.myconsole('msg' + msg);
				wx.hideLoading();
				if (code = 10004) {
					if (inTo == 1) {
						//自定义错误提示
						Extension.custom_error(that, '3', '协商记录为空', '', '');
					}
				} else {
					if (inTo == 1) {
						//错误提示
						Extension.error(that, msg);
					}
				}
			},
			function (res) {
				if (inTo == 1) {
					//错误提示
					Extension.error(that, res);
				}
			},
			function (res) {
				MyUtils.myconsole("请求的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
};

