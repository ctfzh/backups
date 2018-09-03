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

//储值JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
    //协议说明隐藏
    switch_protocol: false,
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
    // 初始化页面
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
    var share_data = this.data.data.share_data;
    if (share_data){
      var title = share_data.title;
      var src = share_data.src;
    }else{
      var title = '';
      var src = '';
    }
    return {
      title: title,
      path: '',
      imageUrl: src,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //重试事件
  retry_onclick: function () {
    // 初始化页面
    Refresh(this);
  },

  //跳转到储值码兑换页
	jump_code: function () {
		wx.navigateTo({
			url: '/pages/recharge_code/recharge_code'
		})

		// var token = Sign.getToken();
		// if (token) {
		// 	wx.navigateTo({
		// 		url: '/pages/recharge_code/recharge_code'
		// 	})
		// } else {
		// 	Currency.skip(this, function (that) {
		// 		wx.navigateTo({
		// 			url: '/pages/recharge_code/recharge_code'
		// 		})
		// 	});
		// }
  },
  //跳转到余额明细
	jump_balance: function () {
		var token = Sign.getToken();
		if (token) {
			wx.navigateTo({
				url: '/pages/recharge_activity/balance_detailed'
			})
		} else {
			Currency.skip(this, function (that) {
				wx.navigateTo({
					url: '/pages/recharge_activity/balance_detailed'
				})
				});
		}
  },
  //关闭协议说明
  switch_protocol: function(){
    var switch_protocol = this.data.switch_protocol ? false : true;
    this.setData({
      switch_protocol: switch_protocol,
    })
  }, 

  //活动规则弹窗
  recharge_rule() {
    this.dialog.showDialog();
    this.setData({
      dialog_title:"充值规则",
      dialog_confirmText:"确定",
      confirmEvent:"recharge_rule_confirmEvent",
      dialog_content: "recharge_rule"
    })
  },
  //活动规则弹窗确认事件
  recharge_rule_confirmEvent() {
    console.log('充值规则');
    this.dialog.hideDialog();
  },

  //充值活动
	activity_recharge(e) {
		var token = Sign.getToken();
		if (token) {
			//清楚数据
			this.setData({
				order_no: null,
				activity_id: null,
				recharge_money: null,
				money: null,
			})
			var active_id = e.currentTarget.dataset.activity.id;
			if (active_id) {
				this.setData({
					activity_id: active_id,
					recharge_money: e.currentTarget.dataset.activity.recharge_money,
				})
				get_recharge_order(this);
			} else {
				Currency.show_top_msg(this, '活动已失效');
			}
		} else {
			Currency.registerrule(this, function (that) { that.activity_recharge(that,e) }, e);
		}
  },

  //充值弹窗
	arbitrarily_recharge(e) {
		var token = Sign.getToken();
		if (token) {
			//清楚数据
			this.setData({
				order_no: null,
				activity_id: null,
				recharge_money: null,
				money: null,
			})
			this.dialog.showDialog();
			this.setData({
				dialog_title: "任意充值",
				dialog_confirmText: "充值",
				confirmEvent: "recharge_activity_confirmEvent",
				dialog_content: "recharge_activity"
			})
		} else {
			Currency.registerrule(this, function (that) { that.arbitrarily_recharge(that) }, e);
		}
  },

  //充值弹窗确认事件
  recharge_activity_confirmEvent() {
    if (this.data.recharge_money){
      get_recharge_order(this);
      this.setData({
        recharge_money: null,
      })
    } else if (this.data.recharge_money==0){
      Currency.show_top_msg(this, '请输入大于零的金额');
    }else{
      Currency.show_top_msg(this,  '请输入充值金额');
    }
    this.dialog.hideDialog();
  },
  //输入充值金额
  input_recharge: function (e) {
    var recharge_money = e.detail.value;
    this.setData({
      recharge_money: parseFloat(recharge_money).toFixed(2),
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


//页面初始化加载
function Refresh(that) {
  //获取商户号
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
          Currency.visit(that, 3);
          that.setData({
             login: false,
             dialog: true,
			 })
			 //获取储值活动页数据
			 get_stored(that);
       }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}

/*==================数据请求方法==================*/

// 获取储值活动页数据
function get_stored(that) {
  var token = Sign.getToken();
  var data = {};
	data['unionid'] = Currency.getUnionid();
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['openid'] = Currency.getOpenid();

  Request.request_data(
    Server.GET_STORED(),
    data,
    function (res) {
      if (res) {
        that.setData({
          dialog: false,
          show_loading_faill: true,
          data: res
        })
        that.dialog = that.selectComponent("#dialog");
      } else {
			Currency.custom_error(that, '2', '页面加载失败', '', '2');

      }
    },
	  function (res) {
		  Currency.error(that, res);
    },
    function (res) {
		 Journal.myconsole("请求储值页的数据：");
		 Journal.myconsole(res);
		 //关闭下拉动画
		 wx.stopPullDownRefresh();
		 //关闭加载中动画
		 wx.hideLoading();
    });
}


// 创建储值订单
function get_recharge_order(that) {
  var token = Sign.getToken();
  var data = {};
  data['token'] = token;
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  //储值活动id,充值金额
  if (that.data.activity_id){
    data['activity_id'] = that.data.activity_id;
  }else
    if (that.data.recharge_money){
      data['recharge_money'] = that.data.recharge_money;
    }

  Request.request_data(
    Server.ADDRECHARGEORDER(),
    data,
    function (res) {
      if (res) {
        that.setData({
          order_no: res,
        })
        recPaymen(that)
      } else {
        Currency.show_top_msg(that,  '充值失败');
      }

    },
    function (res) {
      Currency.show_top_msg(that, res ? res : "充值失败");
    },
	  function (res) {
		  //关闭加载中动画
		  wx.hideLoading();
		  Journal.myconsole("请求储值订单的数据：");
		  Journal.myconsole(res);
    });
}


//调取微信支付
function recPaymen(that) {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  var data = {};
  data['order_no'] = that.data.order_no;
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign(data);
  data['openid'] = Currency.getOpenid();
  Request.request_data(
    Server.RECMENTSUCCESS(),
    data,
    function (res) {
      if (res) {
        //关闭加载中动画
        wx.hideLoading()
        //微信支付api
        wx.requestPayment({
          'appId': res.appId,
          'timeStamp': res.timeStamp,
          'nonceStr': res.nonceStr,
          'package': res.package,
          'signType': res.signType,
          'paySign': res.paySign,
          'success': function (res1) {
            Journal.myconsole('支付成功：');
            Journal.myconsole(res1);
            // show_top_msg(that, '微信支付成功')
            wx.showModal({
              title: '提示',
              content: '支付已完成',
              showCancel: false,
              success: function (res) {
                Refresh(that);
              }
            })
          },
          'fail': function (res2) {
            Journal.myconsole('支付失败：');
            Journal.myconsole(res2);
            if (res2.errMsg == "requestPayment:fail cancel") {
              Currency.show_top_msg(that, '支付已取消')
            } else {
              Currency.show_top_msg(that, res2 && res2.err_desc ? res2.err_desc : '支付失败')
            }
          }
        })
      } else {
        show_top_msg(that, '调取微信支付失败')
      }
    },
    function (res) {
      Currency.show_top_msg(that, res ? res : '支付失败')
    }, function (res) {
      //清楚数据
      that.setData({
        order_no: null,
        activity_id: null,
        recharge_money: null,
      })
      //关闭加载中动画
		 wx.hideLoading()
		 Journal.myconsole("请求支付参数的数据：");
		 Journal.myconsole(res);
    })
}