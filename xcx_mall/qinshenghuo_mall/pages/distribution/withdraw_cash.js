// 提现申请
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
    // 提现方式  1-微信  2-支付宝 3-银行卡
    draw_method: '1',
    //倒计时
    show_secound: 'none',
    //页面隐藏
    show_loading_faill: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //隐藏页面转发按钮
    wx.hideShareMenu();
    //页面初始化
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
    //获取缓存中储存的支付方式
    try {
      var draw_method = wx.getStorageSync('flag');
      console.log(draw_method)
      if (draw_method) {
        this.setData({
          draw_method: draw_method,
        });
      }
    } catch (e) {
    }
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
    //清楚选中的支付方式
    try {
      wx.removeStorageSync('flag')
    } catch (e) {
    }
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
  // 跳转 卡片选择
  to_withdraw_cash_mode: function (e) {
    this.setData({
      phone: null,
      code: null,
      user_name: null,
      wechat_no: null,
      withdraw_money: null,
      alipay_no: null,
      bank_card_name: null,
      bank_name: null,
      bank_card_no: null,
      mun: null,
    })
    wx.navigateTo({
      url: './withdraw_cash_mode',
    })
  },
  //获取手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  //获取真实姓名
  userNameInput: function (e) {
    this.setData({
      user_name: e.detail.value
    });
  },
  //获取微信号
  wxNumberInput: function (e) {
    this.setData({
      wechat_no: e.detail.value
    });
  },
  //获取提现金额
  withDrawInput: function (e) {
    this.setData({
      withdraw_money: e.detail.value
    });
  },
  //获取支付宝账号 
  aliAccountInput: function (e) {
    this.setData({
      alipay_no: e.detail.value
    });
  },
  //获取开户人姓名
  accountNameInput: function (e) {
    this.setData({
      bank_card_name: e.detail.value
    });
  },
  //获取开户行 
  banckInput: function (e) {
    this.setData({
      bank_name: e.detail.value
    });
  },
  //银行卡号
  banckCardNoInput: function (e) {
    this.setData({
      bank_card_no: e.detail.value
    });
  },

  //确认提现
  withdraw: function (e) {
    var that = this;
    if (that.data.myphone) {  //手机号存在时，避免验证码提示
      that.setData({
        code: 1
      });
    }
    var msg = e.detail.value;
    to_withdraw(that, msg);
  },
  //获取验证码
  bindtapcode: function () {
    console.log(11);
    this.setData({
      code_zx: 'none'
    })
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.phone)) {
      Extension.show_top_msg(this, '手机号格式有误');
    } else {
      get_code(this, this.data.phone);
    }
  },
  // 修改个人资料
  edit_user_information: function (e) {
    var that = this;
    this.setData({
      code: e.detail.value
    });
    if (that.data.phone) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(that.data.phone)) {
        Extension.show_top_msg(that, '手机号格式有误');
      } else {
        if (that.data.phone != that.data.account && !that.data.code) {
          Extension.show_top_msg(that, '请输入验证码');
        } else {
          //加载中动画
          wx.showLoading({
            title: '加载中',
          });
          console.log("调用")
          editPrefectData(that);
        }
      }
    } else {
      Extension.show_top_msg(that, '请输入手机号');
    }
  },
  //修改姓名
  edit_user_name: function(e){
    if (this.data.user_name){
      editPrefectData(this);
    }
	},

	//重试事件
	retry_onclick: function () {
		// 初始化页面
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
	},

})

/***************普通方法函数***************/
//页面初始化
function Refresh(that) {
	MySign.getExtMchid(function () {
		//授权
		var openid = Extension.getOpenid();
		if (!openid) {
			var login = true;
		} else {
			var login = false;
			//获取分销商信息
			getDistribution(that);
		}
		that.setData({
			login: login,
		})
	}, function () {
		//自定义错误提示
		Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');

  });
}

//确认提现弹窗
function ok_Wdraw() {
  wx.showModal({
    title: '',
    content: '已申请，等待审核',
    showCancel: false,
    success(res) {
      wx.navigateBack({
        delta: 1,
      })
    }
  });
}

//判断提现方式 提示框 提现 
function to_withdraw(that, msg) {
  switch (that.data.draw_method) {
    case '1':
      if (!that.data.phone) {
        Extension.show_top_msg(that, '请输入手机号');
      } else if (!that.data.code) {
        Extension.show_top_msg(that, '请输入验证码');
      } else if (!that.data.user_name) {
        Extension.show_top_msg(that, '请输入真实姓名');
      } else if (!that.data.wechat_no) {
        Extension.show_top_msg(that, '请输入微信号');
      } else if (!that.data.withdraw_money) {
        Extension.show_top_msg(that, '请输入提现金额');
      } else {
        if (that.data.withdraw_money > that.data.commission) {
          Extension.show_top_msg(that, "可提现佣金不足");
        } else {
          getWithDrawCash(that, msg);
        }
      }
      break;
    case '2':
      if (!that.data.phone) {
        Extension.show_top_msg(that, '请输入手机号');
      } else if (!that.data.code) {
        Extension.show_top_msg(that, '请输入验证码');
      } else if (!that.data.alipay_no) {
        Extension.show_top_msg(that, '请输入支付宝账号');
      } else if (!that.data.withdraw_money) {
        Extension.show_top_msg(that, '请输入提现金额');
      } else {
        if (that.data.withdraw_money > that.data.commission) {
          Extension.show_top_msg(that, "可提现佣金不足");
        } else {
          getWithDrawCash(that, msg);
        }
      }
      break;
    case '3':
      // 银联
      if (!that.data.phone) {
        Extension.show_top_msg(that, '请输入手机号');
      } else if (!that.data.code) {
        Extension.show_top_msg(that, '请输入验证码');
      } else if (!that.data.user_name) {
        Extension.show_top_msg(that, '请输入真实姓名');
      } else if (!that.data.bank_card_name) {
        Extension.show_top_msg(that, '请输入开户人姓名');
      } else if (!that.data.bank_name) {
        Extension.show_top_msg(that, '请输入开户行');
      } else if (!that.data.bank_card_no) {
        Extension.show_top_msg(that, '请输入正确的银行卡号');
      } else if (!that.data.withdraw_money) {
        Extension.show_top_msg(that, '请输入提现金额');
      } else {
        if (that.data.withdraw_money > that.data.commission) {
          Extension.show_top_msg(that, "可提现佣金不足");
        } else {
          getWithDrawCash(that, msg);
        }
      }
      break;
  }
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




/***************接口数据获取方法函数***************/

// 获取提现申请数据
function getWithDrawCash(that, msg) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data = msg;
		data['sign'] = MySign.sign(data);
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['withdraw_money'] = that.data.withdraw_money;
		data['withdraw_type'] = that.data.draw_method;
		MyRequest.request_data(
			MyHttp.GETWITHDRAWCASH(),
			data,
			function (res) {
				ok_Wdraw();
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : "数据加载失败");
			},
			function (res) {
				MyUtils.myconsole("请求提现申请数据的数据：");
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}

// 获取分销商信息
function getDistribution(that) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['sign'] = MySign.sign(data);
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		MyRequest.request_data(
			MyHttp.GETDISTRIBUTION(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						commission: res.info.commission
					});
					if (res.info.status == 2) {
						that.setData({
							anomaly_code: 2,
						});
					} else {
						if (res.info.audit_status == 2) {
							that.setData({
								distribution: res.info,
								anomaly_code: null,
							});
							//获取个人信息
							getPrefectData(that)
						} else {
							that.setData({
								anomaly_code: 2,
							});
						}
					}
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '', '2');

				}
			},
			function (res) {
				if (res == 2) {
					that.setData({
						show_loading_faill: true,
						anomaly_code: 1,
					});
				} else {
					//错误提示
					Extension.error(that, res);
				}
			},
			function (res) {
				MyUtils.myconsole("请求分销商信息的数据");
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})

	}
}

//获取个人信息
function getPrefectData(that) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.USER_PREFECT(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						username: res.user_name,
						user_name: res.user_name,
						phone: res.account,
						account: res.account,
						myphone: res.account,
					})
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '', '2');
				}
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

// 获取验证码的请求
function get_code(that, phone) {
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
      startTime(that, 60)
      wx.hideLoading()
      wx.showToast({
        title: '验证码发送成功',
        icon: 'success',
        duration: 1500
      })
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


//修改个人资料
function editPrefectData(that) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
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

		MyRequest.request_data(
			MyHttp.EDIT_USER_PREFECT(),
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
				Extension.show_top_msg(that, res ? res : '修改个人信息失败！');
			},
			function (res) {
				MyUtils.myconsole("请求修改个人资料的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}
