// pages/communal/order_detail.js

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

		guanzhu: false,
    qrcode_url: "",
    //拼团到期时间
    "expireTime": "2018-02-01 00:00:00",//2018-02-01 20:30:08
    //倒计时
    clock: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //关闭微信右上角菜单分享
    wx.hideShareMenu()

    this.setData({
      id: options.id,
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
    //初始化页面加载
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var name = this.data.data.goods[0].name;
      var imageUrl = this.data.data.goods[0].img[0];
      var group_id = this.data.data.group_id;
      return {
        title: name,
        path: '/pages/groups/groups_details?group_id=' + group_id,
        imageUrl: imageUrl,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },

	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		getOrder_Order_Request(this, 0);
	},
	
  //取消订单
  cancellation_of_order_onclick: function (list) {
    MyUtils.myconsole('取消订单：');
    MyUtils.myconsole(list.target.dataset);
    MyUtils.myconsole('订单id：' + list.currentTarget.dataset.idx.id);
    var id = list.currentTarget.dataset.idx.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消当前订单？',
      success: function (res) {
        if (res.confirm) {
          MyUtils.myconsole('用户点击确定')
          cancel_order(that, id)
        } else if (res.cancel) {
          MyUtils.myconsole('用户点击取消')
        }
      }
    })
  },
  //去支付
  payment_onclick: function () {
    MyUtils.myconsole('去支付:');
    MyUtils.myconsole(this.data.data);
    var order_no = this.data.data.order_no;
    var money = this.data.data.pay_money;
    MyUtils.myconsole('订单编号:' + order_no);
    MyUtils.myconsole('支付金额:' + money);

    MyUtils.MyOnclick(
      function () {
        //跳转至支付界面
        wx.navigateTo({
          url: '/pages/payment/paymentchoice?order_no=' + order_no + '&money=' + money,
        })
      })
  },
  //确认收货
  confirm_receipt_onclick: function () {
    MyUtils.myconsole('确认收货:');
    MyUtils.myconsole(this.data.data);
    MyUtils.myconsole('确认收货：' + this.data.data.id);
    var id = this.data.data.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: "请在货物到达后进行确认，确认后订单交易完成？",
      success: function (res) {
        if (res.confirm) {
          MyUtils.myconsole('用户点击确定')
          receipt_order(that, id)
        } else if (res.cancel) {
          MyUtils.myconsole('用户点击取消')
        }
      }
    })
  },
  //申请退款
  apply_for_refund_onclick:function(goods_list){
    MyUtils.myconsole('申请退款:');
    MyUtils.myconsole(goods_list.target.dataset.idx);
    var id = goods_list.target.dataset.idx.id;
    MyUtils.MyOnclick(
      function () {
        wx.navigateTo({
          url: '/pages/refund/get_refund?order_sku_id='+id,
        })
      })
  },
  //退款成功
  refund_succeed_onclick: function (goods_list) {
    MyUtils.myconsole('退款成功:');
    MyUtils.myconsole(goods_list.target.dataset.idx);
    
  },
  //退款已拒
  refund_reject_onclick: function (goods_list) {
    MyUtils.myconsole('退款已拒:');
    MyUtils.myconsole(goods_list.target.dataset.idx);
    var id = goods_list.target.dataset.idx.id;
    MyUtils.MyOnclick(
      function () {
        wx.navigateTo({
          url: '/pages/refund/refund_detail?order_sku_id=' + id,
        })
      })
  },
  //退款中
  refunding_onclick: function (goods_list) {
    MyUtils.myconsole('退款中:');
    MyUtils.myconsole(goods_list.target.dataset.idx);
    var id = goods_list.target.dataset.idx.id;
    MyUtils.MyOnclick(
      function () {
        wx.navigateTo({
          url: '/pages/refund/refund_detail?order_sku_id=' + id,
        })
      })
	},
	Kguanzhu: function () {
		this.setData({
			guanzhu: !this.data.guanzhu
		});
	},
	del: function () {
		this.setData({
			guanzhu: !this.data.guanzhu
		});
	},
  
  //团详情
  Invitation: function () {
    var group_id = this.data.data.group_id;
    wx.navigateTo({
      url: '/pages/groups/groups_details?group_id=' + group_id,
    })
  },

  /* 毫秒级倒计时 */
  count_down: function () {
    var that = this
    //2016-12-27 12:47:08 转换日期格式  
    var a = that.data.expireTime.split(/[^0-9]/);
    //截止日期：日期转毫秒  
    var expireMs = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    //倒计时毫秒  
    var duringMs = expireMs.getTime() - (new Date()).getTime();
    // 渲染倒计时时钟  
    that.setData({
      clock: that.date_format(duringMs)
    });

    if (duringMs <= 0) {
      that.setData({
        clock: ' 00:00:00 '
      });
      // timeout则跳出递归  
      return;
    }
    setTimeout(function () {
      // 放在最后--  
      duringMs -= 10;
      that.count_down();
    }
      , 10)
  },
  /* 格式化倒计时 */
  date_format: function (micro_second) {
    var that = this;
    // 秒数  
    var second = Math.floor(micro_second / 1000);
    // 小时位  
    var hr = that.fill_zero_prefix(Math.floor(second / 3600));
    // 分钟位  
    var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位  
    var sec = that.fill_zero_prefix(second % 60);// equal to => var sec = second % 60;  
    return " " + hr + ":" + min + ":" + sec + " ";
  },

  /* 分秒位数补0 */
  fill_zero_prefix: function (num) {
    return num < 10 ? "0" + num : num
  }  ,

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
	//加载中动画
	wx.showLoading({
		title: '加载中',
	})
      //获取商户号
      MySign.getExtMchid(
        function () {
			var data = that.data.data;
			  //授权
			  var openid = Extension.getOpenid();
			  if (!openid) {
				  var login = true;
			  } else {
				  var login = false;
				  if (data) {
					  getOrder_Order_Request(that, 0);
				  } else {
					  getOrder_Order_Request(that, 1);
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


//获取订单详情 inTo  1、页面第一次加载
function getOrder_Order_Request(that, inTo) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
  var id = that.data.id;
  var data = {};
  data['token'] = token;
  data['id'] = id;
  data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

  MyRequest.request_data_new(
    MyHttp.ORDERDETAIL(),
    data,
    function (res) {
			if (res) {
        that.setData({
          data:res,
          expireTime: res.group_info.end_time,
          show_loading_faill: true,
        })
        that.count_down();  
			} else {
				//自定义错误提示
				Extension.custom_error(that, '3', '暂无订单', '', '');
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
				Extension.custom_error(that, '3', '暂无订单', '', '');
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
		  MyUtils.myconsole("请求订单详情的数据：")
		  MyUtils.myconsole(res);
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
	  })
	}
};


//取消订单
function cancel_order(that, id) {
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
		data['id'] = id;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.CANCELORDER(),
			data,
			function (res) {
				getOrder_Order_Request(that, null);
				Extension.show_top_msg(that, "取消订单成功")
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '取消订单失败');
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：");
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



//确认收货
function receipt_order(that, id) {
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
		data['id'] = id;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.CRECEIPTORDER(),
			data,
			function (res) {
				getOrder_Order_Request(that, null);
				Extension.show_top_msg(that, "确认收货成功")
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '确认收货失败');
			},
			function (res) {
				MyUtils.myconsole("请求确认收货的数据：");
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}