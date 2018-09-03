// 预约
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
//时间选择器
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
     startYear: 2000,
     endYear: 2050,
     show_loading_faill:false,
   //   门店下拉菜单初始下标
   store_index: 0,
     //下拉框下标
     index:0,
	  activity_data: [],
	  //显示得当前所在得滑动滑动快下标
	  current: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
	  var scene = decodeURIComponent(options.scene)
	  if (scene && scene != "undefined") {
		  var active_id = scene;
		  this.setData({
			  scene: '1'
		  })
	  }else{
		  if (options.id && options.id != "undefined") {
			  var active_id = options.id;
		  }
	  }

	  if (active_id){
			this.setData({
				active_id: active_id
			})
			//   初始化页面
			Refresh(this);
	  } else {
		  //错误提示
		  Currency.custom_error(this, '2', '数据丢失，请稍后重试');
	  }
     // 获取完整的年月日 时分秒，以及默认显示的数组
     var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
     // 精确到分的处理，将数组的秒去掉
     var lastArray = obj.dateTimeArray.pop();
     var lastTime = obj.dateTime.pop();
     var shiftArray = obj.dateTimeArray.shift();
     var shiftTime = obj.dateTime.shift();
     var myDate = new Date();
      var year = myDate.getFullYear();

     this.setData({
        year: year,
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
     });
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
     return {
        title: this.data.res.share_title,
        imageUrl: this.data.res.share_img,
        success: function (res) {
        },
        fail: function (res) {
           // 转发失败
        }
     }
  },

  //登入完成回调
  login_success: function () {
     //加载中动画
     wx.showLoading({
        title: '加载中',
     })
     Refresh(this);
  },

  //门店下拉框
  store_picker: function(e){
	  var store_item = this.data.res.store_list[e.detail.value];
     this.setData({
        store_index: e.detail.value,
        store_id: store_item.id
     })
  },

  //下拉框
  bindPickerChange: function (e) {
     var activity_data = this.data.activity_data;
     var id = e.currentTarget.dataset.id;
     var value = e.currentTarget.dataset.list[e.detail.value];
     var new_type = "dropdown";
     var index = e.detail.value;
     var item = new New_item(id, new_type, value);
     item.index = index
     //赋值本地数组
     activity_data[id] = item;
     this.setData({
        activity_data: activity_data,
     })
  },

//时间选择器
  changeDateTimeColumn(e) {
   var activity_data = this.data.activity_data,
      id = e.currentTarget.dataset.id,
      new_type = "time",
      dateTime = e.currentTarget.dataset.datetime, 
      dateTimeArray = e.currentTarget.dataset.datetimearray;

   dateTime[e.detail.column] = e.detail.value;
   dateTimeArray[1] = dateTimePicker.getMonthDay(this.data.year, dateTimeArray[0][dateTime[0]]);
   if (dateTime[1] > dateTimeArray[1].length-1){
      dateTime[1] = dateTimeArray[1].length-1;
   }

   var value = dateTimeArray[0][dateTime[0]] + "-" +dateTimeArray[1][dateTime[1]] +" "+dateTimeArray[2][dateTime[2]]+":"+dateTimeArray[3][dateTime[3]];

   var item = new New_item(id, new_type, value);
     item.dateTimeArray = dateTimeArray
     item.dateTime = dateTime
     //赋值本地数组
     activity_data[id] = item;
     this.setData({
        activity_data: activity_data,
     })
  },
  //点击时间选择器
  time_tap: function(){
     try {
        wx.setStorageSync('activity_data', this.data.activity_data)
     } catch (e) {
     }
  },
  //时间选择器取消事件
  time_cancel: function(){
     try {
        var activity_data = wx.getStorageSync('activity_data')
        if (activity_data) {
           this.setData({
              activity_data: activity_data,
           })
        }
     } catch (e) {
     }
  }, 

  //预定提交
  submission: function(){
	  if (!this.data.is_submission){
			this.setData({
				is_submission:true,
			})
		var activity_data = this.data.activity_data;
		var activity = this.data.res.content;
		var activity_json = [];
		for (var i = 0; i < activity.length; i++){
			if (activity[i].type == "input"){
					if (activity_data[activity[i].id]) {
						var value = activity_data[activity[i].id].value;
						if (value) {
							var proving = input_proving(value, activity[i].option);
							if (proving) {
							} else {
								Currency.show_top_msg(this, activity[i].name + "输入有误");
								this.setData({
									is_submission: false,
								})
								return
							}
						} else {
							if (activity[i].isRequired == 1) {
								Currency.show_top_msg(this, '请输入' + activity[i].name);
								this.setData({
									is_submission: false,
								})
								return
							}
						}
						}else{
							if (activity[i].isRequired == 1){
								Currency.show_top_msg(this, '请输入' + activity[i].name);
								this.setData({
									is_submission: false,
								})
								return
							} else {
								var value = "";
							}
						}
						var item = new New_item(activity[i].id, "input", value);
						activity_json.push(item);

			} else if (activity[i].type == "dropdown") {
				if (activity_data[activity[i].id]) {
					var index = activity_data[activity[i].id].index;
					if (index == 0) {
						if (activity[i].isRequired == 1) {
							Currency.show_top_msg(this, '请选择' + activity[i].name);
							this.setData({
								is_submission: false,
							})
							return
						} else {
							var value = "";
						}
					}else{
						var value = activity_data[activity[i].id].value;
					}
				} else {
					if (activity[i].isRequired == 1) {
						Currency.show_top_msg(this, '请选择' + activity[i].name);
						this.setData({
							is_submission: false,
						})
						return
					} else {
						var value = "";
					}
				}
				var item = new New_item(activity[i].id, "dropdown", value);
				activity_json.push(item);
			} else if (activity[i].type == "time") {
				if (activity_data[activity[i].id]) {
					var value = activity_data[activity[i].id].value;
				} else {
					var dateTimeArray = this.data.dateTimeArray;
					var dateTime = this.data.dateTime;
					value = dateTimeArray[0][dateTime[0]]+'-'+dateTimeArray[1][dateTime[1]]+" "+dateTimeArray[2][dateTime[2]]+':'+dateTimeArray[3][dateTime[3]]
				}
				var item = new New_item(activity[i].id, "time", this.data.year + "-" + value);
				activity_json.push(item);
			} else if (activity[i].type == "checkBox") {
				if (activity[i].mode == "2") {
					if (activity_data[activity[i].id]) {
						var value = activity_data[activity[i].id].value;
						if (value.length==0){
							if (activity[i].isRequired == 1) {
								Currency.show_top_msg(this, '请选择' + activity[i].name);
								this.setData({
									is_submission: false,
								})
								return
							} else {
								var value = "";
							}
							}
						}else{
						if (activity[i].isRequired == 1) {
							Currency.show_top_msg(this, '请选择' + activity[i].name);
							this.setData({
								is_submission: false,
							})
							return
						}else{
							var value = "";
						}
					}
				}else{
					if (activity_data[activity[i].id]) {
						var value = activity_data[activity[i].id].value;
					} else {
						if (activity[i].isRequired == 1){
							Currency.show_top_msg(this, '请选择' + activity[i].name);
							this.setData({
								is_submission: false,
							})
							return
						}else{
							var value = "";
						}
					}
				}
				var item = new New_item(activity[i].id, "checkBox", value);
				activity_json.push(item);
			}
		}
		this.setData({
			activity_json: activity_json,
		})
		activity_add(this);
	  }
  },

  //文本框
  input: function(e){
     var activity_data = this.data.activity_data;
     var id = e.currentTarget.dataset.id;
     var value = e.detail.value;
     var new_type = "input";
     var item = new New_item(id, new_type, value);
     //赋值本地数组
     activity_data[id] = item;
     this.setData({
        activity_data: activity_data,
     })
  },

  //单选框
  radioChange: function (e) {
     var activity_data = this.data.activity_data;
     var id = e.currentTarget.dataset.id;
     var value = e.detail.value;
	  var new_type = "checkBox";
     var item = new New_item(id, new_type, value);
     //赋值本地数组
     activity_data[id] = item;
     this.setData({
        activity_data: activity_data,
     })
  },

  //多选框
  checkboxChange: function (e) {
     var activity_data = this.data.activity_data;
     var id = e.currentTarget.dataset.id;
	//   var value = e.detail.value;
     var value = e.detail.value.join();
	  var new_type = "checkBox";
     var item = new New_item(id, new_type, value);
     //赋值本地数组
     activity_data[id] = item;
     this.setData({
        activity_data: activity_data,
     })
  },
  //登入完成回调
  login_success: function () {
     //加载中动画
     wx.showLoading({
        title: '加载中',
     })
     Refresh(this);
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
  //列表跳转
  jump: function () {
     wx.navigateTo({
        url: '/pages/appointment/my_reservation',
     })
  },
  //轮播图的切换事件  
  swiperChange: function (e) {
	  this.setData({
		  current: e.detail.current,
	  })
  },
})







/*********************************************普通方法****************************************************/
// 页面初始化方法
function Refresh(that){
   //获取商户号
   Sign.getExtMchid(
      function () {
         //获取经纬度
         wx.getLocation({
            type: 'gcj02',
            success: function (res) {
               that.setData({
                  lat: res.latitude,
                  lng: res.longitude,
               })
            },
            fail: function () {
            },
				complete: function () {
					var openid = Currency.getOpenid();
					if (!openid) {
                  that.setData({
                     login: true,
                  })
               } else {
                  that.setData({
                     login: false,
                  })
                  //浏览记录
                  Currency.visit(that, 4);
                  //预约页面数据
                  activity(that);
               }
            }
         });
		},
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
		},
   )
}

//创建对象
function New_item(id, new_type, value) {
   this.id = id;
   this.type = new_type;
   this.value = value;
}

//输入验证
function input_proving(value,input_type){
   if (input_type==1){
      //姓名验证
      var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,10}$/;
      if (!reg.test(value)) {
         return false
      } else {
         return true
      }
   } else if (input_type == 2) {  6
      //手机号验证
      var reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!reg.test(value)) {
         return false;
      } else {
         return true
      }
   } else if (input_type == 3) {
      //数字验证
      var reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(value)) {
         return false;
      }else{
         return true
      }
   } else if (input_type == 4) {
      //邮箱验证
      var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$","i");
      if (!reg.test(value)) {
         return false;
      } else {
         return true
      }
   } else {
      return true
   }
}

/*********************************************获取接口数据方法****************************************************/

// 预约页面数据
function activity(that) {
   var data = {};
   data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();
	data['active_id'] = that.data.active_id; 
   if (that.data.lat){
      data['lat'] = that.data.lat;
      data['lng'] = that.data.lng;
   }

   Request.request_data(
      Server.ACTIVITY(),
      data,
      function (res) {
         that.setData({
            show_loading_faill: true,
            res:res,
            store_id: res.store_list[0].id
         })
         wx.setNavigationBarTitle({
            title: res.title
         })
      },
		function (res) {
			Currency.error(that, res);
      },
      function (res) {
         //关闭加载中动画
         wx.hideLoading()
			Journal.myconsole("请求预约数据的数据：");
         Journal.myconsole(res);
      });
}


// 提交预约
function activity_add(that) {
   var data = {};
	data['unionid'] = Currency.getUnionid();
   data['sign'] = Sign.sign();
   data['mchid'] = Sign.getMchid();
   data['openid'] = Currency.getOpenid();
   data['content'] = that.data.activity_json;
   data['store_id'] = that.data.store_id; 
	data['active_id'] = that.data.active_id; 

   Request.request_data(
      Server.ACTIVITY_ADD(),
      data,
      function (res) {
         wx.showModal({
            title: '提示',
				showCancel:false,
            content: that.data.res.finish_tip,
            success: function (res) {
					that.setData({
						is_submission: false,
					})
					if (that.data.scene){
						wx.switchTab({
							url: 'pages/home/home',
						})
					}else{
						wx.navigateBack({
							delta: "1",
						})
					}
            }
         })
      },
      function (res) {
         wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000
         })
      },
		function (res) {
			Journal.myconsole("请求预约提交的数据：");
         Journal.myconsole(res);
      });
}
