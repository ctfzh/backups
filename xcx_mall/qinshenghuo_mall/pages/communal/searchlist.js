// pages/communal/serachlist.js
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
    clear_type: "none", 
    showDialog: false,
    isTopTips: false,
    goods_id: '',
    num: 0,
    price_text: '',
    totalNum: 0,
    propertyid: [],
    sku_id: '',
    sku_type: '',
    login_show: false,
    second: '获取验证码',
    show_secound: 'none',
    loading_code: false,
    phone: '',
    code: '',
    //后台设置限购数量
		integral_limit_num: '',
    //当前用户可购买数量
		buy_limit: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.kWord && options.kWord!="undefined"){
      that.setData({
        searchinput: options.kWord,
      })
    }
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
  //监听输入的内容
  Input_text:function(e){
    var value = e.detail.value
    if (value != null && value!=""){
      MyUtils.myconsole("非空输入的值："+value);
      this.setData({
        clear_type: "block",
      });
    }else{
      this.setData({
        clear_type: "none",
      });
    }

  },
  //点击搜索后的事件
	Input_over: function (e) {	
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
    var value = e.detail.value
      MyUtils.myconsole("完成获取的值：" + value);
      get_request_data(this, value);
  },
  //清空输入框
  Cler_input:function(){
    this.setData({
      searchinput:"",
      clear_type: "none",
    })
  },
  //关闭当前页面
  Cancle:function(){
    wx.navigateBack({
      delta: 1
    })
  },
//进入商品详情页面
  into_commodity_details_onclick: function (list) {
    MyUtils.myconsole('商品详情页面：');
    MyUtils.myconsole(list.currentTarget.dataset.idx);
    var list = list.currentTarget.dataset.idx;
    MyUtils.MyOnclick(
      function () {
        if (list.id) {
          if (list.activity_type == 2) {
            var url = '../communal/commodity_details?goods_id=' + list.id;
          } else if (list.activity_type == 3) {
            //限时折扣
            var url = '../time_limit_detail/time_limit_detail?goods_id=' + list.id;
          } else if (list.activity_type == 4) {
            //拼团
            var url = '../groups/groups_commodity_details?goods_id=' + list.id;
          } else {
            var url = '../communal/commodity_details?goods_id=' + list.id;
          }
          wx.navigateTo({
            url: url,
          })
        }
      })

  },

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
  // 购买商品
	buy_onlick: function (e) {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})
    //获取token
    var token = MySign.getToken();
    if (token) {
      var goods_id = this.data.goods_id;
      var sku_id = this.data.sku_id;
      var num = this.data.num;
      var totalNum = this.data.totalNum;
      var sku_type = this.data.sku_type;
      //sku_type 为true才会有sku_id
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
      if (that.data.searchinput) {
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
			get_request_data(that, that.data.searchinput);
      }
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}


//获取商品列表
function get_request_data(that, kWord) {
  var data = {};

  if (kWord) {
    data['keyword'] = kWord;
  }
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
		MyHttp.GOODS_SEARCH_LIST(),
    data,
    function (res) {
      if (res && res.length > 0) {
        that.setData({
          array: res,
        })
      } else {
        that.setData({
          array: [],
        })
			//自定义错误提示
			Extension.custom_error(that, '3', '您搜索的商品不存在', '', '');
      }
    },
	  function (res) {
		  //错误提示
		  Extension.error(that, res);
	  },
	  function (res) {
		  MyUtils.myconsole("请求商品列表的数据：")
		  MyUtils.myconsole(res);
	  })

}


// 获取商品属性
function get_request_getproperty(that, goods_id) {
  var	token = MySign.getToken();
  if (goods_id == null) {
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
    wx.hideLoading()
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
      wx.hideLoading()
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
  var goods_id = that.data.goods_id;
  var sku_id = that.data.sku_id;
  var num = that.data.num;
  var totalNum = that.data.totalNum;
  var sku_type = that.data.sku_type;
  MyUtils.myconsole("请求失败的数据：" + sku_type)
  if (sku_type && !sku_id) {
    Extension.show_top_msg(that, '商品规格不能为空');
    return;
  }
  if (totalNum > 0 && !num && num <= totalNum) {
    if (!num || num == 0) {
      Extension.show_top_msg(that, '商品数量不能为零')
      return;
    }
  } else {
    Extension.show_top_msg(that, '商品库存不足')
  }

  if (!token || !goods_id) {
    Extension.show_top_msg(that, '加入购物车失败')
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

