//组件通用js
module.exports = Behavior({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object,
    store_id: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击图片事件
    custom_url: function (e) {
      //组件数据
      var data = e.currentTarget.dataset.data;
      if (data.url) {
        if (data.linkIndex == 11) {
          //相册链接
          var url = data.url + "?store_id=" + this.data.store_id
          wx.navigateTo({
            url: url
          })
		  } else  {
          if (data.linkType == 1) {
            wx.switchTab({
              url: data.url
            })
          } else {
            wx.navigateTo({
              url: data.url
            })
          }
        }
		} else if (data.linkIndex == 13) {
			wx.makePhoneCall({
				phoneNumber: data.inputValue,
			})
		} else if (data.linkIndex == 15) {
			//储值
			wx.navigateTo({
				url: '/pages/recharge_activity/recharge_activity'
			})
		} else if (data.linkIndex == 16) {
			//买单
			wx.navigateTo({
				url: '/pages/payment/check?store_id=' + this.data.store_id,
			})
		 } 
    },
  }
})

