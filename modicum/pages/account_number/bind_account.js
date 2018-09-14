// 绑定手机号

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

Page({

  /**
   * 页面的初始数据
   */
  data: {
  //默认显示
    an_item: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     wx.login({
        success: function (res) {
           that.setData({
                 code: res.code,
              })
              Journal.myconsole("获取code" + res.code);
        }
     });
     wx.hideShareMenu();
    Retry(this);
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
  //切换
  top_an: function(e) {
    var an_item = e.currentTarget.dataset.an_item;
    this.setData({
      an_item: an_item,
    })
  },

	//授权信息
	authorize: function (e) {
		wx.showLoading({
			title: '授权中...',
		})
		if (e.detail.encryptedData) {
			Obtain_openid(this, this.data.code, e.detail.encryptedData, e.detail.iv);
		} else {
			var title = e.detail.errMsg;
			if (e.detail.errMsg == "getPhoneNumber:fail user deny" || e.detail.errMsg == "getPhoneNumber:fail:cancel to confirm login") {
				title = "已拒绝授权"
			} else if (e.detail.errMsg == "getPhoneNumber:fail 该 appid 没有权限" || e.detail.errMsg == "getPhoneNumber:fail:access denied") {
				title = "小程序没有获取手机号的权限"
			}
			wx.showToast({
				title: title ? title : '授权失败，请稍后重试！！！',
				icon: 'none',
				duration: 4000
			})
		}
	},
  
  //登入完成回调
  login_success: function () {
     //浏览量统计
     Currency.visit(this);
    this.setData({
      login: false,
    })
  },
  //手机号
  code_phone: function (event) {
    var phone = event.detail.value;
    this.setData({
      phone: phone,
    })
  },
  //验证码输入
  code: function (event){
    var code = event.detail.value;
    this.setData({
      code: code,
    })
  },
  //获取验证码
  get_code: function () {
    var phone = this.data.phone;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    } else {
      code(this, this.data.phone);
    }
  },
  //确认登录
  confirm: function () {
    var phone = this.data.phone;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (this.data.code && this.data.code.length ==6){
        phone_code(this, this.data.phone);
      }else{
        wx.showToast({
          title: '验证码输入错误',
          icon: 'none',
          duration: 2000
        })
      }
    }  
  },
  //重试事件
  retry: function () {
    //初始化页面
    Retry(this);
  }
})

/******************************************普通方法***********************************************/

// 页面初始化
function Retry(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      if (!Currency.getOpenid()) {
        that.setData({
          login: true,
        })
      }
      that.setData({
        show: true,
      })
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
//验证码倒计时
function tiem(that){
  var second = that.data.second;
  second--;
  that.setData({
    second: second,
  })
  if (second>0){
    setTimeout(function () {
      tiem(that)
    }, 1000);
  }
}
/******************************************接口数据调用方法******************************************/


//微信获取手机号
function Obtain_openid(that, code, encrypted_data, iv) {

  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['js_code'] = code;
  data['encrypted_data'] = encrypted_data;
  data['iv'] = iv;
  //小程序版本openid区分 1 智慧门店，2 商城小程序, 3 餐饮版小程序
  data['type'] = '3';

  Request.request_data(
    Server.OPENID(),
    data,
    function (res) {
      var res = JSON.parse(res);
      if (res) {
        //微信手机号授权
        phone_register(that, res.phoneNumber);
      } else {
        wx.showToast({
          title: res ? res : '授权失败，请稍后重试！！！',
          icon: 'none',
          duration: 2000
        })
      }
    },
    function (res) {
      wx.showToast({
        title: res ? res : '授权失败，请稍后重试！！！',
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
      //关闭加载中动画
      setTimeout(function () { 			 wx.hideLoading() 		 }, 2000)
      Journal.myconsole("验证码请求数据：")
      Journal.myconsole(res);
    })
}



//微信手机号授权
function phone_register(that, phone_num) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['phone'] = phone_num;
  data['openid'] = Currency.getOpenid();
  if (Currency.getUnionid()){
    data['unionid'] = Currency.getUnionid();
  }
  if (Currency.getuserInfo().nickName) {
    //用户昵称
    data['nickname'] = Currency.getuserInfo().nickName;
  }
  if (Currency.getuserInfo().avatarUrl) {
    //头像
    data['headimgurl'] = Currency.getuserInfo().avatarUrl;
  }
  if (Currency.getuserInfo().gender) {
    //性别
    data['sex'] = Currency.getuserInfo().gender;
  }

  Request.request_data(
    Server.PHONE_REGISTER(),
    data,
    function (res) {
      if (res) {
        //储存token
        try {
          wx.setStorageSync('token', res.token)
        } catch (e) {
        }
        wx.navigateBack({
          delta: '1',
        })
        // wx.showToast({
        //   title: '授权成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      } else {
        //关闭加载中动画
		  wx.hideLoading();
        wx.showToast({
          title: res ? res : '授权失败，请稍后重试！！！',
          icon: 'none',
          duration: 2000
        })
      }
    },
    function (res) {
		 //关闭加载中动画
		 wx.hideLoading();
      wx.showToast({
        title: res ? res : '授权失败，请稍后重试！！！',
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
      Journal.myconsole("微信授权请求数据：")
      Journal.myconsole(res);
    })
}

//手机号验证码
function code(that, phone) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['phone'] = phone;

  Request.request_data(
    Server.GET_CODE(),
    data,
    function (res) {
      var second = 60;
      that.setData({
        second: second,
      })
      var second = 60;
      that.setData({
        second: second,
      })
      //验证码倒计时
      tiem(that);
        wx.showToast({
          title: '已发送',
          icon: 'success',
          duration: 2000
        })
    },
    function (res) {
		 //关闭加载中动画
		 wx.hideLoading();
      wx.showToast({
        title: res ? res : '发送失败，请重试！！！',
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
      Journal.myconsole("验证码请求的数据：")
      Journal.myconsole(res);
    })
}

//手机号授权登入
function phone_code(that, phone) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['phone'] = phone;
  data['openid'] = Currency.getOpenid();
  data['code'] = that.data.code;
  if (Currency.getUnionid()) {
    data['unionid'] = Currency.getUnionid();
  }
  if (Currency.getuserInfo().nickName) {
    //用户昵称
    data['nickname'] = Currency.getuserInfo().nickName;
  }
  if (Currency.getuserInfo().avatarUrl) {
    //头像
    data['headimgurl'] = Currency.getuserInfo().avatarUrl;
  }
  if (Currency.getuserInfo().gender) {
    //性别
    data['sex'] = Currency.getuserInfo().gender;
  }

  Request.request_data(
    Server.PHONE_CODE(),
    data,
    function (res) {
      if (res) {
        //储存token
        try {
          wx.setStorageSync('token', res.token)
        } catch (e) {
        }
        wx.navigateBack({
          delta: '1',
        })
      } else {
        //关闭加载中动画
		  wx.hideLoading();
        wx.showToast({
          title: res ? res : '授权失败，请稍后重试！！！',
          icon: 'none',
          duration: 2000
        })
      }
    },
    function (res) {
		 //关闭加载中动画
		 wx.hideLoading();
      wx.showToast({
        title: res ? res : '授权失败，请稍后重试！！！',
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
      Journal.myconsole("手机号请求的数据：")
      Journal.myconsole(res);
    })
}
