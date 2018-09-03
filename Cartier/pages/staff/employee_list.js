
var app = getApp();
var timer; // 计时器
// 员工列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //默认选中菜单
    item_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    try {
      var seat_name = wx.getStorageSync('seat_name')
      if (seat_name) {
        wx.setNavigationBarTitle({
          title: seat_name,
        })
      }
    } catch (e) {
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
    //人员列表数据
    get_employee(this);
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
    //暂停计时器
    clearTimeout(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //人员列表数据
    get_employee(this)
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

  //选中菜单
  menu_item: function (e) {
    var item_index = e.target.dataset.index;
    this.setData({
      // is_photo: item_index == 1 || item_index == 2 ? item_index: null,
      item_index: item_index,
    });
    //人员列表数据
    // get_employee(this, item_index)
  },
  //搜索关键词
  search: function (event){
    var keywoard = event.detail.value;
    this.setData({
      keywoard: keywoard,
    })
  },
  //点击完成时
  complete:function(){
    //人员列表数据
    get_employee(this)
  },
  //拍照
  state_not: function (e) {
    var that = this;
    var token = app.token();
    var formData = {};
    formData['token'] = token;
    formData['employee_id'] = e.currentTarget.dataset.employee.ID;
                                                                                                                              //传给图片接口参数
                                                                                                                              // console.log(formData)
    // wx.showActionSheet({
    //   itemList: ['从相册选择图片', '拍照'],
    //   success: function (res) {
                                                                                                                              //原图，缩略图
                                                                                                                              // console.log(res.tapIndex)
        // if (res.tapIndex == 0) {
        //   var sourceType = ['album']
        // } else if (res.tapIndex == 1) {
          var sourceType = ['camera']
        // }
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            wx.showLoading({
              title: '上传中',
            })
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths
            //上传图片
            wx.uploadFile({
              url: 'http://cartier.qinxiangyun.com/api/home/upload-head', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              header: {
                'content-type': 'application/json' // 默认值
              },
              formData: formData,
              success: function (res) {
                if (res.statusCode==200){
                  var data = JSON.parse(res.data);
                                                                                                                                            //图片接口返回数据
                                                                                                                                            // console.log(res.data);
                  if (data.errCode == 0) {
                    //人员列表数据
                    get_employee(that);
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 500);
                    setTimeout(function () {
                      wx.showToast({
                        title: '已上传',
                        icon: 'success',
                        duration: 1500
                      })
                    }, 550);
                  } else if (data.errCode == 10002) {
                    //清除token
                    try {
                      wx.setStorageSync('token', '')
                      //跳转登入
                      wx.reLaunch({
                        url: '../index/index'
                      })
                    } catch (e) {
                    }
                  } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: res ? res : "网络连接错误，请稍后重试",
                      icon: 'none',
                      duration: 2000
                    })
                  }
                } else {
                                                                                                                            //图片接口返回错误数据
                                                                                                                            // console.log(res)
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 500);
                  setTimeout(function () {
                    wx.showToast({
                      title: "上传失败",
                      icon: 'none',
                      duration: 1500
                    })
                  }, 550);
                }
              },
              fail: function () {
                setTimeout(function () {
                  wx.hideLoading()
                }, 500);
                setTimeout(function () {
                  wx.showToast({
                    title: "上传失败",
                    icon: 'none',
                    duration: 1500
                  })
                }, 550);
              }
            })
          }
        })
    //   },
    //   fail: function (res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  //跳转员工信息
  state: function (e) {
    var employee_id = e.currentTarget.dataset.employee.ID;
    wx.navigateTo({
      url: './employee_info?employee_id=' + employee_id,
    })
  },
  //暂停拍照
  suspend: function(){
    var start_status = this.data.start_status == 1 ? 2 : 1;
    suspend(this, start_status);
  },
  //查看图片
  sele: function (e) {
    var url = [];
    url.push(e.currentTarget.dataset.img)
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: url, // 需要预览的图片http链接列表
    })
  },
})


// 倒计时
function Countdown(that) {
  timer = setTimeout(function () {
    //人员列表数据
    get_employee(that);
  }, 3000);
};

//员工列表
function get_employee(that) {
  var token = app.token();
  var data = {};
  data['token'] = token;
  //空 返回全部 1 ：已拍照 2 ： 未拍照
  // if (that.data.is_photo) {
  //   data['is_photo'] = that.data.is_photo;
  // }
  //搜索关键词
  if (that.data.keywoard){
    data['keywoard'] = that.data.keywoard;
  }
                                                                                                                                              //传给接口的数据
                                                                                                                                              // console.log(data);
  //数据请求
  wx.request({
    url: 'http://cartier.qinxiangyun.com/api/home/employee-list',
    method: 'GET',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
                                                                                                                                                        //接口返回数据
                                                                                                                                                        // console.log(res.data);
      if (res.data.errCode == 0) {
                                                                                                                                                        //接口返回成功数据
                                                                                                                                                        // console.log(res.data.data);
          that.setData({
            list: res.data.data.list ? res.data.data.list : null,
            start_status: res.data.data.start_status,
            not_photo_num: res.data.data.not_photo_num ? res.data.data.not_photo_num: "0",
            is_photo: res.data.data.list.length - res.data.data.not_photo_num,
          })


        if (res.data.data.start_status == 1) {
          Countdown(that);
        } else {
          //暂停计时器
          clearTimeout(timer);
        }
      } else if (res.data.errCode == 10002) {
        // console.log(res);
        //清除token
        try {
          wx.setStorageSync('token', '')
          //跳转登录
          wx.reLaunch({
            url: '../index/index'
          })
        } catch (e) {
        }
      } else {
        //暂停计时器
        clearTimeout(timer);
        wx.showToast({
          title: res.data.errMsg ? res.data.errMsg+",下拉重试" : "网络连接错误，请稍后重试",
          icon: 'none',
          duration: 2000
        })
      }
    },
    fail: function (res) {
      //暂停计时器
      clearTimeout(timer);
      wx.showToast({
        title: "网络连接错误，请稍后重试",
        icon: 'none',
        duration: 2000
      })
    },
    complete: function () {
      //关闭下拉刷新
      wx.stopPullDownRefresh()
    }
  })

}



//暂停拍照
function suspend(that, start_status){
  var token = app.token();
  var data = {};
  data['token'] = token;
  //1 ：启动  2 ： 暂停
  data['start_status'] = start_status;
  // console.log(data);
  //数据请求
  wx.request({
    url: 'http://cartier.qinxiangyun.com/api/home/account-change-start',
    method: 'GET',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      // console.log(res.data);
      if (res.data.errCode == 0) {
        // console.log(res.data.data);
        that.setData({
          start_status: start_status,
        })
        if (start_status == 1) {
          Countdown(that);
        } else {
          //暂停计时器
          clearTimeout(timer);
        }

      } else if (res.data.errCode == 10002) {
        //清除token
        try {
          wx.setStorageSync('token', '')
          //跳转登录
          wx.reLaunch({
            url: '../index/index'
          })
        } catch (e) {
        }
      } else {
        wx.showToast({
          title: res.data.errMsg ? res.data.errMsg  : "网络连接错误，请稍后重试",
          icon: 'none',
          duration: 1000
        })
      }
    },
    fail: function (res) {
      wx.showToast({
        title: "网络连接错误，请稍后重试",
        icon: 'none',
        duration: 1000
      })
    },
    complete: function () {
      //关闭下拉刷新
      wx.stopPullDownRefresh()
    }
  })
}