// 添加，编辑，删除收货地址
// 收货地址列表
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');

Page({

   /**
    * 页面的初始数据
    */
   data: {
      show_loading_faill: true,
      area: [],
      range: [
         [],
         [],
         [],
      ],
		focus_details: false,
   },

   /**
    * 生命周期函数--监听页面加载
    */
	onLoad: function (options) {
		//优化ios下textarea的内边距
		let system = wx.getSystemInfoSync();
		if (system.platform == 'ios') {
			var address = {};
			address.address = "1";
			this.setData({ hackIos: '-12rpx', address });
		}
      //获取区域
      get_address_code(this, 1, 0);
		
		//编辑的地址数据
		var address = options.address ? options.address : null;
		if (address) {
			var is_address = true;
			address = JSON.parse(address);
			var title = '编辑地址';
		}else {
			var title = '添加地址';
		}
		//替换标题
		wx.setNavigationBarTitle({
			title
		})
		this.setData({
			address,
			is_address,
		})
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
      //重新加载页面
      Refresh(this);
   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   },

   //重试事件
   retry_onclick: function() {
      //加载中动画
      wx.showLoading({
         title: '加载中',
      })
      //重新加载
      Refresh(this)
   },

   //登入完成回调
   login_success: function() {
      //加载中动画
      wx.showLoading({
         title: '加载中',
      })
      Refresh(this);
   },

   //登入
   login_an(e) {
      Extension.registerrule(this, function(that) {
         Refresh(that)
      }, e);
   },

   //表单的值
   formSubmit: function(e) {
      var formData = e.detail.value;
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!formData.name) {
         Extension.show_top_msg(this, "请输入收货人");
         this.setData({
            focus_name: true
         });
      } else if (!formData.phone) {
         Extension.show_top_msg(this, "请输入收货人手机号");
         this.setData({
            focus_phone: true
         });
      } else if (!myreg.test(formData.phone)) {
         Extension.show_top_msg(this, "请输入正确的手机号");
         this.setData({
            focus_phone: true
         })
      } else if (!formData.area.length > 0) {
         Extension.show_top_msg(this, "请选择收货地区");
      } else if (!formData.details) {
         Extension.show_top_msg(this, "请输入收货地址详情");
         this.setData({
            focus_details: true
         });
		} else {
			this.setData({
				an_submit: true,
			})
			get_address_add(this, formData);
      }
   },

   // 区域选择器点击确定
   change(e) {
      var range = this.data.range;
      //选中的下标
      var area = e.detail.value;
      //省
      var province = range[0][area[0] ? area[0] : 0];
      //市
      var town = range[1][area[1] ? area[1] : 0];
      //区
      var district = range[2][area[2] ? area[2] : 0];
      //选中的值
      area.push([province, town, district])

      this.setData({
         area,
      })
   },

   //区域选择器某一列发生改变时触发
   columnchange(e) {
      var column = e.detail.column;
      var value = e.detail.value;
      var range = this.data.range;

      if (column == 0) {
         //改变的省
         var pid = range[0][value].id;
         get_address_code(this, pid, 1);
      } else if (column == 1) {
         //改变的市
         var pid = range[1][value].id;
         get_address_code(this, pid, 2);
      }
   },

   // 区域选择器取消选择
   cancel(e) {
      var area = this.data.area;
      var pid = area.length > 3 ? area[3][0].id ? area[3][0].id : 1 : 1;
      var getType = 1;

      if (pid != 1) {
         getType = area[3][1].id ? area[3][1].id : 1;
      }
      //重制选择器
      get_address_code(this, pid, getType);

      this.setData({
         area,
      })
   },

	//删除地址
	delete (e){
		var id = this.data.address.id;
		if(id){
			get_address_delete(this, id);
		}else{
			Extension.show_top_msg(that, res ? res : '无法删除');
		}
	}
})





/*****************************************普通方法**************************************************/
//页面加载，重试
function Refresh(that) {
   //获取商户号
   MySign.getExtMchid(
      function() {
         var openid = Extension.getOpenid();
         if (!openid) {
            var login = true;
         } else {
            var login = false;
         }
         that.setData({
            login: login,
         })

      },
      function() {
         Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
      },
   )
}



/*****************************************数据获取**************************************************/
//区域
//获取城市的code
function get_address_code(that, pid, getType) {


   var data = {};
   data['pid'] = pid;
   data['sign'] = MySign.sign(data);
   data['mchid'] = MySign.getMchid();

   MyRequest.request_data(
      MyHttp.GET_ADDRESS_CODE(),
      data,
		function (res) {
			var address = that.data.address;
			var is_address = that.data.is_address;
			var range = that.data.range;
			var area = that.data.area;
         var province = [];
         var town = [];
         var district = [];

			if (getType == 0) {
				//省
            for (var a in res) {
					if (a) {
						province.push({
							id: a,
							name: res[a],
						})
						//初始化为已有的地址
						if (address && is_address){
							if (address.province_code == a) {
								var pid = a;
								area[0] = province.length - 1;
								area[3] = [];
								area[3].push({
									id: a,
									name: res[a],
									});
							}
						}
               }
            }
            range[0] = province;
				get_address_code(that, pid ? pid : province[0].id, 1)
         } else if (getType == 1) {
            //市
            for (var a in res) {
               if (a) {
                  town.push({
                     id: a,
                     name: res[a],
                  })
						//初始化为已有的地址
						if (address && is_address) {
							if (address.city_code == a) {
								var pid = a;
								area[1] = town.length - 1;
								area[3].push({
									id: a,
									name: res[a],
								});
							}
						}
               }
            }
            range[1] = town;
				get_address_code(that, pid ? pid : town[0].id, 2)
         } else if (getType == 2) {
            //区
            for (var a in res) {
               if (a) {
                  district.push({
                     id: a,
                     name: res[a],
                  })
						//初始化为已有的地址
						if (address && is_address) {
							if (address.county_code == a) {
								var pid = a;
								area[2] = district.length - 1;
								area[3].push({
									id: a,
									name: res[a],
								});
							}
							that.setData({
								area,
							})
						}
               }
            }
            range[2] = district;
				is_address = false;
         } else {
            //市
            for (var a in res) {
               if (a) {
                  town.push({
                     id: a,
                     name: res[a],
                  })
               }
            }
            range[1] = town;
            get_address_code(that, getType, 2)
         }

         that.setData({
            range,
				is_address,
         })
      },
      function(res) {
         Extension.show_top_msg(that, res ? res : '数据查询失败')
      },
      function(res) {
         MyUtils.myconsole("请求城市的code的数据：")
         MyUtils.myconsole(res);
      })
}


//新增、改收货地址 type:1、新增  2、修改 
function get_address_add(that, formData) {
   //获取token
   var token = MySign.getToken();
   if (!token) {
      Extension.custom_error(that, '3', '登录失效', '', '3');
   } else {
		var address = that.data.address;
      var data = {};
      data['token'] = token;
      data['mchid'] = MySign.getMchid();
      data['sign'] = MySign.sign(data);
		if (address){
			data['id'] = address.id;
		}
		data['province'] = formData.area[3][0].id;
		data['city'] = formData.area[3][1].id;
		data['region'] = formData.area[3][2].id;
		data['address'] = formData.details;
		data['name'] = formData.name;
		data['telephone'] = formData.phone;

      MyRequest.request_data(
			address ? MyHttp.ADDRESSEDIT() : MyHttp.ADDRESSADD(),
         data,
         function(res) {
				wx.navigateBack({
					delta: 1
				})
			},
         function(res) {
				Extension.show_top_msg(that, res ? res : address ? '修改失败':'保存失败')
         },
         function(res) {
				that.setData({
					an_submit: false,
				})
            MyUtils.myconsole("请求新增、改收货地址的数据：")
            MyUtils.myconsole(res);
         })
   }
}


//删除收货地址
function get_address_delete(that, id) {

	//获取token
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		data['id'] = id;
		MyRequest.request_data(
			MyHttp.ADDRESSDELETE(),
			data,
			function (res) {
				wx.navigateBack({
					delta: 1
				})
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '删除失败');
			},
			function (res) {
				MyUtils.myconsole("请求删除收货地址");
				MyUtils.myconsole(res);
			})
	}
}