// 新增收货地址

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
    //性别切换
    curSex: 1,
    name: '',
    telephone: '',
    address: '',
    full_address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    var that = this;
	 if (options.addressId && options.addressId != "undefined") {
      this.setData({
        addressId: options.addressId,
      });
    }
	 if (options.switch && options.switch != "undefined") {
		 this.setData({
			 add_switch: options.switch
		 });
	 }
     //初始化页面
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
  // 性别切换
  tab: function (e) {
    var dataId = e.currentTarget.dataset.id;
    this.setData({
      curSex: dataId
    });
  },
  // 收货地址
  openLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        // console.log(res);
        // var name = res.name;
        var address = res.address;
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("收货地址");
        console.log(address)
        that.setData({
          address: address,
          lat: latitude,
          lng: longitude
        });
      },
      fail:function(){
        wx.showToast({
          title: '获取位置失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //输入联系人
  input_name: function (event) {
    this.setData({
      name: event.detail.value
    });
  },
  //输入手机号
  input_phone: function (event) {
    this.setData({
      telephone: event.detail.value
    });
  },
  //输入详细地址
  input_full_address: function (event) {
    this.setData({
      full_address: event.detail.value
    });
  },
  // 保存地址
  formSubmit: function (event) {
     let that = this;
     this.setData({
        is_formSubmit: 1,
     })
    var title = null;
    let inputValues = event.detail.value;
    if (!this.data.name) {
      var title = '请输入收货人姓名';
    } else if (!that.data.telephone) {
      var title = '请输入手机号';
    } else {
      // isPhone(that,that.data.telephone);
      var reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!reg.test(that.data.telephone)) {
        var title = '请输入有效的手机号！';
      } else if (!that.data.address) {
        var title = '请输入收货地址';
      } else if (!that.data.full_address) {
        var title =  '请输入详细地址';
      } else {
        if (that.data.addressId) {
          // 编辑收货地址
          editAdresss(that, inputValues);
        } else {
          // 添加收货地址
          addAdresssGet(that, inputValues);
        }
      }
    }
    if (title){
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
    }
	 this.setData({
		 is_formSubmit: 2,
	 })
  },
  // 删除地址
  deleteAddress: function () {
    var that = this;
    wx.showModal({
      title: '删除地址',
      content: '确定删除地址吗？',
      success: function(res){
        if (res.confirm){
          deleteAddress(that, that.data.addressId);
        }
      }
    })
  },
  //重试事件
  retry: function () {
    //初始化页面
    Refresh(this);
  }
})
/***********************普通方法****************************/

//刷新页面
function Refresh(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
      if (that.data.addressId) {
        // 获取收货地址详情
        getAddressDetail(that);
      } else {
        that.setData({
          //页面显示
          show: true,
        })
      }
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        log: 0,
        error: 1,
        error_text: "商户不存在",
      })
    },
  )
}

function add_rem(){
	try {
		wx.removeStorageSync('address_id');
		wx.removeStorageSync('address');
		wx.removeStorageSync('lng');
		wx.removeStorageSync('lat');
	} catch (e) {
		// Do something when catch error
	}
}

/*****************获取数据方法*************************/
// 添加收货地址
function addAdresssGet(that, inputValues) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data = inputValues;
    data['token'] = token;
    data['sex'] = that.data.curSex;
    data['address'] = that.data.address;
    data['lat'] = that.data.lat;
    data['lng'] = that.data.lng;
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();

    Request.request_data(
      Server.ADDADDRESSGET(),
      data,
      function (res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
		  var delta = 1;
		  if (that.data.add_switch == 1) {
			  //储存收货地址id
			  try {
				  if (res.address_id) {
					  wx.setStorageSync('address_id', res.address_id)
				  }
				  wx.setStorageSync('address', that.data.address)
				  wx.setStorageSync('lng', that.data.lng)
				  wx.setStorageSync('lat', that.data.lat)
			  } catch (e) {
			  }
			  delta = 2;
		  }
		  wx.navigateBack({
			  delta: delta,
		  })
      },
      function (res) {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      },
      function (res) {
        Journal.myconsole('添加收货地址请求的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}

// 编辑收货地址
function editAdresss(that, inputValues) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data = inputValues;
    data['id'] = that.data.addressId;
    data['token'] = token;
    data['sex'] = that.data.curSex;
    data['address'] = that.data.address;
    data['lat'] = that.data.lat;
    data['lng'] = that.data.lng;
    data['sign'] = Sign.sign();
    data['mchid'] = Sign.getMchid();

    Request.request_data(
      Server.EDITADDRESS(),
      data,
      function (res) {
			add_rem();
        wx.showToast({
          title: '编辑成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: '1',
        })
      },
      function (res) {
        wx.showToast({
          title: '编辑失败',
          icon: 'none',
          duration: 2000
        })
      },
      function (res) {
        Journal.myconsole('编辑收货地址请求数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}



//获取地址详情
function getAddressDetail(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data['token'] = token;
    data['id'] = that.data.addressId;
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign();
    Request.request_data(
      Server.ADDRESSDETAIL(),
      data,
      function (res) {
         if (res) {
         //浏览量统计
         Currency.visit(that);
          that.setData({
            show: true,
            addressDetail: res,
            name: res.name,
            telephone: res.telephone,
            address: res.address,
            full_address: res.full_address,
            lng: res.lng,
            lat: res.lat,
            curSex: res.sex,
          });
        } else {
          that.setData({
            show: false,
            retry_an: 1,
            log: 0,
            error: 1,
            error_text: "地址不存在",
          })
        }
      },
      function (res) {
        that.setData({
          show: false,
          retry_an: 1,
          log: 0,
          error: 0,
          error_text: res,
        })
      },
      function (res) {
        Journal.myconsole('地址详情请求的数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}

// 删除地址
function deleteAddress(that) {
  var token = Sign.getToken();
  if (token) {
    let data = {};
    data['token'] = token;
    data['id'] = that.data.addressId;
    data['mchid'] = Sign.getMchid();
    data['sign'] = Sign.sign();
    Request.request_data(
      Server.DELETEADDRESS(),
      data,
		function (res) {
			add_rem();
        wx.showToast({
          title: '已删除',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: '1',
        })
      },
      function (res) {
        wx.showToast({
          title: '无法删除',
          icon: 'none',
          duration: 2000
        })
      },
      function (res) {
        Journal.myconsole('删除地址请求数据');
        Journal.myconsole(res);
      });
  } else {
    that.setData({
      show: false,
      retry_an: 0,
      error: 1,
      log: 1,
      error_text: "绑定手机号",
    })
  }
}
