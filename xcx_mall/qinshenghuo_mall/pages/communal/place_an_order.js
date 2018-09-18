// pages/communal/place_an_order.js
// 下单界面
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
    // addtype: true,//true 有地址   false 没有地址 新增地址
    checked: true,
    address_showDialog: false,
    address_edit_showDialog: false,
    delivery_method_list: [
      {
        'id': 2,
        'title': '同城配送',
        'content': '由商家门店提供配送服务',
        'checked': false,
      },
      {
        'id': 3,
        'title': '快递配送',
        'content': '由商家选择快递为您提供配送服务',
        'checked': false,
      }
    ],
    province_array: [],
    city_array: [],
    region_array: [],
    province_index: 0,
    city_index: 0,
    region_index: 0,
		hiddenmodalput: true,
		guanzhu: false,
		goods_info: "",
		qrcode_url: "",
		//活动弹出窗默认隐藏
		activity_eject: "none",
		//运费
		freight_money: '0.00',
		//会员折扣默认不选中
		checked: false,
		//优惠券默认选中张数
		coupon_sele: '0',
		//默认合计价格
		money: '0.00',
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

		var that = this;
		wx.setNavigationBarTitle({
			title: '待支付订单',
		})
    //获取传过来的参数
    var is_cart = options.is_cart;
    var cart_id = options.cart_id ? JSON.stringify(options.cart_id.split(",")) : '';
    var cart_id_String = options.cart_id;
    var goods_id = options.goods_id;
    var num = options.num;
    var sku_id = options.sku_id;
    if (options.group_active_id && options.group_active_id != "undefined") {
      var group_active_id = options.group_active_id;
    } else {
      var group_active_id = null;
    }
    if (options.group_id && options.group_id != "undefined") {
      var group_id = options.group_id;
    } else {
      var group_id = null;
    }
    that.setData({
      is_cart: is_cart,
      cart_id: cart_id,
      goods_id: goods_id,
      num: num,
      cart_id_String: cart_id_String,
      sku_id: sku_id,
      group_id: group_id,
      group_active_id: group_active_id,
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

//   选择收货地址
	address_onclick:function(){
		var goods_info = this.data.goods_info;
		wx.navigateTo({
			url: '/pages/receiver_address/address_list?goods_info=' + goods_info,
		})
	},




  //关闭选择配送方式的列表
  delivery_method_onClickdiaView: function () {
    this.setData({
      delivery_method_showDialog: !this.data.delivery_method_showDialog
    });
  },

  //选择配送方式
  select_express_onclick: function () {
    if (!this.data.localdelivery && !this.data.delivery) {
      Extension.show_top_msg(this, "商家未开启配送服务,或收货地址未在配送范围内.")
      return;
    }
    this.setData({
      delivery_method_showDialog: true,
    })
  },
  //选中的配送方式
  delivery_method_checked_onclick: function (list) {
    MyUtils.myconsole(list);
    MyUtils.myconsole(list.currentTarget.dataset.idx);
    var delivery_method_list = this.data.delivery_method_list;
    var express_text = '';
    var express_type = '';
    var freight_money = 0.00
    if (delivery_method_list && delivery_method_list.length > 0) {
      for (var i = 0; i < delivery_method_list.length; i++) {
        if (delivery_method_list[i].id == list.currentTarget.dataset.idx) {
          delivery_method_list[i].checked = true;
          express_text = delivery_method_list[i].title;
          express_type = delivery_method_list[i].id;
          if (delivery_method_list[i].id == 2) {
            freight_money = this.data.localdelivery_freight_money;
          }
          if (delivery_method_list[i].id == 3) {
            freight_money = this.data.delivery_freight_money;
          }
        } else {
          delivery_method_list[i].checked = false;
        }
      }
    }

    // if (list.target.dataset.idx==0){
    //   delivery_method_list['0'].checked = true;
    //   delivery_method_list['1'].checked = false;
    //   express_text = delivery_method_list[0].title;
    // } else if (list.target.dataset.idx == 1){
    //   delivery_method_list['0'].checked = false;
    //   delivery_method_list['1'].checked = true;
    //   express_text = delivery_method_list[1].title;
    // }

		var money = parseFloat(this.data.cost_money) + parseFloat(freight_money);
    MyUtils.myconsole('配送金额1：' + parseFloat(this.data.cost_money));
    MyUtils.myconsole('配送金额2：' + parseFloat(freight_money));
    MyUtils.myconsole('配送金额：' + money.toFixed(2));
    this.setData({
      delivery_method_list: delivery_method_list,
      express_text: express_text,
      express_type: express_type,
      delivery_method_showDialog: false,
      freight_money: freight_money,
			money: money.toFixed(2),
			coupon_ids: '',
			checked: false,
		})
		//获取优惠活动数据
		getdiscount(that, that.data.select_id, '');
  },

  onClickdiaView_edit_default: function () {
    get_address_add(this, 3);
  },
  //重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this) ;
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  // modalinput: function () {
  //   this.setData({
  //     hiddenmodalput: !this.data.hiddenmodalput
  //   })
  // },
  //取消按钮  
  // cancel: function () {
  //   this.setData({
  //     hiddenmodalput: true
  //   });
  // },
  //确认  
  confirm: function (e) {
		this.setData({
      // hiddenmodalput: true,
      remark: this.data.remark_input,
    })
  },
  //提交订单
  submit_onclick: function () {
    var up_to_send_goods_money = this.data.up_to_send_goods_money;
    var cost_money = this.data.cost_money;
    var express_type = this.data.express_type;
    // if ((express_type == 2 && up_to_send_goods_money && up_to_send_goods_money <= cost_money) || express_type == 3) {
      setAddOrder(this);
    // }
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

// 促销活动弹出窗
	tap_promotions_layer: function(e){
		this.setData({
			activity_eject: "",
			activity: "promotions",
			select_id: e.currentTarget.dataset.select_id ? e.currentTarget.dataset.select_id: "null",
		})
	},
//优惠券活动弹出窗
	tap_coupon_layer: function(){
		this.setData({
			activity_eject: "",
			activity: "coupon"
		})
	},

//关闭活动窗口
	tap_activity_layer_close: function () {
	//获取活动优惠
		getdiscount(this, this.data.select_id, this.data.coupon_ids);
	this.setData({
		activity_eject: "none",
		activity: ""
	})
},

//促销活动弹窗列表点击事件
promotions_activity_list: function(e){
	getdiscount(this, e.currentTarget.dataset.active_id, '');
	this.setData({
		select_id: e.currentTarget.dataset.active_id,
		activity_eject: "none",
		activity: "",
		coupon_ids: '',
		checked: false,
	})
},
//会员折扣选中状态
	discounts_radio: function(){
		if (this.data.checked){
			this.setData({
				checked: false,
			})
		}else{
			this.setData({
				checked: true,
			})
		}
		getdiscount(this, this.data.select_id, this.data.coupon_ids)
	},

	//优惠券选中事件
	checkboxChange: function (e) {
		var coupon_sele_id = '';
		for (var i = 0; i < e.detail.value.length; i++) {
			if (i == 0) {
				coupon_sele_id = e.detail.value[i];
			} else {
				coupon_sele_id += ","+e.detail.value[i];
			}
		}
		this.setData({
			coupon_sele: '0',
			coupon_sele_id: coupon_sele_id,
			checked: false,
		})
		//获取活动优惠
		getdiscount(this, this.data.select_id, coupon_sele_id);
	},
	
	//确认选中优惠券
	coupon_confirm: function () {
		this.setData({
			coupon_ids: this.data.coupon_sele_id ? this.data.coupon_sele_id : '',
			activity_eject: "none",
			activity: ""
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
			 //获取下单信息
			 getplaceOrderDetail(that, that.data.is_cart, that.data.cart_id, that.data.goods_id, that.data.num, that.data.sku_id, that.data.group_id, that.data.group_active_id);
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


// 获取下单信息
function getplaceOrderDetail(that, is_cart, cart_id, goods_id, num, sku_id, group_id, group_active_id) {
  //获取token
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['is_cart'] = is_cart;

		if (group_id) {
			data['group_id'] = group_id;
		}
		if (group_active_id) {
			data['group_active_id'] = group_active_id;
		}

		if (cart_id) {
			data['cart_id'] = cart_id;
		}

		if (goods_id) {
			data['goods_id'] = goods_id;
		}

		if (num) {
			data['num'] = num;
		}

		if (sku_id) {
			data['sku_id'] = sku_id;
		}

		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.GETORDERGETGOODS(),
			data,
			function (res) {
				try {
					if (res) {
						var delivery_method_list = that.data.delivery_method_list;
						var express_text = '';
						var express_type = '';
						var freight_money = 0.00;
						if (!res.express) {
							that.setData({
								delivery_method_list: [],
							})
						}
						if (delivery_method_list && delivery_method_list.length > 0) {
							var delete_index = -1;
							for (var i = 0; i < delivery_method_list.length; i++) {
								MyUtils.myconsole("获取到的数据：0=======：" + delivery_method_list[i].id);
								if (res.express && res.express.localdelivery && res.express.delivery) {
									MyUtils.myconsole("获取到的数据：1")
									if (delivery_method_list[i].id == 3) {
										MyUtils.myconsole("获取到的数据：1-1")
										delivery_method_list[i].checked = true;
										express_text = delivery_method_list[i].title;
										express_type = delivery_method_list[i].id;
										// freight_money = res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '';
										// if (freight_money) {
										//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money;
										// }
									} else {
										delivery_method_list[i].checked = false;
										//  var freight_money_title = res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '';
										//  if (freight_money_title) {
										//     delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money_title;
										//   }
									}
								}

								if (res.express && res.express.localdelivery && !res.express.delivery) {
									MyUtils.myconsole("获取到的数据：2")
									if (delivery_method_list[i].id == 2) {
										MyUtils.myconsole("获取到的数据：2-1")
										delivery_method_list[i].checked = true;
										express_text = delivery_method_list[i].title;
										express_type = delivery_method_list[i].id;
										// freight_money = res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '';
										// if (freight_money){
										//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money;
										// }
									} else {
										delete_index = i;
									}
								}

								if (res.express && !res.express.localdelivery && res.express.delivery) {
									MyUtils.myconsole("获取到的数据：3=======：" + delivery_method_list[i].id)
									if (delivery_method_list[i].id == 3) {
										MyUtils.myconsole("获取到的数据：3-1=======id：" + delivery_method_list[i].id)
										delivery_method_list[i].checked = true;
										express_text = delivery_method_list[i].title;
										express_type = delivery_method_list[i].id;
										// freight_money = res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '';
										// MyUtils.myconsole("获取到的数据：3-1=======money：" + delivery_method_list[i].id)
										// if (freight_money) {
										//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money;
										// }
									} else {
										delete_index = i;
										MyUtils.myconsole("获取到的数据：3-2=======：" + delivery_method_list[i].id)
									}
								}
							}

							if (delete_index > -1) {
								delivery_method_list.splice(delete_index, 1);
							}
						}

						var money = parseFloat(res.cost_money) + parseFloat(res.express.delivery.freight_money ? res.express.delivery.freight_money : '0.00');
						that.setData({
							goods_info: JSON.stringify(res.goods_info),
							commodity_list: res.list,
							cost_money: res.cost_money,
							cost_weight: res.cost_weight,
							goods_count: res.goods_count,
							delivery: res.express.delivery,
							up_to_send_goods_money: res.express.localdelivery && res.express.localdelivery.goods_money && res.express.localdelivery.goods_money > res.cost_money ? res.express.localdelivery.goods_money : '',
							localdelivery: res.express.localdelivery,
							delivery_method_list: delivery_method_list,
							express_text: express_text,
							store_id: res.express.localdelivery && res.express.localdelivery.store_id ? res.express.localdelivery.store_id : '',
							express_type: express_type,
							localdelivery_freight_money: res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '',
							delivery_freight_money: res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '',
							freight_money: res.express.delivery.freight_money,
							money: money.toFixed(2),
						})
						get_address_list(that, 1);

					} else {
						//自定义错误提示
						Extension.custom_error(that, '2', '页面加载失败', '（获取订单信息失败）', '2');
					}
				} catch (e) {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '（获取订单信息失败）', '2');
				}

			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求下单信息的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


//获取收货地址列表 inTo==1表示订单信息请求成功后获取默认地址
function get_address_list(that, inTo) {
  //获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data_new(
			MyHttp.ADDRESSLIST(),
			data,
			function (res) {
				if (res) {
					that.setData({
						default_address: inTo == 1 || that.data.default_address ? res.default : that.data.default_address,
						address_list: res.normal,
						addtype: true,
						checked_id: res.default && inTo == 1 ? res.default.id : that.data.checked_id,
						show_loading_faill: true,
						coupon_ids: '',
						checked: false,
					})
				} else {
					that.setData({
						addtype: false,
						show_loading_faill: true,
						coupon_ids: '',
						checked: false,
					})
				}
				//配送方式
				getmerchantexpress(that, res.default.id);
				//获取优惠活动数据
				getdiscount(that, that.data.select_id, '');
			},
			function (code, msg) {
				if (code == 10004) {
					that.setData({
						addtype: false,
						show_loading_faill: true,
						coupon_ids: '',
						checked: false,
					})
				} else {
					if (inTo == 1) {
						//自定义错误提示
						Extension.custom_error(that, '2', '页面加载失败', '（获取订单信息失败）', '2');
					} else {
						Extension.show_top_msg(that, '获取收货地址失败')
					}
				}
				that.setData({
					coupon_ids: '',
					checked: false,
				})
				//获取优惠活动数据
				getdiscount(that, that.data.select_id, '');

			},
			function (res) {
				if (inTo == 1) {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '（获取订单信息失败）', '2');
				} else {
					Extension.show_top_msg(that, '获取收货地址失败')
				}
			},
			function (res) {
				MyUtils.myconsole("请求收货地址列表的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}



// 获取配送方式
function getmerchantexpress(that, select_addres_id) {
  //获取token
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var is_cart = that.data.is_cart;
		var cart_id = that.data.cart_id;
		var cart_id_String = that.data.cart_id_String;
		var goods_id = that.data.goods_id;
		var num = that.data.num;
		var sku_id = that.data.sku_id;

		var data = {};
		if (select_addres_id) {
			data['address_id'] = select_addres_id;
		} else {
			Extension.show_top_msg(that, '获取配送方式失败');
			that.setData({
				delivery: '',
				localdelivery: '',
				delivery_method_list: '',
				express_text: '',
				up_to_send_goods_money: '',
				store_id: '',
				express_type: '',
				localdelivery_freight_money: '',
				delivery_freight_money: '',
				freight_money: '',
			})
		}
		data['is_cart'] = is_cart;

		if (cart_id_String) {
			data['cart_id'] = cart_id_String;
		}

		if (goods_id) {
			data['goods_id'] = goods_id;
		}

		if (num) {
			data['num'] = num;
		}

		if (sku_id) {
			data['sku_id'] = sku_id;
		}

		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);



		MyRequest.request_data(
			MyHttp.GETMERCHANTEXPRESS(),
			data,
			function (res) {
				if (res) {
					var delivery_method_list = [
						{
							'id': 2,
							'title': '同城配送',
							'content': '由商家门店提供配送服务',
							'checked': false,
						},
						{
							'id': 3,
							'title': '快递配送',
							'content': '由商家选择快递为您提供配送服务',
							'checked': false,
						}
					];
					var express_text = '';
					var express_type = '';
					var freight_money = 0.00;
					if (!res.express) {
						that.setData({
							delivery_method_list: [],
						})
					}
					if (delivery_method_list && delivery_method_list.length > 0) {
						var delete_index = -1;
						for (var i = 0; i < delivery_method_list.length; i++) {
							MyUtils.myconsole("获取到的数据：0=======：" + delivery_method_list[i].id);
							if (res.express && res.express.localdelivery && res.express.delivery) {
								MyUtils.myconsole("获取到的数据：1")
								if (delivery_method_list[i].id == 3) {
									MyUtils.myconsole("获取到的数据：1-1")
									delivery_method_list[i].checked = true;
									express_text = delivery_method_list[i].title;
									express_type = delivery_method_list[i].id;
									freight_money = res.express.delivery.freight_money;
									// freight_money = res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '';
									// if (freight_money) {
									//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money;
									// }
								} else {
									delivery_method_list[i].checked = false;
									// var freight_money_title = res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '';
									// if (freight_money_title) {
									//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money_title;
									// }
									// MyUtils.myconsole("同城配送金额：" + freight_money_title)
								}
							}

							if (res.express && res.express.localdelivery && !res.express.delivery) {
								MyUtils.myconsole("获取到的数据：2")
								if (delivery_method_list[i].id == 2) {
									MyUtils.myconsole("获取到的数据：2-1")
									delivery_method_list[i].checked = true;
									express_text = delivery_method_list[i].title;
									express_type = delivery_method_list[i].id;
									// freight_money = res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '';
									// if (freight_money) {
									//   delivery_method_list[i].title = delivery_method_list[i].title + '￥' + freight_money;
									// }
								} else {
									delete_index = i;
								}
							}
							// var money = parseFloat(that.data.cost_money) + parseFloat(freight_money);
							if (res.express && !res.express.localdelivery && res.express.delivery) {
								MyUtils.myconsole("获取到的数据：3=======：" + delivery_method_list[i].id)
								if (delivery_method_list[i].id == 3) {
									MyUtils.myconsole("获取到的数据：3-1=======id：" + delivery_method_list[i].id)
									delivery_method_list[i].checked = true;
									express_text = delivery_method_list[i].title;
									express_type = delivery_method_list[i].id;
									freight_money = res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '';
									freight_money = res.express.delivery.freight_money;
									MyUtils.myconsole("获取到的数据：3-1=======money：" + freight_money)
								} else {
									delete_index = i;
									MyUtils.myconsole("获取到的数据：3-2=======：" + delivery_method_list[i].id)
								}
							}
						}

						if (delete_index > -1) {
							delivery_method_list.splice(delete_index, 1);
						}
					}
					var money = parseFloat(that.data.cost_money) + parseFloat(freight_money);
					that.setData({
						delivery: res.express.delivery,
						localdelivery: res.express.localdelivery,
						delivery_method_list: delivery_method_list,
						up_to_send_goods_money: res.express.localdelivery && res.express.localdelivery.goods_money && res.express.localdelivery.goods_money > res.cost_money ? res.express.localdelivery.goods_money : '',
						express_text: express_text,
						store_id: res.express.localdelivery && res.express.localdelivery.store_id ? res.express.localdelivery.store_id : '',
						localdelivery_freight_money: res.express.localdelivery && res.express.localdelivery.freight_money ? res.express.localdelivery.freight_money : '',
						delivery_freight_money: res.express.delivery && res.express.delivery.freight_money ? res.express.delivery.freight_money : '',
						freight_money: res.express.delivery.freight_money,
						// money: money.toFixed(2),
						money: money.toFixed(2),
						express_type: express_type,
						coupon_ids: '',
						checked: false,
					})
					//获取优惠活动数据
					getdiscount(that, that.data.select_id, '');
				} else {
					Extension.show_top_msg(that, '获取配送方式失败');
					that.setData({
						delivery: '',
						localdelivery: '',
						delivery_method_list: '',
						express_text: '',
						up_to_send_goods_money: '',
						store_id: '',
						express_type: '',
						localdelivery_freight_money: '',
						delivery_freight_money: '',
						freight_money: '',
					})
				}
			},
			function (res) {
				Extension.show_top_msg(that, '获取配送方式失败');
				that.setData({
					delivery: '',
					localdelivery: '',
					delivery_method_list: '',
					express_text: '',
					up_to_send_goods_money: '',
					store_id: '',
					express_type: '',
					localdelivery_freight_money: '',
					delivery_freight_money: '',
					freight_money: '',
				})
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
}

//下单
function setAddOrder(that){
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		});
		var is_cart = that.data.is_cart;
		var cart_id_String = that.data.cart_id_String;
		var goods_id = that.data.goods_id;
		var num = that.data.num;
		var sku_id = that.data.sku_id;
		var goods_info = that.data.goods_info;

		//获取缓存中储存的分销身份绑定编号
		try {
			var p_distributor_no = wx.getStorageSync('p_distributor_no');
			if (p_distributor_no) {
				var distributor_no = p_distributor_no;
			}
		} catch (e) {
		}

		var data = {};

		data['token'] = token;
		data['channel_type'] = 2;
		//分销身份绑定编号
		data['distributor_no'] = distributor_no;
		//商品信息
		var commodity_list = that.data.commodity_list;
		MyUtils.myconsole("商品信息:" + commodity_list)
		if (commodity_list && commodity_list.length > 0) {
			for (var i = 0; i < commodity_list.length; i++) {
				commodity_list[i].num = commodity_list[i].in_cart_num;
			}
			data['goods_info'] = goods_info;
		} else {
			Extension.show_top_msg(that, '获取商品信息失败');
			return;
		}

		//门店id
		var store_id = that.data.store_id;
		if (store_id) {
			data['store_id'] = store_id;
		}

		var address_id = that.data.checked_id;
		if (address_id) {
			data['address_id'] = address_id;
		} else {
			Extension.show_top_msg(that, '收货地址不能为空');
			return;
		}
		//促销优惠
		var select_id = that.data.select_id;
		if (select_id) {
			data['active_id'] = select_id == 'null' ? "" : select_id;
		}
		//优惠券
		var coupon_sele_id = that.data.coupon_ids;
		if (coupon_sele_id) {
			data['coupon_ids'] = coupon_sele_id;
		}
		//会员折扣
		var can_use_member = that.data.can_use_member
		if (can_use_member) {
			data['is_use_member_discount'] = can_use_member && that.data.checked ? '1' : '2';
		}

		//拼团活动id
		var group_id = that.data.group_id;
		if (group_id) {
			data['group_id'] = group_id;
		}
		//拼团团id
		var group_active_id = that.data.group_active_id;
		if (group_active_id) {
			data['group_active_id'] = group_active_id;
		}

		var express_type = that.data.express_type;
		if (express_type) {
			data['express_type'] = express_type;
		} else {
			Extension.show_top_msg(that, '配送方式不能为空！');
			return;
		}

		//订单备注
		var remark = that.data.remark;
		if (remark) {
			data['remark'] = remark;
		}

		data['fright_is_cart'] = is_cart;

		if (remark) {
			data['remark'] = remark;
		}

		if (goods_id) {
			data['fright_goods_id'] = goods_id;
		}

		if (sku_id) {
			data['fright_sku_id'] = sku_id;
		}

		if (num) {
			data['fright_num'] = num;
		}

		if (cart_id_String) {
			data['fright_cart_id'] = cart_id_String;
		}

		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.ORDERADD(),
			data,
			function (res) {
				if (res) {
					// var money = parseFloat(that.data.cost_money) + parseFloat(that.data.freight_money);
					var money = that.data.money;
					var order_no = res.order_no;
					//关闭当前页面跳转至支付界面
					wx.redirectTo({
						url: '/pages/payment/paymentchoice?order_no=' + order_no + '&money=' + money,
					})
				} else {
					Extension.show_top_msg(that, '订单创建失败');
				}
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '订单创建失败');
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：")
				MyUtils.myconsole(res);
			})
	}
}



//优惠活动接口
function getdiscount(that, active_id, coupon_ids){
  var group_id = that.data.group_id;
  var group_active_id = that.data.group_active_id;

  //如果是拼团商品则不掉优惠活动接口
  if (!group_id && !group_active_id){
	//网络传参数组
	var data = {};
	//获取token
	  var token = MySign.getToken();
	  if (!token) {
		  Extension.custom_error(that, '3', '登录失效', '', '3');
	  } else {
		  data['token'] = token;
		  //促销活动id
		  if (active_id || active_id == 'null') {
			  data['active_id'] = active_id;
		  }
		  //优惠券逗号拼接id字符串
		  if (coupon_ids) {
			  data['coupon_ids'] = coupon_ids;
		  }
		  //邮费
		  var postage = that.data.freight_money;
		  if (postage) {
			  data['postage'] = postage;
		  }
		  //收货地址id
		  if (that.data.default_address) {
			  var address_id = that.data.default_address.id;
		  }
		  if (address_id) {
			  data['address_id'] = address_id;
		  }
		  //商品信息数据包
		  data['goods_info'] = that.data.goods_info;

		  //商户号
		  data['mchid'] = MySign.getMchid();
		  //签名
		  data['sign'] = MySign.sign(data);

		  MyRequest.request_data(
			  MyHttp.GETDISCOUNT(),
			  data,
			  function (res) {
				  if (res) {
					  //重新计算价格 cost_money零售价，freight_money运费，res.active_list.select_data.discount优惠券，
					  var money = 0.00;
					  //y零售价
					  var cost_money = parseFloat(that.data.cost_money);
					  //运费is_postage=1包邮=2不包邮
					  var freight_money = parseFloat(res.active_list.select_data.is_postage == 2 && that.data.freight_money ? that.data.freight_money : 0);
					  //促销优惠
					  var discount = parseFloat(res.active_list.select_data.discount);
					  //会员折扣
					  var discount_cost = parseFloat(that.data.checked && res.member_info.can_use_member ? res.member_info.discount_cost : 0);
					  //优惠券
					  var total_discount = parseFloat(res.coupon_info.total_discount ? res.coupon_info.total_discount : 0);
					  //限时折扣
					  var time_limit = parseFloat(res.time_limit.discount_money ? res.time_limit.discount_money : 0);
					  //计算后的价格
					  var money = cost_money + freight_money - discount - discount_cost - total_discount - time_limit;

					  that.setData({
						  active_list: res.active_list,
						  coupon_info: res.coupon_info,
						  member_info: res.member_info,
						  can_use_member: res.member_info.can_use_member,
						  money: money.toFixed(2),
						  time_limit: res.time_limit.discount_money,
						  select_id: res.active_list.select_data.id
					  })
					  var is_checked = 0;
					  if (res.coupon_info.coupon_list && res.coupon_info.coupon_list.can_use) {
						  for (var i = 0; i < res.coupon_info.coupon_list.can_use.length; i++) {
							  if (res.coupon_info.coupon_list.can_use[i].is_checked) {
								  is_checked += 1;
							  }
							  that.setData({
								  coupon_sele: is_checked,
							  })
						  }
					  } else {
						  that.setData({
							  coupon_sele: is_checked,
						  })
					  }
				  } else {
					  Extension.show_top_msg(that, '无法使用');
				  }
			  },
			  function (res) {
				  Extension.show_top_msg(that, '无法使用');
			  },
			  function (res) {
				  MyUtils.myconsole("请求优惠活动的数据：")
				  MyUtils.myconsole(res);
			  })
	  }
  }
}