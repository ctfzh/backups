// pages/user/personal_information.js
// 个人信息
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
Page({

  /**
   * 页面的初始数据
   */
	data: {
		show_secound: 'none',
    sex_array:[
      {
        'id':1,
        'name':'男'
      },
      {
        'id': 2,
        'name': '女'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
    //关闭微信右上角菜单分享
    wx.hideShareMenu()
    wx.setNavigationBarTitle({
      title: '个人信息',
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
    //初始化页面
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
    //初始化页面
    Refresh(this);
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

  bindSexChange: function (e) {
    MyUtils.myconsole('性别：' + e.detail.value)
    this.setData({
      sex_index: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
//输入手机号
  bindInputPhone: function (e) {
    this.setData({
			phone: e.detail.value,
    })

  },
  bindInputName: function (e) {
    this.setData({
      user_name: e.detail.value,
    })

  },
  bindInputID_number: function (e) {
    this.setData({
      ID_number: e.detail.value,
    })

  },
  bindInputEmail: function (e) {
    this.setData({
      email: e.detail.value,
    })

  },
  bindInputAddress: function (e) {
    this.setData({
      address: e.detail.value,
    })

  },
  bindInputEducational: function (e) {
    this.setData({
      educational: e.detail.value,
    })

  },
  bindInputOccupation: function (e) {
    this.setData({
      occupation: e.detail.value,
    })

  },
  bindInputIndustry: function (e) {
    this.setData({
      industry: e.detail.value,
    })

  },
  bindInputIncome: function (e) {
    this.setData({
      income: e.detail.value,
    })

  },
  bindInputInterest: function (e) {
    this.setData({
      interest: e.detail.value,
    })

  },
	//填写验证码
	bindInputCode: function(e){
		this.setData({
			code: e.detail.value,
		})
	},
	//获取验证码
	bindtapcode: function(){
		this.setData({
			code_zx:'none'
		})
		get_code(this,this.data.phone)
	},
  //保存修改的资料
  edit_user_information_onclick: function () {
    MyUtils.myconsole('保存资料');
    var that = this;
    MyUtils.MyOnclick(
      function () {
        editPrefectData(that);
      })
  },
  // 选择图片
  add_img_onclick: function () {
    // var avatar = this.data.avatar;
    // var that = this;
    // wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     var tempFilePaths = res.tempFilePaths
    //     MyUtils.myconsole("选中的图片地址：");
    //     MyUtils.myconsole(tempFilePaths);
    //     MyRequest.uploadImg(that, 'wxHead', tempFilePaths[0], 'file',
    //       function (res) {
    //         MyUtils.myconsole("图片上传成功：");
    //         MyUtils.myconsole(res);
    //         MyUtils.myconsole("图片上传成功返回的图片地址：");
    //         MyUtils.myconsole(res.fileName);
    //         if (res && res.fileName) {
    //           that.setData({
    //             avatar:res.fileName,
    //           })
    //         } else {
    //           Extension.show_top_msg("图片加载失败")
    //         }

    //       },
    //       function (res) {
    //         MyUtils.myconsole("图片上传失败");
    //         MyUtils.myconsole(res);
    //         Extension.show_top_msg("图片加载失败")
    //       })
    //   }
    // })
    // MyUtils.imageSheet(this,
    // function(res){
    //   MyUtils.myconsole("选中的图片地址：");
    //   MyUtils.myconsole(res);
    // },
    // function(res){
    //   MyUtils.myconsole("调取失败：");
    //   MyUtils.myconsole(res);
    // })
  },
  	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		//初始化页面加载
		Refresh(this);
	},
	//登入完成回调
	login_success: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		Refresh(this);
	},
	//登入
	login_an(e) {
		Extension.registerrule(this, function (that) { Refresh(that) }, e);
	}
})





//页面加载，重试
function Refresh(that) {
  //获取商户号
  MySign.getExtMchid(
	  function () {
		  //授权
		  var openid = Extension.getOpenid();
		  if (!openid) {
			  var login = true;
		  } else {
			  var login = false;
			  getPrefectData(that)
		  }
		  that.setData({
			  login: login,
		  })
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}


//获取个人信息
function getPrefectData(that){
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data_new(
			MyHttp.USER_PREFECT(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						upload: res.upload,
						avatar: res.avatar,
						user_name: res.user_name,
						account: res.account,
						phone: res.account,
						sex_index: res.sex ? (res.sex == 1 ? 0 : 1) : '',
						time: res.birthday && res.birthday.length == 3 ? res.birthday[0] + '-' + res.birthday[1] + '-' + res.birthday[2] : '',
						ID_number: res.ID_number,
						email: res.email,
						address: res.address,
						educational: res.educational,
						occupation: res.occupation,
						industry: res.industry,
						income: res.income,
						interest: res.interest,
					})
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
				}
			},
			function (code, msg) {
				//错误提示
				Extension.error(that, msg);
			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求个人信息的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


//修改个人信息
function editPrefectData(that) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		MyUtils.myconsole('保存资料request--1');
		wx.showLoading({
			title: '资料修改中...',
			mask: true,
		})

		MyUtils.myconsole('保存资料request--2');
		var phone = that.data.phone;
		var code = that.data.code;
		var user_name = that.data.user_name;
		var sex_index = that.data.sex_index;
		var time = that.data.time;
		var ID_number = that.data.ID_number;
		var email = that.data.email;
		var address = that.data.address;
		var educational = that.data.educational;
		var occupation = that.data.occupation;
		var industry = that.data.industry;
		var income = that.data.income;
		var interest = that.data.interest;

		MyUtils.myconsole('保存资料request--3');
		var data = {};

		MyUtils.myconsole('保存资料request--4');
		if (phone) {
			data['phone'] = phone;
			data['code'] = code;
		}

		data['user_name'] = user_name;

		MyUtils.myconsole('保存资料request--5');
		if (sex_index) {
			data['sex'] = sex_index == 0 ? 1 : 2;
		} else {
			data['sex'] = '';
		}

		var avatar = that.data.avatar;
		if (avatar) {
			data['avatar'] = avatar;
		}

		data['birthday'] = time;


		data['ID_number'] = ID_number;

		data['email'] = email;

		data['address'] = address;

		data['occupation'] = occupation;

		data['industry'] = industry;


		data['income'] = income;


		data['interest'] = industry;


		MyUtils.myconsole('保存资料request--6');

		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data_new(
			MyHttp.EDIT_USER_PREFECT(),
			data,
			function (res) {
				Extension.show_top_msg(that, '个人资料修改成功');
				wx.hideLoading();
				that.setData({
					code_null: '',
				})
				getPrefectData(that)
			},
			function (code, msg) {
				MyUtils.myconsole("返回失败的数据：")
				MyUtils.myconsole('code:' + code);
				MyUtils.myconsole('msg' + msg);
				Extension.show_top_msg(that, msg ? msg : '个人资料修改失败');
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '个人资料修改失败');
			},
			function (res) {
				MyUtils.myconsole("请求修改个人信息的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


// 获取验证码的请求
function get_code(that,phone) {
	wx.showLoading({
		title: '获取验证码中...',
		mask: true,
	})
	var data = {};
	data['phone'] = phone;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);

	MyRequest.request_data(
		MyHttp.GET_CODE(),
		data,
		function (res) {
			MyUtils.myconsole("获取到的数据：")
			MyUtils.myconsole(res);
			wx.hideLoading()
			Extension.show_top_msg(that, '验证码发送成功');
			LoginRequest.startTime(that, LoginRequest.COUNTDOWNTIME())
		},
		function (res) {
			Extension.show_top_msg(that, res ? res : '获取验证码失败');
		},
		function (res) {
			MyUtils.myconsole("请求验证码的数据：")
			MyUtils.myconsole(res);
			//关闭下拉动画
			wx.stopPullDownRefresh();
			//关闭加载中动画
			wx.hideLoading();
		})
}
