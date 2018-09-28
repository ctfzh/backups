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
// 转译富文本显示组件JS
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');

// 优惠JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
    //切换门店下拉窗口
    switch_store: false,
    //查看更多优惠券
    more_coupon:false,
    //查看更多异业联盟券
    other_more_coupon: false,
    //默认显示两张优惠券
    x_coupon: '2',
    //防止按钮多次触发
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // //加载中动画
    // wx.showLoading({
    //   title: '加载中',
    // })
    //门店id
    var scene = decodeURIComponent(options.scene);
	 if (scene && scene != 'undefined' && scene !="scene") {
      this.setData({
        store_id: scene,
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

	  //初始化页面加载
	  Refresh(this);
     
   //激活会员卡
    try {
       var active_ticket = wx.getStorageSync('active_ticket')
       var card_id = wx.getStorageSync('card_id')
       var code = wx.getStorageSync('code')
       if (active_ticket && card_id && code) {
          Currency.cardactive(this, active_ticket, card_id, code);
       } else {
         //  Currency.show_top_msg(this, '会员卡激活失败');
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
  onPullDownRefresh: function () {
    this.setData({
      isShow: false,
      //切换门店下拉窗口
      switch_store: false,
    })
    // 页面初始化加载
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
      var share_text = res.target.dataset.coupon.share_text;
      var share_img = res.target.dataset.coupon.share_img;
      var path = 'pages/fission/fission?active_id=' + res.target.dataset.coupon.active_id;
    }
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
  },
  
  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    });
    // 初始化页面
    Refresh(this);
  },

  //下拉门店列表
  switch_store: function () {
      this.setData({
        switch_store: this.data.switch_store ? false : true,
        store_data: null,
      })
      //获取门店列表
      get_switchstore(this);
  },
  //切换门店
  switch_store_id: function (e) {
    var store_id = e.currentTarget.dataset.store.id;
    this.setData({
      store_name: e.currentTarget.dataset.store.name,
      store_id: e.currentTarget.dataset.store.id,
      switch_store: this.data.switch_store ? false : true,
    })
    //异业联盟券 获取门店id时刷新异页联盟券
    get_othercoupon(this);
  },
  //查看更多优惠券
  more_coupon: function(){
    this.setData({
      more_coupon: true,
    })
  },
  //查看更多异业联盟券
  other_more_coupon: function () {
    this.setData({
      other_more_coupon: true,
    })
  },
  // 领取优惠券
  coupon_receive: function (e) {
    var card_id = e.currentTarget.dataset.coupon.card_id;
    Currency.receive(this, card_id, false);

  },

  // 开通会员卡
  open_membership: function (e) {

	  //会员验证
	  var token = Sign.getToken();
	  if (token) {
		  if (this.data.is_wx_activate == 1) {
			  this.open_mCard(this);
		  } else {
			  var card_id = e.currentTarget.dataset.user.member_info.member_card_id;
			  var member_id = "xcx_" + this.data.user_info.id;
			  Currency.receive(this, card_id, member_id);
		  }
	  } else {
		  Currency.registerrule(this, function (that) {
			  //会员信息
			  Currency.get_memberinfo(that);
			}, e)
	  }

  },
  //查看会员卡
  see_membership: function (e) {
    var that = this;
    if (that.data.disabled) {
      //加载中动画
      wx.showLoading({
        title: '加载中',
      })
      //关闭点击事件
      that.setData({
        disabled: false,
      })
      var card_id = e.currentTarget.dataset.user.card_id;
      var code = e.currentTarget.dataset.user.member_code;
      wx.openCard({
        cardList: [
          {
            cardId: card_id,
            code: code,
          }
        ],
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function(){
          //激活点击事件
          that.setData({
            disabled: true,
          })
          //关闭加载中动画
          wx.hideLoading();
        }
      })
    }
  },
  //买单
  open_pay: function (e){

		  if (this.data.store_id) {
			  var store_id = this.data.store_id;
			  wx.navigateTo({
				  url: '/pages/payment/check?store_id=' + store_id,
			  })
		  } else {
			  Currency.show_top_msg(this, '非常抱歉，暂时无法使用此功能');
		  }


  },
   // 充值
  jump_recharge_activity: function () {
    wx.navigateTo({
      url: '/pages/recharge_activity/recharge_activity'
    })
  },
  //异业联盟券领取
  bindother_url: function (e) {
    var code = e.currentTarget.dataset.coupon.code;
    var mchid = e.currentTarget.dataset.coupon.mchid;
    wx.navigateTo({
      url: '../discount/other_coupon?code=' + code + '&mchid=' + mchid,
    })
  },
  // 领取会员卡
  open_mCard: function(){
    get_mCard(this);
  },

  //登入完成回调
  login_success: function () {
     //加载中动画
     wx.showLoading({
        title: '加载中',
     })
     Refresh(this);
  },
})



/********************普通方法*****************************/
//页面初始化加载
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
     function () {
		  //验证登入
		  var openid = Currency.getOpenid();
		  if (!openid) {
           that.setData({
              login: true,
           })
        } else {
           //页面浏览统计
           Currency.visit(that, 2);
           that.setData({
              login: false,
              x_coupon: '2',
              isShow: true,
           })
           // 获取优惠页数据
			  get_detail(that);
			  //会员验证
			  var token = Sign.getToken();
			  if (token) {
				  //会员信息
				  Currency.get_memberinfo(that);
			  } 
           //获取经纬度
           wx.getLocation({
              type: 'wgs84',
              success: function (res) {
                 that.setData({
                    lng: res.longitude,
                    lat: res.latitude,
                 })
                 if (that.data.store_id) {
                    //门店详情
                    get_switchstoredtail(that);
                    //异业联盟券 获取门店id时刷新异页联盟券
                    get_othercoupon(that);
                 } else {
                    //获取门店列表
                    get_switchstore(that);
                 }
              },
              fail: function (res) {
                 //没有异业联盟券时显示四张优惠券
                 that.setData({
                    x_coupon: '4',
                    other_coupon: false
                 })
                 Currency.show_top_msg(that, '定位失败');
              }
           })
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
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
    success: function (res) {
    },
    fail: function (res) {
    },
    complete: function (res) {
    }
  })
}

/*==================数据请求方法==================*/

// 获取优惠页数据
function get_detail(that) {
	var data = {};
	data['unionid'] = Currency.getUnionid();
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();

    Request.request_data(
      Server.GETDWTAIL(),
      data,
      function (res) {
        if (res && res != '') {
          that.setData({
            show_loading_faill: true,
            data: res
          })
          //富文本
          WxParse.wxParse('article', 'html', res.member_info.discount_text, that, 0);
		  } else {
			  Currency.custom_error(that, '2', '页面加载失败', '', '2');
        }

      },
		 function (res) {
			 Currency.error(that, res);
      },
      function (res) {
        //关闭加载中动画
        wx.hideLoading();
        //关闭下拉动画
			wx.stopPullDownRefresh();
			Journal.myconsole("请求优惠页的数据：");
			Journal.myconsole(res);
      });
}

// 门店列表
function get_switchstore(that) {

  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['lng'] = that.data.lng;
  data['lat'] = that.data.lat;

  Request.request_data(
    Server.GETSWITCHSTORE(),
    data,
    function (res) {
      if (res && res.length>0) {
        that.setData({
          store_data: res,
        })
        if (!that.data.store_id){
          that.setData({
            store_name: res[0].name,
            store_id: res[0].id,
          })
          //异业联盟券 获取门店id时刷新异页联盟券
          get_othercoupon(that);
        }
      } 
    },
    function (res) {
    },
	  function (res) {
		  Journal.myconsole("请求门店列表的数据：");
		  Journal.myconsole(res);
    });
}

// 门店详情
function get_switchstoredtail(that) {

  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['store_id'] = that.data.store_id;

  Request.request_data(
    Server.GETSWITCHSTOREDTAIL(),
    data,
    function (res) {
      if (res) {
        that.setData({
          store_name: res.name
        })
      } else {
        Currency.show_top_msg(that, '门店不存在');
      }
    },
    function (res) {
      Currency.show_top_msg(that, res ? res : '门店不存在');
    },
	  function (res) {
		  Journal.myconsole("请求门店的数据：");
		  Journal.myconsole(res);
    });
}


// 异页联盟券
function get_othercoupon(that) {
	var data = {};
	data['unionid'] = Currency.getUnionid();
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();
    data['store_id'] = that.data.store_id;

    Request.request_data(
      Server.GETOTHERCOUPON(),
      data,
      function (res) {
          that.setData({
            other_coupon: res
          })
      },
		 function (res) {
			 that.setData({
				 other_coupon: []
			 })
      },
		 function (res) {
			 Journal.myconsole("请求异业联盟券的数据：");
			 Journal.myconsole(res);
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
			Currency.show_top_msg(that, '未查询到会员卡信息');
      }
    },
	  function (res) {
		  Currency.show_top_msg(that, '未查询到会员卡信息');
    },
	  function (res) {
		  Journal.myconsole("请求会员开卡的数据：");
		  Journal.myconsole(res);
    });
}