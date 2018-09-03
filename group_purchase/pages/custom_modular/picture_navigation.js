//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 图片导航组件JS
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
    height:"",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击图片事件
    img_url: function (e) {
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
    }
  },

/*
* 生命周期函数,页面加载完后
*/
})
