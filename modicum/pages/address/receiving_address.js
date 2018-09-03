// 收货地址列表

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
    if (options.lng && options.lng != "undefined" && options.lat && options.lat != "undefined" && options.store_id && options.store_id != "undefined") {
      this.setData({
        lng: options.lng,
        lat: options.lat,
        store_id: options.store_id,
      });
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
    //初始化页面
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
    //初始化页面
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
  
  // 新增地址
  add_address: function () {
    wx.navigateTo({
      url: '/pages/address/new_address',
    })
  },
  //编辑收货地址
  edit: function (event) {
    var addressId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/new_address?addressId=' + addressId,
    })
  },
  //切换收货地址
  switch_address: function (event){
    var address_id = event.currentTarget.dataset.address_id;
    //储存收货地址id
    try {
      wx.setStorageSync('address_id', address_id)
    } catch (e) {
    }
    wx.navigateBack({
      delta: 1
    })
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})


/*****************普通方法***********************/

//刷新页面
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      // 获取地址列表
      getAddressList(that);
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        log: 0,
        error_text: "商户不存在",
      })
    },
  )
}




/*************** 数据请求方法****************/
// 获取地址列表
function getAddressList(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data["token"] = token;
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign(data);
    if (that.data.store_id) {
      data['store_id'] = that.data.store_id;
      data['lng'] = that.data.lng;
      data['lat'] = that.data.lat;
    }
    Request.request_data(
      Server.ADDADDRESSLIST(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        that.setData({
          show: true,
          infoList: res
        });
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          log: 0,
          error: 0,
          error_text: res,
        });
      },
      function (res) {
        //关闭加载中动画
        wx.hideLoading();
        wx.stopPullDownRefresh();
        Journal.myconsole("地址列表请求信息")
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      error: 1,
      log: 1,
      retry_an: 0,
      error_text: "绑定手机号",
    })
  }
}
