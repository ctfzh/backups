// pages/xw_business/director_info.js
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
    folder: 'wechat_pay_card'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData(options);
    }
    this.setData({
      card_validity_type: options.card_validity_type == 1?1:2
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

  handleNameChange:function(){


  
  },

  handleNameChange:function(e){
    this.setData({
      principal:e.detail.value
    })
  },

  handleNoChange:function(e){
    this.setData({
      card_id:e.detail.value
    })
  },

  handleDeletePic: function (e) {
    const {type} = e.currentTarget.dataset;
    if(type == 1){
      this.setData({
        card_front_url: '',
        card_front: '',
        card_front_media_id: '',
        principal:'',
        card_id:''
      })
    }else if(type == 2){
      this.setData({
        card_reverse_url: '',
        card_reverse: '',
        card_reverse_media_id: '',
        card_validity_start_time:'',
        card_validity_end_time:'',
        card_validity_type:2
      })
    }
    
  },

  // 上传图片
  handleUpload: function (e) {
    const that = this;
    const { type } = e.currentTarget.dataset;
    Request.uploadImg(
      that,
      that.data.folder,
      function (res) {
        const resObj = JSON.parse(res.data);
        that.setData({
          ...resObj
        }, function () {
          cardUploadPhoto(that, type);
        });

      },
      function (res) {

      }
    )
  },

  handleSwitch:function(e){
    const isChecked = e.detail.value;
    this.setData({
      card_validity_type: isChecked ? 1 : 2
    })

  },

  bindDateChange:function(e){
    const {date_type} = e.currentTarget.dataset;
    if (date_type == 1){
      const card_validity_start_time = e.detail.value;
      this.setData({
        card_validity_start_time
      })
    }else{
      const card_validity_end_time = e.detail.value;
      this.setData({
        card_validity_end_time
      })
    }
  },

  handleSave:function(){
    const pages = getCurrentPages();
    const prepage = pages[pages.length - 2];
    const {
      card_front_url,
      card_front,
      card_front_media_id,
      card_reverse_url,
      card_reverse,
      card_reverse_media_id,
      principal,
      card_id,
      card_validity_start_time,
      card_validity_type,
      card_validity_end_time
    } = this.data;
    prepage.setData({
      card_front_url,
      card_front,
      card_front_media_id,
      card_reverse_url,
      card_reverse,
      card_reverse_media_id,
      principal,
      card_id,
      card_validity_start_time,
      card_validity_type,
      card_validity_end_time
    });
    wx.navigateBack({
      delta:1
    })
  }

})

/***************************接口方法************************* */
// 上传图片
function cardUploadPhoto(that, type) {
  let data = {};
  const { fileName, imgUrl, folder } = that.data;
  data['url'] = folder + '/source/' + fileName;
  const url = imgUrl + folder + '/source/' + fileName;
  Request.request_data(
    Server.GET_IMAGE_URL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      if (type == 1) {
        that.setData({
          card_front_media_id: res.media_id,
          card_front_url: url,
          card_front: fileName
        });
        getIdCardInfo(that,type);
      } else {
        that.setData({
          card_reverse_media_id: res.media_id,
          card_reverse_url: url,
          card_reverse: fileName
        });
        getIdCardInfo(that,type);
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

// 识别图片
function getIdCardInfo(that,type) {
  let data = {};
  if(type == 1){
    data['url'] = that.data.card_front_url;
  }else{
    data['url'] = that.data.card_reverse_url;
  }
  data['image_type'] = type
  Request.request_data(
    Server.GET_ID_CARD_INFO(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      if(type == 1){
        that.setData({
          principal: res.name,
          card_id: res.code,
        })
      }else{
        that.setData({
          ...res
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