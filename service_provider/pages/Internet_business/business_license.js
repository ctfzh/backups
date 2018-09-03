// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

// pages/Internet_business/business_license.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    folder: 'businessLicense'
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

  handleChange:function(e){
    this.setData({
      buss_auth_num:e.detail.value
    })
  },

  handleDeletePic: function () {
    this.setData({
      license_photo_value: '',
      license_photo: '',
      license_photo_url: '',
      buss_auth_num:''
    })
  },

  // 上传图片
  handleUpload:function(){
    const that = this;
    const FOLDER = 'businessLicense';
    Request.uploadImg(
      that,
      FOLDER,
      function(res){
        const resObj = JSON.parse(res.data);
        that.setData({
          ...resObj,
          folder: FOLDER
        },function(){
          mybankUploadPhoto(that, '03');
        });

      },
      function(res){

      }
    )
  },

  //保存事件
  handleSave:function(){
    const {
      buss_auth_num,
      license_photo,
      license_photo_url,
      license_photo_value
    } = this.data;
    const arr = [
      {
        type: 'required',
        value: buss_auth_num,
        message: '请上传营业执照'
      },
      {
        type: 'required',
        value: license_photo,
        message: '请上传营业执照'
      },
      {
        type: 'required',
        value: license_photo_url,
        message: '请上传营业执照'
      }
    ]
    Currency.wxValidate(arr, this);
    if(this.data.errorString){
      wx.showToast({
        title: this.data.errorString,
        icon:'null'
      })
    }else{
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        buss_auth_num,
        license_photo,
        license_photo_url,
        license_photo_value
      })
      wx.navigateBack({
        delta: 1
      })
    }
  } 

})

/***********************普通方法************************* */
// UPLOAD_FILE_URL







/***************************接口方法************************* */
// 上传图片
function mybankUploadPhoto(that, photo_type) {
  let data = {};
  const {fileName,imgUrl,folder} = that.data;
  const license_photo_url = fileName;
  data['photo_type'] = photo_type;
  data['picture'] = imgUrl + folder + '/source/' + fileName;
  Request.request_data(
    Server.MYBANK_UPLOAD_PHOTO(),
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
      
      if (res.statusCode==200){
        that.setData({
          buss_auth_num: res.data.data.license_no,
          license_photo_url,
          license_photo: res.data.PhotoUrl,
          license_photo_value: imgUrl + folder + '/source/' + fileName
        })
      }
    });
}

