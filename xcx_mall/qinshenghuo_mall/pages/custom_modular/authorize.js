// 引用日志输出
var MyUtils = require('../base/utils/utils.js');
//引入签名加密商户号
var MySign = require('../base/utils/sign.js');
//网络请求
var MyRequest = require('../base/utils/request_management.js');
//数据接口地址
var MyHttp = require('../base/utils/httpurl.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
//base64编码解析
var base64 = require('../base/utils/base64.js')

//登入授权
Component({
	externalClasses: ['class_aut'],
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
   attached: function () {
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
            Obtain_openid(this, this.data.code, e.detail.encryptedData, e.detail.iv, e.detail.userInfo);
         }
      },
		//重试事件
		retry_onclick: function () {
			var that = this;
			//加载中动画
			wx.showLoading({
				title: '加载中',
			})
			//授权成功页面回调
			that.triggerEvent('login');

			setTimeout(function () {
				//小程序信息
				edition(that)
			}, 500);
		},
   }
})

/*******************************普通调用方法*******************************/

//微信登入
function get_app_code(that) {
   wx.login({
      success: function (log) {
         if (log.code) {
            MyUtils.myconsole("code:" + log.code)
            that.setData({
               code: log.code,
            })
         }
      },
      fail: function () {
      }
   });
}

/*******************************接口数据调用方法*******************************/

// 获取版本信息
function edition(that) {
   //获取本版信息
   var data = {};
   data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	data['type'] = '2';

   MyRequest.request_data(
      MyHttp.GET_EDITION(),
      data,
      function (res) {
         if (res) {
            that.setData({
               logo: res.logo,
					xcx_name: res.xcx_name,
					show_loading_faill: true,
            })
            get_app_code(that);
         }
      },
      function (res) {
			Extension.error(that, res);
      },
      function (res) {
         //关闭加载中动画
         wx.hideLoading();
			MyUtils.myconsole("请求小程序信息的数据：");
         MyUtils.myconsole(res);
      })
}

//获取openid，unionid
function Obtain_openid(that, code, encrypted_data, iv, userlnfo) {

   var data = {};
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
   data['js_code'] = code;
   data['encrypted_data'] = encrypted_data;
   data['iv'] = iv;
	//小程序版本openid区分 1 智慧门店，2 商城小程序
	data['type'] = '2';

   MyRequest.request_data(
      MyHttp.OPENID(),
      data,
      function (res) {
         var res = JSON.parse(res);
            //判断openid是否为空
				if (res.openId) {
					//关闭加载中动画
					wx.hideLoading();
               //储存openid，unionid
               try {
                  wx.setStorageSync('unionid', res.unionId);
						wx.setStorageSync('openid', res.openId);
						wx.setStorageSync('userlnfo', userlnfo);
						wx.setStorageSync('token', res.token);
						wx.setStorageSync('login', 'true');
						//授权成功页面回调
						that.triggerEvent('login');
               } catch (e) {
               }
            } else {
               wx.showToast({
                  title: '授权失败，请稍后重试',
                  icon: 'none',
                  duration: 2000
               })
            }
      },
      function (res) {
         wx.showToast({
				title: '授权失败，请稍后重试',
            icon: 'none',
            duration: 2000
         })
      },
		function (res) {
			//关闭加载中动画
			setTimeout(function () {
				wx.hideLoading()
			}, 1000)
         MyUtils.myconsole("请求openid返回的数据：")
         MyUtils.myconsole(res);
      })

}
