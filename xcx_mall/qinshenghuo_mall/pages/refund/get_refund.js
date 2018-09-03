// pages/refund/get_refund.js

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
    img: [],
    refund_cause: {
      index: 0,
      itm: ["请选择退款原因", "多买/买错/不想要", "快递无记录", "少货/空包裹", "未按约定时间发货", "快递一张未送达", "其他"],
    },
    dispose_state: {
      index: 0,
      itm: ["请选择处理方式", "仅退款", "退货退款"],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    var that = this;
    wx.setNavigationBarTitle({
      title: '申请退款',
    })
    this.setData({
      order_sku_id: options.order_sku_id,
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
    getOrder_Detail(this, 0);
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
  // 退款原因选择方式
  bindRefundCauseChange: function (e) {
    this.setData({
      refund_cause: {
        index: e.detail.value,
        itm: this.data.refund_cause.itm,
      }
    })
  },
  bindDisposeStateChange: function (e) {
    this.setData({
      dispose_state: {
        index: e.detail.value,
        itm: this.data.dispose_state.itm,
      }
    })
  },
  //获取输入的退款金额
  bindInputMoney: function (e) {
    this.setData({
      input_money: e.detail.value,
    })

  },
  //获取输入的手机号码
  bindInputPhone: function (e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  //获取输入的备注信息
  bindInputRemark: function (e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  //删除图片
  delete_img_longOnclick: function (e) {
    MyUtils.myconsole("要删除的图片");
    MyUtils.myconsole(e.target.dataset.index);
    var img = this.data.img;

    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除当前图片？',
      success: function (res) {
        if (res.confirm) {

          img.splice(e.target.dataset.index, 1)
          that.setData({
            img: img,
          })
        } else if (res.cancel) {
          MyUtils.myconsole('用户点击取消')
        }
      }
    })
  },
  // 选择图片
  add_img_onclick: function () {
    var img = this.data.img;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        MyUtils.myconsole("选中的图片地址：");
        MyUtils.myconsole(tempFilePaths);
        MyRequest.uploadImg(that, 'mall_refund_img', tempFilePaths[0], 'file',
          function (res) {
            MyUtils.myconsole("图片上传成功：");
            MyUtils.myconsole(res);
            MyUtils.myconsole("图片上传成功返回的图片地址：");
            MyUtils.myconsole(res.fileName);
            if (res && res.fileName) {
              img.push(res.fileName);
              MyUtils.myconsole("图片列表地址：");
              MyUtils.myconsole(img);
              that.setData({
                img:  img,
                imgUrl: res.imgUrl ,
              })
            } else {
              Extension.show_top_msg("图片加载失败")
            }

          },
          function (res) {
            MyUtils.myconsole("图片上传失败");
            MyUtils.myconsole(res);
            Extension.show_top_msg("图片加载失败")
          }, )
      }
    })
    // MyUtils.imageSheet(this,
    // function(res){
    //   MyUtils.myconsole("选中的图片地址：");
    //   MyUtils.myconsole(res);
    // },
    // function(res){
    //   MyUtils.myconsole("调取失败：");
    //   MyUtils.myconsole(res);
    // })
  },
  //提交退款申请
  sumbit_onclick: function () {
    sumbit_refund(this);
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
	//重试事件
  retry_onclick: function () {
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})
		//初始化页面加载
		Refresh(this);
	},
})


//页面加载，重试
function Refresh(that) {
  //获取商户号
  MySign.getExtMchid(
    function () {
      getOrder_Detail(that, 1);
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}

function getOrder_Detail(that, inTo) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var order_sku_id = that.data.order_sku_id;
		var data = {};
		data['order_sku_id'] = order_sku_id;
		data['token'] = token;
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);

		MyRequest.request_data_new(
			MyHttp.REFUNDDETAIL(),
			data,
			function (res) {
				MyUtils.myconsole("获取到的数据：")
				MyUtils.myconsole(res);
				if (res) {
					var dispose_state = {}
					if (res.order_send_status == 1) {
						dispose_state = {
							index: 1,
							itm: ["请选择处理方式", "仅退款",],
						}
					}
					if (res.order_send_status == 2) {
						dispose_state = {
							index: 0,
							itm: ["请选择处理方式", "仅退款", "退货退款"],
						}
					}
					that.setData({
						order_no: res.order_no,
						create_time: res.create_time,
						goods_name: res.goods_name,
						money: res.money,
						show_loading_faill: true,
						dispose_state: dispose_state,
						order_id: res.order_id,
						input_money: res.money,
					})

				} else {
					//自定义错误提示
					Extension.custom_error(that, '3', '订单信息为空', '', '');
				}
			},
			function (code, msg) {
				MyUtils.myconsole("返回失败的数据：");
				MyUtils.myconsole('code:' + code);
				MyUtils.myconsole('msg' + msg);
				wx.hideLoading();
				if (code = 10004) {
					if (inTo == 1) {
						//自定义错误提示
						Extension.custom_error(that, '3', '订单信息为空', '', '');
					}
				} else {
					if (inTo == 1) {
						//错误提示
						Extension.error(that, msg);
					}
				}
			},
			function (res) {
				if (inTo == 1) {
					//错误提示
					Extension.error(that, res);
				}
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：")
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
};





//提交退款申请
function sumbit_refund(that) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		wx.showLoading({
			title: '加载中...',
			mask: true,
		})

		var data = {};
		data['token'] = token;
		var order_id = that.data.order_id;
		data['order_id'] = order_id;

		var order_sku_id = that.data.order_sku_id;
		data['order_sku_id'] = order_sku_id;

		var dispose_state = that.data.dispose_state.index;
		if (dispose_state && dispose_state > 0) {
			data['type'] = dispose_state;
		} else {
			Extension.show_top_msg(that, '请选择处理方式');
			return;
		}
		var reason = that.data.refund_cause.index;
		if (reason && reason > 0) {
			data['reason'] = reason;
		} else {
			Extension.show_top_msg(that, '请选择退款原因');
			return;
		}
		var money = that.data.money;
		var input_money = that.data.input_money;
		if (input_money) {
			if (input_money <= money) {
				data['money'] = input_money;
			} else {
				Extension.show_top_msg(that, '退款金额不能大于实付金额');
				return;
			}
		} else {
			Extension.show_top_msg(that, '请输入退款金额');
			return;
		}
		var phone = that.data.phone;
		if (phone) {
			if (phone.length == 11) {
				data['phone'] = phone;
			} else {
				Extension.show_top_msg(that, '请输入正确的手机号码');
				return;
			}
		} else {
			Extension.show_top_msg(that, '请输入您的联系方式');
			return;
		}

		var remark = that.data.remark;
		if (remark) {
			data['remark'] = remark;
		}

		var img = that.data.img;
		if (img && img.length > 0) {
			data['img'] = JSON.stringify(img);
		}
		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.REFUNDAPPLY(),
			data,
			function (res) {
				Extension.show_top_msg(that, "退款申请提交成功")
				wx.hideLoading();
				wx.redirectTo({
					url: '/pages/refund/refund_detail?order_sku_id=' + order_sku_id,
				})
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '退款申请提交失败');
			},
			function (res) {
				MyUtils.myconsole("请求失败的数据：");
				MyUtils.myconsole(res);
				//关闭下拉动画
				wx.stopPullDownRefresh();
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}
