// pages/refund/refund_detail.js
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
    wx.setNavigationBarTitle({
      title: '申请退款',
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
  //查看协商记录
  look_consultation_onclick: function () {
    wx.navigateTo({
      url: '/pages/refund/consultation_record?order_sku_id=' + this.data.order_sku_id,
    })
  },
  //重新提交退款申请
  anew_submit_onclick: function () {
    wx.redirectTo({
      url: '/pages/refund/get_refund?order_sku_id=' + this.data.order_sku_id,
    })
  },
  //取消退款
  cancel_refund_onclick: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '取消退款申请？',
      success: function (res) {
        if (res.confirm) {
          sumbit_refund(that);
        } else if (res.cancel) {
          MyUtils.myconsole('用户点击取消')
        }
      }
    })
  },
  //填写物流信息
  refund_express_onclick:function(){
    var order_id = this.data.refund_data.order_id;
    var order_sku_id = this.data.order_sku_id;
    var id = this.data.refund_data.order_sku_refund_data.id;
    MyUtils.MyOnclick(
      function () {
        wx.navigateTo({
          url: '/pages/refund/edit_express?order_sku_id=' + order_sku_id + '&order_id=' + order_id + '&id=' + id,
        })
      })
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
		  //加载中动画
		  wx.showLoading({
			  title: '加载中',
		  })
		  //授权
		  var openid = Extension.getOpenid();
		  if (!openid) {
			  var login = true;
		  } else {
			  var login = false;
			  var refund_data = that.data.refund_data;
			  if (refund_data) {
				  getOrder_Detail(that, 0);
			  } else {
				  getOrder_Detail(that, 1);
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


function getOrder_Detail(that, inTo) {
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
			MyHttp.REFUNDDETAIL(),
			data,
			function (res) {
				if (res) {
					that.setData({
						refund_data: res,
						reason: refund_reason_text(res.order_sku_refund_data.reason),
						refund_data_type: refund_type_text(res.order_sku_refund_data.type),
						show_loading_faill: true,
					})

				} else {
					//自定义错误提示
					Extension.custom_error(that, '3', '订单信息为空', '', '');
				}
			},
			function (code, msg) {
				MyUtils.myconsole("返回失败的数据：")
				MyUtils.myconsole('code:' + code);
				MyUtils.myconsole('msg' + msg);
				wx.hideLoading();
				if (code = 10004) {
					if (inTo == 1) {
						//自定义错误提示
						Extension.custom_error(that, '3', '订单信息为空', '', '');
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
				MyUtils.myconsole("请求失败的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
};



//取消退款申请
function sumbit_refund(that) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})
		var data = {};
		data['token'] = token;
		var order_id = that.data.refund_data.order_id;
		data['order_id'] = order_id;

		var order_sku_id = that.data.order_sku_id;
		data['order_sku_id'] = order_sku_id;

		var id = that.data.refund_data.order_sku_refund_data.id;
		data['id'] = id;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.REFUNDCANCEL(),
			data,
			function (res) {
				Extension.show_top_msg(that, "退款申请取消成功")
				setTimeout(function () {
					wx.navigateBack({
						delta: 1
					})
				}, 1500);
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '退款申请取消失败');
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：");
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



//退款原因
function refund_reason_text(index){
  var reason= ["请选择退款原因", "多买/买错/不想要", "快递无记录", "少货/空包裹", "未按约定时间发货", "快递一张未送达", "其他"];
  return reason[index];

}


//退款处理方式
function refund_type_text(index) {
  var refund_type = ["请选择处理方式", "仅退款", "退货退款"];
  return refund_type[index];
}