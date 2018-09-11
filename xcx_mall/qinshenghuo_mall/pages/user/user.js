// pages/user/user.js
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // login_show: true, 
    // second: '获取验证码',
    show_secound: 'none',
    hide_delete: true,
    guanzhu: false,
    login_show: false,
	  qrcode_url: "",
	  //防止按钮多次触发
	  disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //关闭微信右上角菜单分享
    wx.hideShareMenu();
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
    // 初始化页面
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
  //跳转至全部订单
  all_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=全部订单',
    })
  },
  //跳转至待支付订单
  unpaid_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=待支付&order_status=' + 1,
    })
  },
  //跳转至待接单订单
  waiting_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=待接单&order_status=' + 2,
    })
  },
  //跳转至待发货订单
  overhang_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=待发货&order_status=' + 3,
    })
  },
  //跳转至已发货订单
  shipped_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=待收货&order_status=' + 4,
    })
  },
  //跳转至退款售后订单
  over_order_onclick: function () {
    wx.navigateTo({
      url: '/pages/communal/order_list?title=退款/售后&order_status=' + 7,
    })
  },
  // 我的钱包
  my_wallet_onclick: function () {
    wx.navigateTo({
      url: '/pages/user/my_wallet',
    })
  },
  // 消费记录
  expense_calendar_onclick: function () {
    wx.navigateTo({
      url: '/pages/user/expense_calendar',
    })
  },
  //跳转至首页
  home_onclick: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  //跳转至购物车
  shopping_trolley_onclick: function () {
    wx.switchTab({
      url: '/pages/shoppingcart/shoppingcart'
    })
  },
  // 个人信息
  personal_informationt_onclick: function () {
    wx.navigateTo({
      url: '/pages/user/personal_information',
    })
  },
  //我的分销
  myDistribution_onclick: function(){
    wx.navigateTo({
      url: '/pages/distribution/distribution',
    })
	},
	//查看会员卡
	see_membership: function (e) {
		var that = this;
		if (that.data.disabled) {
			//关闭点击事件
			that.setData({
				disabled: false,
			})
			var card_id = e.currentTarget.dataset.user.card_id;
			var code = e.currentTarget.dataset.user.member_code;
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
				},
				complete: function () {
					//激活点击事件
					that.setData({
						disabled: true,
					})
				}
			})
		}
	},

  //重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
    // 初始化页面
    Refresh(this);
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
  //跳转至客服
  msg_onclick: function () {
     var goods_id = this.data.goods_id;
     wx.navigateTo({
        url: '/pages/service/service?goods_id=' + goods_id,
     })
  },
	// 跳转到我的储值
	jump_recharge_activity: function () {
		wx.navigateTo({
			url: '/pages/recharge_activity/recharge_activity'
		})
	},
	//跳转到储值码兑换页
	jump_code: function () {
		wx.navigateTo({
			url: '/pages/recharge_code/recharge_code'
		})
	},
	// 跳转到优惠券列表页
	jump_coupon: function () {
		wx.navigateTo({
			url: '/pages/user/coupon_list'
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



/*************************************普通方法函数**********************************************/

//页面加载，重试
function Refresh(that) {
	MySign.getExtMchid(
		function () {
			var openid = Extension.getOpenid();
			var token = MySign.getToken();
			if (!openid) {
				var login = true;
			} else {
				var login = false;
				if (token) {
					//获取会员信息
					getMemberInformation(that);
					//获取分销设置信息
					getStoreSet(that)
				} else {
					Extension.on_skip(that, function (that) { that.login_success() }, 1);
				}
			}
			that.setData({
				login: login,
				token: token,
			})
		},
		function () {
			//自定义错误提示
			Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
	)
}



/*************************************接口数据获取方法函数**********************************************/

// 获取分销商信息
function getDistribution(that) {
  var token = MySign.getToken();
  var data = {};
  data['sign'] = MySign.sign(data);
  data['token'] = token;
  data['mchid'] = MySign.getMchid();
  MyRequest.request_data(
    MyHttp.GETDISTRIBUTION(),
    data,
    function (res) {
      that.setData({
        distribution_user: true,
      });
    },
    function (res) {
     if (res == 1){
        if (that.data.distribution_set.can_apply==1){
			  var distribution_user = true;
		  } else {
			  var distribution_user = false;
        }
	  } else {
		  var distribution_user = false;
      }
		 that.setData({
			 distribution_user: distribution_user,
		 })
	  },
	  function (res) {
		  MyUtils.myconsole("请求分销商信息的数据");
		  MyUtils.myconsole(res);
	  });
}

// 获取商户分销设置
function getStoreSet(that) {
  var data = {};
  data['sign'] = MySign.sign(data);
  data['mchid'] = MySign.getMchid();
  MyRequest.request_data(
    MyHttp.GETDISTRIBUTIONSET(),
    data,
    function (res) {
      if (res) {
        //获取分销商信息
        getDistribution(that);
        //重置公告内容，*必须先setData加载notice_status: false,
        that.setData({
          notice_status: false,
        })
        that.setData({
          distribution_set:res,
          notice_status: res.notice_status,
        })
      }
    },
    function (res) {
      that.setData({
          distribution_user: false,
      })
	  },
	  function (res) {
		  MyUtils.myconsole("分销商设置数据请求的数据：")
		  MyUtils.myconsole(res);
	  })
}

//获取会员信息
function getMemberInformation(that) {
  var token = MySign.getToken();
  var data = {};
	data['token'] = token;
	data['unionid'] = Extension.getUnionid();
  data['url'] = 'www.qinguanjia.com';
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  MyRequest.request_data(
    MyHttp.USER_HOME(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show_loading_faill: true,
          data: res,
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
		  MyUtils.myconsole("请求会员信息的数据：")
		  MyUtils.myconsole(res);
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
		})


}