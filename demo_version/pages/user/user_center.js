// 我的页面JS

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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_loading_faill: false,
    //防止按钮多次触发
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    // //加载中动画
    // wx.showLoading({
    //   title: '加载中',
    // })
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
    //初始化加载页面
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

  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    });
    // 初始化页面
    Refresh(this);
  },

  // 跳转到我的储值
  jump_recharge_activity: function () {
    wx.navigateTo({
      url: '/pages/recharge_activity/recharge_activity'
    })
  },
  // 跳转到消费记录
  jump_consume_record: function () {
    wx.navigateTo({
      url: '/pages/user/consume_record'
    })
  },
  // 跳转到优惠券列表页
  jump_coupon: function(){
    wx.navigateTo({
      url: '/pages/user/coupon_list'
    })
  },
  // 跳转到个人信息页
  jump_personal: function () {
    wx.navigateTo({
      url: '/pages/user/personal_info'
    })
  },
  //跳转到储值码兑换页
  jump_code: function(){
    wx.navigateTo({
      url: '/pages/recharge_code/recharge_code'
    })
  },
  jump_service: function(){
     wx.navigateTo({
        url: '/pages/user/service'
     })
  },
  //列表跳转
  jump_appointmenl: function () {
     wx.navigateTo({
        url: '/pages/appointment/my_reservation',
     })
  },
  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    Refresh(this);
  },
  //查看会员卡
  see_membership: function (e) {
    var that = this;
    if (that.data.disabled) {
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
        complete: function () {
          //激活点击事件
          that.setData({
            disabled: true,
          })
        }
      })
    }
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

//刷新页面
function Refresh(that){
  Sign.getExtMchid(
     function () {
		  //验证登入
		  var openid = Currency.getOpenid();
		  if (!openid) {
           that.setData({
              login: true,
           })
		  } else {
			  var token = Sign.getToken();

			  //页面浏览统计
			  Currency.visit(that, 4);
			  that.setData({
				  login: false,
				  token: token,
			  }) 
			  if (token) {
				  //获取余额明细数据
				  getMemberInformation(that);
			  } else {
				  Currency.on_skip(that, function (that) { 
					  that.setData({
						  token: Sign.getToken(),
					  })
					  getMemberInformation(that); 
				  },1);
			  }
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}

/***************************接口调用***************************/
 //获取会员信息
function getMemberInformation(that) {
  var token = Sign.getToken();
  var data = {};
	data['token'] = token;
	data['unionid'] = Currency.getUnionid();
  data['url'] = 'www.qinguanjia.com';
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign(data);
  Request.request_data(
    Server.USER_HOME(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show_loading_faill: true,
          data: res,
          avatar: res.upload + res.avatar,
        })
      } else {
			Currency.custom_error(that, '3', '会员信息不存在');
      }
    },
	  function (res) {
		  Currency.error(that, res);
    },function(res){
      //关闭下拉动画
      wx.stopPullDownRefresh();
      //关闭加载中动画
		  wx.hideLoading();
		  Journal.myconsole("请求会员信息的数据：")
		  Journal.myconsole(res);
    })

}