// pages/xw_business/feedback.js
// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');
const IMG = [
  '../img/income/complete.png',
  '../img/income/fail.png',
  '../img/income/await.png'
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    btn: '',
    imgSrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.setData(options);
    }
    queryState(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 跳转签约页面
  handleNext: function() {
    switch (this.data.state) {
      case 3:
        // 待签约
        const {
          applyment_id,
          business_code
        } = this.data;
        const obj = {
          applyment_id,
          business_code
        }
        const objStr = Currency.encodeSearchParams(obj);
        wx.redirectTo({
          url: '/pages/xw_business/sign?' + objStr
        }) 
        break;
      case 2:
        //审核中
        Refresh(this);
        break;
      case 5:
        // 驳回
        const {merchant_id} = this.data;
        wx.redirectTo({
          url: '/pages/xw_business/register?merchant_id=' + merchant_id,
        })
        break;
    }
    
  }
})

/***********************普通方法*************************************/
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function() {
      queryState(that);      
    },
    function() {},
  )
}

/************************接口方法******************************** */
// 获取状态  接口
function queryState(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  data['token'] = token;
  data['business_code'] = that.data.business_code;
  Request.request_data(
    Server.QUERY_STATE(),
    data,
    function(res) {
      Currency.log('接口请求成功');
      that.setData({
        ...res
      })
      let data = {};
      const { sub_mch_id, audit_detail} = that.data;
      switch(res.state){
        case 3:
          data = {
            title:'审核通过',
            content: '商户号' + sub_mch_id,
            btn:'去签约',
            imgSrc:IMG[0]
          };
        break;
        case 2:
          data = {
            title: '审核中',
            content: '审核周期5分钟左右，刷新查看审核结果',
            btn: '刷新',
            imgSrc:IMG[2]
          };
          break;
        case 5:
          data = {
            title: '驳回',
            content: '驳回理由:' + audit_detail[0].reject_reason,
            btn: '编辑',
            imgSrc: IMG[1]
          };
          break;
      }
      that.setData(data);
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}