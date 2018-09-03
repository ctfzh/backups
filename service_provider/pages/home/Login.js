// 登录
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
//   输入账号
	account: function(e){
		var value = e.detail.value;
		this.setData({
			account_text : value,
		})
  },

  //   输入密码
	password: function (e) {
	  var value = e.detail.value;
	  this.setData({
		  password_text: value,
	  })
  },

//   登入按钮
	Login: function(){
		if (!this.data.account_text){
			wx.showToast({
				title: '请输入您的账号',
				icon: 'none',
				duration: 1000
			})
		} else if (!this.data.password_text) {
			wx.showToast({
				title: '请输入您的密码',
				icon: 'none',
				duration: 1000
			})
		}else{
			wx.showToast({
				title: '登入成功',
				icon: 'success',
				duration: 1000
			})
			setTimeout(function(){
				wx.switchTab({
					url: '/pages/home/home',
				})
			},1000)
		}
	},
})