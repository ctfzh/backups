// 引入打印日志
var Currency = require('../JS/tool/currency.js');
// 引入签名
var Sign = require('../JS/tool/sign.js');
// 引入请求方法
var Request = require('../JS/request/request.js');
// 引入请求地址
var Server = require('../JS/request/server_address.js');


// pages/Internet_business/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantTypeArray: ['自然人', '个体工商户','企业商户'],
    multiArray: [[],[],[]],
    multiIndex:[0,0,0],
    statusTip:null,
    alipay_rate:0.38,
    wechat_rate:0.38
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
    if(options.type == 4){
      wx.setStorageSync('type', 4)
    }
    Refresh(this);
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

  // 商户类型选择
  handleMerchantTypeChange:function(e){
    const { merchantTypeArray,isChecked} = this.data;
    this.setData({
      merchant_type:e.detail.value - 0 + 1,
    })
    if (e.detail.value == 0){
      this.setData({
        isChecked:false
      })
    }
    if (this.data.isChecked==false){
      this.setData({
        alipay_rate: 0.38
      })
    }
  },

  // 行业类目选择
  handleIndustryChange:function(e){
    const { mybankCategoryNameList, mybankCategoryList} = this.data;
    this.setData({
      mcc_str: mybankCategoryNameList[e.detail.value],
      mcc: mybankCategoryList[e.detail.value].value
    })
    if (e.detail.value!=0){
      this.setData({
        isChecked: false
      })
    }
    if (this.data.isChecked == false) {
      this.setData({
        alipay_rate: 0.38
      })
    }
  },

  // 经营地址选择
  bindRegionChange:function(e){
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    this.setData({
      multiIndex: e.detail.value,
      province_name: data.multiArray[0][data.multiIndex[0]].area_name,
      province: data.multiArray[0][data.multiIndex[0]].area_post_value,
      province_value: data.multiArray[0][data.multiIndex[0]].area_code,
      city_name: data.multiArray[1][data.multiIndex[1]].area_name,
      city: data.multiArray[1][data.multiIndex[1]].area_post_value,
      city_value: data.multiArray[1][data.multiIndex[1]].area_code,
      district_name: data.multiArray[2][data.multiIndex[2]] ? data.multiArray[2][data.multiIndex[2]].area_name:'',
      district: data.multiArray[2][data.multiIndex[2]] ? data.multiArray[2][data.multiIndex[2]].area_post_value:'',
      district_value: data.multiArray[2][data.multiIndex[2]] ? data.multiArray[2][data.multiIndex[2]].area_code : ''
    })
  },

  // 经营地址每一列的变化
  bindRegionColumnChange:function(e){
    let that = this;
    // 获取数组信息
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 设置选择
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column){
      case 0:
      // 修改省份
        // 把市区设为首个,获取市数组,根据市首个获取区数组
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;

        let promise_c = new Promise(function(resolve,reject){
          mybankRegion(that, function (res) {
            data.multiArray[1] = res;
            that.setData({
              ...data,
              province_name: data.multiArray[0][data.multiIndex[0]].area_name,
              province: data.multiArray[0][data.multiIndex[0]].area_post_value,
              province_value: data.multiArray[0][data.multiIndex[0]].area_code
            });
            resolve(res)
          }, data.multiArray[0][data.multiIndex[0]].area_code);
        })
        promise_c.then(function(c){
          mybankRegion(that, function (res) {
            data.multiArray[2] = res;
            that.setData({
              ...data,
              city_name: data.multiArray[1][data.multiIndex[1]].area_name,
              city: data.multiArray[1][data.multiIndex[1]].area_post_value,
              city_value: data.multiArray[1][data.multiIndex[1]].area_code
            });
          }, c[0].area_code);
        })
        break;
      case 1:
      // 修改市
        // 把区设为首个,改变区数组
        data.multiIndex[2] = 0;
        mybankRegion(that, function (res) {
          data.multiArray[2] = res;
          that.setData({
            ...data,
            city_name: data.multiArray[1][data.multiIndex[1]].area_name,
            city: data.multiArray[1][data.multiIndex[1]].area_post_value,
            city_value: data.multiArray[1][data.multiIndex[1]].area_code
          });
        }, data.multiArray[1][data.multiIndex[1]].area_code);
        break;
      case 2:
      // 修改区
        that.setData({
          ...data,
          district_name: data.multiArray[2][data.multiIndex[2]].area_name,
          district: data.multiArray[2][data.multiIndex[2]].area_post_value,
          district_value: data.multiArray[2][data.multiIndex[2]].area_code
        });
        break; 
      default:
        break;
    }
  },

  // 负责人手机号输入
  handlePrincipalMobileChange:function(e){
    const {value} = e.detail;
    this.setData({
      principal_mobile:value
    })
  },

  handleSwitch:function(e){
    this.setData({
      blue_sea:e.detail.value == true?2:1,
      alipay_rate: e.detail.value == true ?'0.00':'0.38',
      isChecked: e.detail.value
    })
  },

  // 页面跳转函数
  jump_url:function(e){
    const {url_type} = e.currentTarget.dataset;
    let url = '';
    let paramesObj = null;
    switch (url_type) {
      case 'yyzz':
        const {
          buss_auth_num,
          license_photo,
          license_photo_url,
          license_photo_value
        } = this.data;
        paramesObj = {
          buss_auth_num,
          license_photo,
          license_photo_url,
          license_photo_value
        }
        url = buss_auth_num ? ('/pages/Internet_business/business_license?' + Currency.encodeSearchParams(paramesObj)) :'/pages/Internet_business/business_license';
        break;
      case 'sfz':
        const {
          principal_person,
          principal_cert_no,
          cert_photo_a,
          cert_photo_a_value,
          cert_photo_a_url,
          cert_photo_b,
          cert_photo_b_value,
          cert_photo_b_url,
        } = this.data;
        paramesObj = {
          principal_person,
          principal_cert_no,
          cert_photo_a,
          cert_photo_a_url,
          cert_photo_a_value,
          cert_photo_b,
          cert_photo_b_value,
          cert_photo_b_url,
        }
        url = principal_cert_no ? ('/pages/Internet_business/director_info?' + Currency.encodeSearchParams(paramesObj)) :'/pages/Internet_business/director_info';
        break;
      case 'jszh':
        const {
          industry_license_photo,
          industry_license_photo_url,
          industry_license_photo_value,
          bank_card_no,
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
          bank_cert_name,
          merchant_type
        } = this.data;
        paramesObj = {
          industry_license_photo,
          industry_license_photo_url,
          industry_license_photo_value,
          bank_card_no,
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
          bank_cert_name,
          merchant_type
        }
        url = bank_card_no ? ('/pages/Internet_business/account?' + Currency.encodeSearchParams(paramesObj)) : '/pages/Internet_business/account?merchant_type=' + merchant_type;
        break;
      default:
        break;
    }
    wx.navigateTo({
      url: url,
    })
  },

  // 获取验证码
  handleGetCode:function(){
    if (/^1[3456789]\d{9}$/.test(this.data.principal_mobile)){
      getCode(this);
    }else{
      wx.showToast({
        title: '请输入正确的负责人手机号',
        icon:'none'
      })
    }
  },

  // 提交事件
  handleSubmit: function (e) {
    /**
     * 结算账户
     * 负责人身份证
     * 营业执照
     * 行业类目
     * 商户类型
     */
    Currency.log('提交表单数据');
    Currency.log(e.detail.value);
    const iptValue = e.detail.value;
    const {data} = this;
    const arr = [
      // 商户信息验证
      {
        type: 'required',
        value: iptValue.merchant_name,
        message: '请输入商户名称'
      },
      {
        type: 'required',
        value: data.merchant_type,
        message: '请输入选择商户类型'
      },
      {
        type: 'required',
        value: data.mcc,
        message: '请输入选择行业类目'
      },
      // 经营信息 验证
      {
        type: 'required',
        value: iptValue.alias,
        message: '请输入商户简称'
      },
      {
        type: 'required',
        value: data.province_name,
        message: '请选择经营地址'
      },
      {
        type: 'required',
        value: iptValue.address,
        message: '请选择详细地址'
      },
      {
        type: 'servicePhone',
        value: iptValue.service_phone_no,
        message: '请输入正确的客服电话'
      },
      // 联系人信息
      {
        type: 'required',
        value: iptValue.contact_name,
        message: '请输入联系人姓名'
      },
      {
        type: 'telephone',
        value: iptValue.contact_mobile,
        message: '请输入正确的联系人手机号'
      },
      // 负责人信息 验证
      {
        type: 'required',
        value: data.principal_cert_no,
        message: '请上传身份证'
      },
      {
        type: 'telephone',
        value: iptValue.principal_mobile,
        message: '请输入正确的负责人手机号'
      },
      {
        type: 'email',
        value: iptValue.email,
        message: '请输入正确的负责人邮箱'
      }, 
      // 结算账户 验证
      {
        type: 'required',
        value: iptValue.auth_code,
        message: '请输入验证码'
      },
      // 其他页面数据验证
      {
        type: 'required',
        value: data.cert_photo_a_url,
        message: '请上传身份证照片'
      },
      {
        type: 'required',
        value: data.bank_card_no,
        message: '请设置结算账户'
      }
    ]
    Currency.wxValidate(arr, this);

    if (this.data.errorString){
      wx.showToast({
        title: this.data.errorString,
        icon:'none'
      })
    }else{
      // 如果有营业执照情况下 必选上传
      if (data.merchant_type != 1 && !Boolean(data.license_photo_url)) {
        wx.showToast({
          title: '请上传营业执照',
          icon: 'none'
        })
      }else{
        if (this.data.isChecked){
          // 选择蓝海 检测微信费率
          if (iptValue.wechat_rate <= 0.65 && iptValue.wechat_rate >= 0.25){
            this.setData({
              ...iptValue,
            })
            if (this.data.out_merchant_id) {
              mybankEdit(this);
            } else {
              mybankAdd(this);
            }
          }else{
            wx.showToast({
              title: '微信费率应在0.25-0.65之间',
              icon:'none'
            })
          }
        }else{
          // 未选择蓝海 检测支付宝微信费率

          if (iptValue.wechat_rate <= 0.65 && iptValue.wechat_rate >= 0.25 && iptValue.alipay_rate <= 0.65 && iptValue.alipay_rate >= 0.25) {
            this.setData({
              ...iptValue,
            })
            if (this.data.out_merchant_id) {
              mybankEdit(this);
            } else {
              mybankAdd(this);
            }
          } else {
            wx.showToast({
              title: '微信支付宝费率应在0.25-0.65之间',
              icon:'none'
            })
          }
        }
        
      }
    }
    
  }

})

/**********************普通方法**********************************/
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      that.setData({
        auth_code:''
      })
      mybankCategory(that);
      if (that.data.out_merchant_id){mybankDetail(that)};
      let promise_p = new Promise(function(resolve,reject){
        mybankRegion(that, function (res) {
          let multiArray = that.data.multiArray.map(item => item);
          multiArray[0] = res;
          that.setData({
            multiArray
          });
          resolve(res);
        });
      })
      let Promise_c = function(p){
        return new Promise(function (resolve, reject) {
          mybankRegion(that, function (res) {
            let multiArray = that.data.multiArray.map(item => item);
            multiArray[1] = res;
            that.setData({
              multiArray
            })
            resolve(res)
          }, p[0].area_code);
        })
      }
      promise_p.then(function(p){
        Promise_c(p).then(function(c){
          mybankRegion(that, function (res) {
            let multiArray = that.data.multiArray.map(item => item);
            multiArray[2] = res;
            that.setData({
              multiArray
            })
          }, c[0].area_code)
        })
      })
      
      
    },
    function () {
    },
  )
}
/************************接口方法******************************* */
// 添加网商接口
function mybankAdd(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  const { 
    merchant_name,
    blue_sea,
    alias,
    address,
    service_phone_no,
    contact_name,
    contact_mobile,
    principal_mobile,
    email,
    bank_cert_name,
    alipay_rate,
    wechat_rate,
    auth_code,
    province, 
    city, 
    district, 
    mcc,
    merchant_type,
    principal_person,
    principal_cert_no,
    cert_photo_a,
    cert_photo_a_url,
    cert_photo_b,
    cert_photo_b_url,
    industry_license_photo,
    industry_license_photo_url,
    bank_card_no,
    bank,
    branch_province,
    branch_city,
    contact_line,
    buss_auth_num,
    license_photo,
    license_photo_url,    
    } = that.data;
  data['token'] = token;
  data['mcc'] = mcc;
  data['merchant_name'] = merchant_name;
  data['blue_sea'] = blue_sea;
  data['alias'] = alias;
  data['address'] = address;
  data['service_phone_no'] = service_phone_no;
  data['contact_name'] = contact_name;
  data['contact_mobile'] = contact_mobile;
  data['principal_mobile'] = principal_mobile;
  data['email'] = email;
  data['alipay_rate'] = alipay_rate;
  data['wechat_rate'] = wechat_rate;
  data['auth_code'] = auth_code;
  data['merchant_type'] = merchant_type;
  data['blue_sea'] = blue_sea;

  data['province'] = province;
  data['city'] = city;
  data['district'] = district;
  data['buss_auth_num'] = buss_auth_num;
  if (merchant_type != 1){
    data['license_photo'] = license_photo;
    data['license_photo_url'] = license_photo_url;
  }

  data['principal_person'] = principal_person;
  data['principal_cert_no'] = principal_cert_no;
  data['cert_photo_a'] = cert_photo_a;
  data['cert_photo_a_url'] = cert_photo_a_url;
  data['cert_photo_b'] = cert_photo_b;
  data['cert_photo_b_url'] = cert_photo_b_url;

  data['bank_cert_name'] = bank_cert_name;
  data['industry_license_photo'] = industry_license_photo;
  data['industry_license_photo_url'] = industry_license_photo_url;
  data['bank_card_no'] = bank_card_no;
  data['bank']=bank;
  data['branch_province'] = branch_province;
  data['branch_city'] = branch_city;
  data['contact_line'] = contact_line;

  Request.request_data(
    Server.MYBANK_ADD(),
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
        out_merchant_id: res.data.data.out_merchant_id
      })
      const urlStr = Currency.encodeSearchParams({
        sign: that.data.sign,
        out_merchant_id: that.data.out_merchant_id,
        type: that.data.type,
        merchant_id: that.data.merchant_id
      })
      wx.redirectTo({
        url: '/pages/Internet_business/feed_back?' + urlStr
      })
      
    });
}

// 获取行业类目  接口
function mybankCategory(that) {
  let data = {};
  Request.request_data(
    Server.MYBANK_CATEGORY(),
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
      const mybankCategoryNameList = res.data.data.map(item => item.name);
      that.setData({
        mybankCategoryList: res.data.data,
        mybankCategoryNameList
      })
    });
}

// 获取短信验证码  接口
function getCode(that){
  let data = {};
  data['phone'] = that.data.principal_mobile;
  // data['merchant_id'] = 
  // data['type'] = 
  Request.request_data(
    Server.MYBANK_GET_CODE(),
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
    });
}

// 获取网商间连详情
function mybankDetail(that) {
  let data = {};
  data['out_merchant_id'] = that.data.out_merchant_id;
  Request.request_data(
    Server.MYBANK_DETAIL(),
    data,
    function (res) {
      Currency.log('接口请求成功');
      that.setData({
        ...res,
        isChecked: res.blue_sea==2?true:false,
        province_name_code: res.province_name + '_' + res.province,
        city_name_code: res.city_name + '_' + res.city,
        district_name_code: res.district_name + '_' + res.district,
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

// 网商间连编辑
function mybankEdit(that) {
  let data = {};
  data['out_merchant_id'] = that.data.out_merchant_id;
  const {
    merchant_name,
    blue_sea,
    alias,
    address,
    service_phone_no,
    contact_name,
    contact_mobile,
    principal_mobile,
    email,
    bank_cert_name,
    alipay_rate,
    wechat_rate,
    auth_code,
    province,
    city,
    district,
    mcc,
    merchant_type,
    principal_person,
    principal_cert_no,
    cert_photo_a,
    cert_photo_a_url,
    cert_photo_b,
    cert_photo_b_url,
    industry_license_photo,
    industry_license_photo_url,
    bank_card_no,
    bank,
    branch_province,
    branch_city,
    contact_line,
    buss_auth_num,
    license_photo,
    license_photo_url
  } = that.data;
  data['mcc'] = mcc;
  data['merchant_name'] = merchant_name;
  data['blue_sea'] = blue_sea;
  data['alias'] = alias;
  data['address'] = address;
  data['service_phone_no'] = service_phone_no;
  data['contact_name'] = contact_name;
  data['contact_mobile'] = contact_mobile;
  data['principal_mobile'] = principal_mobile;
  data['email'] = email;
  data['alipay_rate'] = alipay_rate;
  data['wechat_rate'] = wechat_rate;
  data['auth_code'] = auth_code;
  data['merchant_type'] = merchant_type;
  data['blue_sea'] = blue_sea;

  data['province'] = province;
  data['city'] = city;
  data['district'] = district;
  data['buss_auth_num'] = buss_auth_num;
  if (merchant_type != 1) {
    data['license_photo'] = license_photo;
    data['license_photo_url'] = license_photo_url;
  }

  data['principal_person'] = principal_person;
  data['principal_cert_no'] = principal_cert_no;
  data['cert_photo_a'] = cert_photo_a;
  data['cert_photo_a_url'] = cert_photo_a_url;
  data['cert_photo_b'] = cert_photo_b;
  data['cert_photo_b_url'] = cert_photo_b_url;

  data['bank_cert_name'] = bank_cert_name;
  data['industry_license_photo'] = industry_license_photo;
  data['industry_license_photo_url'] = industry_license_photo_url;
  data['bank_card_no'] = bank_card_no;
  data['bank'] = bank;
  data['branch_province'] = branch_province;
  data['branch_city'] = branch_city;
  data['contact_line'] = contact_line;
  Request.request_data(
    Server.MYBANK_EDIT(),
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
        out_merchant_id: res.data.data.out_merchant_id
      })
      const urlStr = Currency.encodeSearchParams({
        sign: that.data.sign,
        out_merchant_id: that.data.out_merchant_id,
        type:that.data.type,
        merchant_id: that.data.merchant_id
      })
      wx.redirectTo({
        url: '/pages/Internet_business/feed_back?' + urlStr
      })
    });
}

// 获取网商地址
function mybankRegion(that,success,code) {
  let data = {};
  code && (data['code'] = code);
  Request.request_data(
    Server.MYBANK_REGION(),
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