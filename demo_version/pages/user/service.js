// 客服
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
//md5加密
var md5 = require('../tool/md5.js');
//base64编码解析
var base64 = require('../tool/base64.js');
//当前时间
var util = require('../../utils/util.js'); 

const chat_url = Server.CHATURL();
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
var taht = '';
//防止上拉跳转到底部
var latop = true;

Page({
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
      wx.showLoading({
         title: '加载中',
      })
      taht = this;
      // 初始化页面
      Refresh(this);
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
      taht.setData({
         push_parameter: '',
      })
   },
   //图片发送点击事件
   imgup: function () {
      wx.chooseImage({
         success: function (res) {
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
               url: Server.UPLOADINGIMGURL(),
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
                     fail: function () {
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
   //滚动到顶部加载聊天记录
   scrolltop: function () {
      //防止上拉跳转到底部
      latop = false;

      //拉取历史记录
      getHistory();
   },
   //登入完成回调
   login_success: function () {
      Refresh(this);
   },
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
            service_member_details(taht);
            // 调用函数时，传入new Date()参数，返回值是日期和时间  
            var time = util.formatTime(new Date());
            // 再通过setData更改Page()里面的data，动态更新页面的数据  
            that.setData({
               time: time
            });

            connect();
         }
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}



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
      Currency.show_top_msg(taht, '连接聊天服务器失败，请稍后重试！')
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
               clogin(obj, taht);
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
function clogin(obj, taht) {

   //防止上拉跳转到底部
   latop = true;

   if (obj.clogin.status == 0) {
      isLogin = true;
      customer_uid = obj.clogin.service_uid;
      customer_name = obj.clogin.service_name;
      buyer_uid = obj.clogin.customer_uid;
      customer_avatar = obj.clogin.service_avatar;
      taht.setData({
         customer_name: customer_name,
         customer_avatar: customer_avatar,
      });

      // //拉取历史记录
      getHistory();
   } else {
      setTimeout(function () {
         wx.hideLoading()
      }, 1000)
      // Currency.show_top_msg(taht, obj.clogin.msg)
   }
}

//客服离线
function disconnect() {
   setTimeout(function () {
      wx.hideLoading()
   }, 1000)
   Currency.show_top_msg(taht, '当前无客服在线')
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
function newsAdd(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, width, height) {
   if (msg_type == "img") {
      list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, width, height)
      // wx.getImageInfo({
      // 	src: content,
      // 	success: function (res) {
      // 	}
      // })
   } else {
      list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, '', '')
   }
}

//获取用户信息
function service_member_details(taht) {
   var token = Sign.getToken();
   var data = {};
   data['mchid'] = Sign.getMchid();
   data['openid'] = Currency.getOpenid();
	data['unionid'] = Currency.getUnionid();
	data['sign'] = Sign.sign(data);
	data['token'] = token;

   Request.request_data(
      Server.CHAT(),
      data,
      function (res) {
         if (res) {
            user_id = data['openid'];
            user_name = res.user_name;
            user_avatar = res.avatar;
            merchant_id = res.merchant_id;

            taht.setData({
               show_loading_faill: true,
               user_name: res.user_name,
               user_avatar: res.avatar,
               merchant_id: res.merchant_id
            });
			} else {
				Currency.error(that, res);
         }
		}, 
		function (res) {
			Currency.error(that, res);
      },
      function (res) {
         //关闭加载中动画
         wx.hideLoading();
			Journal.myconsole("请求用户信息的数据：")
         Journal.myconsole(res);
      })
}

//将滚动条保持在底部
function bottom() {
   taht.setData({
      into_view: 'j_page',
   })
}
//加载显示数据
function list_data(type, customer_avatar, user_avatar, customer_name, user_name, content, msg_type, up_down, img_width, img_height) {
   var list = {
      'type': type, 'customer_avatar': customer_avatar,
      'customer_name': customer_name,
      'user_name': user_name,
      'content': content,
      'msg_type': msg_type,
      'up_down': up_down,
      'img_width': img_width,
      'img_height': img_height
   }

   var data = taht.data.array
   //聊天消息在列表上方和下方展示
   if (up_down == 'up') {
      data.unshift(list)
   } else {
      data.push(list)
   }
   taht.setData({
      array: data,
   })

   console.log(taht.data.array)
   //将滚动条保持在底部
   if (latop) {
      bottom();
   }
}