// 订单详情

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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shadow: false,
    // order_type    1 点餐 2 外卖
    order_type: 2
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
	  if (options.order_no && options.order_no != "undefined") {
		  var bar_code_num = options.order_no.substring(options.order_no.length - 8);
		  this.setData({
			  order_no: options.order_no,
			  bar_code_num: bar_code_num
		  });
    } else {
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        log: 0,
        error_text: "数据加载失败",
      })
    }
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
    if (this.data.order_no) {
      //初始化页面
      Refresh(this);
    }
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
    //初始化页面
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
  //支付
  payment: function (e) {
    var order_no = e.currentTarget.dataset.order_no;
    //微信支付
    Currency.chatPaymen(this, order_no, this.data.order_type, 'nav', 1);
  },
  // 取消订单
  cancel_order: function (e) {
    var that = this;
    var pay_status = that.data.order_detail.pay_status;

    // pay_status 1 待付款 2已付款
    if (pay_status == 1) {
      wx.showModal({
        title: '取消订单',
        content: '是否取消订单?',
        cancelText: '不取消了',
        confirmText: '取消订单',
        success: function (res) {
          if (res.confirm) {
            cancelOrder(that);
          }
        }
      })
    } else if (pay_status == 2) {
      if (that.data.order_detail.is_refund == 1) {
        wx.showModal({
          title: '取消订单并退款',
          content: '退款将原路返回到您的支付账户',
          cancelText: '不取消了',
          confirmText: '取消订单',
          success: function (res) {
            if (res.confirm) {
              cancelOrder(that);
            }
          }
        })
      } else if (that.data.order_detail.is_refund == 2) {
        wx.showModal({
          title: '取消订单提示',
          content: '请联系商家取消订单',
          cancelText: '不取消了',
          confirmText: '联系商家',
          success: function (res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: that.data.order_detail.store_telephone,
              })
            }
          }
        })
      }
    }
  },
  // 联系配送员
  contact: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.order_detail.courier_mobile,
    })
  },
  // 联系商家
  contact_store: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.order_detail.store_telephone,
    })
  },
  //关闭跟踪
  close_shadow: function () {
    this.setData({
      shadow: false
    });
  },
  //显示跟踪
  show_trace: function () {
    this.setData({
      shadow: true
    });
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})

/****************普通方法***********************/
// 初始化数据
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      //订单详情
      getOrderDetail(that);
    },
    function () {
      //关闭加载中动画
		 setTimeout(function () {
			 wx.hideLoading()
		 }, 2000)
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        log: 0, 
        error_text: "商户不存在",
      })
    },
  )
}
// 追踪时间截取
function sliceTime(that) {
  var orderLog = that.data.orderLog;
  var times = [];
  for (var i in orderLog) {
    var tempTime = orderLog[i].time.split(" ")[1];
    var timeArr = tempTime.split(":");
    var time = timeArr[0] + ':' + timeArr[1];
    times.push(time);
  }
  that.setData({
    times: times
  });
}

// 订单追踪空心栏
function getOdLogLast(that) {
  var orderLog = that.data.orderLog;
  var length = orderLog.length;
  var lastItem = orderLog[length - 1];
  var preItem = {};
  if (orderLog.length > 0) {
    if (lastItem.type == 1) {
      preItem['txt'] = '等待支付订单';
    } else if (lastItem.type == 2) {
      preItem['txt'] = '等待商家接单';
    } else if (lastItem.type == 3) {
      preItem['txt'] = '等待骑手接单';
    } else if (lastItem.type == 4) {
      preItem['txt'] = '商家送货中';
    } else if (lastItem.type == 5) {
      preItem['txt'] = '等待骑手到店';
    } else if (lastItem.type == 6) {
      preItem['txt'] = '骑手到店取货中';
    } else if (lastItem.type == 7) {
      preItem['txt'] = '骑手送货中';
    }
    that.setData({
      preItem: preItem,
      lastItem: lastItem
    });
  }
}

// 地图中心位置
function mapCenter(that) {
  var orderLog = that.data.orderLog;
  var lastType = orderLog[orderLog.length - 1].type;
  var centerLng, centerLat;
  if (lastType == 3) {
    centerLng = that.data.store_lng;
    centerLat = that.data.store_lat;
  } else {
    centerLng = that.data.lng;
    centerLat = that.data.lat;
  }
  that.setData({
    centerLng: centerLng,
    centerLat: centerLat
  });
}


/****************数据获取********************/
//获取订单详情
function getOrderDetail(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data['token'] = token;
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign();
    data['order_no'] = that.data.order_no;
    Request.request_data(
      Server.GET_ORDER_DETAIL(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        if (res) {
          that.setData({
            show: true,
            order_detail: res
          });
          // 订单追踪
          orderLog(that);
        } else {
          that.setData({
            show: false,
            retry_an: 0,
            error: 1,
            log: 0,
            error_text: "订单不存在",
          })
        }
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          error: 0,
          log: 0,
          error_text: res,
        })
      },
      function (res) {
        wx.stopPullDownRefresh();
        Journal.myconsole('请求订单详情的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}


//取消订单
function cancelOrder(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data["token"] = token;
    //接口必传
    data['mchid'] = Sign.getMchid();
    //接口必传
    data['sign'] = Sign.sign();
    data['order_no'] = that.data.order_no;

    Request.request_data(
      Server.CANCELORDER(),
      data,
      function (res) {
        that.setData({
          show: true,
        });
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
      },
		 function (res) {
			 wx.showToast({
				 title: res ? res : '请求失败，请稍后重试！！！',
				 icon: 'none',
				 duration: 1000
			 })
      },
		 function (res) {
			 // 刷新
			 Refresh(that);
        Journal.myconsole("取消订单请求数据");
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}


// 配送员位置
function getPosition(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data["token"] = token;
    //接口必传
    data['mchid'] = Sign.getMchid();
    //接口必传
    data['sign'] = Sign.sign();
    data['order_no'] = that.data.order_no;

    Request.request_data(
      Server.CORPOSITION(),
      data,
      function (res) {
        var lng = res.lng;
        var lat = res.lat;
        var customer_lng = res.customer_lng;
        var customer_lat = res.customer_lat;
        var store_lat = res.store_lat;
        var store_lng = res.store_lng;
        var orderLog = that.data.orderLog;
        var lastType = orderLog[orderLog.length - 1].type;

        var storeImg = "/pages/img/income/add_map.png";
        var courierImg = "/pages/img/income/courier.png";
        var userImg = "/pages/img/income/adress_user.png";

        var markers = [];
        //骑手
        var markers_item1 = {
          iconPath: courierImg,
          id: 0,
          latitude: lat,
          longitude: lng,
          width: 50,
          height: 50,
        };
        //客户
        var markers_item2 = {
          iconPath: userImg,
          id: 1,
          latitude: customer_lat,
          longitude: customer_lng,
          width: 50,
          height: 50,
        };
        //商户
        var markers_item3 = {
          iconPath: storeImg,
          id: 2,
          latitude: store_lat,
          longitude: store_lng,
          width: 40,
          height: 40,
        };

        if (lastType==3){   //等待骑手接单
          var markers_item1 = {};
          var markers_item2 = {};
          var markers_item3 = markers_item3;
        }
        if (lastType == 5) {//等待骑手到店
          var markers_item1 = markers_item1;
          var markers_item2 = {};
          var markers_item3 = markers_item3;
        }
        if (lastType == 6) {  //骑手到店取货
          var markers_item1 = markers_item1;
          var markers_item2 = markers_item2;
          var markers_item3 = {};
        }
        if (lastType == 7) {  //骑手送货
          var markers_item1 = markers_item1;
          var markers_item2 = markers_item2;
          var markers_item3 = markers_item3;
        }

        markers.push(markers_item1);
        markers.push(markers_item2);
        markers.push(markers_item3);
   
        that.setData({
          show: true,
          store_lat: store_lat,
          store_lng: store_lng,
          lat: lat,
          lng: lng,
          markers: markers,
        });
        // 地图中心
        mapCenter(that);
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          error: 0,
          log: 0,
          error_text: res,
        })
      },
      function (res) {
        wx.stopPullDownRefresh();
        Journal.myconsole("配送员请求数据");
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}


//订单追踪
function orderLog(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data.token = Sign.getToken();
    //接口必传
    data['mchid'] = Sign.getMchid();
    //接口必传
    data['sign'] = Sign.sign();
    data['order_no'] = that.data.order_no;

    Request.request_data(
      Server.ORDERLOG(),
      data,
      function (res) {
        that.setData({
          show: true,
          orderLog: res
        });
        // 追踪时间
        sliceTime(that);
        // 追踪最后一项
        getOdLogLast(that);
        // 配送员位置
        getPosition(that);
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          error: 0,
          log: 0,
          error_text: res,
        })
      },
      function (res) {
        wx.stopPullDownRefresh();
        Journal.myconsole("订单追踪请求数据");
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }

}


// //订单追踪
// function bar_code(that) {
// 		var data = {};
// 		//接口必传
// 		data['mchid'] = Sign.getMchid();
// 		//接口必传
// 		data['sign'] = Sign.sign();
// 		data['order_no'] = that.data.order_no;

// 		Request.request_data(
// 			Server.BARCODE(),
// 			data,
// 			function (res) {
// 			},
// 			function (res) {

// 			},
// 			function (res) {
// 				Journal.myconsole("一维码请求数据");
// 				Journal.myconsole(res);
// 			});
// }