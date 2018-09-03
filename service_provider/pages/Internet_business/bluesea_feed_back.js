// pages/Internet_business/food_back.js
// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

// 审核通过
const VERIFY_PASS = {
  img: 1,
  title: '审核通过',
  text: ['审核周期1-5个工作日，请随时关注审核结果'],
  buttom: '确定'
}
// 驳回
const VERIFY_REJECT = {
  img: 2,
  title: '驳回',
  text: ['审核周期1-5个工作日，请随时关注审核结果'],
  buttom: '编辑'
}
// 审核中
const VERIFYING = {
  img: 3,
  title: '审核中',
  text: ['审核周期1-5个工作日，请随时关注审核结果'],
  buttom: '确定'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '审核中',
    text: ['审核5-10个工作日'],
    buttom: '刷新'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        ...options
      })
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

  handleNext: function () {
    const { 
      sign, 
      mybankBluesea,
      out_merchant_id,
    } = this.data;
    switch (mybankBluesea) {
      case 5:
        // 驳回
        wx.redirectTo({
          url: '/pages/Internet_business/act_enroll?out_merchant_id=' + out_merchant_id + '&sign=' + sign + '&type=' + this.data.type + '&merchant_id=' + this.data.merchant_id
        })
        break;
      default:
        // 状态2审核中/状态3审核通过   都跳转
        if (sign=='网商间连'){
          wx.navigateBack({
            delta: 1
          })
        }else if(sign=='商户新增网商间连'){
          // wx.redirectTo({
          //   url: '/pages/account/add_list?type=' + this.data.type + '&merchant_id=' + this.data.merchant_id,
          // })
          wx.navigateBack({
            delta:1
          })
        }
        break;
    }
  }
})

/*******************普通方法**************************** */
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      getMybankStatus(that)
    },
    function () {
    },
  )
}


/*****************接口方法********************************** */
// 获取网商状态
function getMybankStatus(that) {
  let data = {};
  data['out_merchant_id'] = that.data.out_merchant_id;
  Request.request_data(
    Server.MYBANK_DETAIL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      switch (res.blue_sea_status) {
        case 2:
          // 审核中
          that.setData({
            ...VERIFYING,
            mybankBluesea: res.blue_sea_status,
          })
          break;
        case 4:
          // 通过
          VERIFY_PASS.text = ['商户编号' + res.out_merchant_id]
          that.setData({
            ...VERIFY_PASS,
            mybankBluesea: res.blue_sea_status
          })
          break;
        case 5:
          // 驳回
          VERIFY_REJECT.text = ['驳回理由:' + res.blue_sea_reject_reason]
          that.setData({
            ...VERIFY_REJECT,
            mybankBluesea: res.blue_sea_status
          })
          break;
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