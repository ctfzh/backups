// pages/shoppingcart/shoppingcart.js
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
      show_loading_faill: false,
      height: 100,
      all_checked: true,
      edit_text: '编辑',
      second: '获取验证码',
      show_secound: 'none',
      hide_delete: true,
      //当前用户可购买数量
      guanzhu: false,
      login_show: false,
      qrcode_url: "",
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      //关闭微信右上角菜单分享
      wx.hideShareMenu()
      var that = this;
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {},

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
      //初始化页面加载
      Refresh(this)
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {
      //初始化页面加载
      Refresh(this)
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },
   //全部选中的点击事件
   all_checked_onclick: function() {
      var check;
      if (this.data.all_checked) {
         check = false;
      } else {
         check = true;
      }
      var array = this.data.array;
      var money = 0.00;
      if (array) {
         for (var i = 0; i < array.length; i++) {
            array[i].checked = !check;
            if (!array[i].checked) {
               money = parseFloat(money) + parseFloat(array[i].in_cart_num) * parseFloat(array[i].price);
            }
         }
      }
      this.setData({
         money: money.toFixed(2),
         all_checked: check,
         array: array,
      });
   },

   commodity_checked_onclick: function(list) {
      var list = list.target.dataset.idx;
      var array = this.data.array;

      var all_checked = true;
      var money = 0.00;
      for (var i = 0; i < array.length; i++) {
         if (array[i].id == list.id) {
            array[i].checked = !array[i].checked;
         }
         if (array[i].checked) {
            all_checked = false;
         } else {
            money = parseFloat(money) + parseFloat(array[i].in_cart_num) * parseFloat(array[i].price);
         }
         MyUtils.myconsole('数量：' + array[i].in_cart_num);
      }

      this.setData({
         money: money.toFixed(2),
         all_checked: all_checked,
         array: array,
      });
   },
   edit_onclick: function() {
      var edit_text;
      if (this.data.edit_text == '编辑') {
         edit_text = '完成';
      } else {
         edit_text = '编辑';
      }
      this.setData({
         edit_text: edit_text,
      });
   },
   //跳转至首页
   home_onclick: function() {
      wx.switchTab({
         url: '/pages/home/home'
      })
   },
   //删除单个商品
   deleter_shoppingcart_Onclick: function(list) {
      var list = list.target.dataset.idx;
      var that = this;
      wx.showModal({
         title: '提示',
         content: '确定要将此商品从购物车中移除？',
         success: function(res) {
            if (res.confirm) {
               MyUtils.myconsole('购物车删除点击事件：');
               MyUtils.myconsole(list);
               var delete_ids = []
               delete_ids[0] = list.id;
               delete_shopping(that, delete_ids)
            } else if (res.cancel) {
               MyUtils.myconsole('用户点击取消')
            }
         }
      })

   },
   //删除选中的商品
   all_deleter_shoppingcart_Onclick: function() {
      var array = this.data.array;
      if (array && array.length > 0) {
         var delete_ids = []
         var j = 0;
         for (var i = 0; i < array.length; i++) {
            MyUtils.myconsole('选中状态：' + array[i].checked);
            if (!array[i].checked || array[i].checked == null) {
               delete_ids[j++] = array[i].id;
               MyUtils.myconsole('已选选中状态：' + array[i].checked);
            }
         }
         MyUtils.myconsole('全部删除购物车点击事件：');
         MyUtils.myconsole(delete_ids);
         if (delete_ids.length > 0) {
            var that = this;
            wx.showModal({
               title: '提示',
               content: '确定要将这' + delete_ids.length + '件商品从购物车中移除？',
               success: function(res) {
                  if (res.confirm) {
                     MyUtils.myconsole('用户点击确定')
                     delete_shopping(that, delete_ids)

                  } else if (res.cancel) {
                     MyUtils.myconsole('用户点击取消')
                  }
               }
            })
         }
      }
   },

   //删除全部失效商品
   all_deleter_lose_efficacy_Onclick: function() {
		var not_enough = this.data.not_enough;
		var not_in_time = this.data.not_in_time;
		if ((not_enough && not_enough.length > 0) || (not_in_time && not_in_time.length > 0)) {
         var delete_ids = []
         for (var i = 0; i < not_enough.length; i++) {
            delete_ids.push(not_enough[i].id);
         }

			for (var i = 0; i < not_in_time.length; i++) {
				delete_ids.push(not_in_time[i].id);
			}

         MyUtils.myconsole('全部删除购物车点击事件：');
         MyUtils.myconsole(delete_ids);

         var that = this;
         wx.showModal({
            title: '提示',
            content: '确定清空失效宝贝吗？',
            success: function(res) {
               if (res.confirm) {
                  MyUtils.myconsole('用户点击确定')

                  delete_shopping(that, delete_ids)
               } else if (res.cancel) {
                  MyUtils.myconsole('用户点击取消')
               }
            }
         })

      }

   },
   //结算商品
   settle_accounts_onclick: function() {
      var cart_id = [];
      var array = this.data.array;
      if (array && array.length > 0) {
         for (var i = 0; i < array.length; i++) {
            MyUtils.myconsole('选中状态：' + array[i].checked);
            if (!array[i].checked || array[i].checked == null) {
               cart_id[i] = array[i].id;
            }
         }
         var cartId = '';
         if (cart_id && cart_id.length > 0) {
            cartId = cart_id.join(",");
            MyUtils.MyOnclick(
               function() {
                  wx.navigateTo({
                     url: '/pages/communal/place_an_order?cart_id=' + cartId + '&is_cart=' + 1,
                  })
               })
         } else {
            Extension.show_top_msg(this, "您还未选中任何商品");
         }
      }

   },
   onTapMinus: function(list) {
      MyUtils.myconsole('购物车减击事件：');

      MyUtils.myconsole(list.target.dataset.idx);
      //减号点击
      if (list.target.dataset.idx.num > 1) {
         this.plusMinus('minus', list.target.dataset.idx);
      }
   },
   onTapPlus: function(list) {
      MyUtils.myconsole('购物车加击事件：');

      MyUtils.myconsole(list.target.dataset.idx);
      //加号点击
      if (list.target.dataset.idx.num > 1) {
         this.plusMinus('plus', list.target.dataset.idx);
      }
   },
   onInputNum: function(e) {
      MyUtils.myconsole('输入的值：');
      MyUtils.myconsole(e.target.dataset.idx);
      //input输入时
      // this.inputFunc('input', Number(e.detail.value), e.target.dataset.idx);
   },
   //失去焦点
   lossFocus: function(e) {

      MyUtils.myconsole('失去焦点' + e.detail);
      MyUtils.myconsole(e.target.dataset.idx.in_cart_num);
      //input失去焦点时
      this.inputFunc('loss', Number(e.detail.value), e.target.dataset.idx);
   },
   //点击处理事件
   plusMinus: function(pars, list) {
      MyUtils.myconsole('事件处理：');
      MyUtils.myconsole(list);
      var totalNum = list.num;
      var num = list.in_cart_num;
      var buy_limit = list.buy_limit;
      if (pars == "plus" && num < totalNum) {
         if (list.max_buyed_num > 0) {
            if (buy_limit > 0) {
               num++;
               buy_limit--;
            }
         } else {
            num++;
         }
      } else if (pars == "minus" && num > 1) {
         if (list.max_buyed_num > 0) {
            buy_limit++;
         }
         num--;
      }
      if (num != list.in_cart_num) {
         edit_shopping(this, num, buy_limit, list)
      }
   },
   inputFunc: function(pars, evalue, list) {
      let totalNum = list.num;
      var buy_limit = list.buy_limit;
      if (pars == 'loss') {
         if (evalue > 0) {
            if (list.max_buyed_num > 0) {
               if (evalue >= buy_limit + list.in_cart_num) {
                  if (buy_limit + list.in_cart_num < totalNum) {
                     evalue = buy_limit + list.in_cart_num;
                     buy_limit = 0;
                  } else {
                     evalue = totalNum;
                  }
               }
            } else if (evalue > totalNum) {
               evalue = totalNum;
            }
         } else {
            evalue = 1;
         }
      }
      if (evalue != list.in_cart_num) {
         edit_shopping(this, evalue, buy_limit, list)
      } else {
         var array = this.data.array;
         for (var i = 0; i < array.length; i++) {
            if (array[i].id == list.id) {
               array[i] = list;
               array[i].in_cart_num = evalue;
            }
            MyUtils.myconsole('数量：' + array[i].in_cart_num);
         }
         this.setData({
            array: array,
         });
      }
   },


   //重试事件
   retry_onclick: function() {
      //加载中动画
      wx.showLoading({
         title: '加载中',
      })
      //   重新加载
      Refresh(this);
   },

   Kguanzhu: function() {
      this.setData({
         guanzhu: !this.data.guanzhu
      });
   },
   del: function() {
      this.setData({
         guanzhu: !this.data.guanzhu
      });
   },

   //进入商品详情页面
   into_commodity_details_onclick: function(list) {
      var list = list.currentTarget.dataset.idx;
      MyUtils.MyOnclick(
         function() {
            if (list.id) {
               if (list.activity_type == 2) {
                  var url = '../communal/commodity_details?goods_id=' + list.goods_id;
               } else if (list.activity_type == 3) {
                  //限时折扣
                  var url = '../time_limit_detail/time_limit_detail?goods_id=' + list.goods_id;
               } else if (list.activity_type == 4) {
                  //拼团
                  var url = '../groups/groups_commodity_details?goods_id=' + list.goods_id;
               } else {
                  var url = '../communal/commodity_details?goods_id=' + list.goods_id;
               }
               wx.navigateTo({
                  url: url,
               })
            }
         })
   },

   //登入完成回调
   login_success: function() {
      //加载中动画
      wx.showLoading({
         title: '加载中',
      })
      Refresh(this);
   },
   //登入
   login_an(e) {
      Extension.registerrule(this, function(that) {
         Refresh(that)
      }, e);
   }
})



//页面加载，重试
function Refresh(that) {
   MySign.getExtMchid(
      function() {
         var openid = Extension.getOpenid();
         var token = MySign.getToken();
         if (!openid) {
            var login = true;
         } else {
            var login = false;
            if (token) {
               get_shopping_list(that)
            } else {
               Extension.on_skip(that, function(that) {
                  that.login_success()
               }, 1);
            }
         }
         that.setData({
            login: login,
            token: token,
				edit_text: "编辑"
         })
      },
      function() {
         //自定义错误提示
         Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
      },
   )
}

//获取开始时间
function startTime(that, start_time) {
	if (start_time) {
		//月日
		var arr1 = start_time.split(" ");
		var sdate = arr1[0].split('-');
		var start_date = sdate[1] + "月" + sdate[2] + "日";
		//时分
		var sdate_time = arr1[1].split(':');
		var start_time = sdate_time[0] + ":" + sdate_time[1];
		return start_date + start_time
	}
}

//获取购物车列表
function get_shopping_list(that) {
   var token = MySign.getToken();
   var data = {};
   data['token'] = token;
   data['mchid'] = MySign.getMchid();
   data['sign'] = MySign.sign(data);
   MyRequest.request_data_new(
      MyHttp.GET_CART_LIST(),
      data,
      function(res) {
         if (res) {
            var all_checked = true;
            var money = 0.00;
            if (res.enough) {
               for (var i = 0; i < res.enough.length; i++) {
                  if (res.enough[i].checked) {
                     all_checked = false;
                  } else {
                     money = parseFloat(money) + parseFloat(res.enough[i].in_cart_num) * parseFloat(res.enough[i].price);
                  }
               }
            }
            MyUtils.myconsole("合计 ：" + parseFloat(money.toFixed(2), ));

				//开售时间
				var not_in_time = res.not_in_time;
				var start_time = [];
				if (not_in_time && not_in_time.length > 0){
					for (var i = 0; i < not_in_time.length; i++) {
						start_time.push(startTime(that, not_in_time[i].sale_time));
					}
					that.setData({
						start_time,
					})
				}

            that.setData({
               money: money.toFixed(2),
               data: res,
               show_loading_faill: true,
               array: res.enough ? res.enough : '',
               not_enough: res.not_enough ? res.not_enough : '',
               not_in_time: res.not_in_time ? res.not_in_time : '',
               is_shopping_null: true,
               all_checked: all_checked,
            })
            wx.stopPullDownRefresh()
         } else {
            is_ShoppingCart_Null(that);
         }
      },
      function(code, msg) {
         MyUtils.myconsole("返回失败的数据：")
         MyUtils.myconsole('code:' + code);
         MyUtils.myconsole('msg' + msg);
         wx.hideLoading();
         if (code = 10004) {
            is_ShoppingCart_Null(that);
         } else {
            //错误提示
            Extension.error(that, msg);
         }
      },
      function(res) {
         //错误提示
         Extension.error(that, res);
      },
      function(res) {
         MyUtils.myconsole("请求购物车列表的数据：")
         MyUtils.myconsole(res);
         //关闭下拉动画
         wx.stopPullDownRefresh();
         //关闭加载中动画
         wx.hideLoading();
      })

}


//修改购物车
function edit_shopping(that, num, buy_limit, list) {
   var token = MySign.getToken();

   var data = {};
   data['token'] = token;
   data['id'] = list.id;
   data['goods_id'] = list.goods_id;
   data['num'] = num;
   data['buy_limit'] = num;
   data['mchid'] = MySign.getMchid();
   data['sign'] = MySign.sign(data);
   MyRequest.request_data(
      MyHttp.SET_CART_EDIT(),
      data,
      function(res) {
         if (res) {
            var array = that.data.array;
            for (var i = 0; i < array.length; i++) {
               if (array[i].id == list.id) {
                  array[i] = list;
                  array[i].in_cart_num = num;
               }
               if (array[i].goods_id == list.goods_id && array[i].max_buyed_num > 0) {
                  array[i].buy_limit = buy_limit;
               }
               MyUtils.myconsole('数量：' + array[i].buy_limit);
            }
            var money = 0.00;
            if (array) {

               for (var i = 0; i < array.length; i++) {
                  if (!array[i].checked) {
                     money = parseFloat(money) + parseFloat(array[i].in_cart_num) * parseFloat(array[i].price);
                  }
               }
            }
            that.setData({
               money: money.toFixed(2),
               array: array,
            });
         } else {
            Extension.show_top_msg(that, "请求失败")
         }
      },
      function(res) {
         Extension.show_top_msg(that, res);
      },
      function(res) {
         MyUtils.myconsole("请求修改购物车的数据：")
         MyUtils.myconsole(res);
      })
}

//购物车为空时用
function is_ShoppingCart_Null(that) {
   that.setData({
      is_shopping_null: false,
      show_loading_faill: true,
   })
}

//删除购物车
function delete_shopping(that, delete_ids) {
   wx.showLoading({
      title: '加载中...',
      mask: true,
   })

   var token = MySign.getToken();
   var goods_id = '';
   var in_cart_num = '';
   var data = {};
   data['token'] = token;
   data['delete_ids'] = delete_ids.join(",");
   data['sign'] = MySign.sign(data);
   MyRequest.request_data_new(
      MyHttp.SET_CART_DELETE(),
      data,
      function(res) {
			//初始化页面加载
			Refresh(that);

         // var array = that.data.array;
         // MyUtils.myconsole(array)
         // if (array) {
         //    for (var i = 0; i < array.length; i++) {
         //       for (var j = 0; j < delete_ids.length; j++) {
         //          if (delete_ids[j] == array[i].id) {
         //             if (array[i] != null) {
         //                goods_id = array[i].goods_id;
         //                in_cart_num = array[i].in_cart_num;
         //             }
         //             array.splice(i, 1);
         //          }
         //          if (array[i] != null) {
         //             if (goods_id == array[i].goods_id && array[i].max_buyed_num > 0) {
         //                array[i].buy_limit += in_cart_num;
         //             }
         //          }
         //       }
         //    }
         // }

         // var not_enough = that.data.not_enough;
         // if (not_enough) {
         //    for (var i = 0; i < not_enough.length; i++) {
         //       for (var j = 0; j < delete_ids.length; j++) {
         //          if (delete_ids[j] == not_enough[i].id) {
         //             if (array[i] != null) {
         //                goods_id = array[i].goods_id;
         //                in_cart_num = array[i].in_cart_num;
         //             }
         //             not_enough.splice(i, 1);
         //          }
         //          if (array[i] != null) {
         //             if (goods_id == array[i].goods_id && array[i].max_buyed_num > 0) {
         //                array[i].buy_limit += in_cart_num;
         //             }
         //          }
         //       }
         //    }
         // }

         // var all_checked = true;
         // var money = 0.00;
         // if (array && array.length > 0) {
         //    for (var i = 0; i < array.length; i++) {
         //       if (array[i].checked) {
         //          all_checked = false;
         //       } else {
         //          money = parseFloat(money) + parseFloat(array[i].in_cart_num) * parseFloat(array[i].price);
         //       }

         //    }
         // }

         // that.setData({
         //    array: array && array.length > 0 ? array : '',
         //    edit_text: array && array.length > 0 ? that.data.edit_text : '编辑',
         //    all_checked: all_checked,
         //    not_enough: not_enough && not_enough.length > 0 ? not_enough : '',
         //    money: money.toFixed(2),
         // });
         // MyUtils.myconsole("删除后的数据：")
         // MyUtils.myconsole(array)
         // if ((array && array.length > 0) || (not_enough && not_enough.length > 0)) {

         // } else {
         //    is_ShoppingCart_Null(that);
         // }

         Extension.show_top_msg(that, "删除成功")
      },
      function(code, msg) {
         Extension.show_top_msg(that, msg)
      },
      function(res) {
         Extension.show_top_msg(that, res)
      },
      function(res) {
         MyUtils.myconsole("请求删除购物车的数据：")
         MyUtils.myconsole(res);
      })
}