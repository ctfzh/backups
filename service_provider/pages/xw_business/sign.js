// pages/xw_business/sign.js
// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');
// 引入时间格式化
var Util = require('../../utils/util.js');
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
    // 如果回调函数返回成功就已经清除过Timer
    if (this.data.Timer) {
      deleteTimer(this);
    }
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

  handleJump:function(){
    wx.navigateTo({
      url: '/pages/xw_business/detail?merchant_id=' + this.data.merchant_id
    })
  }
})

/***********************普通方法*************************************/
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      getDetail(that);
      const time = Util.formatTime(new Date());
      let Timer = setInterval(function () {
        queryState(that);
      }, 1000);
      that.setData({
        Timer
      })
    },
    function () { },
  )
}

// 删除计时器
function deleteTimer(that) {
  clearInterval(that.data.Timer);
}

/************************接口方法******************************** */
// 获取二维码  接口
function getQrCode(that) {
  let data = {};
  Request.request_data(
    Server.GET_CONTRACT_QR_CODE(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      this.setData(res)
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取详情 接口
function getDetail(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  data['token'] = token;
  data['business_code'] = that.data.business_code;
  Request.request_data(
    Server.QUERY_STATE(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        ...res
      })
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取状态  接口
function queryState(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  data['token'] = token;
  data['business_code'] = that.data.business_code;
  Request.request_data(
    Server.QUERY_STATE(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        state:res.state
      })
      if(that.data.state == 4){
        clearInterval(that.data.Timer);
        wx.navigateBack({
          delta:1
        })
      }
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}