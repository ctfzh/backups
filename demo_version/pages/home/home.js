// 引用日志输出
var Journal = require('../tool/journal.js')
//引入签名加密商户号
var Sign = require('../tool/sign.js')
//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
//全局通用js
var Currency = require('../tool/currency.js');

// 首页JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //防止按钮多次触发
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })

	  this.show();

    //微页面id
    //扫码进入
    var scene = decodeURIComponent(options.scene)
    if (scene && scene != "undefined") {
      this.setData({
        page_id: scene,
      })
    }
    //链接进入
    if (options.id && options.id != "undefined") {
      this.setData({
        page_id: options.id,
      })
    }
    // 门店id
    if (options.store_id && options.store_id != "undefined") {
      this.setData({
        store_id: options.store_id,
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

	  if (!this.data.go_ref) {
		  //初始化页面加载
		  Refresh(this);
	  }

	  //会员验证
	  var token = Sign.getToken();
	  if (token) {
		  //会员信息
		  Currency.get_memberinfo(this);
     }

	  
    //获取缓存门店切换状态，切换门店时刷新
    try {
      var switch_store = wx.getStorageSync('switch_store');
      if (switch_store) {
        //加载中动画
        wx.showLoading({
          title: '加载中',
        })
        //初始化页面加载
        Refresh(this);
      }
    } catch (e) {
      // Do something when catch error
    }
    
    //激活会员卡
    try {
       var active_ticket = wx.getStorageSync('active_ticket')
       var card_id = wx.getStorageSync('card_id')
       var code = wx.getStorageSync('code')
       if (active_ticket && card_id && code) {
          Currency.cardactive(this, active_ticket, card_id, code);
       } else {
         //  Currency.show_top_msg(this, res ? res : '会员卡激活失败');
       }
    } catch (e) {
       // Do something when catch error
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
  onPullDownRefresh: function (options) {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isShow: false,
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var share_text = res.target.dataset.discount.share_text;
      var share_img = res.target.dataset.discount.share_img;
      var path = 'pages/fission/fission?active_id=' + res.target.dataset.discount.active_id;
      return {
        title: share_text,
        imageUrl: share_img,
        path: path,
        success: function (res) {
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }else{
      return {
        title: '',
        imageUrl: '',
        path: '',
        success: function (res) {
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    //初始化页面加载
    Refresh(this);
  },
  //买单
  payFor: function () {
    if (this.data.store_id) {
      wx.navigateTo({
        url: '/pages/payment/check?store_id=' + this.data.store_id,
      })
    } else {
      Currency.show_top_msg(this, '非常抱歉，暂时无法使用此功能');
    }
  },
  // 优惠券领取
  receive: function (e) {
    var card_id = e.detail.detail.card_id;
    Currency.receive(this, card_id, false);
  },

  //开启会员卡
  open_member: function (e) {
	  //会员验证
	  var token = Sign.getToken();
	  if (token) {
		  if (this.data.is_wx_activate == 1) {
			  get_mCard(this);
		  } else {
			  var card_id = e.detail.card_id;
			  var member_id = "xcx_" + this.data.user_info.id;
			  Currency.receive(this, card_id, member_id);
		  }
	  } else {
		  Currency.registerrule(this, function (that) {
			  //会员信息
			  Currency.get_memberinfo(that);
		  }, e);
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
  //导航栏回调
  show: function(){
	  var wisdom = Currency.getWisdom();
	  if (!wisdom || wisdom == 1) {
		  //隐藏底部导航
		  wx.hideTabBar();
		  var class_aut = "authorize_t"
		  var marketing_home = true
		  //底部logo
	  } else {
		  //显示底部导航
		  wx.showTabBar();
		  var class_aut = "authorize";
		  var marketing_home = false;
	  }

	  this.setData({
		  class_aut: class_aut,
		  marketing_home: marketing_home,
	  })
  }
})

/*==================普通方法==================*/

//页面加载，重试
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      Journal.myconsole("获取到商户号");
		 var openid = Currency.getOpenid();
		 if (!openid) {
			 var login = true;
			 var go_ref = false;
		 } else {
			 var login = false;
			 var go_ref = true;
			 //新人礼包
			 var isShow = true;
			 //浏览记录
			 Currency.visit(that, 1);
		 }
		 that.setData({
			 content: '',
			 login: login,
			 go_ref: go_ref,
			 isShow: isShow,
		 })

		 //没有经纬度的首页数据调取方法
		 get_home(that, '', '');

    },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}

// 设置标题
function bartitle(content) {
  wx.setNavigationBarTitle({
    title: content.name
  })
}

// 会员开卡
function get_argument(that, url) {
  var arr1 = url.split("&&");
  var arr2 = arr1[1].split("&");

  var encrypt_card_id = arr2[0].split("=")[1];
  var outer_str = arr2[1].split("=")[1];
  var biz = arr2[2].split("=")[1];
  var data = {};

  data['encrypt_card_id'] = encrypt_card_id;
  data['outer_str'] = outer_str;
  data['biz'] = biz;
  wx.navigateToMiniProgram({
    appId: 'wxeb490c6f9b154ef9', //固定为此 appid，不可改动
    extraData: data, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
    success: function () {
      setTimeout(function () {
        //获取会员信息
        Currency.get_memberinfo(that);
      }, 1000) //延迟时间 这里是1秒  
    },
    fail: function () {
    },
    complete: function () {
    }
  })
}



/*==================数据请求方法==================*/

// 获取首页数据
function get_home(that, lat, lng) {
   
   //获取缓存门店id，页面id
   try {
      var store_id = wx.getStorageSync('store_id');
   } catch (e) {
   }
  var data = {};
	var unionid = Currency.getUnionid();
	if (unionid){
		data['unionid'] = unionid;
	}
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  //微页面id
  // var page_id = that.data.page_id;
  // if (page_id) {
  //   data['page_id'] = page_id;
  // }
  //门店id
  if (store_id) {
    data['store_id'] = store_id;
  }
  //经纬度
  if (lng) {
    data['lng'] = lng;
  }
  if (lat) {
    data['lat'] = lat;
  }

  Request.request_data(
    Server.GETPAGEINFO(),
    data,
    function (res) {
      if (res) {
			if (!that.data.login) {
				for (let i = 0; i < res.content.length; i++) {
					var content = res.content;
					if (content[i].store_count >1) {
						if (!lat){
							//获取经纬度
							wx.getLocation({
								type: 'gcj02',
								success: function (res) {
									var latitude = res.latitude
									var longitude = res.longitude
									that.setData({
										lat: latitude,
										lng: longitude,
										content: "",
									})
									//有经纬度的首页数据调取方法
									get_home(that, latitude, longitude);
									i = content.length+1
								},
								fail: function () {
								},
								complete: function () {
								}
							});
						}
					}else{
						if (lat && i == res.content.length) {
							that.setData({
								content: "",
							})
							get_home(that, '', '');
						}
					}
				}
			}
				that.setData({
					show_loading_faill: true,
					content: res.content,
					store_id: res.store_id,
				})

        //商城标题设置方法
        bartitle(res.content[0]);
		} else {
			Currency.custom_error(that, '2', '页面加载失败', '（商户未设置首页）', '2');
      }

    },
	  function (res) {
		  Currency.error(that, res);
    },
	  function (res) {
		  Journal.myconsole("请求首页的数据：");
		  Journal.myconsole(res);
      //更改门店切换状态
      try {
        wx.setStorageSync('switch_store', false)
      } catch (e) {
      }
      //关闭下拉动画
      wx.stopPullDownRefresh();
      //关闭加载中动画
      wx.hideLoading();
    });
}


// 会员开卡
function get_mCard(that) {
  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['openid'] = Currency.getOpenid();

  Request.request_data(
    Server.GETMCARD(),
    data,
    function (res) {
      if (res) {
        var url = decodeURIComponent(res.url);
        // 会员开卡
        get_argument(that, url)
      } else {
			Currency.show_top_msg(that, res ? res : '未查询到会员卡信息');
      }

    },
	  function (res) {
		  Currency.show_top_msg(that, res ? res : '未查询到会员卡信息');
    },
    function (res) {
		 Journal.myconsole("请求会员开卡的数据：");
       Journal.myconsole(res);
    });
}
