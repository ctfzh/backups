// pages/refund/edit_express.js
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

    index: 0,
    express_array: [
      { id: '', name: '请选择物流公司' },
      { id: 'sf', name: '顺丰速运' },
      { id: 'ems', name: '申通E物流' },
      { id: 'yto', name: '圆通速递' },
      { id: 'zto', name: '中通速递' },
      { id: 'zjs', name: '宅急送' },
      { id: 'yunda', name: '韵达快运' },
      { id: 'htky', name: '汇通快运' },
      { id: 'ttkdex', name: '天天快递' },
      { id: 'eyb', name: 'EMS经济快递' },
      { id: 'qfkd', name: '全峰快递' },
      { id: 'fedex', name: '联邦快递' },
      { id: 'lb', name: '龙邦速递' },
      { id: 'fast', name: '快捷速递' },
      { id: 'uc', name: '优速物流' },
      { id: 'sure', name: '速尔' },
      { id: 'best', name: '百世物流' },
      { id: 'dbl', name: '德邦物流' },
    ],
    img: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		//关闭转发按钮
		wx.hideShareMenu();
    var that = this;
    that.setData({
      order_id: options.order_id,
      order_sku_id: options.order_sku_id,
      id: options.id,
    })
    //初始化页面加载
    Refresh(this) 
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

  },
  //选择的物流公司
  bindExpressChange: function (e) {
    MyUtils.myconsole('选中的物流公司：' + this.data.express_array[e.detail.value].name);
    this.setData({
      index: e.detail.value
    })
  },
  //获取输入的订单编号
  bindInputExpressNumbers: function (e) {
    MyUtils.myconsole('订单编号' + e.detail.value);
    this.setData({
      express_no: e.detail.value
    })
  },
  //获取输入的备注
  bindInputRemark: function (e) {
    MyUtils.myconsole('备注' + e.detail.value);
    this.setData({
      express_remark: e.detail.value
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
        MyRequest.uploadImg(that, 'mall_refund_express_img', tempFilePaths[0], 'file',
          function (res) {
            MyUtils.myconsole("图片上传成功：");
            MyUtils.myconsole(res);
            MyUtils.myconsole("图片上传成功返回的图片地址：");
            MyUtils.myconsole(res.fileName);
            if (res && res.fileName) {
              img.push(res.fileName);
              that.setData({
                img: img,
                imgUrl: res.imgUrl,
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
  //提交物流信息
  sumbit_onclick:function(){
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
	}
})



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
		 }
		 that.setData({
			 login: login,
			 show_loading_faill:true,
		 })
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}


//提交物流信息
function sumbit_refund(that) {
	wx.showLoading({
		title: '加载中...',
		mask: true,
	})
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {}; data['token'] = token;
		var order_id = that.data.order_id;
		data['order_id'] = order_id;

		var order_sku_id = that.data.order_sku_id;
		data['order_sku_id'] = order_sku_id;

		var id = that.data.id;
		data['id'] = id;


		var express_array = that.data.express_array;
		var index = that.data.index;
		if (index > 0) {
			data['express'] = express_array[index].id;
		} else {
			Extension.show_top_msg(that, '请选择物流公司');
			return;
		}
		var express_no = that.data.express_no;
		if (express_no) {
			data['express_no'] = express_no;
		} else {

			Extension.show_top_msg(that, '请填写物流单号');
			return;
		}
		var express_remark = that.data.express_remark;
		if (express_remark) {
			data['express_remark'] = express_remark;
		}

		var img = that.data.img;
		if (img && img.length > 0) {
			data['express_img'] = JSON.stringify(img);

		}

		data['mchid'] = MySign.getMchid();
		data['sign'] = MySign.sign(data);
		MyRequest.request_data(
			MyHttp.REFUNDSENDGOODS(),
			data,
			function (res) {
				Extension.show_top_msg(that, "物流信息填写成功")
				setTimeout(function () {
					wx.navigateBack({
						delta: 1
					})
				}, 1500);
			},
			function (res) {
				Extension.show_top_msg(that, res ? res : '物流信息填写失败');
			},
			function (res) {
				MyUtils.myconsole("请求提交物流信息的数据：");
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}
