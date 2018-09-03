// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');
// pages/Internet_business/branch.js
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
    this.setData({
      ...options
    })
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

  search_input:function(e){
    const keyword = e.detail.value;
    this.setData({
      keyword
    })
    mybankSubbank(this);
  },

  // 选择事件
  handleSelect: function (e) {
    const { branch_value } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.setData({      
      contact_line: branch_value.post_value,
      branch_name: branch_value.name,
      contact_line_value: branch_value.code
    });
    wx.navigateBack({
      delta: 1
    })
  }
})

/***********************普通方法************************* */
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      mybankSubbank(that)
    },
    function () {
    },
  )
}


/***************************接口方法************************* */

function mybankSubbank(that) {
  let data = {};
  const { bank_id, branch_province_code, branch_city_code, keyword} = that.data;
  data['bank_id'] = bank_id;
  data['province'] = branch_province_code;
  data['city'] = branch_city_code;
  if (keyword){
    data['keyword'] = keyword;
  }
  Request.request_data(
    Server.MYBANK_SUBBANK(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        branchList:res
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