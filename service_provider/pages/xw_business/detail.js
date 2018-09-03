// pages/xw_business/detail.js
// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');
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
    this.setData(options);
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

  jump_store_pic:function(){
    const {
      door_media_id,
      door_photo_url,
      door_photo,
      environment_media_id,
      environmental_photo_url,
      environmental_photo
    } = this.data;
    const obj = {
      door_media_id,
      door_photo_url,
      door_photo,
      environment_media_id,
      environmental_photo_url,
      environmental_photo
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/store_pic_detail?' + objStr;
    wx.navigateTo({
      url
    })
  },

  jump_director_info:function(){
    const {
      card_front_url,
      card_front,
      card_front_media_id,
      card_reverse_url,
      card_reverse,
      card_reverse_media_id,
      principal,
      card_id,
      card_validity_start_time,
      card_validity_type,
      card_validity_end_time
    } = this.data;
    const obj = {
      card_front_url,
      card_front,
      card_front_media_id,
      card_reverse_url,
      card_reverse,
      card_reverse_media_id,
      principal,
      card_id,
      card_validity_start_time,
      card_validity_type,
      card_validity_end_time
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/director_info_detail?' + objStr;
    wx.navigateTo({
      url
    })
  },

  jump_account:function(){
    const {
      principal,
      bank_card_number,
      bank_name,
      bank_id,
      bank_province_name,
      bank_city_name,
      bank_city_code,
      bank_province_code,
      branch_bank_name,
      branch_bank_id
    } = this.data;
    const obj = {
      principal,
      bank_card_number,
      bank_name,
      bank_id,
      bank_province_name,
      bank_city_name,
      bank_city_code,
      bank_province_code,
      branch_bank_name,
      branch_bank_id
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/account_detail?' + objStr;
    wx.navigateTo({
      url
    })
  }
})

// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      marchantDetail(that);
    },
    function () { },
  )
}

// 小微商户详情接口
function marchantDetail(that) {
  let data = {};
  const { merchant_id } = that.data;
  const token = wx.getStorageSync('token');
  data['merchant_id'] = merchant_id;
  data['token'] = token;
  Request.request_data(
    Server.XW_MERCHANT_DETAIL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData(res);
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}