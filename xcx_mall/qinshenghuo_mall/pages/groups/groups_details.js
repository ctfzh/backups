// 拼团团详情页面
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
//base64编码解析
var base64 = require('../base/utils/base64.js')
//关注我们二维码接口

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "expireTime": "",//2018-02-01 20:30:08
    clock: '',
		//活动弹出窗默认隐藏
    activity_eject: "none",
    guanzhu: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var that = this;
	  //加载中动画
	  wx.showLoading({
		  title: '加载中',
	  })
    var scene = decodeURIComponent(options.scene)
    if (scene && scene!="undefined"){
      var group_id = scene
    } else if (options.group_id && options.group_id!="undefined") {
      var group_id = options.group_id
    }
    that.setData({
      group_id: group_id,
    })

    //初始化页面加载
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
    var that = this;
    if (that.data.group_id) {
      var scene = decodeURIComponent(that.data.scene)
      getgroupinfo(that, that.data.group_id)
	 } else {
		 //自定义错误提示
		 Extension.custom_error(that, '3', '拼团信息获取失败请退出重试', '', '');
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.goods_detail,
      path: '/pages/groups/groups_details?group_id=' + this.data.group_id,
      imageUrl: this.data.group.goods_img,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //一键开团
  onekey:function(){
    wx.redirectTo({
      url: '/pages/groups/groups_commodity_details?goods_id=' + this.data.group.goods_id +'&group_id=' + this.data.group_id,
    })
  },
  
  //重新开团
  again: function () {
    wx.redirectTo({
      url: '/pages/groups/groups_commodity_details?goods_id=' + this.data.group.goods_id,
    })
  },

  //邀请加团
  Invitation: function () {
    // var qrcode = new QRCode('canvas', {
    //   text: '/pages/groups/groups_details?group_id=' + this.data.group_id,
    //   width: 135,
    //   height: 130,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   correctLevel: QRCode.CorrectLevel.H,
    // });
    createunlimit(this);
    this.setData({
      activity_eject: "",
    })
  },
  //关闭遮罩窗口
  tap_activity_layer_close: function () {
    this.setData({
      activity_eject: "none",
     })
   },


  /* 毫秒级倒计时 */
  count_down: function () {
    var that = this
    //2016-12-27 12:47:08 转换日期格式  
    var a = that.data.expireTime.split(/[^0-9]/);
    //截止日期：日期转毫秒  
    var expireMs = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    //倒计时毫秒  
    var duringMs = expireMs.getTime() - (new Date()).getTime();
    // 渲染倒计时时钟  
    that.setData({
      clock: that.date_format(duringMs)
    });

    if (duringMs <= 0) {
      that.setData({
        clock: ' 00:00:00 '
      });
      // timeout则跳出递归  
      return;
    }
    setTimeout(function () {
      // 放在最后--  
      duringMs -= 10;
      that.count_down();
    }, 10)
  },
  /* 格式化倒计时 */
  date_format: function (micro_second) {
    var that = this;
    // 秒数  
    var second = Math.floor(micro_second / 1000);
    // 小时位  
    var hr = that.fill_zero_prefix(Math.floor(second / 3600));
    // 分钟位  
    var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位  
    var sec = that.fill_zero_prefix(second % 60);// equal to => var sec = second % 60;  
    return " "+ hr + ":" + min + ":" + sec+ " ";
  },

  /* 分秒位数补0 */
  fill_zero_prefix: function (num) {
    return num < 10 ? "0" + num : num
  },
  //商品详情
  Jump: function(){
    wx.navigateTo({
      url: '/pages/groups/groups_commodity_details?goods_id=' + this.data.group.goods_id,
    })
  },

  // 关注我们
  Kguanzhu: function () {
    this.setData({
      guanzhu: !this.data.guanzhu
    });
  },
  del: function () {
    this.setData({
      guanzhu: !this.data.guanzhu
    });
	},
	//重试事件
	retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
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
// 页面触发事件结束





//页面方法开始

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
			 that.count_down();
			 getgroupinfo(that, that.data.group_id)
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

//获取团详情
function getgroupinfo(that, group_id) {
  //获取token
  var token = MySign.getToken();
  //接口传参数组
  var data = {};

  //验证登入
	if (token) {
		data['token'] = token;
	}
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  if (group_id){
    data['group_id'] = group_id;
  }

  MyRequest.request_data(
    MyHttp.GROUPINFO(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show_loading_faill: true,
          group:res,
          goods_detail: res.goods_detail,
          expireTime: res.end_time,
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
		  MyUtils.myconsole("请求团详情的数据：")
		  MyUtils.myconsole(res);
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
	  })
}

//二维码接口
function createunlimit(that) {
  var data = {};
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  data['page'] = '/pages/groups/groups_details';
  data['scene'] = that.data.group_id;

  MyRequest.request_data(
    MyHttp.CREATEUNLIMIT(),
    data,
    function (res) {
      if (res) {
        that.setData({
          QR_code_img:res.img
        })
      } 
    },
    function (res) {
	  },
	  function (res) {
		  MyUtils.myconsole("请求二维码的数据：")
		  MyUtils.myconsole(res);
	  })

}

