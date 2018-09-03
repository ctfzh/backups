// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

// pages/Internet_business/director_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    folder: 'idCardHand'
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

  handleNameChange:function(e){
    this.setData({
      principal_person:e.detail.value
    })
  },

  handleNoChange:function(e){
    this.setData({
      principal_cert_no:e.detail.value
    })
  },

  handleDeletePic:function(e){
    const {photo_type} = e.currentTarget.dataset;
    if (photo_type == '01'){
      this.setData({
        cert_photo_a_url:'',
        cert_photo_a_value:'',
        cert_photo_a:'',
        principal_person:'',
        principal_cert_no:''
      })
    } else if (photo_type == '02'){
      this.setData({
        cert_photo_b_url:'',
        cert_photo_b:'',
        cert_photo_b_value:''
      })
    }
  },

  // 上传图片点击事件
  handleUpload: function (e) {
    const that = this;
    const {photo_type} = e.currentTarget.dataset;
    const FOLDER = this.data.folder;
    Request.uploadImg(
      that,
      FOLDER,
      function (res) {
        const resObj = JSON.parse(res.data);
        that.setData({
          ...resObj,
          folder: FOLDER
        }, function () {
          mybankUploadPhoto(that, photo_type);
        })

      },
      function (res) {

      }
    )
  },


  // 保存事件
  handleSave:function(){
    const {
      cert_photo_a_url,
      cert_photo_a,
      cert_photo_a_value,
      principal_person,
      principal_cert_no,
      cert_photo_b_url,
      cert_photo_b,
      cert_photo_b_value
    } = this.data;
    const arr = [
      {
        type: 'required',
        value: cert_photo_a_url,
        message: '请上传身份证正面'
      },
      {
        type: 'required',
        value: cert_photo_b_url,
        message: '请上传身份证反面'
      }
    ]
    Currency.wxValidate(arr, this);
    if(this.data.errorString){
      wx.showToast({
        title: this.data.errorString,
        icon:'none'
      })
    }else{
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        cert_photo_a_url,
        cert_photo_a,
        cert_photo_a_value,
        principal_person,
        principal_cert_no,
        cert_photo_b_url,
        cert_photo_b,
        cert_photo_b_value
      })
      wx.navigateBack({
        delta: 1
      })
    }
    
  }

})

/***********************普通方法************************* */








/***************************接口方法************************* */

// 上传图片
function mybankUploadPhoto(that, photo_type) {
  let data = {};
  const { fileName, imgUrl, folder } = that.data;
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
      if (res.statusCode == 200) {
        if (photo_type=='01'){
          that.setData({
            principal_person: res.data.data.principal_name,
            principal_cert_no: res.data.data.principal_cert_no,
            cert_photo_a_url: fileName,
            cert_photo_a_value: imgUrl + folder + '/source/' + fileName,
            cert_photo_a: res.data.PhotoUrl
          });
        } else if (photo_type == '02'){
          that.setData({
            cert_photo_b_url: fileName,
            cert_photo_b: res.data.PhotoUrl,
            cert_photo_b_value: imgUrl + folder + '/source/' + fileName,
          })
        }

      }
    });
}