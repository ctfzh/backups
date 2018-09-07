// 门店地图

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
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    if (options.lat && options.lat != "undefined" && options.lng && options.lng != "undefined" && options.function_type && options.function_type != "undefined") {
      this.setData({
        lat: options.lat,
        lng: options.lng,
        function_type: options.function_type,
      })
		// 使用 wx.createMapContext 获取 map 上下文
		this.mapCtx = wx.createMapContext('myMap')
      //初始化页面
      Retry(this);
    } else {
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        log: 0,
        error_text: "附近没有门店",
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
     this.setData({
        jump: false,
     })
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
  
  //登入完成回调
  login_success: function () {
     //浏览量统计
     Currency.visit(this);
     this.setData({
        login: false,
     })
     Retry(this);
  },
  
  //地图渲染完成
  updated: function(){
    this.mapCtx.moveToLocation();
  },
  //跳转详情
  jump_details: function(e){
     if (!this.data.jump) {
        this.setData({
           jump: true,
        })
        var store_id = e.markerId;
        wx.navigateTo({
           url: '/pages/commodity/goods?function_type=' + this.data.function_type + "&store_id=" + store_id,
        })
     }
  },
  //重试事件
  retry: function () {
    //初始化页面
    Retry(this);
  }
})

/******************************************普通方法******************************************/
// 页面初始化
function Retry(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
       if (Currency.getOpenid()) {
          //浏览量统计
          Currency.visit(that);
            //门店列表
            store_list(that);
      } else {
        //关闭加载中动画
        wx.hideLoading();
        wx.stopPullDownRefresh();
        that.setData({
          login: true,
        })
      }
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        error_text: "商户不存在",
      })
    },
  )
}


//门店列表
function store_list(that) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['lng'] = that.data.lng;
  data['lat'] = that.data.lat;
  data['type'] = that.data.function_type;

  Request.request_data(
    Server.STORE_LIST(),
    data,
    function (res) {
      if (res) {
        if(res.data.length>0){
          var markers = [];
          for (var i=0; i<res.data.length; i++){
            var map_item = new Person( res.data[i].store_id, res.data[i].lat, res.data[i].lng);
            markers.push(map_item);
          }
          that.setData({
            markers: markers,
          })
        }
        that.setData({
          show: true,
        })
      } else {
        that.setData({
          show: false,
          retry_an: 0,
          error: 1,
          error_text: '附近没有门店',
        })
      }
    },
    function (res) {
      that.setData({
        show: false,
        retry_an: 1,
        error: 0,
        error_text: res,
      })
    },
    function (res) {
      //关闭加载中动画
      wx.hideLoading();
      Journal.myconsole("门店列表请求数据：")
      Journal.myconsole(res);
    })
}


function Person(id, latitude, longitude) {
   this.iconPath = "/pages/img/income/add_map.png";
   this.width = 40;
   this.height = 40;
   this.id = id;
  this.latitude = latitude;
  this.longitude = longitude;
}