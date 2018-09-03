// 限时抢购
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  //排序菜单的值
	  sort: ["默认排序", "销量最高","离我最近"],
	  //排序菜单选中的值
	  sort_type: 0,
	  //分类菜单的值
	  classify: ["附近", "1km", "2km", "5km", "10km", "全城"],
	  //分类菜单选中的值
	  classify_type: 0,
	  //附近菜单的值
	  nearby: ["全部", "火锅", "自助餐", "小吃快餐", "西餐", "川湘菜", "粤菜", "东北菜", "海鲜", "中式烧烤/烤串"],
	  //附近菜单选中的值
	  nearby_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		var that = this;
		wx.createSelectorQuery().select('.screen').boundingClientRect(function (rect) {
			that.setData({
				height: rect.height  // 节点的高度
			})
		}).exec()
		//关闭转发
		wx.hideShareMenu();
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

  //滚动事件
	scroll: function (e) {
		var top = e.detail.scrollTop;
		this.setData({
			top: top,
		})
	},

	// 筛选点击事件
	screen_tap: function(e) {
		var screen_type = e.currentTarget.dataset.type;
		if (screen_type == this.data.screen_type || screen_type==""){
			screen_type = null;
		}else{
			screen_type = screen_type;
		}
		this.setData({
			screen_type: screen_type,
		})
	},

	// 菜单选中项
	menu_tap: function (e) {
		var value = e.currentTarget.dataset.value;
		if (this.data.screen_type == 0){
			this.setData({
				sort_type: value,
			})
		} else if (this.data.screen_type == 1){
			this.setData({
				classify_type: value,
			})
		}else{
			this.setData({
				nearby_type: value,
			})
		}
	},

	//条件排序
	condition_tap: function (e) {
		var condition_type = e.currentTarget.dataset.type;
		if (condition_type == this.data.condition_type) {
			condition_type = null;
		} else {
			condition_type = condition_type;
		}
		this.setData({
			condition_type: condition_type,
		})
	},

	//商品详情
	goods_details (e){
		wx.navigateTo({
			url: '/pages/restrictions/details',
		})
	}
})