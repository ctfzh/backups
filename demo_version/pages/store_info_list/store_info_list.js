// 门店列表JS

//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
// 引用日志输出
var Journal = require('../tool/journal.js')
//引入签名加密商户号
var Sign = require('../tool/sign.js')
//全局通用js
var Currency = require('../tool/currency.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    // 经度，纬度
    if (options.lng && options.lat) {
      this.setData({
        lng: options.lng,
        lat: options.lat,
      })
    }

    // 初始化页面
    Refresh(this);
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
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })

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

  //首页跳转
  home_url: function(e){
    var data = e.currentTarget.dataset.data
    wx.showModal({
      title: '',
      content: '是否切换门店到 ' + data.name,
      success: function (res) {
        //缓存门店id
        try {
          wx.setStorageSync('store_id', data.id);
          wx.setStorageSync('switch_store', true);
        } catch (e) {
        }
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/home/home'
          })
          //确定
        } else if (res.cancel) {
          //取消
        }
      }
    })
  },
  //登入完成回调
  login_success: function () {
     Refresh(this);
  },
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
            Currency.visit(that, 4)
            that.setData({
               login: false,
            })
         }
         // 经度，纬度
         if (that.data.lng && that.data.lat) {
            get_storelist(that, that.data.lat, that.data.lng);
         } else {
            get_storelist(that);
         }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}

/*==================数据请求方法==================*/

// 获取门店数据
function get_storelist(that, lat, lng) {

  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  //纬度，经度
  if (lat && lng) {
    data['lat'] = lat;
    data['lng'] = lng;
  }

  Request.request_data(
    Server.GETSTORELIST(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show_loading_faill: true,
          content:res.list
        })
      } else {
			Currency.custom_error(that, '3', '门店信息不存在', '', '2');
      }
    },
	  function (res) {
		  Currency.error(that, res);
    },
	  function (res) {
      //关闭加载中动画
		 wx.hideLoading()
		 Journal.myconsole("获取到的门店列表数据：")
		 Journal.myconsole(res);
    })

}


