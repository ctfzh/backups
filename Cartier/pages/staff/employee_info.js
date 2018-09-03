var app = getApp()
// 员工信息
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      employee_id: options.employee_id,
    })
    get_employee(this)
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
    get_employee(this);
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
  //查看图片
  sele: function (e) {
    var url = [];
    url.push(e.currentTarget.dataset.img)
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: url, // 需要预览的图片http链接列表
    })
  },
  //拍照
  state_not: function (e) {
    var that = this;
    var token = app.token();
    var formData = {};
    formData['token'] = token;
    formData['employee_id'] = that.data.employee_id;
                                                                                                         // console.log(formData)
    wx.showActionSheet({
      itemList: ['从相册选择图片', '拍照'],
      success: function (res) {
                                                                                                        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          var sourceType = ['album']
        } else if (res.tapIndex == 1) {
          var sourceType = ['camera']
        }
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
                if (res.statusCode == 200) {
                  var data = JSON.parse(res.data);
                                                                                              //接口返回数据
                                                                                              // console.log(res.data);
                  if (data.errCode == 0) {
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
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
})


//员工列表
function get_employee(that) {
  var token = app.token();
  var data = {};
  data['token'] = token;
  data['employee_id'] = that.data.employee_id;
                                                                                                                        // console.log(data);
  //数据请求
  wx.request({
    url: 'http://cartier.qinxiangyun.com/api/home/employee-info',
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
          list: res.data.data,
        })
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
      }  else {
        wx.showToast({
          title: res.data.errMsg ? res.data.errMsg + ",下拉重试" : "网络连接错误，请稍后重试",
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