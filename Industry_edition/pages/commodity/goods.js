// 商品

// 引用日志输出
var Journal = require('../JS/tool/journal.js')
//引入签名加密商户号
var Sign = require('../JS/tool/sign.js')
//网络请求
var Request = require("../JS/request/request.js")
//数据接口地址
var Server = require('../JS/request/server_address.js');
//全局通用js
var Currency = require('../JS/tool/currency.js');

var interval; //计时器
var Timeout; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
  //默认选中菜单
    item_index: 0,
    //购物车商品数据
    buy_goods_list:{
      "price": 0,
      "num": 0,
      "goods_list":[],
    },
	  marqueePace: 3,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 120,
    size: 14,

  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if (options.store_id && options.store_id != "undefined" && options.function_type && options.function_type != "undefined") {
      this.setData({
        function_type: options.function_type,
        store_id: options.store_id,
			table_id: options.table_id
      })
	 } else {
		 //关闭加载中动画
		 wx.hideLoading();
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        error_text: "商家暂未出售商品",
      })
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
    if (this.data.store_id){
      //初始化页面
       Retry(this);
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
  //选中菜单
  menu_item: function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      item_index: index,
      menu_id: index,
    })
  },
  //黑色背景点击事件
  goods_mask: function(){
    this.setData({
      mask: false,
      sku_mask: false,
      shopping_cart_mask: false,
		goods_info_mask:false,
    })
  },

  //规格选择/单商品添加
  sku: function(e){
     var sku_goods = e.currentTarget.dataset.goods;
     var add_delete = e.currentTarget.dataset.add_delete;
     var existing_num = e.currentTarget.dataset.existing_num;
    this.setData({
      category: "",
      methods: "",
      batching: "",
      sku_goods: sku_goods,
    })
    //sku
    get_sku(this, sku_goods.id, add_delete, existing_num);
  },

  //sku选择
  sku_item: function (e) {
    var category = this.data.category;
    var methods = this.data.methods;
    var batching = this.data.batching;
    var type_sku = e.currentTarget.dataset.type;
    var sku = e.currentTarget.dataset.sku;
    //修改sku
    if (type_sku == "category") {
      var list = e.currentTarget.dataset.list;
      for (var i = 0; i < category.length; i++){
        if (category[i].id==list.id){
          category[i].item_id = sku.id;
        }
      }
      this.setData({
        category: category,
      })
    } else if (type_sku == "methods") {
      var list = e.currentTarget.dataset.list;
      if (methods.length > 0){
        for (var i = 0; i < methods.length; i++) {
          if (methods[i].id == list.id) {
            if (methods[i].item_id == sku.id){
              delete methods[i].item_id;
            }else{
              methods[i].item_id = sku.id;
            }
          }
        }
      }
      this.setData({
        methods: methods,
      })
    } else if (type_sku =="batching"){
      var item={};
      if (batching.length > 0) {
        for (var i = 0; i < batching.length; i++) {
          if (batching[i].item_id == sku.id) {
            delete batching[i].item_id;
            this.setData({
              batching: batching,
            })
            get_sku(this, this.data.sku.sku.goods_id);
            return;
          }
          if (i == batching.length-1){
            item.item_id = sku.id;
            batching.push(item);
            this.setData({
              batching: batching,
            })
            get_sku(this, this.data.sku.sku.goods_id);
            return;
          } 
        }
      }else{
        item.item_id=sku.id;
        batching.push(item);
        this.setData({
          batching: batching,
        })
      }
    } 
    //获取sku
    get_sku(this, this.data.sku.sku.goods_id);
  },

  //选择商品
  good_choice: function () {
    this.setData({
      mask: false,
		sku_mask: false,
		goods_info_mask: false,
    })
  },

  //购物车弹出层
  shopping_cart_mask: function(){
    this.setData({
      mask: true,
      shopping_cart_mask: true,
    })
  },

  //登入完成回调
  login_success: function () {
     //浏览量统计
     Currency.visit(this);
    this.setData({
      login: false,
    })
  },
  
  //滚动商品菜单
  scroll: function (e) {
    var that = this;
    var top_height = that.data.top_height;
    wx.createSelectorQuery().selectAll('.goods_list_item').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        if (rect.top <= top_height && rect.top+rect.height > top_height){
          that.setData({
            item_index: rect.id,
          })
        }
      })
    }).exec()
  },

  // 加入购物车(选规格)
  add_sku_goods: function () {
    var sku = this.data.sku;
    var category = this.data.category;
    var methods = this.data.methods;
    var batching = this.data.batching;
    var buy_goods_list = this.data.buy_goods_list;
    var only_practice = this.data.only_practice;
    var list = add_goods(this, buy_goods_list, sku, category, methods, batching, only_practice);
    //保存已选商品
    hold_cart_goods(this, list);
    this.setData({
      mask: false,
      sku_mask: false,
    })
  },


  // 添加商品(购物车)
  add_cart_goods: function (e) {
    var sku = e.currentTarget.dataset.sku;
    var category = e.currentTarget.dataset.category;
    var methods = e.currentTarget.dataset.methods;
    var batching = e.currentTarget.dataset.batching;
    var only_practice = e.currentTarget.dataset.only_practice;
    var buy_goods_list = this.data.buy_goods_list;
    var list = add_goods(this, buy_goods_list, sku, category, methods, batching, only_practice);
    //保存已选商品
    hold_cart_goods(this, list);
  },

  //清空购物车
  empty_shopping_cart: function(){
     var list = this.data.buy_goods_list;
     list.goods_list = [];
     list.price = 0;
     list.num = 0;
     //保存已选商品
     hold_cart_goods(this, list);
  },


  //删除商品（购物车）
  empty_cart_goods: function (e) {
    var sku = e.currentTarget.dataset.sku;
    var category = e.currentTarget.dataset.category;
    var methods = e.currentTarget.dataset.methods;
    var batching = e.currentTarget.dataset.batching;
    var only_practice = e.currentTarget.dataset.only_practice;
    var buy_goods_list = this.data.buy_goods_list;
    var list = empty_goods(this, buy_goods_list, sku, category, methods, batching, only_practice);
    //保存已选商品
    hold_cart_goods(this, list);
  },


  //结算
  settlement: function(){
    var list = this.data.buy_goods_list;
    if (list.goods_list.length>0){
      store_detail(this, 1);
    } else {
      wx.showToast({
        title: "请选择一件商品",
        icon: 'none',
        duration: 2000
      })
    }
  },
  //重试事件
  retry: function () {
    //初始化页面
    Retry(this);
  },
  //库存超出
  stock: function(){
    wx.showToast({
      title: "商品库存不足",
      icon: 'none',
      duration: 2000
    })
  },
  //手指触摸动作
  touchstart: function(){
     //停止计算器
     clearTimeout(Timeout);
     clearInterval(interval); 
  },
  //手指触摸结束
  touchend: function(){
     var that = this;
   Timeout = setTimeout(function () {
           scrolltxt(that);
     }, 500)
  },
  //商品详情弹框
  goods_info: function(e){
	  var goods_info = e.currentTarget.dataset.goods_info;
	  this.setData({
		  mask: true,
		  goods_info_mask: true,
		  goods_info: goods_info,
	  })
  }

})




/******************************************普通方法******************************************/

// 页面初始化
function Retry(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
       if (Currency.getOpenid()) {
      } else {
        that.setData({
          login: true,
        })
      }
      //门店信息
      store_detail(that); 
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        error_text: "商户不存在",
      })
    },
  )
}

// 拼接
function sku_item(that) {
  //已选中的sku
  var category = that.data.category;
  var methods = that.data.methods;
  var batching = that.data.batching;
  var only_practice_name = '';

  if (category) {
    var category_selected = '';
    for (var i = 0; i < category.length; i++) {
      if (category[i].item_id) {
        if (category_selected == '') {
           category_selected = category[i].item_id;
           if (category[i].item_name) {
              only_practice_name = category[i].item_name;
           }
        } else {
           category_selected = category_selected + "," + category[i].item_id;
           if (category[i].item_name) {
              only_practice_name = only_practice_name + " / " + category[i].item_name;
           }
        }
      }
    }
  }

  if (methods) {
    var methods_selected = '';
    for (var i = 0; i < methods.length; i++) {
      if (methods[i].item_id) {
        if (methods_selected == '') {
          methods_selected = methods[i].item_id;
          if (only_practice_name == '') {
             if (methods[i].item_name) {
                only_practice_name = methods[i].item_name;
             }
          } else {
             if (methods[i].item_name) {
                only_practice_name = only_practice_name + " / " + methods[i].item_name;
             }
          }
        } else {
          methods_selected = methods_selected + "," + methods[i].item_id;
          if (methods[i].item_name) {
             only_practice_name = only_practice_name + " / " + methods[i].item_name;
          }
        }
      }
    }
  }
  if (batching) {
    var batching_selected = '';
    for (var i = 0; i < batching.length; i++) {
      if (batching[i].item_id) {
        if (batching_selected == '') {
          batching_selected = batching[i].item_id;
          if (only_practice_name == '') {
             if (batching[i].item_name) {
                only_practice_name = batching[i].item_name;
             }
          } else {
             if (batching[i].item_name) {
                only_practice_name = only_practice_name + " / " + batching[i].item_name;
             }
          }
        } else {
          batching_selected = batching_selected + "," + batching[i].item_id;
          if (batching[i].item_name){
             only_practice_name = only_practice_name + " / " + batching[i].item_name;
          }
        }
      }
    }
  }
  
  that.setData({
    category_selected: category_selected ? category_selected: '',
    methods_selected: methods_selected ? methods_selected: '',
    batching_selected: batching_selected ? batching_selected : '',
    only_practice: category_selected + methods_selected + batching_selected,
    only_practice_name: only_practice_name,
  })
}
//拼接
// function sku_data(data){
//       var batching_selected = '';
//       for (var i = 0; i < batching.length; i++) {
//          if (batching[i].item_id) {
//             if (batching_selected == '') {
//                batching_selected = batching[i].item_id;
//                if (only_practice_name == '') {
//                   if (batching[i].item_name) {
//                      only_practice_name = batching[i].item_name;
//                   }
//                } else {
//                   if (batching[i].item_name) {
//                      only_practice_name = only_practice_name + " / " + batching[i].item_name;
//                   }
//                }
//             } else {
//                batching_selected = batching_selected + "," + batching[i].item_id;
//                if (batching[i].item_name) {
//                   only_practice_name = only_practice_name + " / " + batching[i].item_name;
//                }
//             }
//          }
//       }
// }


//添加商品
function add_goods(that, buy_goods_list, sku, category, methods, batching, only_practice){
  var price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2); 
  buy_goods_list.price = Math.formatFloat(parseFloat(buy_goods_list.price) + parseFloat(price), 2).toFixed(2); 
  buy_goods_list.num = buy_goods_list.num ? buy_goods_list.num + 1 : 1;

  //加入商品
  if (buy_goods_list.goods_list.length <= 0) {

    var practice = [];
    var sku_goods = [];

    var practice_item = _practice_item(that, sku, category, methods, batching);
    practice.push(practice_item);

    var sku_goods_item = _sku_goods_item(sku);
    sku_goods_item.practice = practice;
    sku_goods.push(sku_goods_item);

    var goods_item = _goods_item(that,sku);
    goods_item.sku_goods = sku_goods;

    buy_goods_list.goods_list.push(goods_item);

    return buy_goods_list;
  } else {
    var goods_list = buy_goods_list.goods_list;
    for (var g = 0; g < goods_list.length; g++) {
      //对比数据是否已存在
      if (goods_list[g].goods_id == sku.sku.goods_id) {
        //增加金额，数量
        goods_list[g].price = Math.formatFloat(parseFloat(goods_list[g].price) + parseFloat(price), 2).toFixed(2); 
        goods_list[g].num = goods_list[g].num ? goods_list[g].num + 1 : 1;
        var sku_goods = goods_list[g].sku_goods;
        for (var s = 0; s < sku_goods.length; s++) {
          //对比数据是否已存在
          if (sku_goods[s].sku.goods_sku_id == sku.sku.goods_sku_id && sku_goods[s].sku.batching_price == sku.sku.batching_price && sku_goods[s].sku.methods_price == sku.sku.methods_price) {
            //增加金额，数量
            sku_goods[s].price = Math.formatFloat(parseFloat(sku_goods[s].price) + parseFloat(price), 2).toFixed(2); 
            sku_goods[s].num = sku_goods[s].num ? sku_goods[s].num + 1 : 1;
            var practice = sku_goods[s].practice;
            for (var p = 0; p < practice.length; p++) {
              if (practice[p].only_practice == only_practice) {
                //增加金额，数量
                practice[p].price = Math.formatFloat(parseFloat(practice[p].price) + parseFloat(price), 2).toFixed(2); 
                practice[p].num = practice[p].num ? practice[p].num + 1 : 1;

                return buy_goods_list;//创建完成返回数组
              } else if (p == practice.length - 1) {//最后一次对比是否存在
              //创建数据
                var practice_item = _practice_item(that, sku, category, methods, batching);
                practice.push(practice_item);

                return buy_goods_list;//创建完成返回数组
              }
            }

          } else if (s == sku_goods.length - 1) {//最后一次对比是否存在
          //创建数据
            var practice = [];

            var practice_item = _practice_item(that, sku, category, methods, batching);
            practice.push(practice_item);

            var sku_goods_item = _sku_goods_item(sku);
            sku_goods_item.practice = practice;
            sku_goods.push(sku_goods_item);

            return buy_goods_list;//创建完成返回数组
          }
        }

      } else if (g == goods_list.length - 1) {//最后一次对比是否存在
      //创建数据
        var practice = [];
        var sku_goods = [];

        var practice_item = _practice_item(that, sku, category, methods, batching);
        practice.push(practice_item);

        var sku_goods_item = _sku_goods_item(sku);
        sku_goods_item.practice = practice;
        sku_goods.push(sku_goods_item);

        var goods_item = _goods_item(that, sku);
        goods_item.sku_goods = sku_goods;

        goods_list.push(goods_item);
        return buy_goods_list;//创建完成返回数组
      }
    }
  }
}

//创建做法数据
function _practice_item(that, sku, category, methods, batching) {
   var practice_item = {};
   practice_item.category = category;
   practice_item.methods = methods;
   practice_item.batching = batching;
  //选中的sku_name
  practice_item.only_practice_name = that.data.only_practice_name;
  //选中的sku_id
  practice_item.only_practice = that.data.category_selected + that.data.methods_selected + that.data.batching_selected;
//   商品价格总和
  practice_item.price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2);
  //库存数量
  practice_item.max_num = sku.max_num;
  //单价
  practice_item.unit_price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2);
  //商品数量
  practice_item.num = 1;
  return practice_item;
}

//创建sku数据
function _sku_goods_item(sku) {
  var sku_goods_item = {};
  sku_goods_item.sku = sku.sku;
  sku_goods_item.price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2);
  sku_goods_item.num = 1;
  return sku_goods_item;
}

//创建商品数据
function _goods_item(that, sku) {
	var goods_item = {};
  goods_item.goods_id = sku.sku.goods_id;
  goods_item.price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2);
  goods_item.num = 1;
  goods_item.goods_img = that.data.sku_goods.img;
  return goods_item;
}




//判断选中商品数量
function query_goods(that) {
  var sku = that.data.sku;
  var buy_goods_list = that.data.buy_goods_list;
  if (buy_goods_list.goods_list.length > 0) {
    var goods_list = buy_goods_list.goods_list;
    for (var g = 0; g < goods_list.length; g++) {
      if (goods_list[g]) {
        if (goods_list[g].goods_id == sku.sku.goods_id) {
          var sku_goods = goods_list[g].sku_goods;
          for (var s = 0; s < sku_goods.length; s++) {
            if (sku_goods[s]) {
              if (sku_goods[s].sku.goods_sku_id == sku.sku.goods_sku_id) {
                var practice = sku_goods[s].practice;
                for (var p = 0; p < practice.length; p++) {
                  if (practice[p]) {
                    if (practice[p].only_practice == that.data.only_practice) {
                      that.setData({
                        join: true,
                        num: practice[p].num,
                      })
                      return;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  that.setData({
    join: false,
    num: 0,
  })
}

//删除商品
function empty_goods(that, buy_goods_list, sku, category, methods, batching, only_practice) {
	var price = Math.formatFloat(parseFloat(sku.sku.price) + parseFloat(sku.sku.batching_price) + parseFloat(sku.sku.methods_price), 2).toFixed(2);
			var goods_list = buy_goods_list.goods_list;
			for (var g = 0; g < goods_list.length; g++) {
				if (goods_list[g].goods_id == sku.sku.goods_id) {
					if (buy_goods_list.num == 1){
						buy_goods_list.goods_list = [];
						buy_goods_list.price = 0;
						buy_goods_list.num = 0;
						return buy_goods_list;
					}else
					if (goods_list[g].num == 1) {
						buy_goods_list.price = Math.formatFloat(parseFloat(buy_goods_list.price) - parseFloat(price), 2).toFixed(2);
						buy_goods_list.num = buy_goods_list.num - 1;
						goods_list[g] = '';
						return buy_goods_list;
					} else {
						buy_goods_list.price = Math.formatFloat(parseFloat(buy_goods_list.price) - parseFloat(price), 2).toFixed(2);
						buy_goods_list.num = buy_goods_list.num - 1;
						goods_list[g].price = Math.formatFloat(parseFloat(goods_list[g].price) - parseFloat(price), 2).toFixed(2);
						goods_list[g].num = goods_list[g].num - 1;
						var sku_goods = goods_list[g].sku_goods;
						for (var s = 0; s < sku_goods.length; s++) {
							if (sku_goods[s].sku.goods_sku_id == sku.sku.goods_sku_id && sku_goods[s].sku.batching_price == sku.sku.batching_price) {
								if (sku_goods[s].num == 1) {
									sku_goods[s] = '';
									return buy_goods_list;
								} else {
									sku_goods[s].price = Math.formatFloat(parseFloat(sku_goods[s].price) - parseFloat(price), 2).toFixed(2);
									sku_goods[s].num = sku_goods[s].num - 1;
									var practice = sku_goods[s].practice;
									for (var p = 0; p < practice.length; p++) {
										if (practice[p].only_practice == only_practice) {
											if (practice[p].num == 1) {
												practice[p] = '';
												return buy_goods_list;
											} else {
												practice[p].price = Math.formatFloat(parseFloat(practice[p].price) - parseFloat(price), 2).toFixed(2);
												practice[p].num = practice[p].num - 1;
												return buy_goods_list;
											}
										}
									}
								}
							}
						}
					}
				}
		}

}
//多规格删除
function empty_sku_goods(that, buy_goods_list, sku) {
	if (buy_goods_list.num == 1) {
		buy_goods_list.goods_list = [];
		buy_goods_list.price = 0;
		buy_goods_list.num = 0;
		return buy_goods_list;
	} else {
		buy_goods_list.num = buy_goods_list.num - 1;
		var goods_list = buy_goods_list.goods_list;
		for (var g = 0; g < goods_list.length; g++) {
			if (goods_list[g].goods_id == sku.sku.goods_id) {
				buy_goods_list.price = Math.formatFloat(parseFloat(buy_goods_list.price) - parseFloat(goods_list[g].price), 2).toFixed(2);
					goods_list[g] = '';
					return buy_goods_list;
			}
		}
	}

}

//保存购物车
function hold_cart_goods(that, buy_goods_list) {
  if (buy_goods_list.goods_list.length<=0){
    if (!that.data.sku_mask){
      that.setData({
        mask: false,
      })
    }
  }
  console.log(buy_goods_list);
  //储存购物车
  try {
    wx.setStorageSync('buy_goods_list', buy_goods_list);
    that.setData({
		 buy_goods_list: buy_goods_list,
    })
  } catch (e) {
  }
}

//价格计算（防止计算精度偏差）
Math.formatFloat = function (f, digit) {
  var m = Math.pow(10, digit);
  return Math.round(f * m, 10) / m;
}


function scrolltxt(that) {
   var length = that.data.length;//滚动文字的宽度
   var marquee_box = that.data.marquee_box;//.marquee_box宽度
   if (length > marquee_box) {
      var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
      interval = setInterval(function () {
         var crentleft = that.data.marqueeDistance;
         if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
            that.setData({
               marqueeDistance: crentleft + that.data.marqueePace
            })
         } else {
            that.setData({
               marqueeDistance: 0 // 直接重新滚动
            });
            //停止计算器
            clearInterval(interval);
            //重新滚动
            scrolltxt(that);
         }
      }, 60);
   }
   else {
      that.setData({ marquee_margin: "10000" });//只显示一条不滚动右边间距加大，防止重复显示
   }
}

/******************************************接口数据调用方法******************************************/

//获取商品信息
function get_goods(that) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['store_id'] = that.data.store_id;
  data['type'] = that.data.function_type;

  Request.request_data(
    Server.GET_GOOODS(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show: true,
          goods_list: res.goods_list,
          group_list: res.group_list,
          item_index: that.data.item_index ? that.data.item_index : "menu_" +res.group_list[0].id,
        })
        wx.createSelectorQuery().select('.goods_top').boundingClientRect(function (rect) {
          that.setData({
            top_height: rect.height  // 节点的高度
          })
        }).exec()
      } else {
        that.setData({
          show: false,
          retry_an: 0,
          error: 1,
          error_text: "此商家暂无商品出售",
        })
      }
    },
    function (res) {
      that.setData({
        show: false,
        retry_an: 1,
        show_text: res,
      })
    },
    function (res) {
      //关闭加载中动画
      wx.hideLoading();
      Journal.myconsole("商品列表请求信息：")
      Journal.myconsole(res);
    })
}


// 获取sku信息
function get_sku(that, goods_id, single, existing_num) {
  //已选中的sku
  sku_item(that);

  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['goods_id'] = goods_id;
  data['store_id'] = that.data.store_id;
  data['type'] = that.data.function_type;
  if (that.data.category_selected){
    data['category_selected'] = that.data.category_selected;
  }
  if (that.data.methods_selected) {
    data['methods_selected'] = that.data.methods_selected;
  }
  if (that.data.batching_selected) {
    data['batching_selected'] = that.data.batching_selected;
  }

  Request.request_data(
    Server.GETSKU(),
    data,
    function (res) {
      if (res) {
        that.setData({
          sku: res,
          price: Math.formatFloat(parseFloat(res.sku.price) + parseFloat(res.sku.batching_price) + parseFloat(res.sku.methods_price), 2).toFixed(2),
        })
        //保存已选中的数据
        var category = [];
        var methods = [];
        var batching = [];
        if (res.category) {
          for (var i = 0; i < res.category.length; i++) {
            category[i] = {};
            category[i].id = res.category[i].id;
            var itme_list = res.category[i].item_list;
            for (var j = 0; j < itme_list.length; j++) {
              if (itme_list[j].can_select == 1) {
                if (itme_list[j].select == 2) {
                  category[i].item_id = itme_list[j].id;
                  category[i].item_name = itme_list[j].name;
                }
              }
            }
          }
          that.setData({
            category: category,
          })
        }

        if (res.methods) {
          for (var i = 0; i < res.methods.length; i++) {
            methods[i] = {};
            methods[i].id = res.methods[i].id;
            var itme_list = res.methods[i].item_list;
            for (var j = 0; j < itme_list.length; j++) {

              if (itme_list[j].can_select == 1) {
                if (itme_list[j].select == 2) {
                  methods[i].item_id = itme_list[j].id;
                  methods[i].item_name = itme_list[j].name;
                }
              }
            }
          }
          that.setData({
            methods: methods,
          })
        }

        if (res.batching) {
          for (var i = 0; i < res.batching.length; i++) {
            batching[i] = {};
            if (res.batching[i].can_select==1){
              if (res.batching[i].select == 2) {
                batching[i].item_id = res.batching[i].id;
                batching[i].item_name = res.batching[i].name;
              }
            }
          }
          that.setData({
            batching: batching,
          })
        }

        //已选中的sku
        sku_item(that);
        // 判断选中商品数量
        query_goods(that);
         //商品列表添加删除
        var sku = that.data.sku;
        var category = that.data.category;
        var methods = that.data.methods;
        var batching = that.data.batching;
        var buy_goods_list = that.data.buy_goods_list;
        var only_practice = that.data.only_practice;
        if (res.batching && res.batching.length == 0 && res.methods && res.methods.length == 0 && res.category && res.category.length == 0) {
          if (single == 1) {
             if (sku.max_num < that.data.num){
                that.stock();
             } else {
                // 添加商品
                var list = add_goods(that, buy_goods_list, sku, category, methods, batching, only_practice);
                //保存已选商品
                hold_cart_goods(that, list);
             }
          } else if (single == 2) {
            // 删除商品
            var list = empty_goods(that, buy_goods_list, sku, category, methods, batching, only_practice);
            //保存已选商品
            hold_cart_goods(that, list);
          }
        }else{
           if (single == 2 && existing_num == 1) {
              // 删除商品
				  var list = empty_sku_goods(that, buy_goods_list, sku);
              //保存已选商品
              hold_cart_goods(that, list);
           } else if (single == 2 && existing_num > 1){
              wx.showToast({
                 title: "多规格商品请去购物车删除哦",
                 icon: 'none',
                 duration: 1000
              })
           } else {
              that.setData({
                 mask: true,
					  sku_mask: true,
					  goods_info_mask: false,
              })
           }
        }

      } else {
        wx.showToast({
          title: res ? res : "数据加载失败",
          icon: 'none',
          duration: 2000
        })
      }
    },
    function (res) {
      wx.showToast({
        title: res ? res : "数据加载失败",
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
      Journal.myconsole("sku请求信息：")
      Journal.myconsole(res);
    })
}


//门店详情
function store_detail(that, settlement) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['store_id'] = that.data.store_id;
  data['type'] = that.data.function_type;

  Request.request_data(
    Server.GOODS_STORE_DEAIL(),
    data,
    function (res) {
       if (res) {
          //浏览量统计
			 Currency.visit(that);
			 //页面名称
			 wx.setNavigationBarTitle({
				 title: res.store.store_name
			 })

        var open_status = 1
        if (that.data.function_type==1){
          if (res.order_set.open_status == 2) {
            open_status = 2
          }
        }else{
          if (res.takeaway_set.open_status == 2) {
            open_status = 2
          }
        }
        if (open_status==2){
          that.setData({
            show: false,
            retry_an: 0,
            error: 1,
            error_text: "商家休息中",
          })
        }else{
          //提交订单
          if (settlement==1){
            var token = Sign.getToken();
            if (token) {
              if (that.data.function_type == 1) {
					  if (that.data.table_id) {
						  var url = that.data.store_id + "&function_type=" + that.data.function_type + "&store_name=" + res.store.store_name +"&table_id="+ that.data.table_id
					  }else{
						  var url = that.data.store_id + "&function_type=" + that.data.function_type + "&store_name=" + res.store.store_name
					  }
                wx.navigateTo({
						 url: '/pages/order/place_order?store_id=' + url,
                })
              } else if (that.data.function_type == 2) {
                wx.navigateTo({
						 url: '/pages/order/takeout_order?store_id=' + that.data.store_id + "&function_type=" + that.data.function_type + "&lng=" + res.store.lng + "&lat=" + res.store.lat + "&store_name=" + res.store.store_name,
                })
              }
            }else{
              Currency.log_in();
            }
          }else{
            //商品数据
            get_goods(that);

            //获取购物车数据
            try {
              var buy_goods_list = wx.getStorageSync('buy_goods_list')
              if (buy_goods_list) {
              } else {
                buy_goods_list = {
                  "price": 0,
                  "num": 0,
                  "goods_list": [],
                };
              }
              hold_cart_goods(that, buy_goods_list);
            } catch (e) {
            }

            //页面数据
            that.setData({
               store: res,
               send_price: parseFloat(res.takeaway_set.send_price),
               min_price: parseFloat(res.takeaway_set.min_price)
            })
            //停止计时
            clearInterval(interval);
            if (res.store.notice){
               var length = res.store.notice.length * that.data.size;//文字长度
               var marquee_box = wx.getSystemInfoSync().windowWidth-90;// .marquee_box宽度
               that.setData({
                  marqueeDistance: 0,
                  length: length,
                  marquee_box: marquee_box,
               })
               scrolltxt(that);// 第一个字消失后立即从右边出现
            }
            
          }
        }
      } else {
        that.setData({
          show: false,
          retry_an: 0,
          error: 1,
          error_text: "商家暂未出售商品",
        })
      }
    },
    function (res) {
      that.setData({
        show: false,
        retry_an: 1,
        error: 0,
        show_text: res,
      })
    },
    function (res) {
      Journal.myconsole("门店请求数据：")
      Journal.myconsole(res);
      //关闭加载中动画
      wx.hideLoading();
    })
}