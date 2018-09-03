// 点餐评价


// 引用日志输出
var Journal = require('../JS/tool/journal.js')
//引入签名加密商户号
var Sign = require('../JS/tool/sign.js')
//网络请求
var Request = require("../JS/request/request.js")
//数据接口地址
var Server = require('../JS/request/server_address.js');
//全局通用js
var Currency = require('../JS/tool/currency.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //评分默认一分
    store_score: 0,
    //默认提示文字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    if (options.order_id && options.order_id != "undefined" && options.order_no && options.order_no != "undefined") {
      this.setData({
        order_id: options.order_id,
        order_no: options.order_no,
      })
    } else {
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        error_text: "数据加载失败",
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
    if (this.data.order_id){
      //初始化页面
      Refresh(this)
    }
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
  // 提交评论
  comment: function(){
    getcomment_add(this);
  },
  // 点星
  star: function(e) {
    var store_score = e.currentTarget.dataset.item;
    this.setData({
      store_score: store_score,
    })
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})



/****************普通方法***********************/

//刷新页面
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      getOrderDetail(that);
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        log: 0,
        error_text: "商户不存在",
      })
    },
  )
}


/****************数据获取********************/
//添加评价
function getcomment_add(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data.token = token;
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();
    data['order_id'] = that.data.order_id;
    data['store_score'] = that.data.store_score;
    Request.request_data(
      Server.COMMENT_ADD(),
      data,
      function (res) {
        that.setData({
          btn: 1,
        })
        wx.showToast({
          title: "成功",
          icon: 'none',
          duration: 2000
        })
      },
      function (res) {
        wx.showToast({
          title: res ? res : "失败！！！",
          icon: 'none',
          duration: 2000
        })
      },
      function (res) {
        Journal.myconsole('订单详情请求的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      error: 1,
      log: 1,
      retry_an: 0,
      error_text: "绑定手机号",
    })
  }
}


//获取订单详情
function getOrderDetail(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data.token = token;
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();
    data['order_no'] = that.data.order_no;
    Request.request_data(
      Server.GET_ORDER_DETAIL(),
      data,
      function (res) {
         //浏览量统计
         Currency.visit(that);
        if (res) {
          that.setData({
            show: true,
            order_detail: res
          });
          if (res.appointed_time) {
            sliceTime(that, res.appointed_time);
          }
        } else {
          that.setData({
            show: false,
            retry_an: 1,
            error: 1,
            log: 0,
            error_text: "订单不存在",
          })
        }
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          error: 0,
          log: 0,
          show_text: res,
        })
      },
      function (res) {
        Journal.myconsole('订单详情请求的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      error: 1,
      log: 1,
      retry_an: 0,
      error_text: "绑定手机号",
    })
  }
}
