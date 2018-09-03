// pages/Internet_business/food_back.js
// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

const statusList = [
  {
    img: 3,
    title: '审核中',
    text: ['审核周期5分钟-24小时，刷新查看审核结果'],
    buttom: '刷新'
  },
  {
    img: 1,
    title: '审核通过',
    text: [''],
    buttom: '提交蓝海行动'
  },
  {
    img: 1,
    title: '审核通过',
    text: [''],
    buttom: '确定'
  },
  {
    img: 2,
    title: '驳回',
    text: [''],
    buttom: '编辑'
  }
];

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
    if(options){
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

  handleNext:function(){
    const { 
      sign, 
      mybankStatus, 
      mybankBluesea, 
      out_merchant_id
    } = this.data;
    const urlStr = Currency.encodeSearchParams({
      sign: this.data.sign,
      out_merchant_id: this.data.out_merchant_id,
      type: this.data.type,
      merchant_id: this.data.merchant_id
    })
    switch (mybankStatus){
      case 4:
      // 驳回
        wx.redirectTo({
          url: '/pages/Internet_business/register?'+urlStr
        })
        break;
      case 3:
      // 通过
        if(sign == '网商间连'){
          // 非蓝海进网商列表
          if (mybankBluesea==1){
            wx.redirectTo({
              url: '/pages/Internet_business/list?' + urlStr,
            })
          }
          // 蓝海进蓝海行动
          if (mybankBluesea==2){
            wx.redirectTo({
              url: '/pages/Internet_business/act_enroll?' + urlStr,
            })
          }
        }else if(sign == '商户新增网商间连'){
          // 非蓝海进 商户/门店间连选择页
          if (mybankBluesea == 1) {
            // wx.redirectTo({
            //   url: '/pages/account/add_list?' + urlStr,
            // })
            wx.navigateBack({
              delta:1
            })
          }
          // 蓝海进蓝海行动
          if (mybankBluesea == 2) {
            wx.redirectTo({
              url: '/pages/Internet_business/act_enroll?' + urlStr,
            })
          }
        }
        break;
      case 2:
      // 审核中
        getMybankStatus(this);
        break
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
      switch (res.status) {
        case 2:
          // 审核中
          that.setData({
            ...statusList[0],
            mybankStatus: res.status,
            mybankBluesea: res.blue_sea            
          })
          break;
        case 3:
          // 通过
          if (res.blue_sea == 2) {
            statusList[1].text = ['蓝海行动商户请完成蓝海行动报名']
            that.setData({
              ...statusList[1],
              mybankStatus: res.status,
              mybankBluesea: res.blue_sea
            })
          } else {
            // 不参加蓝海,显示商户号
            statusList[2].text = ['商户名称' + res.out_merchant_id]
            that.setData({
              ...statusList[2],
              mybankStatus: res.status,
              mybankBluesea: res.blue_sea
            })
          }
          break;
        case 4:
          // 驳回
          statusList[3].text = ['驳回理由:' + res.reject_msg]
          that.setData({
            ...statusList[3],
            mybankStatus: res.status,
            mybankBluesea: res.blue_sea
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