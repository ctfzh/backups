// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');


// pages/Internet_business/act_enroll.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    folder:'blueSea',
    feedback:false
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
    if (options.out_merchant_id){
      mybankDetail(this);
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

  // 上传图片
  handleUpload: function (e) {
    const that = this;
    const { photo_type } = e.currentTarget.dataset;
    const FOLDER = 'blueSea';
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

  //保存事件
  handleSubmit: function () {
    const {
      out_merchant_id,
      bs_door_pic,
      bs_door_pic_url,
      bs_license_pic,
      bs_license_pic_url,
      bs_syt_pic,
      bs_syt_pic_url,
      bs_shop_pic,
      bs_shop_pic_url,
      bs_supplement_pic,
      bs_supplement_pic_url
    } = this.data;
    const arr = [
      {
        type: 'required',
        value: bs_door_pic_url,
        message: '请上传店铺门头照'
      },
      {
        type: 'required',
        value: bs_syt_pic_url,
        message: '请上传收银台照片'
      },
      {
        type: 'required',
        value: bs_license_pic_url,
        message: '请上传营业执照'
      },
      {
        type: 'required',
        value: bs_shop_pic_url,
        message: '请上传店内环境照片'
      },
      {
        type: 'required',
        value: bs_supplement_pic_url,
        message: '请上传补充材料'
      }
    ];
    Currency.wxValidate(arr, this);
    if(this.data.errorString){
      wx.showToast({
        title: this.data.errorString,
        icon:'none'
      })
    }else{
      mybankBluesea(this);
    }
  }

})

/***********************普通方法************************* */
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      mybankDetail(that);
    },
    function () {
    },
  )
}


/***************************接口方法************************* */

function mybankBluesea(that) {
  let data = {};
  const {
    out_merchant_id,
    bs_door_pic,
    bs_door_pic_url,
    bs_license_pic,
    bs_license_pic_url,
    bs_syt_pic,
    bs_syt_pic_url,
    bs_shop_pic,
    bs_shop_pic_url,
    bs_supplement_pic,
    bs_supplement_pic_url
  } = that.data;
  data.out_merchant_id = out_merchant_id;
  data.bs_door_pic = bs_door_pic;
  data.bs_door_pic_url = bs_door_pic_url;
  data.bs_license_pic = bs_license_pic;
  data.bs_license_pic_url = bs_license_pic_url;
  data.bs_syt_pic = bs_syt_pic;
  data.bs_syt_pic_url = bs_syt_pic_url;
  data.bs_shop_pic = bs_shop_pic;
  data.bs_shop_pic_url = bs_shop_pic_url;
  data.bs_supplement_pic = bs_supplement_pic;
  data.bs_supplement_pic_url = bs_supplement_pic_url;

  Request.request_data(
    Server.MYBANK_BLUESRA(),
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
      const {
        sign,
        out_merchant_id, 
      } = that.data;
      const urlStr = Currency.encodeSearchParams({
        sign: that.data.sign,
        out_merchant_id: that.data.out_merchant_id,
        type: that.data.type,
        merchant_id: that.data.merchant_id
      })
      wx.redirectTo({
        url: '/pages/Internet_business/bluesea_feed_back?' + urlStr,
      })    
    });
}

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
        switch (photo_type){
          case '06':
            that.setData({
              bs_door_pic_url: fileName,
              bs_door_pic: res.data.PhotoUrl,
              bs_door_pic_value: imgUrl + folder + '/source/' + fileName
            });
            break;
          case '08':
            that.setData({
              bs_syt_pic_url: fileName,
              bs_syt_pic: res.data.PhotoUrl,
              bs_syt_pic_value: imgUrl + folder + '/source/' + fileName
            });
            break;
          case '03':
            that.setData({
              bs_license_pic_url: fileName,
              bs_license_pic: res.data.PhotoUrl,
              bs_license_pic_value: imgUrl + folder + '/source/' + fileName
            });
            break;
          case '09':
            that.setData({
              bs_shop_pic_url: fileName,
              bs_shop_pic: res.data.PhotoUrl,
              bs_shop_pic_value: imgUrl + folder + '/source/' + fileName
            });
            break;
          case '10':
            that.setData({
              bs_supplement_pic_url: fileName,
              bs_supplement_pic: res.data.PhotoUrl,
              bs_supplement_pic_value: imgUrl + folder + '/source/' + fileName
            });
            break;
          default :
            break;
        }

      }
    });
}

// 获取网商详情
function mybankDetail(that) {
  let data = {};
  data['out_merchant_id'] = that.data.out_merchant_id;
  Request.request_data(
    Server.MYBANK_DETAIL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        bs_door_pic: res.bs_door_pic,
        bs_door_pic_url: res.bs_door_pic_url,
        bs_door_pic_value: res.bs_door_pic_value,
        bs_license_pic: res.bs_license_pic,
        bs_license_pic_url: res.bs_license_pic_url,
        bs_license_pic_value: res.bs_license_pic_value,
        bs_syt_pic: res.bs_syt_pic,
        bs_syt_pic_url: res.bs_syt_pic_url,
        bs_syt_pic_value: res.bs_syt_pic_value,
        bs_shop_pic: res.bs_shop_pic,
        bs_shop_pic_url: res.bs_shop_pic_url,
        bs_shop_pic_value: res.bs_shop_pic_value,
        bs_supplement_pic: res.bs_supplement_pic,
        bs_supplement_pic_url: res.bs_supplement_pic_url,
        bs_supplement_pic_value: res.bs_supplement_pic_value,
        blue_sea_status: res.blue_sea_status,
        blue_sea_reject_reason: res.blue_sea_reject_reason
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
