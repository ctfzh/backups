//数据接口地址
var Server = require('../request/server_address.js');
//全局通用js
var Currency = require('../tool/currency.js');

//异业联盟券
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
    var that = this;
    var url = 'https://uapi.qinguanjia.com/coupon/get-coupon?code=' + options.code + '&mchid=' + options.mchid;
    //获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        if (res.longitude && res.latitude){
          url = url + '&lng=' + res.longitude + '&lat=' + res.latitude;
        }
      },
      fail: function (res) {
        Currency.show_top_msg(that, '获取地理位置失败');
      }, 
      complete: function(){
        that.setData({
          url: url
        })
      }
    })

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
    //页面浏览统计
    Currency.visit(this, 4);
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
  
  }
})