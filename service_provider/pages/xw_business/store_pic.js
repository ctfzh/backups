// pages/xw_business/store_pic.js
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
    folder:'wechat_pay_store'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData(options)
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

  handleDeletePic: function (e) {
    const {type} = e.currentTarget.dataset;
    if(type == 1){
      this.setData({
        door_photo: '',
        door_photo_url: '',
        door_media_id: ''
      })
    }else if(type == 2){
      this.setData({
        environment_media_id: '',
        environmental_photo_url: '',
        environmental_photo: ''
      })
    }
  },

  // 上传图片
  handleUpload: function (e) {
    const that = this;
    const {type} = e.currentTarget.dataset;
    Request.uploadImg(
      that,
      that.data.folder,
      function (res) {
        const resObj = JSON.parse(res.data);
        that.setData({
          ...resObj
        }, function () {
          storeUploadPhoto(that,type);
        });

      },
      function (res) {

      }
    )
  },

  handleSave:function(){
    const {
      door_media_id,
      door_photo_url,
      door_photo,
      environment_media_id,
      environmental_photo_url,
      environmental_photo
    } = this.data;
    if (door_photo && environmental_photo){
      const pages = getCurrentPages();
      const prePage = pages[pages.length - 2];
      prePage.setData({
        door_media_id,
        door_photo_url,
        door_photo,
        environment_media_id,
        environmental_photo_url,
        environmental_photo
      })
    }
    wx.navigateBack({
      delta:1
    })
  }
})

/************************普通方法************************ */
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
     
    },
    function () {
    },
  )
}
/***************************接口方法************************* */
// 上传图片
function storeUploadPhoto(that,type) {
  let data = {};
  const { fileName, imgUrl, folder } = that.data;
  data['url'] = folder + '/source/' + fileName;
  const url = imgUrl + folder + '/source/' + fileName;
  Request.request_data(
    Server.GET_IMAGE_URL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      if(type == 1){
        that.setData({
          door_media_id: res.media_id,
          door_photo_url: url,
          door_photo: fileName
        })
      }else{
        that.setData({
          environment_media_id: res.media_id,
          environmental_photo_url: url,
          environmental_photo: fileName
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
