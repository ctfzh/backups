// 授权组件

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

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  attached:function(){
    //小程序信息
    edition(this)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //授权信息
    authorize: function (e) {
      if (e.detail.userInfo) {
        wx.showLoading({
          title: '登录中...',
        })
        try {
          wx.setStorageSync('userInfo', e.detail.userInfo);
        } catch (e) {
        }
        Obtain_openid(this, this.data.code, e.detail.encryptedData, e.detail.iv);
      }
    },
  }

})

/******************************************普通方法***********************************************/

//微信登入
function get_app_code(that) {
      wx.login({
        success: function (log) {
          if (log.code) {
            Journal.myconsole("获取code" + log.code);
            that.setData({
              code: log.code,
              show_loading_faill: true,
            })
          } else {
            Journal.myconsole('获取用户登录状态失败！' + log.errMsg)
          }
        },
        fail: function () {
        },
      });
}

/******************************************接口数据调用方法******************************************/

// 获取版本信息
function edition(that) {
  //获取本版信息
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  //小程序版本openid区分 1 智慧门店，2 商城小程序, 3 餐饮版小程序
  data['type'] = '3';

  Request.request_data(
    Server.GET_EDITION(),
    data,
    function (res) {
        that.setData({
          logo: res.logo,
          xcx_name: res.xcx_name,
        })

		 //储存小程序名称
		 try {
			 wx.setStorageSync('xcx_name', res.xcx_name)
		 } catch (e) {
		 }
        get_app_code(that);
    },
    function (res) {
    },
    function (res) {
      //关闭加载中动画
       wx.hideLoading();
       Journal.myconsole("请求版本信息返回数据：")
       Journal.myconsole(res);
    })
}

//获取openid，unionid
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
        //判断openid是否为空
        if (res.openId) {
          Journal.myconsole(res)
          //储存openid，unionid
          try {
				 wx.setStorageSync('unionid', res.unionId)
				 wx.setStorageSync('openid', res.openId)
				 wx.setStorageSync('token', res.token)
          } catch (e) {
          }
          //授权成功页面回调
          that.triggerEvent('login');
         //  openid获取统计
          newmember(that);
        } else {
          wx.showToast({
            title: res ? res : '授权失败，请稍后重试！！！',
            icon: 'none',
            duration: 2000
          })
        }
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
        title: res ? res:'授权失败，请稍后重试！！！',
        icon: 'none',
        duration: 2000
      })
    },
    function (res) {
       //关闭加载中动画
       wx.hideLoading();
       Journal.myconsole("请求openid的返回数据：")
       Journal.myconsole(res);
    })
}


// openid获取统计
function newmember(that) {
   var data = {};
   data['mchid'] = Sign.getMchid();
   data['sign'] = Sign.sign();
   data['openid'] = Currency.getOpenid();
   data['channel'] = "1";

   Request.request_data(
      Server.NEWMEMBER(),
      data,
      function (res) {
      },
      function (res) {
      },
      function (res) {
         Journal.myconsole("openid获取统计返回数据")
         Journal.myconsole(res);
      })
}