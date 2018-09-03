// 客服

//md5加密
var md5 = require('../base/utils/md5.js')
//base64编码解析
var base64 = require('../base/utils/base64.js')
//接口地址
var MyHttp = require('../base/utils/httpurl.js');
//日志打印工具
var MyUtils = require('../base/utils/utils.js');
//请求方法
var MyRequest = require('../base/utils/request_management.js');
//生成签名，获取商户ID
var MySign = require('../base/utils/sign.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
//当前时间
var util = require('../../utils/util.js'); 

const chat_url = MyHttp.CHATURL();
var socketOpen = false;
var isLogin = false; //是否登录到服务器上
var message_id = []; //消息id 数组
var history_list_offset = 0; //聊天记录偏移量

var user_id = ''; //用户id
var user_name = ''; //用户昵称
var user_avatar = ''; //用户头像
var store_id = '0'; //门店id
var merchant_id = ''; //商户id
var buyer_uid = ''; //顾客uid 登录成功后返回

var customer_uid = ''; //客服uid
var customer_name = ''; //客服昵称
var customer_avatar = ''; //客服头像

var interval = '';//定时任务

//消息列表
var that = '';
//防止上拉跳转到底部
var latop= true;

Page({
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
		wx.showLoading({
			title: '加载中',
		})
		that = this;
		service_member_details(that);
		if (options.goods_id && options.goods_id!= "undefined"){
			that.setData({
				goods_id: options.goods_id,
			});
			// Extension.show_top_msg(that, '已获取商品id')
			service_order_details(that, options.goods_id);
		}

		// 调用函数时，传入new Date()参数，返回值是日期和时间  
		var time = util.formatTime(new Date());
		// 再通过setData更改Page()里面的data，动态更新页面的数据  
		this.setData({
			time: time
		}); 

    connect();
  },
  onUnload: function () {
    if (socketOpen) {
      wx.closeSocket();
    }

    clearInterval(interval);
    console.log('页面消失事件1111');
  },
	data: {
		isTopTips: false,
		push_parameter: '',
		Send_text: '',
		array: [],
		//商品数据
		goods: '',
		//关闭商品链接默认显示
		goods_close: "null",
		//用户名称
		user_name: '',
		//用户头像
		user_avatar: '',
		//客服名称
		customer_name: '',
		//客服头像
		customer_avatar: '',
  },
//文本框输入获取值事件
  text_content: function (e) {
    this.setData({
      push_parameter: e.detail.value
    })
  },
		//发送按钮事件
  send: function () {
		send_text('text', this.data.push_parameter);
		that.setData({
			push_parameter:'',
		})
  },
		//图片发送点击事件
  imgup: function () {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: MyHttp.UPLOADINGIMGURL(),
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'folder': 'chat',
            'thumb': '300_0@300*0'
          },
          success: function (res) {
            var jsondata = JSON.parse(res.data)

            var img_original = jsondata.imgUrl + 'chat/source/' + jsondata.fileName;
            var img_min = jsondata.imgUrl + 'chat/300_0/' + jsondata.fileName;
            var width = "";
            var height = "";
            wx.getImageInfo({
              src: img_min,
              success: function (res) {
                width = res.width;
                height = res.height;

                var img = new Object();
                img.img_original = img_original;
                img.img_min = img_min;
                img.width = width;
                img.height = height;
                var img_json = JSON.stringify(img);
                send_text('img', img_json);
              },
              fail:function() {
                width = 0;
                height = 0;

                var img = new Object();
                img.img_original = img_original;
                img.img_min = img_min;
                img.width = width;
                img.height = height;
                var img_json = JSON.stringify(img);
                send_text('img', img_json);
              }
            })
          }
        })
      }
    })
  },
	//商品链接关闭按钮
	goods_close: function (e) {
		that.setData({
			goods_close: e.currentTarget.dataset.index
		})
	},
	//商品链接发送按钮
	goods_send: function () {
		var mchid = MySign.getMchid();
		var sendmsg = new Object();
		sendmsg.img = that.data.goods.img[0].img;
		sendmsg.name = that.data.goods.name;
		sendmsg.price = that.data.goods.price;
		sendmsg.goods_id = that.data.goods_id;
		sendmsg.url = mchid + '.qinguanjia.com/mall/goods/detail.html?goods_id=' + that.data.goods_id;

		var sendmsg_json = JSON.stringify(sendmsg);
		send_text('goods', sendmsg_json);
	},
	//跳转商品详情
	getgoods: function(e){
		var goods_url = e.currentTarget.dataset.content.goods_url;
		var goods_id=goods_url.split("=")[1];
		wx.navigateTo({
			url: '../communal/commodity_details?goods_id=' + goods_id,
    })
	},
//滚动到顶部加载聊天记录
	scrolltop: function () {
		//防止上拉跳转到底部
		latop = false;

		//拉取历史记录
		getHistory();
	},
	// previewImage: function (e) {
	// 	var current = e.target.dataset.src;
	// 	wx.previewImage({
	// 		current: current, // 当前显示图片的http链接  
	// 		urls: this.data.imgalist // 需要预览的图片http链接列表  
	// 	})
	// }    
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

function connect() {
  wx.connectSocket({
    url: chat_url
  })

  wx.onSocketOpen(function (res) {
    socketOpen = true
    
    //开启心跳
    interval = setInterval(function () {
      hello()
    }, 25000);

    //初始化聊天消息偏移量
    history_list_offset = 1;
  })

  wx.onSocketError(function (res) {
    Extension.show_top_msg(that, '连接聊天服务器失败，请稍后重试！')
  })

  wx.onSocketMessage(function (res) {
    console.log('收到服务器内容：' + res.data)
    var message_from_server = res.data;
    if (message_from_server != '{"type":"pong"}') {
      var obj = JSON.parse(message_from_server);
      switch (obj.type) {
        case 'create':
          create(obj.create.key);
          break;
        case 'clogin':
          clogin(obj, that);
          break;
        case 'sendresult':
          send_result(obj);
          break;
        case 'sendmsg':
          send_msg(obj);
          break;
        case 'auth':
          auth();
          break;
        case 'disconnect':
          disconnect();
          break;
        case 'shistory':
          shistory(obj);
          break;
        default:
          break;
      }
    }

  })
}

function sendMessage(msg) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data: msg
    })
  }
	setTimeout(function () {
		wx.hideLoading()
	}, 2000)
}



//创建链接
function create(key) {
  var token = '';
  key = key.substring(0, 5);
  try {
    token = md5.md5(key);
  } catch (err) {

  }

  sendMessage('{"type":"auth","token":"' + token + '"}');
}

//验证成功
function auth() {
  login(user_name, '0', user_id, merchant_id, user_avatar);
}

//登陆
function login(customer_name, store_id, customer_id, merchant_id, user_avatar) {
  sendMessage('{"type":"clogin","customer_name":"' + customer_name + '","customer_merchant_id":"' + merchant_id + '","customer_store_id":"' + store_id + '","customer_id":"' + customer_id + '","customer_avatar":"' + user_avatar + '"}');
}

//登陆成功
function clogin(obj, that) {

	//防止上拉跳转到底部
	latop = true;

	if (obj.clogin.status == 0) {
		isLogin = true;
    customer_uid = obj.clogin.service_uid;
    customer_name = obj.clogin.service_name;
    buyer_uid = obj.clogin.customer_uid;
    customer_avatar = obj.clogin.service_avatar;
		that.setData({
			customer_name: customer_name,
			customer_avatar: customer_avatar,
		});

    // //拉取历史记录
    getHistory();
	} else {
		setTimeout(function () {
			wx.hideLoading()
		}, 1000)
   //  Extension.show_top_msg(that, obj.clogin.msg)
  }
}

//客服离线
function disconnect() {
	setTimeout(function () {
		wx.hideLoading()
	}, 1000)
  Extension.show_top_msg(that, '当前无客服在线')
}

//发送消息
function send_text(msg_type, content) {
  if (socketOpen == false) {
    connect();
  }
  if (isLogin == false) {
    auth();
  }
	//防止上拉跳转到底部
	latop = true;

  var myData = new Date();
  var times = myData.getTime();
  var message_id = md5.md5(times.toString() + buyer_uid + customer_uid);

  if (msg_type == 'text') {
    var text = content;
    if (text == '') {
      return;
    }

    var content = base64.encode(text);
    sendMessage('{"type":"sendmsg","to_client_uid":"' + customer_uid + '","message_id":"' + message_id + '","context":"' + content + '","message_type":"' + msg_type + '"}');
		newsAdd('right', customer_avatar, user_avatar, customer_name, user_name, text, 'text', 'down', '', '');
  }

  if (msg_type == 'img') {
    var img = JSON.parse(content);
    var content = '[]';
    var msg = '{"type":"sendmsg","to_client_uid":"' + customer_uid + '","message_id":"' + message_id + '","context":"' + content + '","message_type":"' + msg_type + '","ext":{"img_width":' + img.width + ',"img_height":' + img.height + ',"img_original":"' + img.img_original + '","img_min":"' + img.img_min + '"}}';

    // console.log(msg);
    sendMessage(msg);
		newsAdd('right', customer_avatar, user_avatar, customer_name, user_name, img.img_min, 'img', 'down', '', '');
  }

  if (msg_type == 'goods') {
    var obj = JSON.parse(content);
    var content = '[]';
    var msg = {
      'type': 'sendmsg',
      'to_client_uid': customer_uid,
      'message_id': message_id,
      'context': content,
      'message_type': msg_type,
      'ext': {
        'goods_img': obj.img,
        'goods_name': obj.name,
        'goods_price': obj.price,
				'goods_url': obj.url,
				'goods_id': obj.goods_id
      }
    };

    sendMessage(JSON.stringify(msg));
		newsAdd('right', customer_avatar, user_avatar, customer_name, user_name, msg.ext, 'goods', 'down', '', '');
  }
}

//心跳包
function hello() {
  console.log('启动心跳包');
  sendMessage('{"type":"ping"}');
}

//消息发送成功
function send_result(obj) {

}

//收到消息
function send_msg(obj) {

	//防止上拉跳转到底部
	latop = true;

  var content = obj.sendmsg.context;
  //只接收登陆客服的消息
  if (obj.sendmsg.from_client_uid == customer_uid) {
    var text = base64.decode(content);

    var msg_type = obj.sendmsg.message_type;
    if (msg_type == 'img') {
			newsAdd('left', customer_avatar, user_avatar, customer_name, user_name, obj.sendmsg.ext.img_min, obj.sendmsg.message_type, 'down', '', '');
    }
    if (msg_type == 'text') {
			newsAdd('left', customer_avatar, user_avatar, customer_name, user_name, text, obj.sendmsg.message_type, 'down', '', '');
    }
    if (msg_type == 'goods') {
			newsAdd('left', customer_avatar, user_avatar, customer_name, user_name, obj.sendmsg.ext, obj.sendmsg.message_type, 'down', '', '');
    }
  }
}

//历史消息记录处理
function shistory(obj) {
  var obj = obj.shistory;
  if (obj.status == 0) {
    history_list_offset = history_list_offset + obj.history_list.length;

    for (var i = 0; i < obj.history_list.length; i++) {
      var list = obj.history_list[i];
      if (list) {
        var type = '';
        if (customer_uid == list.from_client_uid) {
          type = 'left';
        } else {
          type = 'right';
        }
        switch (list.message_type) {
          case 'text':
						newsAdd(type, customer_avatar, user_avatar, customer_name, user_name, base64.decode(list.context), list.message_type, 'up', '', '');
            break;
          case 'img':
						newsAdd(type, customer_avatar, user_avatar, customer_name, user_name, list.ext.img_min, list.message_type, 'up', '', '');
            break;
          case 'goods':
						newsAdd(type, customer_avatar, user_avatar, customer_name, user_name, list.ext, list.message_type, 'up', '', '');
            break;
          default:
            break;
        }
      }
    }
  }
}

//拉取历史消息
function getHistory() {
  var json = {
    'type': 'shistory',
    'start': history_list_offset,
    'end': history_list_offset + 14,
    'customer_uid': buyer_uid,
    'service_uid': customer_uid
  };

  sendMessage(JSON.stringify(json));
}

//将消息显示在列表上
function newsAdd(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down,width, height) {
	if (msg_type == "img") {
		list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, width, height)
		// wx.getImageInfo({
		// 	src: content,
		// 	success: function (res) {
		// 	}
		// })
	}else{
		list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, '', '')
	}
}

//获取商品信息
function service_order_details(that, goods_id) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		if (goods_id) {
			var data = {};
			data['token'] = token;
			data['goods_id'] = goods_id;
			data['mchid'] = MySign.getMchid();
			data['sign'] = MySign.sign(data);

			MyRequest.request_data(
				MyHttp.GOODS_DETAIL(),
				data,
				function (res) {
					if (res) {
						that.setData({
							goods: res,
						});
					}
				},
				function (res) {
					//错误提示
					Extension.error(that, res);
				},
				function (res) {
					MyUtils.myconsole("请求商品详情失败的数据：")
					MyUtils.myconsole(res);
				})
		}
	}
 
}

//获取用户信息
function service_member_details(that) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['openid'] = Extension.getOpenid();
		data['unionid'] = Extension.getUnionid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data(
			MyHttp.CHAT(),
			data,
			function (res) {
				if (res) {
					user_id = data['openid'];
					user_name = res.user_name;
					user_avatar = res.avatar;
					merchant_id = res.merchant_id;

					that.setData({
						show_loading_faill: true,
						user_name: res.user_name,
						user_avatar: res.avatar,
						merchant_id: res.merchant_id
					});
					if (that.data.goods_id) {
						list_data("right", customer_avatar, user_avatar, customer_name, user_name, that.data.goods, "goods_fa", '', '', '')
					}
				}
			}, 
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("请求商品详情失败的数据：")
				MyUtils.myconsole(res);
			})
	}
}

//将滚动条保持在底部
function bottom() {
	that.setData({
		into_view: 'j_page',
	})
}
//加载显示数据
function list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, img_width, img_height){
	var list = { 'type': type, 'customer_avatar': customer_avatar,
	 'customer_name': customer_name,
	 'user_name': user_name, 
	 'content': content,
	 'msg_type': msg_type,
	 'up_down': up_down,
	 'img_width': img_width,
	 'img_height': img_height }

	var data = that.data.array
  //聊天消息在列表上方和下方展示
  if (up_down == 'up') {
    data.unshift(list)
  } else {
    data.push(list)
  }
	that.setData({
		array: data,
	})

	console.log(that.data.array)
	//将滚动条保持在底部
	if (latop) {
		bottom();
	}
}