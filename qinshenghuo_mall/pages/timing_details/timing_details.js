// pages/communal/commodity_details.js
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
// 在需要使用的js文件中，导入js  
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goods_id: '',
		num: 0,
		price_text: '',
		totalNum: 0,
		propertyid: [],
		sku_id: '',
		sku_type: '',


		article: '',
		swiperCurrent: 0,
		showDialog: false,
		add: '',
		login_show: false,
		second: '获取验证码',
		show_secound: 'none',
		loading_code: false,
		phone: '',
		code: '',
		img_round: 0,
		//后台设置限购数量
		integral_limit_num: '',
		//当前用户可购买数量
		buy_limit: '',
		guanzhu: false,
		freight_money: '0.00',
		hide_delete: true,
		qrcode_url: "",
		//活动弹出窗默认隐藏
		activity_eject: "none"
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		/**
		  * WxParse.wxParse(bindName , type, data, target,imagePadding)
		  * 1.bindName绑定的数据名(必填)
		  * 2.type可以为html或者md(必填)
		  * 3.data为传入的具体数据(必填)
		  * 4.target为Page对象,一般为this(必填)
		  * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
		  */
		var that = this;
		var scene = decodeURIComponent(options.scene);
		if (scene && scene != 'undefined') {
			if (scene.indexOf('&') != -1) {
				var strs = scene.split("&"); //字符分割 
				var goods_id = strs[0];
				var p_distributor_no = strs[1];
				that.setData({
					goods_id: goods_id,
				});
			} else {
				that.setData({
					goods_id: scene,
				});
			}
		} else {
			//分销关系绑定身份编号
			if (options.distributor_no && options.distributor_no != 'undefined') {
				var p_distributor_no = options.distributor_no;
			}
			that.setData({
				goods_id: options.goods_id,
			})
		}

		//缓存分销身份绑定编号
		if (p_distributor_no) {
			try {
				wx.setStorageSync('p_distributor_no', p_distributor_no)
			} catch (e) {
			}
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function (options) {
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		//初始化页面
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
	onShareAppMessage: function (res) {
		var that = this;
		return {
			title: that.data.commodity_data.introduction,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},

	swiperChange: function (e) {
		this.setData({
			swiperCurrent: e.detail.current
		})
	},


	//规格的点击事件
	checked_property_oncilick: function (list) {
		MyUtils.myconsole('规格的点击事件：');
		MyUtils.myconsole(list.target.dataset);
		MyUtils.myconsole(list.target.dataset.idx);
		MyUtils.myconsole('规格的点击事件2：');
		MyUtils.myconsole(list.target.dataset.postion);
		MyUtils.myconsole('规格的点击事件3：');
		MyUtils.myconsole(list.target.dataset.itmpostion);
		var index = list.target.dataset.postion;
		var propertyid = this.data.propertyid;
		if (propertyid[index] == list.target.dataset.idx.id) {
			propertyid[index] = '';
		} else {
			propertyid[index] = list.target.dataset.idx.id;
		}
		this.setData({
			propertyid: propertyid,
		})
		get_request_getproperty_sku(this, this.data.goods_id, propertyid);
	},


	onClickdiaView: function () {
		this.setData({
			sku_type: '',
			sku_id: '',
			showDialog: !this.data.showDialog
		});
	},

	onTapMinus: function () {
		//减号点击
		if (this.data.totalNum > 1) {
			this.plusMinus('minus');
		}
	},
	onTapPlus: function () {
		//加号点击
		if (this.data.totalNum > 1) {
			this.plusMinus('plus');
		}
	},
	onInputNum: function (e) {
		//input输入时
		this.inputFunc('input', Number(e.detail.value));
	},
	lossFocus: function (e) {
		//input失去焦点时
		this.inputFunc('loss', Number(e.detail.value));
	},
	plusMinus: function (pars) {
		let totalNum = this.data.totalNum;
		let num = this.data.num;
		if (pars == "plus" && num == 1) {
			num++;
		} else if (pars == "minus" && num == totalNum) {
			num--;
		} else if (num > 1 && num < totalNum) {
			pars == "plus" ? num++ : num--;
		}
		this.setData({
			num: num
		});
	},
	inputFunc: function (pars, evalue) {
		let totalNum = this.data.totalNum;
		if (pars == 'input') {
			if (evalue.length == 1 && evalue[0] == 0) { evalue = 1; }
		} else {
			if (totalNum > 0) {
				if (evalue == '' || evalue <= 0) {
					evalue = 1;
				} else if (evalue > totalNum) {
					evalue = totalNum;
				}
			} else {
				evalue = 0;
			}
		}
		this.setData({
			num: evalue
		});
	},
	// 加入购物车
	add_shoppingtrolley_onlick: function () {
		//获取token
		var token = MySign.getToken();
		if (token) {
			wx.showLoading({
				title: '加载中...',
				mask: true,
			})
			get_request_shopping_trolley(this, token);
		}
	},
	//购买
	buy_commodity: function () {
		wx.showLoading({
			title: '加载中...',
		})
		get_request_getproperty(this, this.data.goods_id, 2)
	},
	//加入购物车
	add_shopping: function () {
		//获取token
		var token = MySign.getToken();
		if (token) {
			wx.showLoading({
				title: '加载中...',
				mask: true,
			})
			get_request_getproperty(this, this.data.goods_id, 1)
		}
	},
	// 购买商品
	buy_onlick: function () {

		//获取token
		var token = MySign.getToken();
		if (token) {
			var goods_id = this.data.goods_id,
				sku_id = this.data.sku_id,
				num = this.data.num,
				totalNum = this.data.totalNum,
				sku_type = this.data.sku_type,
				integral_num = this.data.integral_limit_num,
				buy_limit = this.data.buy_limit;
			//sku_type 为true才会有sku_id
			MyUtils.myconsole("请求失败的数据：" + sku_type)

			if (!goods_id) {
				Extension.show_top_msg(this, '请重新选择商品')
				return;
			} else if (totalNum <= 0) {
				Extension.show_top_msg(this, '商品库存不足')
				return;
			} else if (sku_type && !sku_id) {
				Extension.show_top_msg(this, '商品规格不能为空');
				return;
			} else if (integral_num != 0 && num > buy_limit) {
				Extension.show_top_msg(this, '已达到商品购买限制数量');
				return;
			}

			MyUtils.MyOnclick(
				function () {
					wx.navigateTo({
						url: '/pages/communal/place_an_order?is_cart=' + 2 + '&goods_id=' + goods_id + '&num=' + num + '&sku_id=' + sku_id,
					})
				})

			//跳转至下单界面  然后刷新界面  关闭弹窗
			this.setData({
				num: 0,
				totalNum: 0,
				sku_id: '',
				price_text: '',
				sku_type: '',
				showDialog: !this.data.showDialog,//关闭窗口
			})
			// get_request_data(this, null);
		}
		wx.hideToast()
	},
	onClickdiaView: function () {
		this.setData({
			sku_type: '',
			sku_id: '',
			showDialog: !this.data.showDialog
		});
	},
	//跳转至首页
	home_onclick: function () {
		wx.switchTab({
			url: '/pages/home/home'
		})
	},
	//跳转至客服
	msg_onclick: function () {
		var goods_id = this.data.goods_id;
		wx.navigateTo({
			url: '/pages/service/service?goods_id=' + goods_id,
		})
	},
	//跳转至购物车
	shopping_trolley_onclick: function () {
		wx.switchTab({
			url: '/pages/shoppingcart/shoppingcart'
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

	// 促销活动弹出窗
	tap_promotions_layer: function () {
		this.setData({
			activity_eject: "",
			activity: "promotions"
		})
	},

	//关闭活动窗口
	tap_activity_layer_close: function () {
		this.setData({
			activity_eject: "none",
			activity: ""
		})
	},
	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this);
	},

	//授权完成回调
	login_success: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this);
	},
})



//初始化页面
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
			}
			that.setData({
				login: login,
			})

			get_request_data(that, that.data.goods_id);
		},
		function () {
			//自定义错误提示
			Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
	)
}


//  获取当前时间
function current(that) {
	// 调用函数时，传入new Date()参数，返回值是日期和时间
	var current_time = util.Time(new Date());
	// 再通过setData更改Page()里面的data，动态更新页面的数据  
	that.setData({
		current_time: current_time
	});
}
//获取开始时间
function startTime(that) {
	if (that.data.commodity_data.timelimimt_view) {
		var start_time = that.data.commodity_data.timelimimt_view.start_time;
	}
	if (start_time) {
		//月日
		var arr1 = start_time.split(" ");
		var sdate = arr1[0].split('-');
		var start_date = sdate[1] + "月" + sdate[2] + "日";
		//时分
		var sdate_time = arr1[1].split(':');
		var start_time = sdate_time[0] + ":" + sdate_time[1];
		that.setData({
			start_date: start_date,
			start_time: start_time,
		})
	}
}

//获取商品详情
function get_request_data(that, goods_id) {
	var token = MySign.getToken();
	var data = {};
	data['token'] = token;
	data['goods_id'] = goods_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	MyRequest.request_data(
		MyHttp.GOODS_DETAIL(),
		data,
		function (res) {
			if (res && res.length != 0) {
				that.setData({
					activity_data: res.activity_data,
				})
				var img_round = 0;
				var img_round_list = res.img_round.split(",")
				for (var i = 0; i < img_round_list.length; i++) {
					if (img_round_list[i] > img_round) {
						img_round = img_round_list[i];
					}
				}
				MyUtils.myconsole("获取到最大图片的比例：" + img_round)
				//获取屏幕宽高  
				wx.getSystemInfo({
					success: function (res) {
						var windowWidth = res.windowWidth;
						var windowHeight = res.windowHeight;
						that.setData({
							display_height: windowWidth * img_round,
						})
						MyUtils.myconsole("屏幕的宽度" + windowWidth)
						MyUtils.myconsole("获取到轮播图的高度：" + windowWidth * img_round)
					}
				});

				that.setData({
					commodity_data: res,
					show_loading_faill: true,
				})
				if (res.content) {
					WxParse.wxParse('article', 'html', res.content, that, 0);
				}
				if (res.freight_money.delivery.freight_money > 0) {
					that.setData({
						freight_money: res.freight_money.delivery.freight_money,
					})
				}
				//获取当前时间
				current(that)
				//获取开始时间
				startTime(that);

			} else {
				//自定义错误提示
				Extension.custom_error(that, '3', '该商品已下架', '', '');
			}
		},
		function (res) {
			//错误提示
			Extension.error(that, res);
		},
		function (res) {
			MyUtils.myconsole("请求商品详情的数据：")
			MyUtils.myconsole(res);
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
		})
}


// 获取商品属性
function get_request_getproperty(that, goods_id) {
	var token = MySign.getToken();
	if (goods_id == "" || goods_id == null) {
		Extension.show_top_msg(that, '数据加载失败')
		return;
	}
	var data = {};
	data['token'] = token;
	data['goods_id'] = goods_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.GETPROPERTY(),
		data,
		function (res) {
			if (res) {
				that.setData({
					goods_id: goods_id,
					property_data: res,
					num: res.stock > 0 ? 1 : 0,
					totalNum: res.stock,
					price_text: res.price,
					showDialog: !that.data.showDialog,
					sku_type: res.sku.length > 0 ? 'true' : '',
					propertyid: [],
					integral_limit_num: res.max_buy_num,
					buy_limit: res.buy_limit,
				})
			} else {
				Extension.show_top_msg(that, '获取商品信息失败')
			}
		},
		function (res) {
			Extension.show_top_msg(that, '数据加载失败')
		},
		function (res) {
			MyUtils.myconsole("请求商品属性的数据：")
			MyUtils.myconsole(res);
			//关闭加载中动画
			wx.hideLoading();
		})

}


// 获取商品sku
function get_request_getproperty_sku(that, goods_id, propertyid) {
	if (goods_id == null && propertyid != null && propertyid.leng > 0) {
		Extension.show_top_msg(that, '数据加载失败')
		return;
	}
	var sku_id = propertyid.join(",");

	MyUtils.myconsole("获取到商品的规格id：" + sku_id)

	var data = {};
	data['goods_id'] = goods_id;
	data['sku_id'] = sku_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.GETSKU(),
		data,
		function (res) {
			if (res) {
				that.setData({
					// property_data: res,
					num: res.stock > 0 ? 1 : 0,
					// totalNum: res.stock,
					sku_id: res.sku_id,
					totalNum: res.stock,
					price_text: res.price,
				})
				if (res.stock <= 0) {
					Extension.show_top_msg(that, '商品库存不足')
				}
			} else {
				Extension.show_top_msg(that, '商品信息获取失败')
			}
		},
		function (res) {
			Extension.show_top_msg(that, '数据加载失败')
		},
		function (res) {
			MyUtils.myconsole("请求商品sku的数据：")
			MyUtils.myconsole(res);
			//关闭加载中动画
			wx.hideLoading();
		})

}


// 加入购物车
function get_request_shopping_trolley(that, token) {
	var goods_id = that.data.goods_id,
		sku_id = that.data.sku_id,
		num = that.data.num,
		totalNum = that.data.totalNum,
		sku_type = that.data.sku_type,
		integral_num = that.data.integral_limit_num,
		buy_limit = that.data.buy_limit;
	if (!goods_id) {
		Extension.show_top_msg(that, '请重新选择商品')
		return;
	} else if (totalNum <= 0) {
		Extension.show_top_msg(that, '商品库存不足')
		return;
	} else if (sku_type && !sku_id) {
		Extension.show_top_msg(that, '商品规格不能为空');
		return;
	} else if (integral_num != 0 && num > buy_limit) {
		Extension.show_top_msg(that, '已达到商品购买限制数量');
		return;
	}

	var data = {};
	data['token'] = token;
	data['goods_id'] = goods_id;
	if (sku_id) {
		data['sku_id'] = sku_id;
	}
	data['num'] = num;
	data['sign'] = MySign.sign(data);
	MyRequest.request_data(
		MyHttp.ADDSHOPPING(),
		data,
		function (res) {
			that.setData({
				num: 0,
				totalNum: 0,
				sku_id: '',
				price_text: '',
				sku_type: '',
				showDialog: !that.data.showDialog,//关闭窗口
			})
			Extension.show_top_msg(that, '已加入购物车');
		},
		function (res) {
			Extension.show_top_msg(that, res ? res : " '加入购物车失败'")
		},
		function (res) {
			MyUtils.myconsole("请求加入购物车的数据：")
			MyUtils.myconsole(res);
			//关闭加载中动画
			wx.hideLoading();
		})

}