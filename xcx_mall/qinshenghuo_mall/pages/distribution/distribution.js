// 我的分销
var MyUtils = require('../base/utils/utils.js');
var MyRequest = require('../base/utils/request_management.js');
var MySign = require('../base/utils/sign.js');
var MyHttp = require('../base/utils/httpurl.js');
var LoginRequest = require('../template/login.js');
//扩展工具js
var Extension = require('../base/utils/Extension_tool.js');
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');
// 日期时间获取
var util = require('../../utils/util.js');

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
    //二维码数据
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      var distributor_no = scene;
    } else if (options.distributor_no && options.distributor_no != 'undefined') {
      var distributor_no = options.distributor_no;
    }
    //分销关系绑定身份编号
    if (distributor_no) {
      this.setData({
        p_distributor_no: distributor_no,
      })
      try {
        wx.setStorageSync('p_distributor_no', distributor_no);
      } catch (e) {
      }
    }

    //获取手机像素比
    wx.getSystemInfo({
      success: function (res) { 
        that.setData({
          pixelRatio:res.pixelRatio,
        })
      }
    })

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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮 1,商城推荐，2,分销商邀请
      if (this.data.spread == 2) {
        var share_text = res.target.dataset.recruit.share_describe ? res.target.dataset.recruit.share_describe: "立即成为商城合伙人，一起推广商品赚钱吧！";
        var share_img = res.target.dataset.recruit.share_img ? res.target.dataset.recruit.share_img : '../img/apply.png';
        var path = 'pages/distribution/distribution?distributor_no=' + this.data.distribution.distributor_no;
      } else {
        var share_text = this.data.distribution.nickname+'发现了一个购物的好地方，马上了解一下！';
        var share_img = '../img/Invitation.png';
        var path = 'pages/home/home?distributor_no=' + this.data.distribution.distributor_no;
      }
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
		//加载中动画
		wx.showLoading({
			title: '加载中',
		})

    // 初始化页面
    Refresh(this);
  },

  //跳转 推广商品 页面
  to_spread_goods: function () {
    wx.navigateTo({
      url: '../distribution/spread_goods',
    });
  },

  //跳转 推广统计 页面
  to_spread_statistics: function () {
    wx.navigateTo({
      url: '../distribution/spread_statistics',
    })
  },
  //跳转 我的佣金 页面
  to_commission: function () {
    wx.navigateTo({
      url: '../distribution/commission',
    })
  },
  // 跳转 分销规则 页面
  to_distribution_rule: function () {
    wx.navigateTo({
      url: '../distribution/distribution_rule',
    })
  },
  //跳转 会员中心 页面
  to_user: function () {
    wx.switchTab({
      url: '/pages/user/user',
    })
  },

  //推广商城
  to_spread_mall: function () {
    this.setData({
      spread: 1,
      share_friend: true,
    })
  },

  //邀请好友
  to_invite_friend: function () {
    this.setData({
      spread: 2,
      share_friend: true,
    })
  },

  //关闭分享弹出框
  close_share: function () {
    this.setData({
      share_friend: false,
      flag_shar_gd: false,
      flag_sha_code: false,
    });
  },

  //分销申请
  apply: function () {
    distributor_apply(this);
  },

  // 审核中返回按钮
  cancel: function () {
    wx.navigateBack({
      data: 1,
    })
  },

  //分享到朋友圈
  circle_friends: function () {
    var that = this;
    this.setData({
      share_friend: false,
      flag_shar_gd: true,
      time_img: true,
    });
    //获取小程序码
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
    urls.push(this.data.tempFilePath);
    if (!that.data.tempFilePath) {
      Extension.show_top_msg(that, '图片生成失败，无法预览');
    } else {
      wx.previewImage({
        current: this.data.tempFilePath, // 当前显示图片的http链接
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
			 // 获取分销商数据
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


//分享到朋友圈需要的画布
function canvas(that) {
  const downloadTask = wx.downloadFile({
    url: that.data.distribution.avatar,
    success: function (res) {
      //头像
      var portrait = res.tempFilePath;
      //用户昵称
      var user_name = that.data.distribution.nickname;
      //商城名称
      var mall = that.data.distribution.mall_name;
      //推广文字
      var extension_text = '';
      var extension_text_h2 = '';
      if (that.data.spread == 1) {
        extension_text = user_name + "向您推荐了" + mall + "商城";
        extension_text_h2 = "马上选购商品吧";
      } else {
        extension_text = user_name + "邀请您一起加入推广";
        extension_text_h2 = "赢取佣金奖励";
      }
      //小程序码
      var QR_code_img = that.data.QR_code_img;
      //手机像素比
      var pixelRatio = that.data.pixelRatio;

      wx.createSelectorQuery().selectAll('.circle_friends_canvas').boundingClientRect(function (rects) {
        rects.forEach(function (rect) {
          var width = rect.width;
          var height = rect.height;
          var center = width / 2
          //下方尺寸计算方式：width/（510/原尺寸）
          const ctx = wx.createCanvasContext('myCanvas');
          
          ctx.beginPath();
          ctx.setFillStyle('#FFFFFF')
          ctx.fillRect(0, 0, width, height);
          ctx.closePath();
          
          ctx.beginPath();
          ctx.save()
          ctx.beginPath()
          ctx.fill('#FFFFFF');
          ctx.arc(center, width / 5.6666666, width / 12.75, 0, 2 * Math.PI);
          ctx.clip()
          ctx.closePath();

          ctx.beginPath();
          ctx.setTextAlign('center');
          ctx.drawImage(portrait, center - (width / 6.375) / 2, width / 10.2, width / 6.375, width / 6.375)
          ctx.restore()
          ctx.closePath();

          ctx.beginPath();
          ctx.setFontSize(14)
          ctx.setTextAlign('center');
          ctx.setFillStyle('#2C2F33');
          ctx.fillText(extension_text, center, width / 2.833333);
          ctx.closePath();

          ctx.beginPath();
          ctx.setTextAlign('center');
          ctx.fillText(extension_text_h2, center, width / 2.31818181);
          ctx.closePath();

          ctx.beginPath();
          ctx.drawImage(QR_code_img, center - (width / 1.9921875) / 2, width / 1.917293, width / 1.9921875, width / 1.9921875)
          ctx.closePath();

          ctx.beginPath();
          ctx.setFontSize(width / 21.25)
          ctx.setTextAlign('center');
          ctx.setFillStyle('#757A80');
          ctx.fillText('长按识别小程序码', center, height - (width / 8.5));
          ctx.closePath();

          ctx.draw(true, function () {
            //导出图片
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width * pixelRatio,
              destHeight: height * pixelRatio,
              canvasId: 'myCanvas',
              success: function (res) {
                that.setData({
                  tempFilePath: res.tempFilePath,
                })
              }
            })
          });

          //关闭加载动画
            that.setData({
              time_img: false,
            })

        })
      }).exec();
    }
  })

}

//小程序码画布
function canvas_code(that){
  //小程序码
  var QR_code_img = that.data.QR_code_img;
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
      ctx.setFillStyle('#FFFFFF');
      ctx.fillRect(0, 0, width, height);
      ctx.closePath();

      ctx.beginPath();
      ctx.drawImage(QR_code_img, center - (width / 1.9921875) / 2, width / 6.375, width / 1.9921875, width / 1.9921875);
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
            })
          }
        })
      })

      that.setData({
        time_img: false,
      })

    })
  }).exec();
}



/*************************************接口数据获取方法函数**********************************************/

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
						anomaly_code: null,
						distribution_apply: false,
						distribution_user: false,
						examine: false,
					});
					if (res.info.status == 2) {
						that.setData({
							anomaly_code: 2,
						});
					} else {
						if (res.info.audit_status == 1) {
							that.setData({
								examine: true,
							});
						} else if (res.info.audit_status == 2) {
							that.setData({
								distribution: res.info,
								distribution_user: true,
							});
							// 获取推广统计信息
							getSpreadStatistics(that);
							// 分销招募页
							getRecruit(that);
						} else if (res.info.audit_status == 3) {
							that.setData({
								distribution: res.info,
								anomaly_code: 3,
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
				} else if (res == 1) {
					that.setData({
						show_loading_faill: true,
						distribution_apply: true,
						distribution_user: false,
						examine: false,
						anomaly_code: null,
					});
					// 分销招募页
					getRecruit(that);
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
function getSpreadStatistics(that) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		data['token'] = token;
		data['sign'] = MySign.sign(data);
		data['mchid'] = MySign.getMchid();
		MyRequest.request_data(
			MyHttp.GETSPREADSTATISTICS(),
			data,
			function (res) {
				if (res) {
					that.setData({
						Statistics: res,
					})
				} else {
					Extension.custom_error(that, '2', '页面加载失败', '', '2');
				}
			},
			function (res) {
				//错误提示
				Extension.error(that, res);
			},
			function (res) {
				MyUtils.myconsole("推广统计请求的数据：")
				MyUtils.myconsole(res);
				//关闭加载中动画
				wx.hideLoading();
			})
	}
}


// 获取分销招募页
function getRecruit(that) {
  var data = {};
  data['sign'] = MySign.sign(data);
  data['mchid'] = MySign.getMchid();
  MyRequest.request_data(
    MyHttp.GETRECRUITPAGE(),
    data,
    function (res) {
      if (res) {
        that.setData({
          recruit: res,
        })
        WxParse.wxParse('article', 'html', res.content, that, 0);
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
		  MyUtils.myconsole("分销招募页请求的数据：")
		  MyUtils.myconsole(res);
		  //关闭加载中动画
		  wx.hideLoading();
	  })
}


// 分销申请
function distributor_apply(that) {
	var token = MySign.getToken();
	if (!token) {
		Extension.custom_error(that, '3', '登录失效', '', '3');
	} else {
		var data = {};
		var distributor_no = that.data.p_distributor_no;

		data['token'] = token;
		data['sign'] = MySign.sign(data);
		data['mchid'] = MySign.getMchid();
		if (distributor_no) {
			data['p_distributor_no'] = distributor_no;
		}

		MyRequest.request_data(
			MyHttp.DISTRIBUTORAPPLY(),
			data,
			function (res) {
				if (res) {
					that.setData({
						show_loading_faill: true,
						distribution_apply: false,
						distribution_user: false,
						examine: false,
						anomaly_code: null,
					});
					if (res.status == 2) {
						that.setData({
							anomaly_code: 2,
						});
					} else {
						if (res.audit_status == 1) {
							that.setData({
								examine: true,
							});
						} else if (res.audit_status == 2) {
							//获取分销商信息
							getDistribution(that);
						} else if (res.audit_status == 3) {
							that.setData({
								anomaly_code: 3,
							});
						}
						//清楚身份编号
						try {
							wx.removeStorageSync('p_distributor_no')
						} catch (e) {
						}
					}
				} else {
					//自定义错误提示
					Extension.custom_error(that, '2', '页面加载失败', '', '2');
				}
			},
			function (res) {
				if (res == 2 || res == 3) {
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
				MyUtils.myconsole("分销申请请求的数据：")
				MyUtils.myconsole(res);
			})
	}
  
}

//获取小程序码
function get_small_program(that){
  var data = {};
  data['mchid'] = MySign.getMchid();
  data['sign'] = MySign.sign(data);
  data['type'] = 2;
  if (that.data.spread==1){
    data['page'] = 'pages/home/home';
  }else{
    data['page'] = 'pages/distribution/distribution';
  }
  data['scene'] = that.data.distribution.distributor_no;

  MyRequest.request_data(
    MyHttp.CREATEUNLIMIT(),
    data,
    function (res) {
      if (res) {
        const downloadTask = wx.downloadFile({
          url: res.img[0], 
          success: function (res) {
            that.setData({
              QR_code_img: res.tempFilePath,
              tempFilePath: null,
            })
            if (that.data.flag_shar_gd) {
              //画布
              canvas(that);
            } else {
              //画布
              canvas_code(that);
            }
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


