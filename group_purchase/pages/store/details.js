// 门店详情
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
  //打电话
	phone (e) {
		var value = e.currentTarget.dataset.phone;
		wx.makePhoneCall({
			phoneNumber: value 
		})
	},

	// 打开地图
	address(e) {
		var latitude = e.currentTarget.dataset.lat;
		var longitude = e.currentTarget.dataset.lng;
				wx.openLocation({
					name: "位置名",
					scale: 15,
					address: "详细地址",
					latitude: latitude,
					longitude: longitude,
					scale: 15
				})
	}
})