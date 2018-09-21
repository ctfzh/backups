// pages/communal/order_list.js
// 订单列表界面
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
	  order_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //关闭微信右上角菜单分享
    wx.hideShareMenu()
    MyUtils.myconsole("传过来的标题：" + options.title);
    MyUtils.myconsole("传过来的状态：" + options.order_status);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      order_status: options.order_status,
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
      var name = res.target.dataset.idx.goods[0].name;
      var imageUrl = res.target.dataset.idx.goods[0].img[0];
      var group_id = res.target.dataset.idx.group_id;
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
    getOrder_List_Request(this,0);
  },
  //进入订单详情
  look_order_onclick:function(list){
    MyUtils.myconsole('进入订单详情：');
    MyUtils.myconsole(list.currentTarget);
    MyUtils.myconsole(list.currentTarget.dataset.list);
    var id = list.currentTarget.dataset.list.id;
    MyUtils.MyOnclick(
      function () {
        wx.navigateTo({
          url: '/pages/communal/order_detail?id=' + id,
        })
      })
  },
  //取消订单
  cancellation_of_order_onclick:function(list){
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
  payment_onclick:function(list){
    MyUtils.myconsole('去支付:');
    MyUtils.myconsole(list.target.dataset.idx);
    var order_no = list.target.dataset.idx.order_no;
    var money = list.target.dataset.idx.pay_money;
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
  confirm_receipt_onclick:function(list){
    MyUtils.myconsole('确认收货:');
    MyUtils.myconsole(list.target.dataset.idx);
    MyUtils.myconsole('确认收货' + list.currentTarget.dataset.idx.id);
    var id = list.currentTarget.dataset.idx.id;
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
  //团详情
  Invitation:function(e){
    var group_id = e.target.dataset.idx.group_id;
    wx.navigateTo({
      url: '/pages/groups/groups_details?group_id=' + group_id,
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
	},

	// 切换订单状态
	order_type_switch (e){
		var order_type = e.currentTarget.dataset.type;
		getOrder_List_Request(this, 0, order_type);
	},

	//去逛逛
	order_an(e) {
		wx.switchTab({
			url: '/pages/home/home',
		})
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
			 var order_list = that.data.order_list;
				 if (order_list && order_list.length > 0) {
					 getOrder_List_Request(that, 0,that.data.order_type);
				 } else {
					 getOrder_List_Request(that, 1, that.data.order_type);
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


//获取订单列表 inTo  1、页面第一次加载  //order_status == 'group'为拼团订单数据
function getOrder_List_Request(that, inTo, order_type) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var order_status = that.data.order_status;
		var data = {};
		if (order_status && order_status !='group') {
			data['order_status'] = order_status;
		}else{
			data['order_status'] = order_type;
		}
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data_new(
			order_status == 'group' ? MyHttp.GROUPBUY() : MyHttp.ORDERLIST(),
			data,
			function (res) {
				if (res && res.list && res.list.length > 0) {
					that.setData({
						order_list: res.list,
						order_type: order_type,
						show_loading_faill: true,
					})
				} else {
					if (order_status == 'group'){
						that.setData({
							show_loading_faill: true,
							order_list: '',
							order_type: order_type,
							order_error: true,
						})
					}else{
						//自定义错误提示
						Extension.custom_error(that, '3', '暂无订单', '', '');
					}
				}
			},
			function (code, msg) {
				MyUtils.myconsole("返回失败的数据：")
				MyUtils.myconsole('code:' + code);
				MyUtils.myconsole('msg:' + msg);
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
				MyUtils.myconsole("请求订单列表的数据：")
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
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['id'] = id;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.CANCELORDER(),
			data,
			function (res) {
				getOrder_List_Request(that);
				Extension.show_top_msg(that, "订单取消成功")
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '订单取消失败');
			},
			function (res) {
				MyUtils.myconsole("请求取消订单的数据：");
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



//确认收货
function receipt_order(that, id) {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['id'] = id;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.CRECEIPTORDER(),
			data,
			function (res) {
				getOrder_List_Request(that);
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




