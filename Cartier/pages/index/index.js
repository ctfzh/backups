// 引入js
var md5 = require('../JS/md5.js');
// 登录
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
    wx.setNavigationBarTitle({
      title: '登录'
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

  //输入账号
  account_number: function (event) {
    var account_number = event.detail.value;
    this.setData({
      account_number: account_number,
    })
  },

  //输入密码
  password: function (event) {
    var password = event.detail.value;
    this.setData({
      password: password,
    })
  },

  //登录
  sign_an: function () {
    if (!this.data.account_number) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration: 1000
      })
    } else if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1000
      })
    } else {
      // wx.showLoading({
      //   title: '登录中',
      // })
      //登录接口
      get_login(this);
    }
  }
})


//登入接口
function get_login(that){
  var data = {};
  data['account'] = that.data.account_number;
  data['pwd'] = that.data.password;
  // console.log(data);
  //数据请求
  wx.request({
    url: 'http://cartier.qinxiangyun.com/api/home/login',
    method: 'GET',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      // console.log(res.data);
      if (res.data.errCode == 0) {
        // console.log(res.data.data);
        //缓存登入令牌，拍照位名称
        try {
          wx.setStorageSync('token', res.data.data.token);
          wx.setStorageSync('seat_name', res.data.data.seat_name);
          //跳转人员列表
          wx.reLaunch({
            url: '../staff/employee_list',
          })
        } catch (e) {
        }

      } else {
        wx.showToast({
          title: res.data.errMsg ? res.data.errMsg : "网络连接错误，请稍后重试",
          icon: 'none',
          duration: 1000
        })
      }
    },
    fail: function (res) {
      wx.showToast({
        title: "网络连接错误，请稍后重试",
        icon: 'none',
        duration: 1000
      })
    },
    complete: function(){

    }
  })
}