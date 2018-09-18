//全局工具js

//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
// 引用日志输出
var Journal = require('../tool/journal.js');
//引入签名加密商户号
var Sign = require('../tool/sign.js');

//通用错误提示
function error(that, res) {
	//关闭下拉动画
	wx.stopPullDownRefresh();
	//关闭加载中动画
	wx.hideLoading();
	var show = ['2', '页面加载失败', res ? '（'+res+'）' : '' , '2'];
	if (res == 404) {
		show = ['1', '您的网络好像出现了问题！', '', '1'];
	} else if (res == 10002){
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
	var show = [show_img, show_text, show_text2 , show_an];
	that.setData({
		show_loading_faill: false,
		show: show,
	});
}

//弹窗窗口
function show_top_msg(that, content) {
	if (content==404){
		content = '您的网络好像出现了问题！';
	} else if (content == 10002){
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

//全局存储版本代号
function getWisdom() {
  try {
    var wisdom_type = wx.getStorageSync('wisdom_type')
    if (wisdom_type) {
      return wisdom_type;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

//全局存储版商户id
function getmerchant_id() {
  try {
    var merchant_id = wx.getStorageSync('merchant_id')
    if (merchant_id) {
      return merchant_id;
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


//访问量统计 1微页面 ，2优惠页 ，3，储值页 ，4其它页面
function visit(that,scene){
  //获取商户号
  Sign.getExtMchid(
    function () {
      var data = {};
      data['mchid'] = Sign.getMchid();
      data['sign'] = Sign.sign();
      data['openid'] = getOpenid();
      data['scene'] = scene;

      Request.request_data(
        Server.GETVISIT(),
        data,
        function (res) {
        },
        function (res) {
        },
			function (res) {
        })
	  },
	  function () {
		  Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
	  },
  )
}

//优惠券领取
function receive(that, card_id, member, active_id){
  if (that.data.disabled) {
    //加载中动画
    // wx.showLoading({
    //   title: '加载中',
    // })
    //防止多次点击
    that.setData({
      disabled: false,
    })
    if (card_id) {
      get_receive(that, card_id, member, active_id)
    } else {
      Journal.myconsole(card_id);
    }
  }
}


// 优惠券领取
function get_receive(that, card_id, member, active_id) {

  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['card_id'] = card_id;

  Request.request_data(
    Server.GETCARDIGN(),
    data,
    function (res) {
      if (res) {
        var cardId = res.cardId;
        var api_ticket = res.cardExt.api_ticket;
        var nonce_str = res.cardExt.nonce_str;
        var signature = res.cardExt.signature;
        var timestamp = res.cardExt.timestamp;
        if (active_id){
          var cardExt = '{"api_ticket":"' + api_ticket + '","nonce_str":"' + nonce_str + '","signature":"' + signature + '","timestamp":"' + timestamp + '","outer_str":"' + active_id + '"}'
        } else if (member) {
          var cardExt = '{"api_ticket":"' + api_ticket + '","nonce_str":"' + nonce_str + '","signature":"' + signature + '","timestamp":"' + timestamp + '","outer_str":"' + member + '"}'
        } else {
          var cardExt = '{"api_ticket":"' + api_ticket + '","nonce_str":"' + nonce_str + '","signature":"' + signature + '","timestamp":"' + timestamp + '"}'
        }
        wx.addCard({
          cardList: [
            {
              cardId: cardId,
              cardExt: cardExt,
            }
          ],
          success: function (res) {
            //会员卡领取
            if (member) {
              setTimeout(function () {
					  //获取会员信息
					  get_memberinfo(that);
              }, 1000) //延迟时间 这里是1秒  
            }else{
               if (that.refresh()!=''){
                  that.refresh();
               }
            }
            show_top_msg(that, '领取成功');
            Journal.myconsole(res);// 卡券添加结果
          },
          fail: function (res) {
            Journal.myconsole(res);// 卡券添加结果
          },
          complete: function () {
            //激活点击事件
            that.setData({
              disabled: true,
            })
            //关闭加载中动画
            // wx.hideLoading();
          }
        })
      } else {
			show_top_msg(that, '领取失败');
      }

    },
    function (res) {
		 show_top_msg(that, res ? res : '领取失败');
    },
	  function (res) {
		  Journal.myconsole("请求卡券数的数据：");
		  Journal.myconsole(res);
    });
}


// 会员信息
function get_memberinfo(that) {
  var token = Sign.getToken();
  var data = {};
  data['token'] = token;
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();

  Request.request_data(
    Server.GETMEMBERINFO(),
    data,
    function (res) {
      if (res) {
        if (res.card_id) {
          that.setData({
            vip: true,
          })
        }
        that.setData({
			  is_wx_activate: res.is_wx_activate,
          user_info: res,
          user_portrait: res.upload + res.avatar,
          member_code: res.member_code,
        })
      } else {
        show_top_msg(that, '会员信息不存在');
      }

    },
    function (res) {
      show_top_msg(that, res ? res : '会员信息不存在');
    },
	  function (res) {
		  Journal.myconsole("请求会员信息的数据：");
		  Journal.myconsole(res);
    });
}

//会员卡激活
function cardactive(that, active_ticket, card_id, code){
   var data = {};
     data['sign'] = Sign.sign();
     data['mchid'] = Sign.getMchid();
     data['openid'] = getOpenid();
     data['active_ticket'] = active_ticket;
     data['card_id'] = card_id;
     data['code'] = code;

   Request.request_data(
      Server.CARDACTIVE(),
      data,
      function (res) {
			//储存token
			try {
				wx.setStorageSync('token', res.token);
				syntony(that, e);
			} catch (e) {
			}
         get_memberinfo(that);
      },
      function (res) {
      },
      function (res) {
         Journal.myconsole("会员激活请求：");
         Journal.myconsole(res);
      });
} 

//会员卡激活方式
function activetype(that) {
	var token = Sign.getToken();
	var data = {};
	data['token'] = token;
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();

	Request.request_data(
		Server.ACTIVETYPE(),
		data,
		function (res) {
			if (res) {
				that.setData({
					is_wx_activate:res,
				})
			} else {
				show_top_msg(that, '设置错误');
			}

		}, 
		function (res) {
			show_top_msg(that, res ? res : '设置错误');
		},
		function (res) {
			Journal.myconsole("请求会员卡激活方式的数据：");
			Journal.myconsole(res);
		});
}


//非跳转注册方式方式
function registerrule(that, syntony, e) {
		var data = {};
		data['sign'] = Sign.sign();
		data['mchid'] = Sign.getMchid();

		Request.request_data(
			Server.REGISTERRULE(),
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
					//手机号
					wx.navigateTo({
						url: '/pages/account_number/bind_account',
					})
				} else {
					show_top_msg(that, '商户设置错误');
				}
			},
			function (res) {
				show_top_msg(that, res ? res : "失败");
			},
			function (res) {
				Journal.myconsole("请求注册方式");
				Journal.myconsole(res);
			});
}

// 跳转注册方式
function skip(that, syntony, e) {
	var data = {};
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();

	Request.request_data(
		Server.REGISTERRULE(),
		data,
		function (res) {
			if (res.rule_type == 1) {
				syntony(that, e);
			} else if (res.rule_type == 2) {
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
			Journal.myconsole("请求注册方式");
			Journal.myconsole(res);
		});
}

// 页面非跳转注册方式
function on_skip(that, syntony, e) {
	var data = {};
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();

	Request.request_data(
		Server.REGISTERRULE(),
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
				if(e==1){
					that.setData({
						show_loading_faill: true,
					})
				}else{
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
			Journal.myconsole("请求注册方式");
			Journal.myconsole(res);
		});
}


//登录
function small_program_login(that, syntony, e) {
	var userlnfo = getuserlnfo();
	var data = {};
	data['openid'] = getOpenid();
	data['unionid'] = getUnionid();
	data['mchid'] = Sign.getMchid();
	data['sign'] = Sign.sign();
	data['channel'] = '2';

	Request.request_data(
		Server.OPENID_LOGIN(),
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
			Journal.myconsole("请求登录返回的数据：")
			Journal.myconsole(res);
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
	data['mchid'] = Sign.getMchid();
	data['sign'] = Sign.sign();
	data['channel'] = '2';


	Request.request_data(
		Server.REGISTER(),
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
			Journal.myconsole("请求注册返回的数据：")
			Journal.myconsole(res);
		})

}


//建立调用
module.exports = {
	//会员卡激活方式
	activetype: activetype,
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
  //全局存储版本代号
  getWisdom: getWisdom,
  //全局存储用户信息
	getuserlnfo: getuserlnfo,
  //缓存商户id
  getmerchant_id: getmerchant_id,
  //访问数量统计
  visit: visit,
  //优惠券领取
  receive: receive,
  //获取会员信息
  get_memberinfo: get_memberinfo,
  //会员卡激活
  cardactive: cardactive,
}