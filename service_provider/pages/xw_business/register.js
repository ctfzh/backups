// pages/xw_business/register.js
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
    CategoryArray: [
      [],
      []
    ], //一级行业类目
    CategoryIndex: [0, 0], //二级行业类目
    multiArray: [
      [],
      [],
      []
    ], //经营地址
    multiIndex: [0, 0, 0] //经营地址结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      this.setData(options);
    }
    Refresh(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  jump_store_pic: function() {
    const {
      door_media_id,
      door_photo_url,
      door_photo,
      environment_media_id,
      environmental_photo_url,
      environmental_photo
    } = this.data;
    const obj = {
      door_media_id,
      door_photo_url,
      door_photo,
      environment_media_id,
      environmental_photo_url,
      environmental_photo
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/store_pic?' + objStr;
    wx.navigateTo({
      url
    })
  },

  jump_director_info: function() {
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
    const obj = {
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
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/director_info?' + objStr;
    wx.navigateTo({
      url
    })
  },

  jump_account: function() {
    const {
      principal,
      bank_card_number,
      bank_name,
      bank_id,
      bank_province_name,
      bank_city_name,
      bank_city_code,
      bank_province_code,
      branch_bank_name,
      branch_bank_id
    } = this.data;
    const obj = {
      principal,
      bank_card_number,
      bank_name,
      bank_id,
      bank_province_name,
      bank_city_name,
      bank_city_code,
      bank_province_code,
      branch_bank_name,
      branch_bank_id
    }
    const objStr = Currency.encodeSearchParams(obj);
    const url = '/pages/xw_business/account?' + objStr;
    wx.navigateTo({
      url
    })
  },

  handleCategoryChange: function(e) {
    this.setData({
      CategoryIndex: e.detail.value,
    })
    const {
      CategoryIndex,
      CategoryArray
    } = this.data;
    const p_category = CategoryArray[0][CategoryIndex[0]];
    const categore = CategoryArray[1][CategoryIndex[1]]
    this.setData({
      p_category_name: p_category.name,
      category_name: categore.name,
      category_code: categore.code
    })
  },

  handleCategoryColumnChange: function(e) {
    // 修改的列为e.detail.column
    // 修改的列的值为e.detail.value
    let data = {
      CategoryArray: this.data.CategoryArray,
      CategoryIndex: this.data.CategoryIndex
    };
    // 设置修改列的值
    data.CategoryIndex[e.detail.column] = e.detail.value;
    // 如果修改一级类目,就请求获取二级行业类目
    if (e.detail.column == 0) {
      const p_id = data.CategoryArray[0][e.detail.value].code;
      this.setData({
        p_id
      })
      getSubCategory(this);
    }
  },

  handleAddressChange: function(e) {
    const {
      multiArray,
      multiIndex
    } = this.data;
    const province = multiArray[0][multiIndex[0]];
    const city = multiArray[1][multiIndex[1]];
    const area = multiArray[2][multiIndex[2]];
    this.setData({
      province_code: province.code,
      province_name: province.name,
      city_code: city.code,
      city_name: city.name,
      area_code: area.code,
      area_name: area.name
    })
  },

  handleAddressColumnChange: function(e) {
    let that = this;
    // 修改的列为e.detail.column
    // 修改的列的值为e.detail.value
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 设置修改列的值
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        // 修改省份
        // 把市区设为首个,获取市数组,根据市首个获取区数组
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;

        let promise_c = new Promise(function(resolve, reject) {
          getSubArea(that, function(res) {
            data.multiArray[1] = res;
            that.setData({
              ...data,
              province_name: data.multiArray[0][data.multiIndex[0]].name,
              province_code: data.multiArray[0][data.multiIndex[0]].code
            });
            resolve(res)
          }, data.multiArray[0][data.multiIndex[0]].code);
        })
        promise_c.then(function(c) {
          getSubArea(that, function(res) {
            data.multiArray[2] = res;
            that.setData({
              ...data,
              city_name: data.multiArray[1][data.multiIndex[1]].name,
              city_code: data.multiArray[1][data.multiIndex[1]].code
            });
          }, c[0].code);
        })
        break;
      case 1:
        // 修改市
        // 把区设为首个,改变区数组
        data.multiIndex[2] = 0;
        getSubArea(that, function(res) {
          data.multiArray[2] = res;
          that.setData({
            ...data,
            city_name: data.multiArray[1][data.multiIndex[1]].name,
            city_code: data.multiArray[1][data.multiIndex[1]].code
          });
        }, data.multiArray[1][data.multiIndex[1]].code);
        break;
      case 2:
        // 修改区
        that.setData({
          ...data,
          area_name: data.multiArray[2][data.multiIndex[2]].name,
          area_code: data.multiArray[2][data.multiIndex[2]].code
        });
        break;
      default:
        break;
    }
  },

  handleRateChange: function(e) {
    const {
      rateList
    } = this.data;
    this.setData({
      contract_rate: rateList[e.detail.value]
    })
  },

  handleSubmit: function(e) {
    this.setData({
      ...e.detail.value
    })
    // 表单验证
    const _data = this.data;
    const arr = [{
        type: 'range2_30',
        value: _data.short_name,
        message: '请输入2-30位商户简称'
      },
      {
        type: 'required',
        value: _data.category_code,
        message: '请选择行业类目'
      },
      {
        type: 'required',
        value: _data.store_name,
        message: '请输入门店名称'
      },
      {
        type: 'required',
        value: _data.door_media_id,
        message: '请上传门店门头照'
      },
      {
        type: 'required',
        value: _data.environment_media_id,
        message: '请输入门店环境照'
      },
      {
        type: 'required',
        value: _data.province_code,
        message: '请选择经营地址'
      },
      {
        type: 'required',
        value: _data.city_code,
        message: '请选择经营地址'
      },
      {
        type: 'required',
        value: _data.area_code,
        message: '请选择经营地址'
      },
      {
        type: 'required',
        value: _data.detail_address,
        message: '请输入详细地址'
      },
      {
        type: 'required',
        value: _data.service_mobile,
        message: '请输入正确的客服电话'
      },
      {
        type: 'required',
        value: _data.connect_name,
        message: '请输入联系人姓名'
      },
      {
        type: 'required',
        value: _data.connect_mobile,
        message: '请输入正确的联系人手机号'
      },
      {
        type: 'required',
        value: _data.principal,
        message: '请输入负责人姓名'
      },
      {
        type: 'required',
        value: _data.card_id,
        message: '请输入身份证号'
      },
      {
        type: 'required',
        value: _data.card_validity_start_time,
        message: '请输入身份证有效期开始时间'
      },
      {
        type: 'required',
        value: _data.card_validity_type,
        message: '请选择证件是否长期有效'
      },
      // 证件长期有效不验证结束时间
      {
        type: 'required',
        value: _data.card_validity_type == 2 ? _data.card_validity_end_time : 1,
        message: '请输入身份证有效期结束时间'
      },
      {
        type: 'required',
        value: _data.bank_card_number,
        message: '请输入银行卡号'
      },
      {
        type: 'required',
        value: _data.bank_id,
        message: '请选择开户银行'
      },
      {
        type: 'required',
        value: _data.bank_id == 18 ? _data.branch_bank_id : 1,
        message: '请选择支行银行'
      },
      {
        type: 'required',
        value: _data.bank_province_code,
        message: '请选择开户城市'
      },
      {
        type: 'required',
        value: _data.bank_city_code,
        message: '请选择开户城市'
      },
      {
        type: 'required',
        value: _data.contract_rate,
        message: '请选择签约费率'
      },
    ]
    Currency.wxValidate(arr, this);
    if (this.data.errorString) {
      wx.showToast({
        title: this.data.errorString,
        icon: 'none'
      })
    } else {
      if (this.data.merchant_id) {
        editMerchant(this);
      } else {
        addMerchant(this);
      }
    }
  }

})
/**********************普通方法************************** */
// 刷新
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function() {
      getCategory(that);
      getRate(that);
      if (that.data.merchant_id) {
        marchantDetail(that);
      };
      // 加载页面时先获取省,在根据第一个获取市,在根据市第一个获取区
      let promise_p = new Promise(function(resolve, reject) {
        getProvince(that, function(res) {
          let multiArray = that.data.multiArray.map(item => item);
          multiArray[0] = res;
          that.setData({
            multiArray
          });
          resolve(res);
        });
      })
      let Promise_c = function(p) {
        return new Promise(function(resolve, reject) {
          getSubArea(that, function(res) {
            let multiArray = that.data.multiArray.map(item => item);
            multiArray[1] = res;
            that.setData({
              multiArray
            })
            resolve(res)
          }, p[0].code);
        })
      }
      promise_p.then(function(p) {
        Promise_c(p).then(function(c) {
          getSubArea(that, function(res) {
            let multiArray = that.data.multiArray.map(item => item);
            multiArray[2] = res;
            that.setData({
              multiArray
            })
          }, c[0].code)
        })
      })

    },
    function() {},
  )
}


/********************接口方法*************************** */
// 获取一级行业类目  接口
function getCategory(that) {
  let data = {};
  Request.request_data(
    Server.GET_CATEGORY(),
    data,
    function(res) {
      Currency.log('接口请求成功');
      let {
        CategoryArray
      } = that.data;
      CategoryArray[0] = res;
      that.setData({
        CategoryArray,
        p_id: res[0].code
      })
      // 获取二级类目
      getSubCategory(that);
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取二级行业类目  接口
function getSubCategory(that) {
  let data = {};
  data['p_id'] = that.data.p_id;
  Request.request_data(
    Server.GET_SUB_CATEGORY(),
    data,
    function(res) {
      Currency.log('接口请求成功');
      let {
        CategoryArray
      } = that.data;
      CategoryArray[1] = res;
      that.setData({
        CategoryArray
      })
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取省  接口
function getProvince(that, success) {
  let data = {};
  Request.request_data(
    Server.GET_PROVINCE(),
    data,
    function(res) {
      success(res);
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取市区 接口
function getSubArea(that, success, code) {
  let data = {};
  code && (data['area_parent_code'] = code);
  Request.request_data(
    Server.GET_SUB_AREA(),
    data,
    function(res) {
      success(res);
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 获取费率接口
function getRate(that) {
  let data = {};
  Request.request_data(
    Server.GET_RATE(),
    data,
    function(res) {
      that.setData({
        rateList: res
      })
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

// 添加小微商户接口
function addMerchant(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  const _data = that.data;
  data = {
    token,
    submit_type: 1,
    short_name: _data.short_name,
    category_code: _data.category_code,
    store_name: _data.store_name,
    door_photo: _data.door_photo,
    door_media_id: _data.door_media_id,
    environmental_photo: _data.environmental_photo,
    environment_media_id: _data.environment_media_id,
    province_code: _data.province_code,
    city_code: _data.city_code,
    area_code: _data.area_code,
    detail_address: _data.detail_address,
    service_mobile: _data.service_mobile,
    connect_name: _data.connect_name,
    connect_mobile: _data.connect_mobile,
    principal: _data.principal,
    card_front: _data.card_front,
    card_front_media_id: _data.card_front_media_id,
    card_reverse: _data.card_reverse,
    card_reverse_media_id: _data.card_reverse_media_id,
    card_id: _data.card_id,
    card_validity_start_time: _data.card_validity_start_time,
    card_validity_type: _data.card_validity_type,
    bank_card_number: _data.bank_card_number,
    bank_id: _data.bank_id,
    bank_province_code: _data.bank_province_code,
    bank_city_code: _data.bank_city_code,
    branch_bank_id: _data.branch_bank_id,
    contract_rate: _data.contract_rate
  }
  if (_data.card_validity_type == 2) {
    // 非长期
    data['card_validity_end_time'] = _data.card_validity_end_time
  }
  Request.request_data(
    Server.XW_MERCHANT_ADD(),
    data,
    function(res) {
      that.setData(res);
      if (that.data.shmerchant_id) {
        // xwAccountAdd(that);
      } else {
        const {
          applyment_id,
          business_code
        } = res;
        const obj = {
          applyment_id,
          business_code
        };
        const objStr = Currency.encodeSearchParams(obj);
        wx.redirectTo({
          url: '/pages/xw_business/feedback?' + objStr
        })
      }
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
      if (res.data.errCode != 0) {
        if (typeof res.data.data != 'undefined') {
          that.setData({
            errorString: res.data.data.detail_msg
          });
        } else {
          that.setData({
            errorString: res.data.errMsg
          });
        }
        wx.showToast({
          title: that.data.errorString,
          icon: 'none',
          duration: 2000
        })
      }
    });
}

// 编辑小微商户接口
function editMerchant(that) {
  let data = {};
  const token = wx.getStorageSync('token');
  const _data = that.data;
  data = {
    token,
    submit_type: 1,
    merchant_id: _data.merchant_id,
    short_name: _data.short_name,
    category_code: _data.category_code,
    store_name: _data.store_name,
    door_photo: _data.door_photo,
    door_media_id: _data.door_media_id,
    environmental_photo: _data.environmental_photo,
    environment_media_id: _data.environment_media_id,
    province_code: _data.province_code,
    city_code: _data.city_code,
    area_code: _data.area_code,
    detail_address: _data.detail_address,
    service_mobile: _data.service_mobile,
    connect_name: _data.connect_name,
    connect_mobile: _data.connect_mobile,
    principal: _data.principal,
    card_front: _data.card_front,
    card_front_media_id: _data.card_front_media_id,
    card_reverse: _data.card_reverse,
    card_reverse_media_id: _data.card_reverse_media_id,
    card_id: _data.card_id,
    card_validity_start_time: _data.card_validity_start_time,
    card_validity_end_time: _data.card_validity_end_time,
    card_validity_type: _data.card_validity_type,
    bank_card_number: _data.bank_card_number,
    bank_id: _data.bank_id,
    bank_province_code: _data.bank_province_code,
    bank_city_code: _data.bank_city_code,
    branch_bank_id: _data.branch_bank_id,
    contract_rate: _data.contract_rate
  }
  Request.request_data(
    Server.XW_MERCHANT_EDIT(),
    data,
    function(res) {
      that.setData(res);
      const {
        applyment_id,
        business_code,
        shmerchant_id
      } = res;
      const obj = {
        applyment_id,
        business_code,
        shmerchant_id
      }
      const objStr = Currency.encodeSearchParams(obj);
      wx.redirectTo({
        url: '/pages/xw_business/feedback?' + objStr
      })
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
      if (res.data.errCode != 0) {
        if (typeof res.data.data != 'undefined') {
          that.setData({
            errorString: res.data.data.detail_msg
          });
        } else {
          that.setData({
            errorString: res.data.errMsg
          });
        }
        wx.showToast({
          title: that.data.errorString,
          icon: 'none',
          duration: 2000
        })
      }
    });
}

// 小微商户详情接口
function marchantDetail(that) {
  let data = {};
  const {
    merchant_id
  } = that.data;
  const token = wx.getStorageSync('token');
  data['merchant_id'] = merchant_id;
  data['token'] = token;
  Request.request_data(
    Server.XW_MERCHANT_DETAIL(),
    data,
    function(res) {
      Currency.log('接口请求成功');
      that.setData(res);
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
    });
}

//添加小微收款账号  接口
function xwAccountAdd(that) {
  let data = {};
  let token = wx.getStorageSync('token');
  data['token'] = token;
  data['merchant_id'] = that.data.shmerchant_id;
  data['wechat_pay_merchant_id'] = that.data.wechat_pay_merchant_id;
  Request.request_data(
    Server.WX_ACCOUNT_ADD(),
    data,
    function(res) {
      Currency.log('接口请求成功');
      const {
        applyment_id,
        business_code
      } = that.data;
      const obj = {
        applyment_id,
        business_code
      };
      const objStr = Currency.encodeSearchParams(obj);
      wx.redirectTo({
        url: '/pages/xw_business/feedback?' + objStr
      })
    },
    function(res) {
      Currency.log('接口请求成功');
    },
    function(res) {
      Currency.log('登入请求返回的数据');
      Currency.log(res);
      
    });
}