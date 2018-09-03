//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 标题
Component({

  //引入组件通用js
  behaviors: [myBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
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
    title_url: function(e){
      //组件数据
      var data = e.currentTarget.dataset.data;
      if (data.url) {
        if (data.linkIndex == 11) {
          var url = data.url + "?store_id=" + this.data.store_id
          wx.navigateTo({
            url: url
          })
        } else {
          wx.navigateTo({
            url: data.url
          })
        }
      }
    },
  }
})
