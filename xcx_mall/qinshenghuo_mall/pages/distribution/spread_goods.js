//推广商品
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面隐藏
    show_loading_faill: false,
    //商品分享弹出框flag
    flag_shar_gd: false,
    //分享小程序码flag
    flag_sha_code: false,
    //加载中动画
    time_img: true,
    //tab切换index
    curIndex: 0,
    // 默认排序 1,佣金，2,销量
    order_by: 1,
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

    //隐藏页面转发按钮
    wx.hideShareMenu();

    // 初始化页面
    Refresh(this);

    //获取手机像素比
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          pixelRatio: res.pixelRatio,
        })
      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var share_img = this.data.goods_list.img;
      var share_text = this.data.goods_list.name;
      var path = 'pages/' + goods_ulr(this.data.goods_list) + '?goods_id=' + this.data.goods_list.id + '&distributor_no=' + this.data.distribution.distributor_no;
      this.setData({
        share_friend: false,
      })
    }
    return {
      title: share_text,
      imageUrl: share_img,
      path: path,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //重试事件
  retry_onclick: function () {
    // 初始化页面
    Refresh(this);
  },

  //立即推广
  to_spread: function (e) {
    this.setData({
      goods_list: e.currentTarget.dataset.goods,
      share_friend: true,
    })
  },

  //tab切换
  tab: function (e) {
    // 获取推广商品
    getSpreadGoods(this, e.currentTarget.dataset.id, this.data.spread_goods_name);
  },

  //关闭分享弹出框
  close_share: function () {
    this.setData({
      share_friend: false,
      flag_shar_gd: false,
      flag_sha_code: false,
      img_See: false,
    });
  },

  //分享到朋友圈
  circle_friends: function () {
    var that = this;
    this.setData({
      share_friend: false,
      flag_shar_gd: true,
      time_img: true,
    });
    get_small_program(that);
  },

  //小程序码分享
  Small_program_code: function () {
    var that = this;
    that.setData({
      share_friend: false,
      flag_sha_code: true,
      time_img: true,
    });
    get_small_program(that);
  },

  //查看原图
  img_See: function () {
    var that = this;
    var urls = [];
    urls.push(that.data.tempFilePath);
    
    if (!that.data.tempFilePath){
      Extension.show_top_msg(that, '图片生成失败，无法预览');
    }else{
      wx.previewImage({
        current: that.data.tempFilePath, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    }
  },

  //保存图片
  save_btn: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.tempFilePath,
      success(res) {
        wx.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          share_friend: false,
          flag_shar_gd: false,
          flag_sha_code: false,
        })
        MyUtils.myconsole(res)
      },
      fail(res) {
        Extension.show_top_msg(that, '图片生成失败，无法保存');
      },
      complete(res) {
        MyUtils.myconsole(res)
      }
    })
  },

  //商品详情
  goods_details: function (e) {
    var list = e.currentTarget.dataset.goods
    var url = '../' + goods_ulr(list) + '?goods_id=' + list.id;
    wx.navigateTo({
      url: url,
    })
  },
  //搜索输入完成
  search_dcon: function (event){
    this.setData({
      spread_goods_name:event.detail.value
    })
    getSpreadGoods(this, this.data.curIndex, event.detail.value);
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

/*********************************************普通方法函数*********************************************/
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
			 share_friend: false,
			 flag_shar_gd: false,
			 flag_sha_code: false,
		 })
		 
    },
	  function () {
		  //自定义错误提示
		  Extension.custom_error(that, '2', '页面加载失败', '（商户不存在）', '2');
    },
  )
}

//推广商品画布
function extension_goods(that){
  const downloadTask = wx.downloadFile({
    url: that.data.goods_list.img,
    success: function (res) {
      //头像
      var portrait = that.data.portrait;
      //手机像素比
      var pixelRatio = that.data.pixelRatio;
      //商品图片
      var goods_img = res.tempFilePath;
      //商品价格
      var goods_money = that.data.goods_list.price;
      //商品名称
      var goods_name = that.data.goods_list.name;
      //小程序码
      var QR_code_img = that.data.QR_code_img ? that.data.QR_code_img : "";
      //获取父级高宽
      wx.createSelectorQuery().selectAll('.circle_friends_canvas').boundingClientRect(function (rects) {
        rects.forEach(function (rect) {

          var width = rect.width;
          var height = rect.height;
          var center = width / 2
          //下方尺寸计算方式：width/（510/原尺寸）
          const ctx = wx.createCanvasContext('extension_goods');
          
          ctx.beginPath();
          ctx.setFillStyle('#FFFFFF');
          ctx.fillRect(0, 0, width, height);
          ctx.closePath();

          ctx.beginPath();
          ctx.drawImage(goods_img, center - (width / 1.02) / 2, 0, width / 1.02, width / 1.02);
          ctx.closePath();

          ctx.beginPath();
          const grd = ctx.createLinearGradient(0, width / 1.5, 0, width / 0.935779);
          grd.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grd.addColorStop(1, '#000000');
          ctx.closePath();
          
          ctx.beginPath();
          ctx.setFillStyle(grd);
          ctx.fillRect(center - (width / 1.02) / 2, width / 1.5, width / 1.02, width / 3.1875);
          ctx.closePath();

          ctx.beginPath();
          ctx.setFillStyle('#FFFFFF');
          ctx.rect(center - (width / 1.02) / 2, width / 1.5, width / 2.475728, width / 9.107142);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.arc(width / 2.475728 + 0.1, width / 1.5 + width / 9.107142 / 2, width / 9.107142 / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.setFillStyle('#DB3927');
          ctx.setFontSize(width / 13.421052);
          ctx.setTextBaseline('middle');
          ctx.setTextAlign('center');
          ctx.fillText('￥' + goods_money, center - (width / 1.02) / 2 + width / 2.475728 / 2, width / 1.5 + width / 9.107142 / 2);
          ctx.closePath();

          ctx.beginPath();
          ctx.setFillStyle('#FFFFFF');
          ctx.setFontSize(width / 18.214285);
          ctx.setTextBaseline('middle');
          ctx.setTextAlign('left');
          var lineWidth = 0;
          var canvasWidth = width / 1.253071;     //计算canvas的宽度
          var initHeight = width / 1.186046;         //绘制字体距离canvas顶部初始的高度
          var lastSubStrIndex = 0;                        //每次开始截取的字符串的索引
          var line_number = 0;                             //当前行数
          for (let i = 0; i < goods_name.length; i++) {
            lineWidth += ctx.measureText(goods_name[i]).width;    //measureText在工具中无效，
            if (lineWidth > canvasWidth) {
              if (line_number == 0) {
                ctx.fillText(goods_name.substring(lastSubStrIndex, i), center - (width / 1.253071) / 2, initHeight);//绘制截取部分
                initHeight += 20;//20为字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                line_number += 1;
              } else {
                ctx.beginPath();
                ctx.fillText(goods_name.substring(lastSubStrIndex, i - 2) + "...", center - (width / 1.253071) / 2, initHeight);//绘制截取部分
                ctx.closePath();
                i = goods_name.length;
              }
            }
            if (i == goods_name.length - 1) {//绘制剩余部分
              if (line_number > 0){
                ctx.beginPath();
                ctx.fillText(goods_name.substring(lastSubStrIndex, i + 1), center - (width / 1.253071) / 2, initHeight);
                ctx.closePath();
              }else{
                ctx.fillText(goods_name.substring(lastSubStrIndex, i + 1), center - (width / 1.253071) / 2, initHeight);
              }
            }
          }
          ctx.closePath();
          
          ctx.beginPath();
          ctx.save();
          ctx.arc(center - (width / 1.02 / 2) + (width / 6.375 / 2) + (width / 8.5), width / 0.971428 + (width / 6.375 / 2), width / 12.75, 0, 2 * Math.PI);
          ctx.clip();
          ctx.closePath();

          ctx.beginPath();
          ctx.setTextAlign('center');
          ctx.drawImage(portrait, center - (width / 1.02 / 2) + (width / 8.5), width / 0.971428, width / 6.375, width / 6.375);
          ctx.restore();
          ctx.closePath();

          ctx.beginPath();
          ctx.setFillStyle('#2C2F33');
          ctx.setFontSize(width / 18.214285);
          ctx.setTextAlign('left');
          ctx.setTextBaseline('middle');
          ctx.fillText('推荐给您一款超值商品', center - (width / 1.02 / 2) + (width / 5.1) + (width / 8.5), width / 0.894736);
          ctx.closePath();

          ctx.beginPath();
          ctx.drawImage(QR_code_img, center - (width / 2.318181) / 2, width / 0.829268, width / 2.318181, width / 2.318181);
          ctx.setFillStyle('#757A80');
          ctx.setFontSize(width / 21.25);
          ctx.setTextAlign('center');
          ctx.fillText('长按识别小程序码', center, height - (width / 12.5));
          ctx.closePath();

          //导出图片
          ctx.draw(true, function (e) {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width * pixelRatio,
              destHeight: height * pixelRatio,
              canvasId: 'extension_goods',
              success: function (res) {
                that.setData({
                  tempFilePath: res.tempFilePath,
                  img_See: true,
                })
              }
            })
          })
          that.setData({
            time_img: false,
          })
        });
        
      }).exec();
    }
  })
}

//小程序码画布
function canvas_code(that) {
  //小程序码
  var QR_code_img = that.data.QR_code_img ? that.data.QR_code_img : "";
  //手机像素比
  var pixelRatio = that.data.pixelRatio;

  wx.createSelectorQuery().selectAll('.canvas_code').boundingClientRect(function (rects) {
    rects.forEach(function (rect) {
      var width = rect.width;
      var height = rect.height;
      var center = width / 2
        //下方尺寸计算方式：width/（510/原尺寸）
      const ctx = wx.createCanvasContext('canvas_code')

      ctx.beginPath();
      ctx.setFillStyle('#FFFFFF')
      ctx.fillRect(0, 0, width, height)
      ctx.closePath();

      ctx.beginPath();
      ctx.drawImage(QR_code_img, center - (width / 1.9921875) / 2, width / 6.375, width / 1.9921875, width / 1.9921875)
      ctx.closePath();

      ctx.beginPath();
      ctx.setFontSize(width / 21.25)
      ctx.setTextAlign('center');
      ctx.setFillStyle('#757A80');
      ctx.fillText('长按识别小程序码', center, height - (width / 8.5));
      ctx.closePath();

      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: width,
          height: height,
          destWidth: width * pixelRatio,
          destHeight: height * pixelRatio,
          canvasId: 'canvas_code',
          success: function (res) {
            that.setData({
              tempFilePath: res.tempFilePath,
              img_See: true,
            })
          }
        })
      })
      //关闭加载中动画
      that.setData({
        time_img: false,
      })

    })
  }).exec();
}



/***************接口数据获取方法函数***************/

// 获取分销商信息
function getDistribution(that) {
	var token = MySign.getToken();
	if (!token) {
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
							// 获取推广商品
							getSpreadGoods(that, 1, that.data.spread_goods_name);
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

// 获取推广商品数据
function getSpreadGoods(that, order_by, spread_goods_name) {
  var mchid = MySign.getMchid();
  var data = {};
  data['sign'] = MySign.sign(data);
  data['mchid'] = mchid;
  data['order_by'] = order_by;
  if (spread_goods_name){
    data['goods_name'] = spread_goods_name;
  }
  MyRequest.request_data(
    MyHttp.GETSPREADGOODS(),
    data,
    function (res) {
      if (res) {
        that.setData({
          show_loading_faill: true,
          data: res,
          curIndex: order_by,
        });
      } else {
			//自定义错误提示
			Extension.custom_error(that, '3', '暂无商品', '', '');
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
		  MyUtils.myconsole("获取推广商品失败的数据");
		  MyUtils.myconsole(res);
		  //关闭下拉动画
		  wx.stopPullDownRefresh();
		  //关闭加载中动画
		  wx.hideLoading();
	  })

}

//获取小程序码
function get_small_program(that) {
  var scene = new Array(that.data.goods_list.id+"&"+that.data.distribution.distributor_no)
  var data = {};
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  data['type'] = 2;
  data['page'] = 'pages/' + goods_ulr(that.data.goods_list);
  data['scene'] = scene;

  MyRequest.request_data(
    MyHttp.CREATEUNLIMIT(),
    data,
    function (res) {
      if (res) {
        var downloadTask = wx.downloadFile({
          url: res.img[0],
          success: function (res) {
            that.setData({
              QR_code_img: res.tempFilePath,
              tempFilePath: null,
            })
            if (that.data.flag_shar_gd) {
              //商品推广画布
              extension_goods(that);
            } else {
              //小程序码画布
              canvas_code(that);
            }
          }, fail: function(){
            Extension.show_top_msg(that, '小程序码生成失败');
          }
        })

      } else {
        Extension.show_top_msg(that, '小程序码生成失败');
      }

    },
    function (res) {
      Extension.show_top_msg(that, '小程序码生成失败');
	  },
	  function (res) {
		  MyUtils.myconsole("请求小程序码的数据：")
		  MyUtils.myconsole(res);
	  })
}

function goods_ulr(list){
  if (list.id) {
    if (list.activity_type == 3) {
      //限时折扣
      var url = 'time_limit_detail/time_limit_detail';
    } else if (list.activity_type == 4) {
      //拼团
      var url = 'groups/groups_commodity_details';
    } else {
      var url = 'communal/commodity_details';
    }
    return url;
  }
}