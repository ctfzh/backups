//app.js

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // const updateManager = wx.getUpdateManager()

    // updateManager.onCheckForUpdate(function (res) {
    //   // 请求完新版本信息的回调
    //   console.log(res.hasUpdate)
    // })

    // updateManager.onUpdateReady(function () {
    //   wx.showModal({
    //     title: '更新提示',
    //     content: '新版本已经准备好，是否重启应用？',
    //     success: function (res) {
    //       if (res.confirm) {
    //         // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //         updateManager.applyUpdate()
    //       }
    //     }
    //   })

    // })

    // updateManager.onUpdateFailed(function () {
    //   // 新的版本下载失败
    // })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
     if (options.referrerInfo){
        if (options.referrerInfo.appId == 'wxeb490c6f9b154ef9') {
           if (options.referrerInfo.extraData) {
              var active_ticket = options.referrerInfo.extraData.activate_ticket;
              var card_id = options.referrerInfo.extraData.card_id;
              var code = options.referrerInfo.extraData.code;
                 try {
                    wx.setStorageSync('active_ticket', active_ticket)
                    wx.setStorageSync('card_id', card_id)
                    wx.setStorageSync('code', code)
                 } catch (e) {
                 }
           }
        }
     }
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
    
  }
})
