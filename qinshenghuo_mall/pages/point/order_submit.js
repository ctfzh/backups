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
    address_name: '',
    address_phone: '',
    address_information: '',
    address_postal_code: '',
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
    wx.hideShareMenu();
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
    that.setData({
      is_cart: is_cart,
      cart_id: cart_id,
      goods_id: goods_id,
      num: num,
      cart_id_String: cart_id_String,
      sku_id: sku_id,
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
  address_onclick: function () {
    this.setData({
      addres_id: '',
      address_name: '',
      address_phone: '',
      address_information: '',
      address_postal_code: '',
      address_showDialog: !this.data.address_showDialog
    });
  },

  // 添加地址
  address_onclick_wx: function (list) {
    var that = this;
    //获取微信收货地址
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          addres_id: '',
          //收件人姓名
          address_name: res.userName,
          //收件人手机号
          address_phone: res.telNumber,
          //收件人详细地址
          address_information: res.detailInfo,
          //收件人邮编
          address_postal_code: res.postalCode,
          address_showDialog: !that.data.address_showDialog,
          address_edit_showDialog: !that.data.address_edit_showDialog
        })
        get_address_code(that, '1', 0, '')
      },
      fail: function () {
        that.setData({
          addres_id: '',
          address_name: '',
          address_phone: '',
          address_information: '',
          address_postal_code: '',
          address_showDialog: !that.data.address_showDialog
        });
      }
    })
  },
  // 关闭收货地址列表
  onClickdiaView: function () {
    this.setData({
      addres_id: '',
      address_name: '',
      address_phone: '',
      address_information: '',
      address_postal_code: '',
      address_showDialog: !this.data.address_showDialog
    });
  },
  //列表选中事件
  checked_onclick: function (list) {
    MyUtils.myconsole('选中地址：');
    MyUtils.myconsole(list.target.dataset.idx);
    this.setData({
      checked_id: list.target.dataset.idx.id,
      default_address: list.target.dataset.idx,
      address_showDialog: !this.data.address_showDialog
    });
    getmerchantexpress(this, list.target.dataset.idx.id);
  },

  //去修改收货地址
  edit_onclick: function (list) {
    var list = list.target.dataset.idx;
    MyUtils.myconsole('去修改的地址：');
    MyUtils.myconsole(list);
    this.setData({
      addres_id: list.id,
      address_name: list.name,
      address_phone: list.phone,
      address_information: list.address,
      address_postal_code: list.code,
      delete_show: list && list.is_default == 1 ? false : true,
      address_edit_showDialog: !this.data.address_edit_showDialog
    });
    get_address_code(this, '1', 0, list.province_code)
    get_address_code(this, list.province_code, 1, list.city_code)
    get_address_code(this, list.city_code, 2, list.county_code)
  },
  //去新增收货地址
  add_onclick: function (list) {
    this.setData({
      addres_id: '',
      address_name: '',
      address_phone: '',
      address_information: '',
      address_postal_code: '',
      address_edit_showDialog: !this.data.address_edit_showDialog
    });
    get_address_code(this, '1', 0, '')
  },
  //删除收货地址
  onClickdiaView_edit_delete: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此收货地址？',
      success: function (res) {
        if (res.confirm) {
          get_address_delete(that);
        } else if (res.cancel) {
          MyUtils.myconsole('用户点击取消')
        }
      }
    })


  },
  // 关闭收货地址列表
  onClickdiaView_edit: function () {
    this.setData({
      addres_id: '',
      address_name: '',
      address_phone: '',
      address_information: '',
      address_postal_code: '',
      address_edit_showDialog: !this.data.address_edit_showDialog,
      // address_showDialog: !this.data.address_showDialog
    });
  },
  //选择的省
  bindProvinceChange: function (e) {
    MyUtils.myconsole('省：' + e.detail.value)
    this.setData({
      province_index: e.detail.value
    })
    var province_array = this.data.province_array;
    get_address_code(this, province_array[e.detail.value].id, 1, '')
  },
  //选择的市
  bindCityChange: function (e) {
    MyUtils.myconsole('市：' + e.detail.value)
    this.setData({
      city_index: e.detail.value
    })
    var city_array = this.data.city_array;
    get_address_code(this, city_array[e.detail.value].id, 2, '')
  },
  //选择的区
  bindRegionChange: function (e) {
    MyUtils.myconsole('区：' + e.detail.value)
    this.setData({
      region_index: e.detail.value
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
      Extension.Extension.show_top_msg(this, "商家未开启配送服务,或收货地址未在配送范围内.")
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
  },



  //获取输入的收货人
  bindInputName: function (e) {
    this.setData({
      address_name: e.detail.value,
    })

  },
  //获取输入的手机号码
  bindInputPhone: function (e) {
    this.setData({
      address_phone: e.detail.value,
    })
  },
  //获取输入的详细地址
  bindInputAddressInformation: function (e) {
    this.setData({
      address_information: e.detail.value,
    })
  },
  //获取输入的留言信息
  bindInputremark: function (e) {
    this.setData({
      remark_input: e.detail.value,
    })
  },
  //获取输入的邮编
  bindInputPostalCode: function (e) {
    this.setData({
      address_postal_code: e.detail.value,
    })
  },


  //保存收货地址
  onClickdiaView_edit_save: function () {
    var id = this.data.addres_id;
    var phone = this.data.address_phone;
    MyUtils.myconsole("地址id:" + id)
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        Extension.show_top_msg(this, '手机号格式有误')
      }
    } else {
      this.setData({
        ajxtrue: true
      })
      get_address_add(this, !id ? 1 : 2);
    }
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
	  //页面重新加载
	  Refresh(this);
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
    setAddOrder(this);
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
			 //进行网络请求
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
			MyHttp.UGETORDERGETGOODS(),
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

						var money = parseFloat(res.pay_money) + parseFloat(res.express.delivery.freight_money ? res.express.delivery.freight_money : '0.00');
						that.setData({
							goods_info: res.goods_info,
							commodity_list: res.list,
							cost_money: res.pay_money,
							pay_bonus: res.pay_bonus,
							cost_weight: res.cost_weight,
							goods_count: res.goods_count,
							delivery: res.express.delivery,
							up_to_send_goods_money: res.express.localdelivery && res.express.localdelivery.goods_money && res.express.localdelivery.goods_money > res.pay_money ? res.express.localdelivery.goods_money : '',
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
				MyUtils.myconsole("请求失败的数据：")
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

			},
			function (res) {
				if (inTo == 1) {
					//错误提示
					Extension.error(that, res);
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

//新增、改收货地址 type:1、新增  2、修改 3、设为默认地址
function get_address_add(that, inToType) {
  //获取token
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var address_name = that.data.address_name;
		var address_phone = that.data.address_phone;
		var address_information = that.data.address_information;
		var address_postal_code = that.data.address_postal_code;


		var province_array = that.data.province_array;
		var province_index = that.data.province_index;

		var city_array = that.data.city_array;
		var city_index = that.data.city_index;

		var region_array = that.data.region_array;
		var region_index = that.data.region_index;
		var data = {};
		if (inToType == 2 || inToType == 3) {
			var id = that.data.addres_id;
			MyUtils.myconsole("地址--id:" + id)
			if (id) {
				data['id'] = id;
			} else {
				Extension.show_top_msg(that, '收货地址保存失败！')
				return;
			}
		}
		if (inToType == 3) {
			data['is_default_address'] = 1;
		}


		if (address_name) {
			data['name'] = address_name;
		} else {
			Extension.show_top_msg(that, '收货人不能为空！')
			return;
		}
		if (address_phone) {
			data['telephone'] = address_phone;
		} else {
			Extension.show_top_msg(that, '收货人联系电话不能为空！')
			return;
		}
		if (province_array && province_index && province_index != 0) {
			data['province'] = province_array[province_index].id;
		} else {
			Extension.show_top_msg(that, '请选择收货地区！')
			return;
		}

		if (city_array && city_index && city_index != 0) {
			data['city'] = city_array[city_index].id;
		} else {
			Extension.show_top_msg(that, '请选择收货地区！')
			return;
		}
		if (region_array && region_index && region_index != 0) {
			data['region'] = region_array[region_index].id;
		} else {
			Extension.show_top_msg(that, '请选择收货地区！')
			return;
		}



		if (address_information) {
			data['address'] = address_information;
		} else {
			Extension.show_top_msg(that, '详细地址不能为空！')
			return;
		}
		if (address_postal_code) {
			data['code'] = address_postal_code;
		}
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data_new(
			inToType == 1 ? MyHttp.ADDRESSADD() : MyHttp.ADDRESSEDIT(),
			data,
			function (res) {
				if (res) {
					if (inToType == 1) {
						Extension.show_top_msg(that, '收货地址新增成功');
					} else if (inToType == 2) {
						Extension.show_top_msg(that, '收货地址修改成功');
					} else if (inToType == 3) {
						Extension.show_top_msg(that, '默认地址设置成功');
					}
					get_address_list(that, 2);
					that.setData({
						addres_id: '',
						address_name: '',
						address_phone: '',
						address_information: '',
						address_postal_code: '',
						address_edit_showDialog: !that.data.address_edit_showDialog
					})
				}
			},
			function (code, msg) {
				MyUtils.myconsole("请求失败的数据：------------------------------3-----------")
				if (inToType == 1) {
					Extension.show_top_msg(that, '收货地址新增失败');
				} else if (inToType == 2) {
					Extension.show_top_msg(that, '收货地址修改失败');
				} else if (inToType == 3) {
					Extension.show_top_msg(that, '默认地址设置失败');
				}

			},
			function (res) {
				if (inTo == 1) {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '（获取订单信息失败）', '2');

				} else {
					if (inToType == 1) {
						Extension.show_top_msg(that, '收货地址新增失败');
					} else if (inToType == 2) {
						Extension.show_top_msg(that, '收货地址修改失败');
					} else if (inToType == 3) {
						Extension.show_top_msg(that, '默认地址设置失败');
					}
				}
			},
			function (res) {
				MyUtils.myconsole("请求新增、改收货地址的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();

			})

	}
}


//删除收货地址
function get_address_delete(that) {

	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};

		var id = that.data.addres_id;
		MyUtils.myconsole("地址--id:" + id)
		if (id) {
			data['id'] = id;
		} else {
			Extension.show_top_msg(that, '收货地址删除失败！')
			return;
		}

		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data_new(
			MyHttp.ADDRESSDELETE(),
			data,
			function (res) {
				get_address_list(that, 2);
				that.setData({
					addres_id: '',
					address_name: '',
					address_phone: '',
					address_information: '',
					address_postal_code: '',
					default_address: id == that.data.checked_id ? '' : that.data.default_address,
					address_edit_showDialog: !that.data.address_edit_showDialog
				})
				Extension.show_top_msg(that, '收货地址删除成功');
			},
			function (code, msg) {
				Extension.show_top_msg(that, msg ? msg : '默认地址设置失败');
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '默认地址设置失败');
			},
			function (res) {
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


//获取城市的code
function get_address_code(that, pid, getType, code) {

  var data = {};

  data['pid'] = pid;
  data['sign'] = MySign.sign(data);

  MyRequest.request_data_new(
    MyHttp.GET_ADDRESS_CODE(),
    data,
    function (res) {
      var index = 0;
      var array = [];
      if (res) {
        for (var a in res) {
          MyUtils.myconsole("key:" + a);
          MyUtils.myconsole("value:" + res[a]);
          if (a) {
            array.push({
              id: a,
              name: res[a],
            })
          } else {
            array.unshift({
              id: a ? a : 0,
              name: res[a],
            })

          }

        }

        if (code) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id == code) {
              index = i;
            }
          }
        }
        if (getType == 0) {
          that.setData({
            province_array: array,
            province_index: index,
          })
        } else if (getType == 1) {
          that.setData({
            city_array: array,
            city_index: index,
          })
        } else if (getType == 2) {
          that.setData({
            region_array: array,
            region_index: index,
          })
        }
      } else {
      }
    },
    function (code, msg) {
      Extension.show_top_msg(that, '获取城市code失败')
    },
    function (res) {
      Extension.show_top_msg(that, '获取城市code失败')
		},
		function (res) {
			MyUtils.myconsole("请求城市的code的数据：")
			MyUtils.myconsole(res);
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
		})


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
					MyUtils.myconsole("获取到的数据：")
					MyUtils.myconsole(res);
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
						up_to_send_goods_money: res.express.localdelivery && res.express.localdelivery.goods_money && res.express.localdelivery.goods_money > res.pay_money ? res.express.localdelivery.goods_money : '',
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
				MyUtils.myconsole("请求配送方式的数据：")
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}

//下单
function setAddOrder(that) {
	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
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
			data['goods_info'] = JSON.stringify(goods_info);
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

		wx.showLoading({
			title: '加载中...',
			mask: true,
		});
		MyRequest.request_data(
			MyHttp.ADDORDER(),
			data,
			function (res) {
				if (res) {
					// var money = parseFloat(that.data.cost_money) + parseFloat(that.data.freight_money);
					var money = that.data.money;
					var order_no = res.order_no;
					//关闭当前页面跳转至支付界面
					if (money > 0) {
						wx.redirectTo({
							url: '/pages/payment/paymentchoice?order_no=' + order_no + '&money=' + money,
						})
					} else {
						wx.redirectTo({
							url: '/pages/payment/paymentsuccess?order_no=' + order_no + '&money=' + money,
						})
					}
					wx.hideLoading();
				} else {
					Extension.show_top_msg(that, '订单创建失败');
				}
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '订单创建失败');
			},
			function (res) {
				MyUtils.myconsole("请求下单的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}

