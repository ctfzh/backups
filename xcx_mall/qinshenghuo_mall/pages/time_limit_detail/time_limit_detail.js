// 限时折扣-商品详情
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
var timer;

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
    show_secound: 'none',
    loading_code: false,
    img_round: 0,
    //后台设置限购数量
    integral_limit_num: '',
    //当前用户可购买数量
    buy_limit: '',
    guanzhu: false,
    freight_money: '0.00',
    hide_delete: true,
    qrcode_url: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
    var that = this;
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      if (scene.indexOf('&') != -1) {
        var strs = scene.split("&"); //字符分割 
        var goods_id = strs[0];
        var p_distributor_no = strs[1];
        that.setData({
          goods_id: goods_id,
        });
        get_request_data(that, goods_id);
      } else {
        that.setData({
          goods_id: scene,
        });
        get_request_data(that, scene);
      }
    } else {
      //分销关系绑定身份编号
      if (options.distributor_no && options.distributor_no != 'undefined') {
        var p_distributor_no = options.distributor_no;
      }
      that.setData({
        goods_id: options.goods_id,
      })
      get_request_data(that, options.goods_id);
    }

    if (p_distributor_no) {
      //缓存分销身份绑定编号
      try {
        wx.setStorageSync('p_distributor_no', p_distributor_no)
      } catch (e) {
      }
    }

    //初始化页面
    Refresh(this);

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
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
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
  //购买
  buy_commodity: function () {
    wx.showLoading({
      title: '加载中...',
    })
	  this.setData({
		  add: 2,
	  })
    get_request_getproperty(this, this.data.goods_id, 2)
  },
  //加入购物车
  add_shopping: function () {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
		this.setData({
			add:1,
		})
      get_request_getproperty(this, this.data.goods_id, 1)
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
	 } else {
		 Extension.registerrule(this, function (that) { that.buy_onlick() }, e);
	 }
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


//初始化页面
function Refresh(that) {
  //获取商户号
  MySign.getExtMchid(
	  function () {
		//   关闭倒计时
		  clearTimeout(timer);
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

//获取时间差
function getDateStr(addDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1;//获取当前月份的日期 
	var d = dd.getDate();
	var h = dd.getHours();
	var mm = dd.getMinutes();
	var s = dd.getSeconds();
	if (m < 10) {
		m = '0' + m;
	};
	if (d < 10) {
		d = '0' + d;
	};
	if (s < 10) {
		s = '0' + s;
	};
	return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
}


/* 毫秒级倒计时 */
function count_down(that, expireTime) {
	if (expireTime) {
		//2016-12-27 12:47:08 转换日期格式  
		var a = expireTime.split(/[^0-9]/);
		//截止日期：日期转毫秒  
		var expireMs = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
		//倒计时毫秒  
		var duringMs = expireMs.getTime() - (new Date()).getTime();
		date_format(that, duringMs);
	}
}

/* 格式化倒计时 */
function date_format(that, micro_second) {
	if (micro_second <= 0) {
		that.setData({
			clock_hr: '00',
			clock_min: '00',
			clock_sec: '00',
		});
		// timeout则跳出递归  
		return;
	}
	// 秒数  
	var second = Math.floor(micro_second / 1000);
	// 小时位  
	var hr = fill_zero_prefix(Math.floor(second / 3600));
	// 分钟位  
	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
	// 秒位  
	var sec = fill_zero_prefix(second % 60);// equal to => var sec = second % 60;  
	// return " " + hr + ":" + min + ":" + sec + " ";
	that.setData({
		clock_hr: hr,
		clock_min: min,
		clock_sec: sec,
	});
	//延时调用
	timer = setTimeout(function () {
		// 放在最后--  
		micro_second -= 1000;
		date_format(that, micro_second);
	}, 1000);
}

/* 分秒位数补0 */
function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}




//获取结束时间
function endTime(that, end_time) {
  if (end_time) {
    //月日
    var arr1 = end_time.split(" ");
    var sdate = arr1[0].split('-');
    var end_date = sdate[1] + "月" + sdate[2] + "日";
    //时分
    var sdate_time = arr1[1].split(':');
    var end_time = sdate_time[0] + ":" + sdate_time[1];
    that.setData({
      end_date: end_date,
      end_time: end_time,
    })
  }
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
    MyHttp.GOODS_DETAIL(),
    data,
    function (res) {
		 if (res && res.length != 0) {
			 //自定义错误提示
			 Extension.custom_error(that, '', '', '', '');
        // 获取当前时间
        var current_time = util.Time(new Date());
        //判断活动是否已结束
			if (res.timelimimt_data.length <= 0){
				wx.showModal({
					title: '提示',
					content: '活动未开始',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.redirectTo({
								url: '/pages/communal/commodity_details?goods_id=' + goods_id,
							})
						}
					}
				})
		  }else if (res.timelimimt_data.end_time < current_time) {
				//自定义错误提示
				Extension.custom_error(that, '', '', '', '');
          wx.showModal({
            title: '提示',
            content: '活动已结束',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/communal/commodity_details?goods_id=' + goods_id,
                })
              }
            }
          })
        }else{
          //商品图片
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
          //富文本
          if (res.content) {
            WxParse.wxParse('article', 'html', res.content, that, 0);
          }
          //邮费
          if (res.freight_money.delivery.freight_money > 0) {
            that.setData({
              freight_money: res.freight_money.delivery.freight_money,
            })
				}
			 	//当前时间的一天后
				var present_time = getDateStr(1);
				//结束时间
				var end_time = res.timelimimt_data.end_time;
				if (present_time >= end_time){
					var limit = true;
					//  倒计时
					count_down(that, end_time);
				} else {
					var limit = false;
					//活动结束时间
					endTime(that, end_time);
				}

				//页面参数
				that.setData({
					limit: limit,
					commodity_data: res,
					show_loading_faill: true,
				})
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
  if (goods_id == "" || goods_id == null) {
    Extension.show_top_msg(that, '数据加载失败')
    return;
  }
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