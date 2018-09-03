// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

// pages/Internet_business/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  // swiper切换
  swiper_current:function(e){
    const {current} = e.currentTarget.dataset;
    this.setData({
      current
    })
  },

  // 滑动切换
  change: function (e) {
    const { current } = e.detail;
    this.setData({
      current
    });
    Refresh(this);
  },

  // 添加商户按钮 点击事件
  jump_add:function(){
    wx.navigateTo({
      url: '/pages/Internet_business/register?sign=网商间连',
    })
  },

  // 跳入网商入驻页
  jump_detail:function(e){
    const { out_merchant_id, status_str} = e.currentTarget.dataset;
    if (status_str == '驳回'){
      wx.navigateTo({
        url: '/pages/Internet_business/register?out_merchant_id=' + out_merchant_id + '&sign=网商间连'
      })
    }
  },

  // 跳入蓝海报名页面
  jump_lanhai: function (e) {
    const { 
      out_merchant_id, 
      blue_sea_status, 
      merchant_name, 
      status_str
    } = e.currentTarget.dataset.merchant;
    switch (blue_sea_status){
      case 1:
        //未提交
        if (status_str == '已通过'){
          wx.navigateTo({
            url: '/pages/Internet_business/act_enroll?out_merchant_id=' + out_merchant_id + '&merchant_name=' + merchant_name
          });
        }
        break;
      case 2:
        // 审核中
        if (status_str == '已通过'){
          // wx.navigateTo({
          //   url: '/pages/Internet_business/act_enroll?out_merchant_id=' + out_merchant_id + '&merchant_name=' + merchant_name
          // });
        }
        break;
      case 3:
        // 待确认
        break;
      case 4:
        // 已通过
        break;
      case 5:
        // 驳回
        wx.navigateTo({
          url: '/pages/Internet_business/act_enroll?out_merchant_id=' + out_merchant_id + '&merchant_name=' + merchant_name + '&sign=网商间连'
        });
        break;
      default:
        // wx.navigateTo({
        //   url: '/pages/Internet_business/act_enroll?out_merchant_id=' + out_merchant_id + '&merchant_name=' + merchant_name
        // });
        break;
    }

    

  }

})

/***********************普通方法*************************************/
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      mybankList(that)
    },
    function () {
    },
  )
}


/************************接口方法******************************** */
// 获取网商间连列表  接口
function mybankList(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  const {current} = that.data;
  data['token'] = token;
  current && (data['status'] = current);
  Request.request_data(
    Server.MYBANK_LIST(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        mybankArray:res
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