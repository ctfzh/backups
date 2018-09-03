// 推广统计
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
// 日期时间获取
var util = require('../../utils/util.js');  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面隐藏
    show_loading_faill: false,
    //中部tab切换index
    time_select: 0,
    //底部tab切换index
    curBtIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //隐藏页面转发按钮
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
    // 初始化页面
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
  //中部tab切换
  tabFun_m: function (e) {
    if (e.currentTarget.dataset.id==0){
      var time = getDateStr(-1) + '-' + getDateStr(-1);
      // 获取推广统计信息
      getSpreadStatistics(this, time);
    } else if (e.currentTarget.dataset.id == 1){
      var time = getDateStr(-7) + '-' + getDateStr(-1);
      // 获取推广统计信息
      getSpreadStatistics(this, time);
    } else if(e.currentTarget.dataset.id == 2){
      var time = getDateStr(-30) + '-' + getDateStr(-1);
      // 获取推广统计信息
      getSpreadStatistics(this, time);
    }
    this.setData({
      time_select: e.currentTarget.dataset.id
    });
  },
  //底部tab切换
  tabFun_b: function(e){
    if (e.currentTarget.dataset.id==0){
      this.setData({
        content: this.data.Statistics.order_num,
        curBtIndex: e.currentTarget.dataset.id,
      });
    } else if (e.currentTarget.dataset.id == 1) {
      this.setData({
        content: this.data.Statistics.order_money,
        curBtIndex: e.currentTarget.dataset.id,
      });
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        content: this.data.Statistics.commission,
        curBtIndex: e.currentTarget.dataset.id,
      });
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



/*************************************普通方法函数**********************************************/

// 初始化页面
function Refresh(that) {
  MySign.getExtMchid(
    function () {
		 //授权
		 var openid = Extension.getOpenid();
		 if (!openid) {
			 var login = true;
		 } else {
			 var login = false;
			 //分销商信息
			 getDistribution(that);
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

function getDateStr(addDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();
  if (m < 10) {
    m = '0' + m;
  };
  if (d < 10) {
    d = '0' + d;
  };
  return y + "/" + m + "/" + d;
}




/*************************************接口数据获取方法函数**********************************************/

// 获取分销商信息
function getDistribution(that) {
	var token = MySign.getToken(); if (!token) {
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
							var downloadTask = wx.downloadFile({
								url: res.info.avatar,
								success: function (res) {
									that.setData({
										portrait: res.tempFilePath,
									});
								}
							})
							var time = getDateStr(-1) + '-' + getDateStr(-1);
							// 获取推广统计信息
							getSpreadStatistics(that, null);
							// 获取推广统计信息
							getSpreadStatistics(that, time);
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


// 获取推广统计信息
function getSpreadStatistics(that, time) {
  var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['sign'] = MySign.sign(data);
		data['mchid'] = MySign.getMchid();
		if (time) {
			data['time'] = time;
		}
		MyRequest.request_data(
			MyHttp.GETSPREADSTATISTICS(),
			data,
			function (res) {
				MyUtils.myconsole("获取到的推广统计数据：")
				MyUtils.myconsole(res);

				if (res) {
					if (!time) {
						that.setData({
							accumulative: res,
						})
					} else {
						that.setData({
							Statistics: res,
							curMdIndex: that.data.time_select,
							content: res.commission,
						})
					}
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '', '2');
				}
			},
			function (res) {
				if (res == 2) {
					that.setData({
						show_loading_faill: false,
						anomaly_code: 1,
					});
				} else {
					//错误提示
					Extension.error(that, res);
				}
			},
			function (res) {
				MyUtils.myconsole("请求推广统计信息的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})

	}
}