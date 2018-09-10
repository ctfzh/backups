// 门店列表

// 引用日志输出
var Journal = require('../JS/tool/journal.js')
//引入签名加密商户号
var Sign = require('../JS/tool/sign.js')
//网络请求
var Request = require("../JS/request/request.js")
//数据接口地址
var Server = require('../JS/request/server_address.js'); 
//全局通用js
var Currency = require('../JS/tool/currency.js');
// 引入SDK核心类
var QQMapWX = require('../JS/tool/qqmap-wx-jssdk.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  //取餐状态
    choice:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    if (options.function_type && options.function_type !="undefined"){
      this.setData({
        function_type: options.function_type,
      })
    }else{
      this.setData({
        show: false,
        retry_an: 0,
        error: 1,
        log: 0,
        error_text: "附近没有门店",
      })
    }
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
    if (this.data.function_type){
      //初始化页面
      Retry(this);
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //初始化页面
    Retry(this);
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
  //取餐选择
  choice: function(e){
    var choice = e.currentTarget.dataset.choice;
    var store_id = e.currentTarget.dataset.store_id;
	  this.setData({
		  store_id: store_id,
	  })

    if (choice==1){
		 get_time(this);
	 } else {
		 this.setData({
			 choice: 0,
		 })
      //移除时间
      try {
        wx.removeStorageSync('time')
      } catch (e) {
		 }
	}

  },
  //点餐门店选择
	order_store: function (e) {
		//移除时间
		try {
			wx.removeStorageSync('time')
		} catch (e) {
		}
    var store_id = e.currentTarget.dataset.store.store_id;
    if (this.data.order == store_id){
      var order = null;
    }else{
      var order = store_id;
    }
    this.setData({
      choice: 0,
      order: order,
      })
  },

  //跳转门店
  jump_store: function(e){
    //移除购物车
    try {
      wx.removeStorageSync('buy_goods_list')
    } catch (e) {
    }
    var store = e.currentTarget.dataset.store;
    wx.navigateTo({
      url: '/pages/commodity/goods?function_type=' + this.data.function_type + "&store_id=" + store.store_id,
    })
  },

  //登入完成回调
  login_success: function () {
     //浏览量统计
     Currency.visit(this);
    this.setData({
      login: false,
    })
    Retry(this);
  },

  //搜索关键词
  search: function (event) {
    var key_word = event.detail.value;
    this.setData({
      key_word: key_word,
    })
  },
  
  //点击完成时
  complete: function () {
    //人员列表数据
    store_list(this)
  },

  //查看门店地图
  consult_map: function(){
    wx.navigateTo({
      url: '../store/consult_map?lat=' + this.data.lat + '&lng=' + this.data.lng +"&function_type=" + this.data.function_type,
    })
  },

  //重试事件
  retry: function () {
    //初始化页面
    Retry(this);
  },
  
   //切换地址 
  sele_address: function(){
     wx.navigateTo({
		  url: '/pages/address/sele_receiving_address?address= ' + this.data.address,
     })
  }
})

/******************************************普通方法******************************************/
// 页面初始化
function Retry(that) {
  //获取商户号
  Sign.getExtMchid(
    function () {
       if (Currency.getOpenid()) {
          //浏览量统计
          Currency.visit(that);
         //获取地址
         try{
            var lat = wx.getStorageSync('lat');
				var lng = wx.getStorageSync('lng');
				var address = wx.getStorageSync('address');
            if(lat&&lng){
               that.setData({
                  lat: lat,
                  lng: lng,
						address: address
               })
               //详细地址
               address_details(that);
               //门店列表
               store_list(that);
            }else{
               // 定位当前位置
               location(that);
            }
         }catch(e){

         }
      } else {
        //关闭加载中动画
        wx.hideLoading();
        wx.stopPullDownRefresh();
        that.setData({
          login: true,
        })
      }
    },
    function () {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.setData({
        show: false,
        retry_an: 1,
        error: 1,
        error_text: "商户不存在",
      })
    },
  )
}



//定位
function location(that){
   //获取位置
   wx.getLocation({
      type: 'wgs84',
      success: function (res) {
         that.setData({
            lat: res.latitude,
            lng: res.longitude,
         })
			address_details(that);
         //门店列表
         store_list(that);
      },
      fail: function (res) {
         //关闭加载中动画
         wx.hideLoading();
         wx.stopPullDownRefresh();
         that.setData({
            show: false,
            retry_an: 2,
            error: 0,
            error_text: "请授权地理位置",
         })
      }
   })
} 


/******************************************获取数据方法******************************************/

//门店列表
function store_list(that) {
  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();
  data['lng'] = that.data.lng;
  data['lat'] = that.data.lat;
  data['type'] = that.data.function_type;
  if (that.data.key_word) {
    data['key_word'] = that.data.key_word;
  }

  Request.request_data(
    Server.STORE_LIST(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show: true,
          store: res,
        })
        //评分
        var grade = [];
        var decimal = [];
        for (var i = 0; i < res.data.length;i++){
          var res_score = String(res.data[i].store_score);
          if (res_score && res_score.indexOf('.') != -1) {
            var score = res_score.split(".");
            grade.push(score[0]);
            decimal.push(score[1] * 10);
          } else {
            grade.push(res_score);
            decimal.push(0);
          }
        }
        that.setData({
          grade: grade,
          decimal: decimal,
        })
      } else {
        that.setData({
          show: false,
          retry_an: 0,
          error: 1,
          error_text: '附近没有门店',
        })
      }
    },
    function (res) {
      that.setData({
        show: false,
        retry_an: 1,
        error: 0,
        error_text: res,
      })
    },
    function (res) {
      //关闭加载中动画
      wx.hideLoading();
      wx.stopPullDownRefresh();
      Journal.myconsole("门店列表请求数据：")
      Journal.myconsole(res);
    })
}

//获取时间段
function get_time(that) {
	let data = {};
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();
	data['store_id'] = that.data.store_id;
	data['type'] = that.data.function_type;
	Request.request_data(
		Server.TIME_SELECT(),
		data,
		function (res) {
			if (res&&res.length>0){
				//获取选中时间
				try {
					var time = wx.getStorageSync('time')
					if (time) {
						that.setData({
							time,
						})
					}
				} catch (e) {
				}
				that.setData({
					mack: true,
					choice: 1,
				})
			}else{
				wx.showToast({
					title: "非常抱歉，当前无预约时间可选择",
					icon: 'none',
					duration: 2000
				})
			}
		},
		function (res) {
			wx.showToast({
				title: res ? res : "失败！！！",
				icon: 'none',
				duration: 2000
			})
		},
		function (res) {
			Journal.myconsole('时间段请求的数据');
			Journal.myconsole(res);
		});
}


//详细地址
function address_details(that) {
	var data = {};
	data['sign'] = Sign.sign();
	data['mchid'] = Sign.getMchid();
	data['lng'] = that.data.lng;
	data['lat'] = that.data.lat;

	Request.request_data(
		Server.GETADDRESS(),
		data,
		function (res) {
				var address = res.address;
				if (that.data.address) {
					var address = that.data.address;
				}
				// console.log(res);
				that.setData({
					address: address,
				})
		},
		function (res) {
			wx.showToast({
				title: res ? res : "失败！！！",
				icon: 'none',
				duration: 2000
			})
		},
		function (res) {
			//关闭加载中动画
			setTimeout(function () {
				wx.hideLoading();
			}, 2000)
			Journal.myconsole('地址详情接口返回数据');
			Journal.myconsole(res);
		});
}