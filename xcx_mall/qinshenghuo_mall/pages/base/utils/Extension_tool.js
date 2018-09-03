//接口地址
var MyHttp = require('httpurl.js');
//日志打印工具
var MyUtils = require('utils.js');
//请求方法
var MyRequest = require('request_management.js');
//生成签名，获取商户ID
var MySign = require('sign.js');


//通用错误提示
function error(that, res) {
	//关闭下拉动画
	wx.stopPullDownRefresh();
	//关闭加载中动画
	wx.hideLoading();
	var show = ['2', '页面加载失败', res ? '（' + res + '）' : '', '2'];
	if (res == 404) {
		show = ['1', '您的网络好像出现了问题！', '', '1'];
	} else if (res == 10002) {
		show = ['3', '登录已失效', '', '3'];
	}
	that.setData({
		show_loading_faill: false,
		show: show,
	});
}

//自定义错误提示
function custom_error(that, show_img, show_text, show_text2, show_an) {
	//关闭下拉动画
	wx.stopPullDownRefresh();
	//关闭加载中动画
	wx.hideLoading();
	var show = [show_img, show_text, show_text2, show_an];
	that.setData({
		show_loading_faill: false,
		show: show,
	});
}

//弹窗窗口
function show_top_msg(that, content) {
	//关闭下拉动画
	wx.stopPullDownRefresh();
	//关闭加载中动画
	wx.hideLoading();
	if (content == 404) {
		content = '您的网络好像出现了问题！';
	} else if (content == 10002) {
		content = '登录失效';
	}
	that.setData({
		isTopTips: true,
		TopTipscontent: content
	});

	setTimeout(function () {
		that.setData({
			isTopTips: false
		});
	}, 1500);
}

//全局存储openid
function getOpenid() {
	try {
		var openid = wx.getStorageSync('openid')
		if (openid) {
			return openid;
		} else {
			return '';
		}
	} catch (e) {
		return '';
	}
}

//全局存储unionid
function getUnionid() {
	try {
		var unionid = wx.getStorageSync('unionid')
		if (unionid) {
			return unionid;
		} else {
			return '';
		}
	} catch (e) {
		return '';
	}
}


//全局存储用户信息
function getuserlnfo() {
	try {
		var userlnfo = wx.getStorageSync('userlnfo')
		if (userlnfo) {
			return userlnfo;
		} else {
			return '';
		}
	} catch (e) {
		return '';
	}
}


//非跳转注册方式方式
function registerrule(that, syntony, e) {
	var data = {};
	data['sign'] = MySign.sign(data);
	data['mchid'] = MySign.getMchid();

	MyRequest.request_data(
		MyHttp.REGISTERRULE(),
		data,
		function (res) {
			if (res.rule_type == 1) {
				var openid = getOpenid();
				if (!openid) {
					that.setData({
						login: true,
					})
				} else {
					//自动注册
					small_program_login(that, syntony, e);
				}
			} else if (res.rule_type == 2) {
				//关闭加载中动画
				wx.hideLoading();
				//手机号
				wx.navigateTo({
					url: '../account_number/bind_account',
				})
			} else {
				show_top_msg(that, '商户设置错误');
			}
		},
		function (res) {
			show_top_msg(that, res ? res : "失败");
		},
		function (res) {
			MyUtils.myconsole("请求注册方式");
			MyUtils.myconsole(res);
		});
}

// 跳转注册方式
function skip(that, syntony, e) {
	var data = {};
	data['sign'] = MySign.sign(data);
	data['mchid'] = MySign.getMchid();

	MyRequest.request_data(
		MyHttp.REGISTERRULE(),
		data,
		function (res) {
			if (res.rule_type == 1) {
				syntony(that, e);
			} else if (res.rule_type == 2) {
				//关闭加载中动画
				wx.hideLoading();
				//手机号
				wx.navigateTo({
					url: '../account_number/bind_account',
				})
			} else {
				show_top_msg(that, '商户设置错误');
			}
		},
		function (res) {
			show_top_msg(that, res ? res : "失败");
		},
		function (res) {
			MyUtils.myconsole("请求注册方式");
			MyUtils.myconsole(res);
		});
}

// 页面非跳转注册方式
function on_skip(that, syntony, e) {
	var data = {};
	data['sign'] = MySign.sign(data);
	data['mchid'] = MySign.getMchid();

	MyRequest.request_data(
		MyHttp.REGISTERRULE(),
		data,
		function (res) {
			if (res.rule_type == 1) {
				var openid = getOpenid();
				if (!openid) {
					that.setData({
						login: true,
					})
				} else {
					//自动注册
					small_program_login(that, syntony, e);
				}
			} else if (res.rule_type == 2) {
				if (e == 1) {
					that.setData({
						show_loading_faill: true,
					})
				} else {
					//手机号
					Currency.custom_error(that, '3', '登入失效', '', '3');
				}
			} else {
				show_top_msg(that, '商户设置错误');
			}
		},
		function (res) {
			show_top_msg(that, res ? res : "失败");
		},
		function (res) {
			MyUtils.myconsole("请求注册方式");
			MyUtils.myconsole(res);
		});
}


//登录
function small_program_login(that, syntony, e) {
	var userlnfo = getuserlnfo();
	var data = {};
	data['openid'] = getOpenid();
	data['unionid'] = getUnionid();
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	data['channel'] = '2';

	MyRequest.request_data(
		MyHttp.OPENID_LOGIN(),
		data,
		function (res) {
			//关闭加载中动画
			wx.hideLoading();
			if (res) {
				//储存token
				try {
					wx.setStorageSync('token', res.token);
					syntony(that, e);
				} catch (e) {
				}
			} else {
				wx.showToast({
					title: '登入失败，请稍后重试',
					icon: 'none',
					duration: 2000
				})
			}
		},
		function (res) {
			if (userlnfo) {
				//自动注册
				small_program_registration(that, syntony, e)
			} else {
				wx.showToast({
					title: '登入失败，请稍后重试',
					icon: 'none',
					duration: 2000
				})
			}
		},
		function (res) {
			MyUtils.myconsole("请求登录返回的数据：")
			MyUtils.myconsole(res);
		})

}


//注册
function small_program_registration(that, syntony, e) {
	var userlnfo = getuserlnfo();
	var data = {};
	data['openid'] = getOpenid();
	data['unionid'] = getUnionid();
	//用户昵称
	data['nickname'] = userlnfo.nickName;
	//头像
	data['head_img'] = userlnfo.avatarUrl;
	//性别
	data['sex'] = userlnfo.gender;
	data['mchid'] = MySign.getMchid();
	data['sign'] = MySign.sign(data);
	data['channel'] = '2';


	MyRequest.request_data(
		MyHttp.REGISTER(),
		data,
		function (res) {
			small_program_login(that, syntony, e)
		},
		function (res) {
			wx.showToast({
				title: '注册失败会员，请稍后重试',
				icon: 'none',
				duration: 2000
			})
		},
		function (res) {
			//关闭加载中动画
			wx.hideLoading();
			MyUtils.myconsole("请求注册返回的数据：")
			MyUtils.myconsole(res);
		})

}

//建立调用
module.exports = {
	// 页面非跳转注册方式
	on_skip: on_skip,
	// 跳转注册方式
	skip: skip,
	//注册方式
	registerrule: registerrule,
	//通用错误提示
	error: error,
	// 自定义错误提示
	custom_error: custom_error,
	//弹窗窗口
	show_top_msg: show_top_msg,
	//全局存储openid
	getOpenid: getOpenid,
	//全局存储unionid
	getUnionid: getUnionid,
	//全局存储用户信息
	getuserlnfo: getuserlnfo,
}