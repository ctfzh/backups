App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        //跳转人员列表
        wx.reLaunch({
          url: 'pages/staff/employee_list'
        })
      }
    } catch (e) {
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

  //存储获取token
  token: function(){
    try {
      var token = wx.getStorageSync('token')
      if (token) {
        return token;
      }else{
        return '';
      }
    } catch (e) {
      return '';
    }
  }

})

