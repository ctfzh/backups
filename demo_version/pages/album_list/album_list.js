// 相册JS

//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
// 引用日志输出
var Journal = require('../tool/journal.js');
//引入签名加密商户号
var Sign = require('../tool/sign.js');
//全局通用js
var Currency = require('../tool/currency.js');

var scroll = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面加载初始隐藏
    show_loading_faill: false,
    album_type_sle: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    });

    // 门店id
    if (options.store_id) {
      this.setData({
        store_id: options.store_id,
      })
    }
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
    //加载中动画
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      album_type_sle: '0',
    })
    // 初始化页面
    Refresh(this);

    //关闭下拉
    wx.stopPullDownRefresh()
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
	/**
	 * 页面滚动事件
	 */
	onPageScroll: function (e) {
		var top = e.scrollTop;
		if(top>0){
			if (!scroll){
				scroll = true;
				this.setData({
					fixed: true
				})
			}
		} else {
			if (scroll) {
				scroll = false;
				this.setData({
					fixed: false
				})
			}
		}
	},

  //重试事件
  retry_onclick: function () {
    //加载中动画
    wx.showLoading({
      title: '加载中',
    });
    // 初始化页面
    Refresh(this);
  },

  //分类点击事件
  album_type_bin: function (e) {
    this.setData({
      album_type_sle: e.currentTarget.dataset.index
    })

    //加载中动画
    wx.showLoading({
      title: '加载中',
    })

    //传入分类id获取对应图片数据
    get_album_list(this, e.currentTarget.dataset.data.album_id, e.currentTarget.dataset.data.type)
  },
  //查看原图
  prototype_src_bin: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgalist // 需要预览的图片http链接列表  
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
})


// 初始化页面
function Refresh(that) {
   //获取商户号
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
            Currency.visit(that, 4);
            that.setData({
               login: false,
            })
         }
         get_album_type(that);
      },
		function () {
			Currency.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
      },
   )
}



/*==================数据请求方法==================*/

// 获取相册类型数据
function get_album_type(that) {

  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();

  //门店id
  var store_id = that.data.store_id;
  if (store_id) {
    data['store_id'] = store_id;
  }

  Request.request_data(
    Server.GETTABLBUMTYPE(),
    data,
    function (res) {
		 if (res && res!="[]"){
			 that.setData({
				 show_loading_faill: true,
				 album_type_c: res,
			 })
			 //获取第一个分类的图片数据
			 get_album_list(that, res[0].album_id, res[0].type)
		 } else {
			 Currency.custom_error(that, '2', '页面加载失败' ,'（商户暂无上传）', '2');
		 }
    },
	  function (res) {
		  Currency.error(that, res);
	  }, 
	  function (res) {
		  Journal.myconsole("请求相册类型的数据：")
		  Journal.myconsole(res);
    })

}

// 获取相册图片数据
function get_album_list(that, album_id, album_type) {

  var data = {};
  data['mchid'] = Sign.getMchid();
  data['sign'] = Sign.sign();

  //相册id
  if (album_id) {
    data['album_id'] = album_id;
  }
  //相册类型
  if (album_type) {
    data['type'] = album_type;
  }

  Request.request_data(
    Server.GETALBUMLIST(),
    data,
    function (res) {
      if (res) {
        that.setData({
          album_list: res,
			  list_len: res.list,
        })
        //原图链接数组
        var imgalist = [];
        for (var i = 0; i < res.list.length; i++) {
          imgalist.push(res.list[i].prototype_src)
          that.setData({
            imgalist: imgalist,
          })
        }
      }
    },
	  function (res) {
		  Currency.error(that, res);
    },
	  function (res) {
		  if (that.data.list_len.length > 0) {
			  var length = false;
		  }else{
			  var length = true;
		  }
		  that.setData({
			  length: length
		  })
		  setTimeout(function () {
			  //关闭下拉动画
			  wx.stopPullDownRefresh();
			  //关闭加载中动画
			  wx.hideLoading();
		  }, 200);
		  Journal.myconsole("请求相册图片的数据：")
		  Journal.myconsole(res);
    })
}