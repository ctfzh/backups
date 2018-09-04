// 全部商品js
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
		guanzhu: false,
		//分组id
		group_id:'null',
		//关键字
		kWord: "null",
		//排序
		sort_type: '2', 
		//排序关键字
		sort_name: "buyNumSort",
		//默认选中第一个分组
		group_index: "0",
		//搜索框清除按钮
		clear_type: "none",
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '全部商品',
		});
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
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
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
  onShareAppMessage: function () {

  },
  //进入商品详情页面
  into_commodity_details_onclick: function (list) {
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

  //加号点击事件
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

  //input失去焦点时触发事件
  inputFunc: function (pars, evalue) {
    let totalNum = this.data.totalNum;
    if (pars == 'input') {
      if (evalue.length == 1 && evalue[0] == 0) { evalue = 1; }
    } else {
      if (evalue == '' || evalue == 0) {
        evalue = 1;
      } else if (evalue > totalNum) {
        evalue = totalNum;
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
  buy_onlick:function(e){
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
    }else{
		 Extension.registerrule(this, function (that) { that.buy_onlick() }, e);
	 }
  },
  //重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
	//   重新加载
	  Refresh(this); 
  },

	//监听输入的内容
	Input_text: function (e) {

		var value = e.detail.value

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

  //点击跳转搜索
  // input_tiao:function(){
  //   wx.navigateTo({
  //     url: '/pages/communal/searchlist'
  //   })
  // },

	 //点击搜索后的事件
	Input_over: function (e) {
		var that = this,
			kWord = that.data.kWord,
			group_id = that.data.group_id,
			sort_type = that.data.sort_type,
			sort_name = that.data.sort_name,
			value = e.detail.value;

    that.setData({
      kWord: value,
    });
		kWord= value;
		get_request_data(that, kWord, group_id, sort_type, sort_name);
    MyUtils.myconsole("完成获取的值：" + value);
	},

	 //清空输入框
	Cler_input: function () {

		var that = this,
			kWord = that.data.kWord,
			group_id = that.data.group_id,
			sort_type = that.data.sort_type,
			sort_name = that.data.sort_name;

		that.setData({
			searchinput: "",
			clear_type: "none",
			kWord: "null",
		})

		kWord = "null";
		get_request_data(that, kWord, group_id, sort_type, sort_name);
	},

	//筛选
	caidan: function(list){
		var that = this,
			kWord = that.data.kWord, 
			group_id = that.data.group_id, 
			sort_type = that.data.sort_type, 
			sort_name = that.data.sort_name;

		MyUtils.myconsole('商品详情页面：');
		MyUtils.myconsole(list.currentTarget.dataset.idx.id);

		this.setData({
			group_id: list.currentTarget.dataset.idx.id,
			group_index: null,
		})

		group_id=list.currentTarget.dataset.idx.id
		get_request_data(that, kWord, group_id, sort_type, sort_name)

	},

	//排序筛选
	paixu: function (list) {

		var that = this,
		kWord = that.data.kWord,
		group_id = that.data.group_id,
		sort_type = that.data.sort_type,
		sort_name = that.data.sort_name;

		MyUtils.myconsole('商品详情页面：');
		MyUtils.myconsole(list.currentTarget.dataset.idx);
		if (sort_name != list.currentTarget.dataset.idx) {
			this.setData({
				sort_type: "2",
			})
			sort_type = "2";
		}else	if (list.currentTarget.dataset.idx =="priceSort"){
			if (sort_type == "1") {
				this.setData({
					sort_type: "2",
				})
				sort_type = "2";
			} else
				if (sort_type == "2") {
					this.setData({
						sort_type: "1",
					})
					sort_type = "1";
				} 
		}
		this.setData({
			sort_name: list.currentTarget.dataset.idx,
		})

		sort_name = list.currentTarget.dataset.idx;
		get_request_data(that, kWord, group_id, sort_type, sort_name)
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
  MySign.getExtMchid(
	  function () {
		  var openid = Extension.getOpenid();
		  if (!openid) {
			  var login = true;
		  } else {
			  var login = false;
		  }
		  that.setData({
			  login: login,
		  })

      var kWord = that.data.kWord,
        group_id = that.data.group_id,
        sort_type = that.data.sort_type,
        sort_name = that.data.sort_name;
      get_request_data(that, kWord, group_id, sort_type, sort_name);
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}

//获取商品列表
function get_request_data(that, kWord, group_id, sort_type, sort_name) {

	var data = {};
	if (kWord != "null" && kWord != null && kWord != ""){
		data['kWord'] = kWord;
	}
	if (group_id != "null" && group_id != null && group_id != ""){
		data['group_id'] = group_id;
	}
	if (sort_type != "null" && sort_type != null && sort_type != "") {
		data['sort_type'] = sort_type;
	}
	if (sort_name != "null" && sort_name != null && sort_name != "") {
		data['sort_name'] = sort_name;
	 }
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.GOODS_LIST(),
		data,
		function (res) {
			if (res) {
				that.setData({
					data: res.list,
					group_data: res.group_data,
					show_loading_faill: true,
				})
			} else {
				//自定义错误提示
				Extension.custom_error(that, '3', '暂无商品', '', '');
			}
		},
		function (res) {
			//错误提示
			Extension.error(that, res);
		},
		function (res) {
			MyUtils.myconsole("请求商品列表的数据：")
			MyUtils.myconsole(res);
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
		})

}

// 获取商品属性
function get_request_getproperty(that, goods_id) {
  
	var token  = MySign.getToken();
   if (goods_id == null) {
		Extension.show_top_msg(that, '数据加载失败')
		return;
	}
	var data = {};
	if (token){
		data['token'] = token;
	}
  data['goods_id'] = goods_id;
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
    MyHttp.GETPROPERTY(),
    data,
    function (res) {
      if(res){
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
          price_text: res.price,
          showDialog: !that.data.showDialog,
          sku_type: res.sku.length > 0 ? 'true' : '',
          propertyid: [],
          integral_limit_num: res.max_buy_num,
          buy_limit: res.buy_limit,
			  buy_onlick_show: buy_onlick_show,
        })

      }else{
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
  var data = {};
  data['goods_id'] = goods_id;
  data['sku_id'] = sku_id;
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);

  MyRequest.request_data(
    MyHttp.GETSKU(),
    data,
    function (res) {
      if(res){
        that.setData({
          num: res.stock > 0 ? 1 : 0,
          sku_id: res.sku_id,
          totalNum: res.stock,
          price_text: res.price,
        })

        if (res.stock <= 0) {
          Extension.show_top_msg(that, '商品库存不足')
        }
      }else{
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
	if (sku_id) {
		data['sku_id'] = sku_id;
	}
  data['token'] = token;
  data['goods_id'] = goods_id;
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
      Extension.show_top_msg(that, res ? res :" '加入购物车失败'")
	  },
	  function (res) {
		  MyUtils.myconsole("请求加入购物车的数据：")
		  MyUtils.myconsole(res);
		  //关闭加载中动画
		  wx.hideLoading();
	  })

}