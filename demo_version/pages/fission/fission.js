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

//裂变红包JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
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
    });


	  //优惠券id
	  var scene = decodeURIComponent(options.scene);
	  if (scene && scene != 'undefined') {
		  var active_id = scene;
	  } else if (options.active_id && options.active_id != 'undefined') {
		  var active_id = options.active_id;
	  }
	  
	  if (active_id) {
		  this.setData({
			  active_id: active_id
		  })
		  //页面初始化加载
		  Refresh(this)
	  } else {
		  Currency.custom_error(this, '2', '数据丢失，请稍后重试');
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
    // 初始化页面
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
    // 来自页面内转发按钮
    var share_text = this.data.coupon.coupon_info.share_text;
    var share_img = this.data.coupon.coupon_info.share_img;
    return {
      title: share_text,
      imageUrl: share_img,
      success: function (res) {
        Currency.show_top_msg(that, '分享失败');
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
  //查看更多优惠
  more_favorable: function () {
    wx.switchTab({
      url: '../discount/discount',
    })
  },
  //返回首页
  coupon_home: function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 领取优惠券
  coupon_receive: function (e) {
    var card_id = e.currentTarget.dataset.coupon.card_id;
    var active_id = 'couponevent_'+this.data.active_id
    Currency.receive(this, card_id, false, active_id);
  },
  //领取优惠券刷新
  refresh: function(){
     // 初始化页面
     Refresh(this);
  },
  //登入完成回调
  login_success: function () {
     Refresh(this);
	},
	//登入
	login_an(e) {
		Currency.registerrule(this, function (that) { Refresh(that) }, e);
	}
})



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
           Currency.visit(that, 4);
           that.setData({
              login: false,
           })
           get_fission(that)
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}

//小数分离
function discount_money(that, money) {
  var res_money = String(money);
  if (res_money && res_money.indexOf('.') != -1) {
    var money_list = res_money.split(".");
    var discount = money_list[0];
    var discount_spot = money_list[1];
    that.setData({
      discount: discount,
      discount_spot: discount_spot,
    })
  } else {
    that.setData({
      discount: money,
      discount_spot: null,
    })
  }
}


/*==================数据请求方法==================*/

// 创建裂变券
function get_fission(that) {
	var data = {};
	data['unionid'] = Currency.getUnionid();
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();
    data['active_id'] = that.data.active_id;

    Request.request_data(
      Server.GETFISSION(),
      data,
      function (res) {
          that.setData({
            show_loading_faill: true,
            coupon: res
          })
          if (res.coupon_info.discount_money) {
            discount_money(that, res.coupon_info.discount_money);
          }
      },
		 function (res) {
			 Currency.error(that, res);
      },
      function (res) {
        //关闭下拉动画
        wx.stopPullDownRefresh();
        //关闭加载中动画
			wx.hideLoading();
			Journal.myconsole("请求裂变券的数据：");
			Journal.myconsole(res);
      });
}

