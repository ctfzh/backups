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

//优惠券领取JS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
    //更多门店
    see_more: true,
    //防止按钮多次触发
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //优惠券id
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
		 var coupon_id = scene;
	 } else if (options.coupon_id && options.coupon_id != 'undefined') {
		 var coupon_id = options.coupon_id;
    }
	  if (coupon_id){
		  this.setData({
			  coupon_id: coupon_id
		  })
		  //页面初始化加载
		  Refresh(this)
	 }else{
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
    //页面初始化加载
    Refresh(this)
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
    var share_text = this.data.coupon.share_text;
    var share_img = this.data.coupon.share_img;
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
  //查看更多优惠
  more_favorable: function () {
    wx.switchTab({
      url: '../discount/discount',
    })
  },
  //返回首页
  coupon_home: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },
  //查看更多门店
  see_more : function(){
    this.setData({
      see_more: this.data.see_more ? false : true,
    })
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
  // 领取优惠券
  coupon_receive: function (e) {
    var card_id = e.currentTarget.dataset.coupon.card_id;
    Currency.receive(this, card_id, false);
  },
  // 拨打电话
  call: function (e) {
    // 获取自定义参数（页面元素自定义参数）
    var phone = e.currentTarget.dataset.call;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  },
  //查看门店地址
  address: function (e) {
    // 门店经度
    var lng = e.currentTarget.dataset.store.lng;
    // 门店维度
    var lat = e.currentTarget.dataset.store.lat;
    //名称
    var name = e.currentTarget.dataset.store.name;
    //详细地址
    var address = e.currentTarget.dataset.store.address;
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      name: name,
      address: address,
      scale: 28
    })
  },
  //领取优惠券刷新
  refresh: function () {
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

       //获取经纬度
       wx.getLocation({
          type: 'wgs84',
          success: function (res) {
             that.setData({
                lng: res.longitude,
                lat: res.latitude,
             })
             //门店详情
             get_switchstore(that);
          },
          fail: function (res) {
             Currency.show_top_msg(that, '定位失败');
          },
          complete: function () {
				 //验证登入
				 var openid = Currency.getOpenid();
				 if (!openid) {
                that.setData({
                   login: true,
                })
             } else {
                //页面浏览统计
                Currency.visit(this, 4);
                that.setData({
                   login: false,
                })
             }
          }
       })
       get_coupon(that);
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}

//小数分离
function discount_money(that, money){
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
//优惠券详情
function get_coupon(that) {
  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['coupon_id'] = that.data.coupon_id;

  Request.request_data(
    Server.COUPONDETAIL(),
    data,
    function (res) {
        that.setData({
          show_loading_faill: true,
          coupon: res
        })
        if (res.reduce_cost) {
          discount_money(that, res.reduce_cost);
        }
        if (res.discount) {
          discount_money(that, res.discount);
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
		 Journal.myconsole("请求优惠券的数据：");
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
      if (res && res.length > 0) {
        that.setData({
          store_data: res,
        })
      }
    },
    function (res) {
    },
	  function (res) {
		  Journal.myconsole("请求门店列表的数据：");
		  Journal.myconsole(res);
    });
}