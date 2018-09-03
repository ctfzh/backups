// pages/xw_business/list.js

// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');
const FWS_WECHAT_MERCHANT_STATE = {
  1: '未提交',
  2: '审核中',
  3: '待签约',
  4: '已签约',
  5: '驳回'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    FWS_WECHAT_MERCHANT_STATE
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
    Refresh(this);
    wx.stopPullDownRefresh();
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
  swiper_current: function (e) {
    const { current } = e.currentTarget.dataset;
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

  // 添加商户跳转
  jump_add:function(){
    wx.navigateTo({
      url: '/pages/xw_business/register',
    })
  },

  handleDetail:function(e){
    const {merchant_id, state,business_code} = e.currentTarget.dataset;
    switch (state){
      case 1:
       // 未提交 
        wx.navigateTo({
          url: '/pages/xw_business/register?merchant_id=' + merchant_id,
        })
        break;
      case 2:
      // 审核中
        wx.navigateTo({
          url: '/pages/xw_business/detail?merchant_id=' + merchant_id,
        })
        break;
      case 3:
      // 待签约
        wx.navigateTo({
          url: '/pages/xw_business/sign?merchant_id=' + merchant_id + '&business_code=' + business_code,
        })
        break;
      case 4:
      // 已签约
        wx.navigateTo({
          url: '/pages/xw_business/detail?merchant_id=' + merchant_id,
        })
        break;
      case 5:
        //驳回 
        wx.navigateTo({
          url: '/pages/xw_business/register?merchant_id=' + merchant_id,
        })
        break;
      default:
        break;
    }
  },

//   滚动到顶部
	scroll (e) {
		var top = e.detail.scrollTop;
		console.log(top);
		if (top == 0) {
			console.log(top);
			if (this.data.shade_class !="block"){
				this.setData({
					shade_class: "block",
				})
			}
		} else {
			if (this.data.shade_class != "none") {
				this.setData({
					shade_class: "none",
				})
			}
		}
	},


})

/***********************普通方法*************************************/
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      xwMerchantList(that)
    },
    function () {
    },
  )
}


/*************************接口方法************************ */
// 获取小微商户列表  接口
function xwMerchantList(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  data['token'] = token;
  data['platform'] = 1;
  if (that.data.current){
    data['state'] = that.data.current;
  }
  Request.request_data(
    Server.XW_MERCHANT_LIST(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
      that.setData({
        xwMerchantArray: res.data.data
      })
    });
}