// pages/payment/paymentchoice.js
// 支付渠道选择界面
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
		weixin_pay_type: true,
    chuzhi_pay_type: false,
    chzhi_money: '0.00',
    money: '0.00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    var that = this;
    wx.setNavigationBarTitle({
      title: '在线支付',
    });
    var order_no = options.order_no;
    var money = options.money;
    that.setData({
      order_no: order_no,
      money: money,
    })
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
  //选中微信支付
  weixin_pay: function () {
    this.setData({
      weixin_pay_type: !this.data.weixin_pay_type,
      chuzhi_pay_type: false,
    })

  },
  //选中储值支付
  chuzhi_pay: function () {
    this.setData({
      weixin_pay_type: false,
      chuzhi_pay_type: !this.data.chuzhi_pay_type,
    })
  },
  //确认支付
  sumbit_pay: function () {
	  this.setData({
		  is_sumbit_pay:true,
	  })
    var weixin_pay_type = this.data.weixin_pay_type;
    var chuzhi_pay_type = this.data.chuzhi_pay_type;
    var chzhi_money = this.data.chzhi_money;
    var money = this.data.money;
    //微信支付
    if (weixin_pay_type && !chuzhi_pay_type) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      get_app_code(this)
    }
    //储值支付
    if (!weixin_pay_type && chuzhi_pay_type && chzhi_money - money >= 0) {

      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定要使用储值支付此笔订单？',
        success: function (res) {
          if (res.confirm) {
            setMemberStoredValueBalancePay(that);
          } else if (res.cancel) {
            MyUtils.myconsole('用户点击取消')
          }
        }
      })
    }
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
			 getMemberStoredValueBalance(that)
			 getPaymentsuccess(that, 1)
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


//获取会员储值余额接口
function getMemberStoredValueBalance(that) {
  //获取token
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.GETPAYMEMBER(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						chzhi_money: res.balance,
					})
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '', '2');
				}
			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求会员储值余额的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})

	}
}


//储值支付
function setMemberStoredValueBalancePay(that) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['method'] = 'trade.balance.pay';
		var order_no = that.data.order_no;
		data['token'] = token;
		var money = (that.data.money + '00').replace(/\.([\d]{2})/, '$1.') * 1;
		data['order_no'] = order_no;
		data['pay_money'] = money;
		// // data['mchid'] = MySign.getMchid();
		// data['sign'] = MySign.sign(data);
		data['type'] = '4';
		data['merchant_id'] = that.data.merchant_id;



		MyRequest.request_data(
			MyHttp.SETPAYMEMBER(),
			data,
			function (res) {
				if (res) {
					var order_no = res.order_no;
					// Extension.show_top_msg(that, '储值支付成功！');
					wx.showModal({
						title: '提示',
						content: '支付已完成',
						showCancel: false,
						success: function (res) {
							//清楚分销身份编号
							try {
								wx.removeStorageSync('p_distributor_no')
							} catch (e) {
							}
							if (res.confirm) {
								getPaymentsuccess(that, 2);
							}
						}
					})
				} else {
					Extension.show_top_msg(that, '储值支付失败！');
				}
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '储值支付失败！');
			},
			function (res) {
				that.setData({
					is_sumbit_pay: false,
				})
				MyUtils.myconsole("请求储值支付的数据：")
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



//获取openid
function getOpenId(that, appid, component_appid, component_access_token) {
  //知道appid和secret获取openid
  // wx.login({
  //   success: function (res) {
  //     if (res) {
  //       MyUtils.myconsole('获取用户登录状态：' + res)
  //       MyUtils.myconsole(res)
  //       MyUtils.myconsole('获取用户的code：' + res.code)
  //       var appid = 'wx65001181d6724bb1'; //填写微信小程序appid  
  //       var secret = '5aa7e5e5fe82aec62f80a791ac622b5a'; //填写微信小程序secret  
  //       wx.request({
  //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + res.code,
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         success: function (res) {
  //           MyUtils.myconsole("openid:")
  //           MyUtils.myconsole(res.data.openid) //获取openid
  //         }
  //       })
  //     } else {
  //       MyUtils.myconsole('获取用户登录态失败！' + res.errMsg)
  //     }
  //   }
  // });

  //第三方授权获取openid
  wx.login({
    success: function (log) {
      MyUtils.myconsole("获取code=====" + log.code);
      // if (log.code) {
      //   //发起网络请求
      //   wx.request({
      //     url: 'https://api.weixin.qq.com/sns/component/jscode2session',
      //     header: {
      //       'content-type': 'application/json',
      //     },
      //     method: 'GET',
      //     data: {
      //       'appid': appid,
      //       'js_code': log.code,
      //       'grant_type': 'authorization_code',
      //       'component_appid': component_appid,
      //       'component_access_token': component_access_token
      //     },
      //     success: function (reque) {
      //       MyUtils.myconsole('openid_data:' + reque.data);
      //       MyUtils.myconsole(reque.data);
      //       MyUtils.myconsole('open_id:' + reque.data.openid);
      //       try {
      //         wx.setStorageSync('open_id', reque.data.openid)
      //       } catch (e) {
      //       }
      //       chatPaymen(that,reque.data.openid);
      //       // wx.getUserInfo({
      //       //   success: function (res) {
      //       //     utils.myconsole('用户资料:');
      //       //     var userInfo = res.userInfo;
      //       //     utils.myconsole(userInfo);
      //       //     var nickName = userInfo.nickName
      //       //     var avatarUrl = userInfo.avatarUrl
      //       //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
      //       //     var province = userInfo.province
      //       //     var city = userInfo.city
      //       //     var country = userInfo.country
      //       //   }
      //       // })
      //       //直接使用
      //     }
      //   })
      // } else {
      //   MyUtils.myconsole('获取用户登录态失败！' + res.errMsg)
      //   Extension.show_top_msg(that, '调取微信支付失败')
      //   wx.hideLoading()
      // }
    },
  });
}

//获取生成code
function get_app_code(that){
  wx.login({
    success: function (log) {
      MyUtils.myconsole("获取code=====" + log.code);
      if (log.code) {
        //发起网络请求
        chatPaymen(that, log.code)
      } else {
        MyUtils.myconsole('获取用户登录态失败！' + res.errMsg)
        Extension.show_top_msg(that, '调取微信支付失败')
      }
    },
  });
}


//调取微信支付
function chatPaymen(that, code) {
  var data = {};

  if (code) {
    data['js_code'] = code;
  }else{
    Extension.show_top_msg(that, '调取微信支付失败'); 
    return;
  }
  data['order_no'] = that.data.order_no;
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  MyRequest.request_data(
    MyHttp.PAYMENTSUCCESS(),
    data,
    function (res) {
      if (res) {
		//   if (res.is_h5==1){
		// 	  wx.navigateTo({
		// 		  url: '/pages/payment/pay_web-view?order_no=' + that.data.order_no,
		// 	  })
		// 	}else{
			  wx.requestPayment({
				  'appId': res.appId,
				  'timeStamp': res.timeStamp,
				  'nonceStr': res.nonceStr,
				  'package': res.package,
				  'signType': res.signType,
				  'paySign': res.paySign,
				  'success': function (res1) {
					  MyUtils.myconsole('支付成功：');
					  MyUtils.myconsole(res1);
					  wx.showModal({
						  title: '提示',
						  content: '支付已完成',
						  showCancel: false,
						  success: function (res) {
							  //清楚分销身份编号
							  try {
								  wx.removeStorageSync('p_distributor_no')
							  } catch (e) {
							  }
							  if (res.confirm) {
								  getPaymentsuccess(that, 2);
							  }
						  }
					  })
				  },
				  'fail': function (res2) {
					  MyUtils.myconsole('支付失败：');
					  MyUtils.myconsole(res2);
					  Extension.show_top_msg(that, res2 && res2.err_desc ? res2.err_desc : '支付失败')
				  }
			  })
			// }
      } else {
        Extension.show_top_msg(that, '加载失败')
      }

      wx.hideLoading()
    },
    function (res) {
		Extension.show_top_msg(that, res ? res :'加载失败')

	  },
	  function (res) {
		  that.setData({
			  is_sumbit_pay: false,
		  })
		  MyUtils.myconsole("请求微信支付的数据：")
		  MyUtils.myconsole(res);
		  //关闭加载中动画
		  wx.hideLoading();
	  })
}


//获取订单详情
function getPaymentsuccess(that, redirect) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		var order_no = that.data.order_no;
		data['token'] = token;
		data['order_no'] = order_no;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.PAYMENTUCCESS(),
			data,
			function (res) {
				if (res) {

					MyUtils.myconsole("获取到的数据：")
					MyUtils.myconsole(res);
					that.setData({
						merchant_id: res.merchant_id,
						group_id: res.group_id,
						// money: res.pay_money_cent,
					})
					if (redirect == 2) {
						if (res.group_id) {
							//关闭当前页面跳转至支付成功界面
							wx.redirectTo({
								url: '/pages/groups/groups_details?group_id=' + res.group_id,
							})
						} else {
							//关闭当前页面跳转至支付成功界面
							wx.redirectTo({
								url: '/pages/payment/paymentsuccess?order_no=' + order_no,
							})
						}
					}

				} else {
					Extension.show_top_msg(that, '支付结果获取失败');
				}

			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '支付结果获取失败');
			},
			function (res) {
				MyUtils.myconsole("请求订单详情的数据：")
				MyUtils.myconsole(res);
			})
	}
}