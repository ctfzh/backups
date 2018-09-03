// pages/point/point_detail.js
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');
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
		freight_money: '',
		goods_bonus: '',
		goods_price: '',
		integral_limit_num: '',
		member_integral_num: '',
		guanzhu: false,
		qrcode_url: "",
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
    var that = this;
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
    that.setData({
			goods_id: options.goods_id,
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
	onShareAppMessage: function () {

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

	//购买
	buy_commodity: function () {
		wx.showLoading({
			title: '加载中...',
		})
    get_request_data(this, this.data.goods_id);
		get_request_getproperty(this, this.data.goods_id, 2)
	},

	// 购买商品
	buy_onlick: function (e) {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})
		//获取token
		var token = MySign.getToken();
		if (token) {
			var goods_id = this.data.goods_id,
				sku_id = this.data.sku_id,
				num = this.data.num,
				totalNum = this.data.totalNum,
				sku_type = this.data.sku_type,
				integral_num = this.data.integral_limit_num,
				member_num = this.data.member_integral_num;

			//sku_type 为true才会有sku_id
			MyUtils.myconsole("请求失败的数据：" + sku_type)
			if (!goods_id) {
				Extension.show_top_msg(this, '请重新选择商品')
				return;
			} else if (integral_num != 0 && num + member_num >= integral_num) {
				Extension.show_top_msg(this, '已达到商品购买限制数量');
				return;
			} else if (sku_type && !sku_id) {
				Extension.show_top_msg(this, '商品规格不能为空');
				return;
			} else if (totalNum <= 0) {
				Extension.show_top_msg(this, '商品库存不足')
				return;
			}
			//sku_type 为true才会有sku_id
			MyUtils.MyOnclick(
				function () {
					wx.navigateTo({
						url: '/pages/point/order_submit?is_cart=' + 2 + '&goods_id=' + goods_id + '&num=' + num + '&sku_id=' + sku_id,
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
		} else {
			Extension.registerrule(this, function (that) { that.buy_onlick() }, e);
		}
		wx.hideToast()
	},
	onClickdiaView: function () {
		this.setData({
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
	msg_onclick: function (e) {
		//获取token
		var token = MySign.getToken();
		if (token) {
			var goods_id = this.data.goods_id;
			wx.navigateTo({
				url: '/pages/service/service?goods_id=' + goods_id,
			})
		} else {
			Extension.registerrule(this, function (that) { that.msg_onclick() }, e);
		}
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
	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this);
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
			 get_request_data(that, that.data.goods_id);
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


//获取商品详情
function get_request_data(that, goods_id) {
  var token = MySign.getToken();
	var data = {};
	if (token) {
		data['token'] = token;
	}
	data['goods_id'] = goods_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	MyRequest.request_data(
		MyHttp.POINTDETAIL(),
		data,
		function (res) {
			if (res) {
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
        //判断购买按钮的状态
        if (res.integral_is_open == 1) {
          if (res.member_bonus >= res.integral_goods_bonus) {
            that.setData({
              anniu_duihuan: "0"
            })
          } else {
            that.setData({
              anniu_duihuan: "1"
            })
          }
        } else {
          that.setData({
            anniu_duihuan: "2"
          })
        }

        that.setData({
          member_bonus: res.member_bonus,
          integral_is_open: res.integral_is_open,
					goods_bonus: res.integral_goods_bonus,
					goods_price: res.integral_goods_price,
					commodity_data: res,
					show_loading_faill: true,
					integral_limit_num: res.integral_limit_num,
					member_integral_num: res.member_integral_num,
				})
				if (res.content) {
					WxParse.wxParse('article', 'html', res.content, that, 0);
				}
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
	if (goods_id == null) {
		Extension.show_top_msg(that, '数据加载失败')
		return;
	}
	var integral_goods_price = "";
	var data = {};
	if (token) {
		data['token'] = token;
	}
	data['goods_id'] = goods_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.GETPROPERTY(),
		data,
		function (res) {
			if (res) {
				integral_goods_price = res.integral_goods_price;
				that.setData({
					goods_id: goods_id,
					property_data: res,
					num: res.stock > 0 ? 1 : 0,
					totalNum: res.stock,
					price_text: res.price,
					showDialog: !that.data.showDialog,
					sku_type: res.sku.length > 0 ? 'true' : '',
					propertyid: [],
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
			//关闭下拉动画
			wx.stopPullDownRefresh();
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
        //判断购买按钮的状态
        if (that.data.integral_is_open == 1) {
          if (that.data.member_bonus >= res.integral_bonus) {
            that.setData({
              anniu_duihuan: "0"
            })
          } else {
            that.setData({
              anniu_duihuan: "1"
            })
          }
        } else {
          that.setData({
            anniu_duihuan: "2"
          })
        }
        that.setData({
          goods_bonus: res.integral_bonus,
          goods_price: res.integral_price,
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
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
		})
}