// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');

// pages/Internet_business/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    folder:'industryLicense',
    multiArray: [[], []],
    multiIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        ...options,
        contact_line_name: options.contact_line?options.contact_line.split('_')[0]:''
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

  // 跳转事件
  jump_url:function(e){
    const {url,type} = e.currentTarget.dataset;
    if(type == 3){
      // 支行
      const { 
        bank_id,
        branch_province_code, 
        branch_city_code 
      } = this.data;
      wx.navigateTo({
        url: url + "?bank_id=" + bank_id + '&branch_province_code=' + branch_province_code + '&branch_city_code=' + branch_city_code
      })
    }else{
      wx.navigateTo({
        url
      })
    }
    
  },

  handleDeletePic: function () {
    this.setData({
      industry_license_photo_value:'',
      industry_license_photo:'',
      industry_license_photo_url:''
    })
  },

  // 上传图片
  handleUpload: function () {
    const that = this;
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
          mybankUploadPhoto(that, '05');
        })

      },
      function (res) {

      }
    )
  },

  // 开户城市选择
  bindRegionChange: function (e) {    
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    this.setData({
      multiIndex: e.detail.value,
      branch_province: data.multiArray[0][data.multiIndex[0]].area_post_value,
      branch_province_code: data.multiArray[0][data.multiIndex[0]].area_code,
      branch_province_value: data.multiArray[0][data.multiIndex[0]].area_name,
      branch_city: data.multiArray[1][data.multiIndex[1]].area_post_value,
      branch_city_code: data.multiArray[1][data.multiIndex[1]].area_code,
      branch_city_value: data.multiArray[1][data.multiIndex[1]].area_name
    })
  },

  // 经营地址每一列的变化
  bindRegionColumnChange: function (e) {
    let that = this;
    // 获取数组信息
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 设置选择
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        // 修改省份
        // 把市区设为首个,获取市数组
        data.multiIndex[1] = 0;        
        mybankBankRegion(that, function (res) {
          data.multiArray[1] = res;
          that.setData({
            ...data,
            branch_province: data.multiArray[0][data.multiIndex[0]].area_post_value,
            branch_province_code: data.multiArray[0][data.multiIndex[0]].area_code,
            branch_province_value: data.multiArray[0][data.multiIndex[0]].area_name,
          });
        }, data.multiArray[0][data.multiIndex[0]].area_code);
        break;
      case 1:
        // 修改区
        that.setData({
          ...data,
          branch_city: data.multiArray[1][data.multiIndex[1]].area_post_value,
          branch_city_code: data.multiArray[1][data.multiIndex[1]].area_code,
          branch_city_value: data.multiArray[1][data.multiIndex[1]].area_name,
        });
        break;
      default:
        break;
    }
  },

  //保存事件
  handleSubmit: function (e) {
    /**
     * 开户银行,开户支行,开户许可证
     */
    const { 
      bank_cert_name, 
      bank_card_no,
    } = e.detail.value;
    const {
      industry_license_photo,
      industry_license_photo_url,
      industry_license_photo_value,
      bank,
      bank_id,
      branch_province,
      branch_province_code,
      branch_province_value,
      branch_city,
      branch_city_code,
      branch_city_value,
      branch_name,
      contact_line,
      contact_line_value,
    } = this.data;
    const arr = [
      {
        type: 'required',
        value: bank_cert_name,
        message: '请输入开户名称'
      },
      {
        type: 'required',
        value: bank_card_no,
        message: '请输入银行卡号'
      },
      {
        type: 'required',
        value: bank,
        message: '请选择开户银行'
      },
      {
        type: 'required',
        value: branch_province,
        message: '请选择开户城市'
      },
      {
        type: 'required',
        value: contact_line,
        message: '请选择开户支行'
      }
    ]
    if (this.data.merchant_type==3){
      arr.push({
        type: 'required',
          value: industry_license_photo_url,
            message: '请上传开户许可证'
      })
    }
    Currency.wxValidate(arr,this);
    if(this.data.errorString){
      wx.showToast({
        title: this.data.errorString,
        icon:'none'
      })
    }else{
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.setData({
        bank_cert_name,
        bank_card_no,
        industry_license_photo,
        industry_license_photo_url,
        industry_license_photo_value,
        bank,
        bank_id,
        branch_province,
        branch_province_code,
        branch_province_value,
        branch_city,
        branch_city_code,
        branch_city_value,
        branch_name,
        contact_line,
        contact_line_value        
      })
      wx.navigateBack({
        delta: 1
      })
    }
    
  }
})

/***********************普通方法************************* */

function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      let promise_p = new Promise(function (resolve, reject) {
        mybankBankRegion(that, function (res) {
          let multiArray = that.data.multiArray.map(item => item);
          multiArray[0] = res
          that.setData({
            multiArray
          })
          resolve(res);
        });
      });
      promise_p.then(function(p){
        mybankBankRegion(that, function (res) {
          let multiArray = that.data.multiArray.map(item => item);
          multiArray[1] = res;
          that.setData({
            multiArray
          })
          
        }, p[0].area_code);
      })

    },
    function () {
    },
  )
}






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
        that.setData({
          industry_license_photo_url: fileName,
          industry_license_photo: res.data.PhotoUrl,
          industry_license_photo_value: imgUrl + folder + '/source/' + fileName
        })
        

      }
    });
}

// 获取网商银行地址
function mybankBankRegion(that, success, code) {
  let data = {};
  code && (data['code'] = code);
  Request.request_data(
    Server.MYBANK_BANK_REGION(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      success(res);
    },
    function (res) {
      Currency.log('接口请求成功');
    },
    function (res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}