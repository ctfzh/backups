// 个人信息js

// 引用日志输出
var Journal = require('../tool/journal.js')
//引入签名加密商户号
var Sign = require('../tool/sign.js')
//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
//全局通用js
var Currency = require('../tool/currency.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //倒计时
    show_secound: 'none',
    array: ['男', '女'],
    show_loading_faill: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中动画
    // wx.showLoading({
    //   title: '加载中',
    // });
    //关闭微信右上角菜单分享
    wx.hideShareMenu();
    // 初始化页面
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

  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    });
    // 初始化页面
    Refresh(this);
  },

  //手机号编辑
  bindphone: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  //验证码输入
  bindcode: function (e) {
    this.setData({
      code: e.detail.value,
    })
  },
  //姓名编辑
  binduser_name: function (e) {
    this.setData({
      user_name: e.detail.value,
    })
  },
  // 性别选择
  bindPickerChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  //生日日期选择
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  //身份证编辑
  bindID_number: function (e) {
    this.setData({
      ID_number: e.detail.value,
    })
  },
  //邮箱编辑
  bindemail: function (e) {
    this.setData({
      email: e.detail.value,
    })
  },
  //详细地址编辑
  bindaddress: function (e) {
    this.setData({
      address: e.detail.value,
    })
  },
  //教育背景编辑
  bindeducational: function (e) {
    this.setData({
      educational: e.detail.value,
    })
  },
  //职业编辑
  bindoccupation: function (e) {
    this.setData({
      occupation: e.detail.value,
    })
  },
  //行业编辑
  bindindustry: function (e) {
    this.setData({
      industry: e.detail.value,
    })
  },
  //收入编辑
  bindincome: function (e) {
    this.setData({
      income: e.detail.value,
    })
  },
  //兴趣爱好编辑
  bindinterest: function (e) {
    this.setData({
      interest: e.detail.value,
    })
  },
  //获取验证码
  bindtapcode: function () {
    this.setData({
      code_zx: 'none'
    })
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.phone)) {
      Currency.show_top_msg(this, '手机号格式有误');
    } else {
      get_code(this, this.data.phone);
    }
  },
  // 修改个人资料
  edit_user_information: function () {
    var that = this;
    if (that.data.phone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(that.data.phone)) {
        Currency.show_top_msg(that, '手机号格式有误');
      } else {
        if (that.data.phone != that.data.account && !that.data.code) {
          Currency.show_top_msg(that, '请输入验证码');
        } else {
          //加载中动画
          wx.showLoading({
            title: '加载中',
          });
          editPrefectData(that);
        }
      }
    } else {
      Currency.show_top_msg(that, '请输入手机号');
    }
  },
  //登入完成回调
  login_success: function () {
     Refresh(this);
	},

	//登入
	login_an(e) {
		Currency.registerrule(this, function (that) { Refresh(that) }, e);
	}
})

//初始化页面
function Refresh(that) {
  Sign.getExtMchid(
     function () {
		  //验证登入
		  var openid = Currency.getOpenid();
		  if (!openid) {
           that.setData({
              login: true,
           })
        } else {
           //页面浏览统计
           Currency.visit(that, 4)
           that.setData({
              login: false,
           })
           //获取个人信息
           getPrefectData(that);
        }
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}


/***************************接口调用***************************/
//获取个人信息
function getPrefectData(that) {
  var token = Sign.getToken();
	if (!token){
		Currency.custom_error(that, '3', '登录失效', '', '3');
  }else{
	var data = {};
	data['token'] = token;
	data['mchid'] = Sign.getMchid();
	data['sign'] = Sign.sign(data);
	Request.request_data(
		Server.USER_PREFECT(),
		data,
		function (res) {
			if (res) {
			that.setData({
				show_loading_faill: true,
				data: res,
				phone: res.account,
				account: res.account,
				user_name: res.user_name,
				ID_number: res.ID_number,
				email: res.email,
				address: res.address,
				educational: res.educational,
				occupation: res.occupation,
				industry: res.industry,
				income: res.income,
				interest: res.interest,
				sex: res.sex ? (res.sex == 1 ? 0 : 1) : '',
				birthday: res.birthday && res.birthday.length>0 ? res.birthday[0] + '-' + res.birthday[1] + '-' + res.birthday[2] : '',
				avatar: res.upload + res.avatar,
			})
			} else {
				Currency.custom_error(that, '3', '用户信息不存在', '', '2');
			}
		},
		function (res) {
			Currency.error(that, res);
		},
		function (res) {
			//关闭加载中动画
			wx.hideLoading();
			Journal.myconsole("请求个人信息的数据：");
			Journal.myconsole(res);
		})
	}
}


//修改个人资料
function editPrefectData(that) {
	var token = Sign.getToken();
	if (!token) {
		Currency.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = Sign.getMchid();
		data['sign'] = Sign.sign(data);
		//手机号
		data['phone'] = that.data.phone;
		//验证码
		if (that.data.code) {
			data['code'] = that.data.code;
		}
		//姓名
		if (that.data.user_name) {
			data['user_name'] = that.data.user_name;
		}
		//用户性别
		if (that.data.sex!=null) {
			data['sex'] = that.data.sex == 0 ? '1' : '2';
		}
		//生日
		if (that.data.birthday.length>0) {
			data['birthday'] = that.data.birthday;
		}
		//身份证号
		if (that.data.ID_number) {
			data['ID_number'] = that.data.ID_number;
		}
		//邮箱地址
		if (that.data.email) {
			data['email'] = that.data.email;
		}
		//详细地址
		if (that.data.address) {
			data['address'] = that.data.address;
		}
		//教育背景
		if (that.data.educational) {
			data['educational'] = that.data.educational;
		}
		//	职业
		if (that.data.occupation) {
			data['occupation'] = that.data.occupation;
		}
		//行业
		if (that.data.industry) {
			data['industry'] = that.data.industry;
		}
		//收入
		if (that.data.income) {
			data['income'] = that.data.income;
		}
		//	兴趣爱好
		if (that.data.interest) {
			data['interest'] = that.data.interest;
		}
		Request.request_data(
			Server.EDIT_USER_PREFECT(),
			data,
			function (res) {
				var phone = that.data.phone
				that.setData({
				account: phone,
				})
				wx.showToast({
				title: '修改成功',
				icon: 'success',
				duration: 1500
				})
			},
			function (res) {
				Currency.show_top_msg(that, res ? res : '修改个人信息失败！');
			},
			function (res) {
				//关闭加载中动画
				wx.hideLoading();
				Journal.myconsole("请求修改个人信息的数据：")
				Journal.myconsole(res);
			})
	}
}

//获取验证码
// 获取验证码的请求
function get_code(that, phone) {
  wx.showLoading({
    title: '获取验证码中...',
    mask: true,
  })
  var data = {};
  data['phone'] = phone;
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign(data);

  Request.request_data(
    Server.GET_CODE(),
    data,
    function (res) {
      startTime(that, 60)
      wx.hideLoading()
      wx.showToast({
        title: '验证码发送成功',
        icon: 'success',
        duration: 1500
      })
    },
    function (res) {
      Currency.show_top_msg(that, res ? res : '获取验证码失败');
    },
	  function (res) {
      //关闭加载中动画
		 wx.hideLoading();
		 Journal.myconsole("请求验证码的数据：")
		 Journal.myconsole(res);
    })
}

//倒计时
function startTime(that, second) {
  var time = setTimeout(function () {
    that.setData({
      second: second,
      show_secound: 'block'
    });
    if (second > 0) {
      startTime(that, second - 1);
    } else {
      clearInterval(time);
      that.setData({
        second: '重新获取验证码',
        show_secound: 'none',
        loading_code: false,
      });
    }
  }
    , 1000)
}