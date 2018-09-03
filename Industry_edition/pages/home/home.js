// 首页

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
//base64编码解析
var base64 = require('../JS/tool/base64.js');

Page({

   /**
    * 页面的初始数据
    */
   data: {
      //显示得当前所在得滑动滑动快下标
      current: 0,
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
      //初始化页面
      Retry(this);
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {

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
   //轮播图的切换事件  
   swiperChange: function(e) {
      this.setData({
         current: e.detail.current,
      })
   },
   //登入完成回调
   login_success: function() {
      //浏览量统计
      Currency.visit(this);
      this.setData({
         login: false,
      })
   },

   //点餐 1，点餐； 2，外卖
   order: function(e) {
      var function_type = e.currentTarget.dataset.type;
      if (function_type == 1 && this.data.merchant.order_model == 2) {
			//扫一扫
			scan(this);
      } else {
         wx.navigateTo({
            url: '/pages/store/store_selection?function_type=' + function_type,
         })
      }
   },
   //重试事件
   retry: function() {
      //初始化页面
      Retry(this);
   }

})


/******************************************普通方法******************************************/
// 页面初始化
function Retry(that) {
   //获取商户号
   Sign.getExtMchid(
      function() {
         if (!Currency.getOpenid()) {
            that.setData({
               login: true,
            })
         } else {
            //浏览量统计
            Currency.visit(that);
         }
         //首页接口
         getHome(that);
         // 点餐设置
         merchant(that);
      },
      function() {
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

// 弹框
function show(that){
	wx.showModal({
		title: '提示',
		content: '找不到餐桌信息，请联系商家',
		confirmText: '去扫码',
		success: function (res) {
			if (res.confirm) {
				scan(that);
			} else if (res.cancel) {
				console.log('用户点击取消')
			}
		}
	})
}

//扫一扫
function scan(that){
	// 只允许从相机扫码
	wx.scanCode({
		onlyFromCamera: true,
		success: (res) => {
			if (res.path) {
				var url = res.path; //获取url中"?"符后的字串   
				if (url.indexOf("=") != -1) {
					var strs = url.split("=");
					var id = strs[1];
					// 校验桌台id
					check_valid(that, id);
				}
			}else{
				show(that);
			}
		}
	})
}

/*************************获取数据方法*******************************/
//获取首页数据
function getHome(that) {
   let data = {};
   //接口必传
   data['mchid'] = Sign.getMchid();
   //接口必传
   data['sign'] = Sign.sign();
   Request.request_data(
      Server.GETHOME(),
      data,
      function(res) {
         if (res) {
            try {
               var xcx_name = wx.getStorageSync('xcx_name')
               if (xcx_name) {
                  //页面名称
                  wx.setNavigationBarTitle({
                     title: xcx_name
                  })
               }
            } catch (e) {}
            that.setData({
               show: true,
               imgUrls: res
            });
         } else {
            that.setData({
               show: false,
               retry_an: 0,
               error: 1,
               error_text: "商户首页不存在",
            })
         }
      },
      function(res) {
         that.setData({
            show: false,
            retry_an: 1,
            error: 0,
            error_text: res,
         })
      },
      function(res) {
         Journal.myconsole('商户首页请求的数据');
         Journal.myconsole(res);
      });
}


//点餐设置
function merchant(that) {
   let data = {};
   data['mchid'] = Sign.getMchid();
   data['sign'] = Sign.sign();
   Request.request_data(
      Server.GETMERCHANTSET(),
      data,
      function(res) {
         that.setData({
            merchant: res,
         })
      },
      function(res) {
         that.setData({
            show: false,
            retry_an: 1,
            error: 0,
            error_text: res,
         })
      },
      function(res) {
         Journal.myconsole('点餐设置请求的数据');
         Journal.myconsole(res);
      });
}



//校验桌台id
function check_valid(that, id) {
	let data = {};
	data['mchid'] = Sign.getMchid();
	data['sign'] = Sign.sign();
	data['table_id'] = id;
	Request.request_data(
		Server.CHRCK_VALID(),
		data,
		function (res) {
			//移除购物车 选择时间
			try {
				wx.removeStorageSync('buy_goods_list')
				wx.removeStorageSync('time')
			} catch (e) {
			}
			wx.navigateTo({
				url: '/pages/commodity/goods?function_type=1' + "&store_id=" + res.store_id + "&table_id=" + id,
			})
		},
		function (res) {
			show(that);
		},
		function (res) {
			Journal.myconsole('校验桌台id请求的数据');
			Journal.myconsole(res);
		});
}
