// 用户中心

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
  // 收货地址
   address_get: function(){
     wx.navigateTo({
       url: '/pages/address/receiving_address'
     })
   },
  //  使用须知
   handbook:function(){
     wx.navigateTo({
       url: '/pages/user/handbook',
     })
   },
   //重试事件
   retry: function () {
     //初始化页面
     Refresh(this);
   },
	//去登入
   no_entry_an: function(){
     Currency.log_in();
   }
})






/*********************普通方法*************************/ 
//刷新页面
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      // 获取会员信息
      getMemberInformation(that);
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


/********************数据请求方法************************/ 


//获取会员信息
function getMemberInformation(that) {
  var token = Sign.getToken();
  if (token) {
    var data = {};
    data['token'] = token;
    data['url'] = 'www.qinguanjia.com';
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign(data);
    Request.request_data(
      Server.USER_HOME(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        if (res) {
          that.setData({
            no_entry: false,
            show: true,
            data: res,
            avatar: res.upload + res.avatar,
          })
        } else {
          that.setData({
            show: false,
            error: 1,
            retry_an: 1,
            log: 0,
            retry_an: 0,
            error_text: "账号不存在",
          })
        }
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          error: 0,
          log: 0,
          error_text: res,
        })
      }, function (res) {
        //关闭下拉动画
        wx.stopPullDownRefresh();
        //关闭加载中动画
        wx.hideLoading();
        Journal.myconsole("会员中心请求数据");
        Journal.myconsole(res);
      })
  }else{
    that.setData({
      show: true,
      no_entry: true,
    })
  }

}