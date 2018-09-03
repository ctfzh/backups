// pages/xw_business/account.js

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
    multiArray: [],
    multiIndex: [0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData(options);
    }
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

  jump_bank:function(){
    const url = '/pages/xw_business/bank';
    wx.navigateTo({
      url
    })
  },

  jump_branch:function(){
    const url = '/pages/xw_business/branch';
    wx.navigateTo({
      url
    })
  },

  bindRegionChange:function(){
    const {
      multiArray,
      multiIndex
    } = this.data;
    const bank_province = multiArray[0][multiIndex[0]];
    const bank_city = multiArray[1][multiIndex[1]];
    this.setData({
      bank_province_name: bank_province.name,
      bank_city_name: bank_city.name,
      bank_city_code: bank_city.code,
      bank_province_code: bank_province.code,
    })
  },

  bindRegionColumnChange:function(e){
    let _that = this;
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0){
      getSubArea(this,function(res){
        data.multiArray[1] = res;
        _that.setData(data)
      }, data.multiArray[0][data.multiIndex[0]].code)
    } else if (e.detail.column == 1){
      _that.setData(data)
    };
    
  },

  handlePrincipalChange:function(e){
    this.setData({
      principal:e.detail.value
    })
  },

  handleCardChange:function(e){
    this.setData({
      bank_card_number:e.detail.value
    })
  },

  handleSubmit:function(){
    const {
      // principal, 
      bank_card_number, 
      bank_name, 
      bank_city_name, 
      bank_province_code, 
      bank_city_code, 
      branch_bank_name, 
      branch_bank_id,
      bank_id
    } = this.data;
    const pages = getCurrentPages();
    const prepage = pages[pages.length - 2];
    prepage.setData({
      // principal,
      bank_card_number,
      bank_name,
      bank_city_name,
      bank_province_code,
      bank_city_code,
      branch_bank_name,
      branch_bank_id,
      bank_id
    });
    wx.navigateBack({
      delta:1
    })
  }
})

/**********************普通方法**********************************/
function Refresh(that) {
  let _that = that;
  //获取商户号
  Sign.getExtMchid(
    function () {
      getProvince(that, function (res) {
        let { multiArray } = that.data;
        multiArray[0] = res
        that.setData({
          multiArray
        })
        getSubArea(_that, function (res) {
          let { multiArray } = that.data;
          multiArray[1] = res
          that.setData({
            multiArray
          })
        }, multiArray[0][0].code)
      })
    },
    function () {
    },
  )
}

/***************************接口方法************************* */

// 获取省  接口
function getProvince(that, success) {
  let data = {};
  Request.request_data(
    Server.GET_PROVINCE(),
    data,
    function (res) {
      success(res);
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取市区 接口
function getSubArea(that, success, code) {
  let data = {};
  code && (data['area_parent_code'] = code);
  Request.request_data(
    Server.GET_SUB_AREA(),
    data,
    function (res) {
      success(res);
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}