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

// 买单JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
    //活动弹出窗默认隐藏
    activity_eject: "none",
    //会员折扣默认状态
    if_member_discount: 2,
    //默认支付金额
    pay_money: "0.00",
    //默认选中0张优惠券
    coupon_sele: '0',
    //禁用
    available:false,
    //会员折扣不可用文字
    member_discount: true,
    //输入的消费总金额
    order_money: '',
    //输入的不参与优惠的金额
    undiscountable_money: '',
    //优惠券开关
    coupon_switch: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //门店id
    if (options.store_id){
      this.setData({
        store_id: options.store_id,
      })
    }
    // 初始化页面
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
		// 初始化页面
		Refresh(this);
    //移除缓存选中数量
    try {
      wx.removeStorageSync('coupon_sele')
    } catch (e) {
      // Do something when catch error
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
    // 初始化页面
    Refresh(this);
  },
  //优惠券活动弹出窗
  tap_coupon_layer: function () {
    this.setData({
      //会员折扣默认状态
      if_member_discount: 2,
      activity_eject: "",
      activity: "coupon"
    })
  },
  //关闭活动窗口
  tap_activity_layer_close: function () {
    this.setData({
      activity_eject: "none",
      activity: ""
    })
    get_nedpay(this, this.data.coupon_sele_id, '1');
  },
  //优惠券选中数量
  checkboxChange: function (e) {
    var coupon_sele = e.detail.value.length;
    var coupon_sele_id = '';
    for (var i = 0; i < e.detail.value.length; i++) {
      if (i == 0) {
        coupon_sele_id = e.detail.value[i];
      } else {
        coupon_sele_id += "," + e.detail.value[i];
      }
    }
    this.setData({
      coupon_sele: coupon_sele,
      coupon_sele_id: coupon_sele_id,
    })
  },
  //优惠券勾选
  see_check: function(e) {
    //选中的优惠券数据
    var coupon = e.currentTarget.dataset.coupon;
    //区分选中或是取消状态，获取缓存选中数量
    try {
      var coupon_sele = wx.getStorageSync('coupon_sele')
        //选中后的操作
      if (coupon_sele < this.data.coupon_sele) {
        this.setData({
          sele_id: coupon.id,
        })
          if (coupon.can_use_with_other_discount==2){
            this.setData({
              Unavailable:true,
            })
        }
        }else{//取消选中后的操作
          this.setData({
            sele_id: null,
          })
          if (coupon.can_use_with_other_discount == 2) {
            this.setData({
              Unavailable: false,
            })
          }
        }
    } catch (e) {
    }
    get_nedpay(this, this.data.coupon_sele_id, '2');
    //缓存选中数量
    try {
      wx.setStorageSync('coupon_sele', this.data.coupon_sele)
    } catch (e) {
    }
  },
  //确认选中优惠券
  coupon_confirm: function () {
    this.setData({
      activity_eject: "none",
      activity: ""
    })
    get_nedpay(this, this.data.coupon_sele_id, '1');
  },
  //会员折扣选中状态
  discounts_radio: function (e) {
	  //登入验证
	  var token = Sign.getToken();
	  if(token){
		  this.setData({
			  if_member_discount: this.data.if_member_discount == '1' ? '2' : '1',
		  })
		  get_nedpay(this, this.data.coupon_sele_id, this.data.if_member_discount);
	  }else{
		  Currency.registerrule(this, function (that) {
			  //获取会员信息
			  get_member_info(that);
			  that.discounts_radio(e);
		  }, e)
	  }
  },
  //用户输入的消费总金额
  bind_order_money : function (e) {
    var order_money = parseFloat(e.detail.value ? e.detail.value: '0').toFixed(2);
    this.setData({
      undiscountable_money:'',
      order_money: order_money,
      coupon_checked: false,
      Unavailable: false,
      coupon_sele: '0',
      coupon_sele_id: '',
      pay_money: order_money,
      if_member_discount: '2',
      coupon_discount_money: '0',
    })
    // get_nedpay(this, this.data.coupon_sele_id, this.data.if_member_discount);
    //缓存选中数量
    try {
      wx.setStorageSync('coupon_sele', this.data.coupon_sele)
    } catch (e) {
    }
  },
  //用户输入的不参与优惠金额
  bind_undiscountable_money: function (e) {
    var undiscountable_money = e.detail.value;
    if (!this.data.order_money){
      this.setData({
        undiscountable_money: '',
      })
    }else//不可大于消费总金额
      if (parseFloat(undiscountable_money) > parseFloat(this.data.order_money)) {
      this.setData({
        undiscountable_money : this.data.order_money
      })
    }else{
      this.setData({
        undiscountable_money: undiscountable_money,
      })
    }
    this.setData({
      coupon_checked: false,
      Unavailable: false,
      coupon_sele: '0',
      coupon_sele_id: '',
    })
    get_nedpay(this, this.data.coupon_sele_id, this.data.if_member_discount);
    //缓存选中数量
    try {
      wx.setStorageSync('coupon_sele', this.data.coupon_sele)
    } catch (e) {
    }
  },
  bind_addorder: function () {
    if (this.data.order_money) {
      get_addorder(this, this.data.coupon_sele_id, this.data.if_member_discount);
    }else{
      Currency.show_top_msg(this, "请输入消费金额");
    }
  },
  //授权完成回调
  login_success: function () {
     Refresh(this);
	},

	//登入
	login_an (e) {
		Currency.registerrule(this, function (that) { Refresh(that)} , e);
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
				Currency.visit(that, 4);
				that.setData({
					login: false,
				})
					//获取会员信息
					get_member_info(that);
         }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}




/*==================数据请求方法==================*/

// 获取会员信息
function get_member_info(that) {
  //登入验证
  var token = Sign.getToken();
		//传给服务器的参数
		var data = {};
		if (token) {
			data['token'] = token;
	}
	data['unionid'] = Currency.getUnionid();
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();
		//门店id
		if (that.data.store_id) {
			data['store_id'] = that.data.store_id;
		}

		Request.request_data(
			Server.GET_MEMBERINFO(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						coupon: res.coupon_list,
					})
				} else {
					Currency.custom_error(that, '2', '页面加载失败', '（会员信息不存在）', '2');
				}
			},
			function (res) {
				Currency.error(that, res);
			},
			function (res) {
				Journal.myconsole("请求会员信息的数据：");
				Journal.myconsole(res);
			});
}

// 计算优惠金额
function get_nedpay(that, coupon_id_list, if_member_discount) {
  //登入验证
	var token = Sign.getToken();
		//传给服务器的参数
		var data = {};
		if (token) {
			data['token'] = token;
	}
	data['unionid'] = Currency.getUnionid();
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();
		//订单金额
		if (that.data.order_money) {
			data['order_money'] = that.data.order_money;
		}
		//不打折金额
		if (that.data.undiscountable_money) {
			data['undiscountable_money'] = that.data.undiscountable_money;
		}
		//优惠券id
		if (coupon_id_list) {
			data['coupon_id_list'] = coupon_id_list;
		}
		//是否选择会员折扣
		if (if_member_discount) {
			data['if_member_discount'] = if_member_discount;
		}

		Request.request_data(
			Server.GET_NEDPAY(),
			data,
			function (res) {
				if (res) {
					if (that.data.if_member_discount == if_member_discount) {
						that.setData({
							pay_money: res.pay_money == '0' ? '0.00' : parseFloat(res.pay_money).toFixed(2),
							discount_money: res.member_discount_money ? res.member_discount_money : null,
							coupon_discount_money: res.coupon_discount_money ? res.coupon_discount_money : '0'
						})
					}
				} else {
					Currency.show_top_msg(that, '优惠金额计算错误');
				}
				that.setData({
					member_discount: true,
				})
			},
			function (res) {
				if (res == "该优惠券不能与会员折扣同用") {
					that.setData({
						if_member_discount: '2',
						member_discount: false,
					})
				} else {
					Currency.show_top_msg(that, res ? res : "优惠金额计算错误");
				}
			},
			function (res) {
				Journal.myconsole("请求优惠金额的数据：");
				Journal.myconsole(res);
			});
}

// 创建订单
function get_addorder(that, coupon_id_list, if_member_discount) {
  //登入验证
	var token = Sign.getToken(); 
		//传给服务器的参数
	var data = {};
	if (token) {
		data['token'] = token;
	}
	data['unionid'] = Currency.getUnionid();
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();
		//门店id
		if (that.data.store_id) {
			data['store_id'] = that.data.store_id;
		}

		//订单金额
		if (that.data.order_money) {
			data['total_amount'] = that.data.order_money;
		}
		//不打折金额
		if (that.data.undiscountable_money) {
			data['undiscount_amount'] = that.data.undiscountable_money;
		}
		//优惠券id
		if (coupon_id_list) {
			data['coupon_id_list'] = coupon_id_list;
		}
		//是否选择会员折扣
		if (if_member_discount) {
			data['if_member_discount'] = if_member_discount;
		}

		Request.request_data(
			Server.GET_ADDORDER(),
			data,
			function (res) {
				if (res) {
					//跳转到支付渠道选择页
					wx.navigateTo({
						url: '../payment/payment?order_no=' + res.order_no + '&money=' + that.data.pay_money + '&store_id=' + that.data.store_id,
					})
				} else {
					Currency.show_top_msg(that, '支付失败');
				}
			},
			function (res) {
				Currency.show_top_msg(that, res ? res : "支付失败");
			},
			function (res) {
				Journal.myconsole("请求创建订单的数据：");
				Journal.myconsole(res);
			});

}