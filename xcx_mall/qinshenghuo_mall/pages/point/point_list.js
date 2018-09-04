// pages/home/home.js
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
// 在需要使用的js文件中，导入js  
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
	data: {
		// article: '<p>gfds发的v额vdd<img src="http://y.gtimg.cn/music/photo_new/T003R720x288M000004LcPsq28qel0.jpg" alt="" /></p>',
		swiperCurrent: 0,

		showDialog: false,
		isTopTips: false,
		goods_id: '',
		num: 0,
		price_text: '',
		goods_bonus: '',
		goods_price: '',
		totalNum: 0,
		propertyid: [],
		sku_id: '',
		sku_type: '',
		loading_code: false,
		phone: '',
		code: '',
		anniu_duihuan: "",
		integral_limit_num: '',
		member_integral_num: '',
		guanzhu: false,
    qrcode_url: "",
    //搜索框清除按钮
    clear_type: "none",
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
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
		var share_data = this.data.share_data;
		var that = this;
		return {
			title: share_data.title,
			path: share_data.path,
			imageUrl: share_data.src,
			success: function (res) {
				// 转发成功
				Extension.show_top_msg(that, "转发成功");
			},
			fail: function (res) {
				// 转发失败
				Extension.show_top_msg(that, "转发失败");
			}
		}
	},


	//轮播图根据图片改变小圆点
	swiperChange: function (e) {
		this.setData({
			swiperCurrent: e.detail.current
		})
	},
	//图片导航
	image_navigation_onclick_img: function (list) {
		MyUtils.myconsole('广告点击事件');
		MyUtils.myconsole(list);
		MyUtils.myconsole(list.currentTarget.dataset.idx);
		custom_url(list.currentTarget.dataset.idx);
		
	},
	
	//轮播广告的点击事件
	advert_onclick_img: function (advertList) {
		MyUtils.myconsole('广告点击事件');
		MyUtils.myconsole(advertList.target.dataset.idx);
		custom_url(advertList.target.dataset.idx);
		// wx.navigateTo({
		//   url: '/pages/communal/commodity_details',
		// })
	},
	//商品列表点击事件
	into_commodity_details_onclick: function (productList) {
		MyUtils.myconsole('商品列表点击事件');
		MyUtils.myconsole(productList.target.dataset.idx);
		// wx.navigateTo({
		//   url: '/pages/home/home',
		// })
		allOnclick(productList.target.dataset.idx);
	},
  //监听输入的内容
  Input_text: function (e) {
    var value = e.detail.value;
    if (value != null && value != "") {
      MyUtils.myconsole("非空输入的值：" + value);
      this.setData({
        clear_type: "block",
      });
    } else {
      this.setData({
        clear_type: "none",
      });
    }
  },
  //点击搜索后的事件
  Input_over: function (e) {
    var kWord = e.detail.value;
    wx.navigateTo({
      url: '/pages/communal/searchlist?kWord=' + kWord,
    })
  },
  //清空输入框
  Cler_input: function () {
    var that = this;
    that.setData({
      searchinput: "",
      clear_type: "none",
      kWord: "null",
    })
  },



	/**======================================  加入购物车和购买使用 ================================== */

	// 加入购物车
	add_shoppingtrolley_onlick: function (e) {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})
		//获取token
		var token = MySign.getToken();
		if (token) {
			get_request_shopping_trolley(this, token);
		} else {
			Extension.registerrule(this, function (that) { that.add_shoppingtrolley_onlick() }, e);
		}
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
			} else if (integral_num != 0 && num + member_num > integral_num){
				Extension.show_top_msg(this, '已达到商品购买限制数量');
				return;
			}else if (sku_type && !sku_id) {
				Extension.show_top_msg(this, '商品规格不能为空');
				return;
			} else if (totalNum <= 0) {
				Extension.show_top_msg(this, '商品库存不足')
				return;
			}
			var that = this;
			MyUtils.MyOnclick(
				function () {
					if (that.data.is_integral_goods==2){
						wx.navigateTo({
							url: '/pages/communal/place_an_order?is_cart=' + 2 + '&goods_id=' + goods_id + '&num=' + num + '&sku_id=' + sku_id,
						})
					}else{
						wx.navigateTo({
							url: '/pages/point/order_submit?is_cart=' + 2 + '&goods_id=' + goods_id + '&num=' + num + '&sku_id=' + sku_id,
						})
					}
				})

			//跳转至下单界面  然后刷新界面  关闭弹窗
			this.setData({
				num: 0,
				totalNum: 0,
				sku_id: '',
				// price_text: '',
				sku_type: '',
				showDialog: !this.data.showDialog,//关闭窗口
			})
			// get_request_data(this, null);
		} else {
			Extension.registerrule(this, function (that) { that.buy_onlick() }, e);
		}
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
			if(totalNum>0){
				if (evalue == '' || evalue <= 0) {
					evalue = 1;
				} else if (evalue > totalNum) {
					evalue = totalNum;
				}
			}else{
				evalue= 0;
			}
		}
		this.setData({
			num: evalue
		});
	},
	//商品列表点击事情
	showModal: function (list) {
		var is_integral_goods = list.target.dataset.idx.is_integral_goods;
		this.setData({
			sku_type: '',
			sku_id: '',
			is_integral_goods: is_integral_goods ? is_integral_goods: '0',
		});
		MyUtils.myconsole('商品点击事件：');
		MyUtils.myconsole(list.target.dataset.idx);
		wx.showLoading({
			title: '加载中...',
		})
		get_request_getproperty(this, list.target.dataset.idx.id, is_integral_goods)
		// Extension.show_top_msg(this,'成功')
	},

	//重试事件
	retry_onclick: function () {
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
	}
})

//页面加载，重试
function Refresh(that) {
	//加载中动画
	wx.showLoading({
		title: '加载中',
	})
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
      getHomeData(that, null);
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}

// 获取商品属性
function get_request_getproperty(that, goods_id, is_integral_goods) {
	if (goods_id == null) {
		Extension.show_top_msg(that, '数据加载失败')
		return;
	}
	if (is_integral_goods == 2) {
		var http = MyHttp.GETPROPERTY();
	} else {
		var http = MyHttp.POINTDETAIL();
	}
	var	token = MySign.getToken();
	//获取商品详情数据
	var data = {};
	if (token) {
		data['token'] = token;
	}
	data['goods_id'] = goods_id;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	MyRequest.request_data(
		http,
		data,
		function (res) {
			if(res){
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
					goods_bonus: res.integral_goods_bonus,
					goods_price: res.integral_goods_price,
					integral_limit_num: res.integral_limit_num,
					member_integral_num: res.member_integral_num,
          member_bonus: res.member_bonus,
          integral_is_open: res.integral_is_open,
					showDialog: !that.data.showDialog,
				})
				wx.stopPullDownRefresh()
			}else{
				//自定义错误提示
				Extension.custom_error(that, '2', '页面加载失败', '', '2');

			}
		},
    function (res) {
		 //错误提示
		 Extension.error(that, res);
		},
		function (res) {
			MyUtils.myconsole("请求商品详情数据的数据：")
			MyUtils.myconsole(res);
		})
		
	// 获取商品属性数据
	MyRequest.request_data(
		MyHttp.GETPROPERTY(),
		data,
		function (res) {
			if (res) {
				//定时开售 关闭立即购买
				var current_time = util.Time(new Date());
				if (res.sale_time && res.sale_time >= current_time) {
					var buy_onlick_show = true;
				} else {
					var buy_onlick_show = false;
				}
				that.setData({
					goods_id: goods_id,
					property_data: res,
					num: res.stock > 0 ? 1 : 0,
					totalNum: res.stock,
					// price_text: res.price,
					sku_type: res.sku.length > 0 ? 'true' : '',
					propertyid: [],
					buy_onlick_show,
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



// 自定义点击事件
function custom_url(list) {
	if (list.url) {
		if (list.linkType == 1) {
			wx.switchTab({
				url: list.url
			})
		} else if (list.linkIndex == 8) {
			if (list.activity_type == 2) {
				wx.navigateTo({
					url: '../communal/commodity_details?goods_id=' + list.url,
				})
			} else if (list.activity_type == 3) {
				//限时折扣
				wx.navigateTo({
					url: '../time_limit_detail/time_limit_detail?goods_id=' + list.url,
				})
			} else if (list.activity_type == 4) {
				//拼团
				wx.navigateTo({
					url: '../groups/groups_commodity_details?goods_id=' + list.url,
				})
			} else {
				wx.navigateTo({
					url: '../communal/commodity_details?goods_id=' + list.url,
				})
			}
		}
		else {
			wx.navigateTo({
				url: list.url
			})
		}
	}
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
					// price_text: res.price,
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


//获取首页数据
function getHomeData(that, id) {
  var token = MySign.getToken();
	var data = {};
	if (id) {
		data['id'] = id;
	}
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.POINTDATA(),
		data,
		function (res) {
			if (res.content && res.content.length > 0) {
				//设置标题栏
				for (var i = 0; i < res.content.length; i++) {
					if (res.content[i].type == 'group') {
						wx.setNavigationBarTitle({
							title: res.content[i].name,
						});
					}
					if (res.content[i].type == 'banner') {
						//获取屏幕宽高  
						wx.getSystemInfo({
							success: function (res) {
								var windowWidth = res.windowWidth;
								var windowHeight = res.windowHeight;
								that.setData({
									windowWidth: windowWidth,
								})
								MyUtils.myconsole("屏幕的宽度" + windowWidth)
								// MyUtils.myconsole("获取到轮播图的高度：" + windowWidth * res.content[i])
							}
						});
					}
				}
				that.setData({
					content: res.content,
					show_loading_faill: true,
					share_data: res.share_data,
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
			MyUtils.myconsole("请求首页的数据：")
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
			Extension.show_top_msg(that, '加入购物车成功');
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


function allOnclick(list) {
	MyUtils.myconsole("单击事件：")
	MyUtils.myconsole(list)
	MyUtils.MyOnclick(
		function () {
			if (list.is_integral_goods==2){
				if (list.url) {
					if (list.activity_type == 2) {
						var url = '../communal/commodity_details?goods_id=' + list.url;
					} else if (list.activity_type == 3) {
						//限时折扣
						var url = '../time_limit_detail/time_limit_detail?goods_id=' + list.url;
					} else if (list.activity_type == 4) {
						//拼团
						var url = '../groups/groups_commodity_details?goods_id=' + list.url;
					} else {
						var url = '../communal/commodity_details?goods_id=' + list.url;
					}
				}
			}else{
				var url = list.url;
			}
			wx.navigateTo({
				url: url,
			})
		})
}