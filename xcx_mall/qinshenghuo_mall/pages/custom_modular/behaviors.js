//组件通用js
module.exports = Behavior({
  /**
   * 组件的属性列表
   */
  properties: {
    list: Object,
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
    // 自定义点击事件
    custom_url: function (e) {
      //组件数据
      var data = e.currentTarget.dataset.data;
      if (data.url) {
        if (data.linkType == 1) {
          wx.switchTab({
            url: data.url
          })
        } else if (data.linkIndex==8){
          if (data.activity_type==2){
            wx.navigateTo({
              url: '../communal/commodity_details?goods_id=' + data.url,
            })
          } else if (data.activity_type == 3) {
            //限时折扣
            wx.navigateTo({
              url: '../time_limit_detail/time_limit_detail?goods_id=' + data.url,
            })
          } else if (data.activity_type == 4) {
            //拼团
            wx.navigateTo({
              url: '../groups/groups_commodity_details?goods_id=' + data.url,
            })
          }else{
            wx.navigateTo({
              url: '../communal/commodity_details?goods_id=' + data.url,
            })
          }
		  }else {
          wx.navigateTo({
            url: data.url
          })
        }
		} else if (data.linkIndex == 13) {
			wx.makePhoneCall({
				phoneNumber: data.inputValue,
			})
		} 
    },
    // 自定义商品点击事件
    goods_discount_jump: function (e) {
      //组件数据
      var list = e.currentTarget.dataset.data;
      if (list.url) {
        if (list.activity_type == 2) {
          var url = '../communal/commodity_details?goods_id=' + list.url;
        } else if (list.activity_type == 3) {
          //限时折扣
          var url = '../time_limit_detail/time_limit_detail?goods_id=' + list.url;
        } else if (list.activity_type == 4) {
          //拼团
          var url = '../groups/groups_commodity_details?goods_id=' + list.url;
        } else {
          var url = '../communal/commodity_details?goods_id=' + list.url;
        }
        wx.navigateTo({
          url: url,
        })
      }
    },
  }
})