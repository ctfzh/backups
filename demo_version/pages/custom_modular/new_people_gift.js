// 新人礼包组件
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
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //防止按钮多次触发
    disabled: true,
    // 去使用
    get_success: false,
    //礼包
    gift:true
  },
  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
   */
  attached: function () {
    get_newgift(this);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 新人礼包领取
    receive_bag: function (e) {
      var arrInfo = []; //领取的卡券信息数组
      var arr = []; //有库存的卡券
      var card_id_Array = [];
      if (this.data.disabled) {
        //加载中动画
        wx.showLoading({
          title: '加载中',
        })
        //防止多次点击
        this.setData({
          disabled: false,
        })
        this.setData({
          actId: "newmember_" + this.data.act_id  //  actId
        });
        var coupon_list = this.data.coupon_list  // this.data.coupon_list
        for (var i in coupon_list) {
          if (coupon_list[i].quantity > 0) {
            arr.push(coupon_list[i]);
          }
        }

        for (var i in arr) {
          card_id_Array[i] = arr[i].card_id;
        }
        if (card_id_Array.length > 0) {
          for (var i in card_id_Array) {
            if (card_id_Array[i]) {
              get_receive_bag(this, card_id_Array[i], arrInfo, arr.length);
            } else {
              Journal.myconsole(card_id_Array[i]);
            }
          }
        } else {
          this.setData({
            //礼包弹框是否显示
            isShow: false
          });
          Journal.myconsole(card_id_Array);
        }
      }
    },
    //去使用
    to_use: function(){
      wx:wx.switchTab({
        url: '/pages/discount/discount'
      });
    },
    close: function(){
      this.setData({
        //礼包弹框是否显示
        isShow: false
      });
    }
  }
})

/***********************普通方法*****************************/

//判断券是否都抢光了
function isNull(that) {
  var list = that.data.coupon_list;
  var arr = [];
  for (var i in list) {
    if (list[i].quantity > 0) {
      arr.push(1)
    }
  }
  if (arr.length == 0) {
    that.setData({
      isNull: true
    });
  }
}



/******************数据请求方法**********************/
//新人礼包数据
function get_newgift(that) {
    var data = {}
	  data['unionid'] = Currency.getUnionid();
    data['mchid'] = Sign.getMchid();
    Request.request_data(
      Server.NEWPEOPLEGIFT(),
      data,
      function (res) {
        if (res) {
            var discount = [];
            for (var i = 0; i < res.coupon_list.length; i++) {
              var money = res.coupon_list[i].discount.toString();
              var arr = money.split(".");
              discount.push(arr[1]);
            }
            that.setData({
              isShow: true,
              coupon_list: res.coupon_list,
              act_id: res.active_id,
              discount: discount
            });
        } else {
        }
      }, function (res) {
        if (res == '606002') {
          that.setData({
            //礼包弹框是否显示
            isShow: false
          });
        } 
      },
		 function (res) {
			 Journal.myconsole("请求新人礼包信息的数据：");
			 Journal.myconsole(res);
      }
    );
}

// 新人礼包领取
function get_receive_bag(that, card_id, arrInfo, arrLength) {
  var data = {};
  data['sign'] = Sign.sign();
  data['mchid'] = Sign.getMchid();
  data['card_id'] = card_id;

  Request.request_data(
    Server.GETCARDIGN(),
    data,
    function (res) {
      if (res) {
        var _object = {};
        var _bojectPlus = {};
        var cardId = res.cardId;
        var api_ticket = res.cardExt.api_ticket;
        var nonce_str = res.cardExt.nonce_str;
        var signature = res.cardExt.signature;
        var timestamp = res.cardExt.timestamp;

        _object.cardId = cardId;
        _object.cardExt = '{"api_ticket":"' + api_ticket + '","nonce_str":"' + nonce_str + '","signature":"' + signature + '","timestamp":"' + timestamp + '","outer_str":"' + that.data.actId + '"}';
        arrInfo.push(_object);
        if (arrInfo.length == arrLength) {
          wx.addCard({
            cardList: arrInfo,
            success: function (res) {
              that.setData({
                get_success: true,
                gift: false
              });
              //新人礼包
              // get_newgift(that);
              Journal.myconsole(res);// 卡券添加结果
            },
          fail: function (res) {
            //获取会员信息
            Journal.myconsole(res);// 卡券添加结果
          },
          complete: function () {
            //关闭加载中动画
            wx.hideLoading();
            //激活点击事件
            that.setData({
              disabled: true,
            })
          }
          });
        }
      } else {
        Journal.myconsole('获取卡券数据失败');
        Currency.show_top_msg(that, '礼包已过期');
      }

    },
    function (res) {
		 Currency.show_top_msg(that, res ? res : '领取失败');
    },
	  function (res) {
		  Journal.myconsole("请求卡券的数据：");
		  Journal.myconsole(res);
    });
}

