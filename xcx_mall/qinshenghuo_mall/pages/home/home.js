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
    swiperCurrent: 0,
    showDialog: false,
    isTopTips: false,
    goods_id: '',
    num: 0,
    price_text: '',
    totalNum: 0,
    propertyid: [],
    sku_id: '',
    sku_type: '',
    loading_code: false,
    phone: '',
		code: '',
    //后台设置限购数量
		integral_limit_num: '',
    //当前用户可购买数量
		buy_limit: '',
		guanzhu: false,
    qrcode_url: "",
    //搜索框清除按钮
    clear_type: "none",
    //防止按钮多次触发
    disabled: true,
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

    var scene = decodeURIComponent(options.scene);
    if (scene && scene!= 'undefined'){
      var distributor_no = scene;
    } else if (options.distributor_no && options.distributor_no != 'undefined'){
      var distributor_no = options.distributor_no;
    }
    //分销关系绑定身份编号
    if (distributor_no) {
      //缓存身份编号
      try {
        wx.setStorageSync('p_distributor_no', distributor_no);
      } catch (e) {
      }
    }
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
		if (!this.data.go_ref) {
			//初始化页面加载
			Refresh(this);
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
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
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
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var share_text = res.target.dataset.discount.share_text;
      var share_img = res.target.dataset.discount.share_img;
      var path = 'pages/fission/fission?active_id=' + res.target.dataset.discount.active_id;
    }else{
      var share_data = this.data.share_data;
      var share_text = share_data.title;
      var share_img = share_data.src;
      var path = share_data.path;
    }
    return {
      title: share_text,
      path: path,
      imageUrl: share_img,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  fanhui: function () {
     wx.navigateBackMiniProgram({
        extraData: {
           foo: 'bar'
        },
        success(res) {
           // 返回成功
        }
     })
   },

  //商品列表点击事件
  into_commodity_details_onclick: function (productList) {
    MyUtils.myconsole('商品列表点击事件');
    MyUtils.myconsole(productList.currentTarget.dataset.idx);
    allOnclick(productList.currentTarget.dataset.idx);
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
    var   kWord = e.detail.value;
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
          buy_limit = this.data.buy_limit;
      //sku_type 为true才会有sku_id
      MyUtils.myconsole("请求失败的数据：" + sku_type)

      if (!goods_id) {
        wx.hideLoading()
        Extension.show_top_msg(this, '请重新选择商品')
        return;
      } else if (integral_num != 0 && num > buy_limit) {
        Extension.show_top_msg(this, '已达到商品购买限制数量');
        return;
      }
			if (sku_type && !sku_id) {
        wx.hideLoading();
        Extension.show_top_msg(this, '商品规格不能为空');
        return;
      } else if (totalNum <= 0) {
        Extension.show_top_msg(this, '商品库存不足')
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

  //商品列表点击事情
	showModal: function (list) {
		this.setData({
			sku_type: '',
			sku_id: '',
		});
    MyUtils.myconsole('商品点击事件：');
    MyUtils.myconsole(list.target.dataset.idx);
    wx.showLoading({
      title: '加载中...',
    })
    get_request_getproperty(this, list.target.dataset.idx.id)
    // Extension.show_top_msg(this,'成功')
  },

  //重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
	  //重新加载
	  Refresh(this)
  },

	del: function () {
		this.setData({
			guanzhu: !this.data.guanzhu
		});
	},
  
//拼团点击事件
  groups_package:function (e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  // 优惠券领取
  receive: function (e) {
    if (this.data.disabled) {
      // wx.showLoading({
      //   title: '加载中...',
      //   mask: true,
      // })
      //防止多次点击
      this.setData({
        disabled: false,
      })
      var card_id = e.detail.detail.card_id;
      if (card_id) {
        get_receive(this, card_id)
      } else {
        Journal.myconsole(card_id);
      }
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

});




//页面加载，重试
function Refresh(that) {
	//获取商户号
	MySign.getExtMchid(
		function () {
			var openid = Extension.getOpenid();
			if (!openid) {
				var login = true;
				var go_ref = false;
			} else {
				var login = false;
				var go_ref = true;
			}
			that.setData({
				content: '',
				login: login,
				go_ref: go_ref,
			})

			//首页数据调取方法
			getHomeData(that, null);

		},
		function () {
			Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
	)
}

function allOnclick(list) {
	MyUtils.myconsole("单击事件：")
	MyUtils.myconsole(list)
	MyUtils.MyOnclick(
		function () {
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
				wx.navigateTo({
					url: url,
				})
			}
		})
}




// 获取商品属性
function get_request_getproperty(that, goods_id) {
	var token = MySign.getToken();
  if (goods_id == null) {
    wx.hideLoading()
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
   		var current_time = util.Time(new Date());
			if (res.sale_time && res.sale_time >= current_time){
				var buy_onlick_show = true;
			} else {
				var buy_onlick_show = false;
			}
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
			  buy_onlick_show: buy_onlick_show,
        })
      } else {
        Extension.show_top_msg(that, '获取商品信息失败')
      }
    },
	  function (res) {
		  Extension.show_top_msg(that, '获取商品信息失败')
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

  MyUtils.myconsole("获取到商品的规格id：" + sku_id);

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
        Extension.show_top_msg(that, '数据加载失败')
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
    wx.hideLoading()
    Extension.show_top_msg(that, '请重新选择商品')
    return;
  } else if (integral_num != 0 && num > buy_limit) {
    wx.hideLoading();
    Extension.show_top_msg(that, '已达到商品购买限制数量');
    return;
  }
	 if (sku_type && !sku_id) {
    wx.hideLoading();
    Extension.show_top_msg(that, '商品规格不能为空');
    return;
  } else if (totalNum <= 0) {
    wx.hideLoading();
    Extension.show_top_msg(that, '商品库存不足')
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


//获取首页数据
function getHomeData(that, id) {
  var data = {};

  if (id) {
    data['id'] = id;
  }
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
    MyHttp.HOMEDATA(),
    data,
		function (res) {
			if (res.content && res.content.length > 0) {
        //设置标题栏
        wx.setNavigationBarTitle({
          title: res.content[0].name,
        });
				for (var i = 0; i < res.content.length; i++) {
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
          share_data:res.share_data,
        })
      } else {
				//自定义错误提示
				Extension.custom_error(that, '2', '页面加载失败', '（商户暂未设置首页）', '2');
      }
    },
	  function (res) {
		  //错误提示
		  Extension.error(that, res);
	  },
	  function (res) {
		  MyUtils.myconsole("请求首页的数据：")
		  MyUtils.myconsole(res);
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
	  })

}


// 优惠券领取
function get_receive(that, card_id) {

  var data = {};
  data['sign'] = MySign.sign(data);
  data['mchid'] = MySign.getMchid();
  data['card_id'] = card_id;

  MyRequest.request_data(
    MyHttp.GETCARDIGN(),
    data,
    function (res) {
      if (res) {
        var cardId = res.cardId;
        var api_ticket = res.cardExt.api_ticket;
        var nonce_str = res.cardExt.nonce_str;
        var signature = res.cardExt.signature;
        var timestamp = res.cardExt.timestamp;
        wx.addCard({
          cardList: [
            {
              cardId: cardId,
              cardExt: '{"api_ticket":"' + api_ticket + '","nonce_str":"' + nonce_str + '","signature":"' + signature + '","timestamp":"' + timestamp + '"}'
            }
          ],
          success: function (res) {
            Extension.show_top_msg(that, '领取成功');
            MyUtils.myconsole(res);// 卡券添加结果
          },
          fail: function (res) {
            MyUtils.myconsole(res);// 卡券添加结果
          },
          complete: function () {
            //激活点击事件
            that.setData({
              disabled: true,
            })
          }
        })
      } else {
        Extension.show_top_msg(that, '领取失败');
      }

    },
    function (res) {
		 Extension.show_top_msg(that, res ? res : '领取失败');
    },
	  function (res) {
		  MyUtils.myconsole("请求卡券的数据：");
		  MyUtils.myconsole(res);
		  //关闭加载中动画
		  wx.hideLoading();
    });
}