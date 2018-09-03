//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 相册组件js
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
    // 查看更多点击事件
    album_list_url: function (e) {
      wx.navigateTo({
        url: "/pages/album_list/album_list?store_id=" + this.data.store_id
      })
    },
    
    //预览原图点击事件
      prototype_src_bin: function (e) {
      var current = e.currentTarget.dataset.src;
      var data = this.data.list.list;
      var imgalist = [];
      for(var i=0; i<data.length; i++){
        imgalist.push(data[i].prototype_src)
      }
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: imgalist // 需要预览的图片http链接列表  
      })
    }
  }
})
