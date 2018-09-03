// 选择收款账号
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
	  var account_type = options.type;
	  var title = "间连收款账号";
	  if (options.type == 1){
		  title = "支付宝收款账号";
	  } else if (options.type == 3){
		  title = "微信收款账号";
	  }
	  wx.setNavigationBarTitle({
		  title: title
	  })
	  this.setData({
		  account_type: account_type,
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

  	//直连，间连账号选择
	jump_account: function (e) {
		var jump_type = e.currentTarget.dataset.type;
		if (jump_type==1){
			wx.navigateTo({
				url: '/pages/account/scan_add',
			})
		}else{
			if (jump_type == 3) {
				var itemList = ['选择账号'];
			} else if (jump_type == 2 || jump_type == 4) {
				var itemList = ['新增账号', '选择账号'];
			}
			wx.showActionSheet({
				itemList: itemList,
				success: function (res) {
					// console.log(res.tapIndex)
					if (itemList.length == 1) {
						wx.navigateTo({
							url: '/pages/account/add_list?type=' + jump_type,
						})
					} else {
						if (res.tapIndex == 1) {
							wx.navigateTo({
								url: '/pages/account/add_list?type=' + jump_type,
							})
						}
					}
				},
				fail: function (res) {
					// console.log(res.errMsg)
				}
			})
		}
	}
})