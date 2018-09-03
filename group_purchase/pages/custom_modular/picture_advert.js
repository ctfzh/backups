//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 图片广告组件js
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
    current: 0,
    height:'',
  },
/** 
 * 组件生命周期函数，在组件实例进入页面节点树时执行
*/
  attached: function(){
    var that = this;
    get_img_width(that)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //轮播图的切换事件  
    swiperChange: function (e) {
        this.setData({
          current: e.detail.current
        })
    },
    // 点击图片事件
    img_url: function (e) {
      //组件数据
      var data = e.currentTarget.dataset.data;
      if (data.url){
        if (data.linkIndex == 11){
          //相册链接
          var url = data.url + "?store_id=" + this.data.store_id
          wx.navigateTo({
            url: url
          })
        }else {
          wx.navigateTo({
            url: data.url
          })
        }
      }
    },
  }
})

//第一张图片宽度/图片最大宽度
function get_img_width(that){
  var list = that.data.list;
  //判断样式
  if (list.style == 1 || list.style == 4){
    //获取屏幕宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          max_img_width: res.windowWidth,
        })
        get_images_height(that, res.windowWidth);
      }
    });
  } else if (list.style == 2) {
    var max_img_width = "300";
    that.setData({
      max_img_width: max_img_width,
    })
    get_images_height(that, max_img_width);
  } else if (list.style == 3) {
    var max_img_width = "260";
    if (list.lineDisplay == 1) {
      max_img_width = "210";
    } else if (list.lineDisplay == 2) {
      max_img_width = "160";
    } else if (list.lineDisplay == 3) {
      max_img_width = "130";
    }
    that.setData({
      max_img_width: max_img_width,
    })
    get_images_height(that, max_img_width);

  } else if (list.style == 4) {

  } else if (list.style == 5) {
    var max_img_width = "630";
    that.setData({
      max_img_width: max_img_width,
    })
    get_images_height(that, max_img_width);
  }
}

// 图片高度
function get_images_height(that, max_img_width) {
  //第一张图片
  var img_height = that.data.list.list[0].height;
  var img_width = that.data.list.list[0].width;
  var images_height = max_img_width / (img_width / img_height);
  that.setData({
    images_height: images_height,
  })
  get_images_width(that, images_height);
}

// 图片宽度
function get_images_width(that, images_height) {
  var list = that.data.list.list;
  var images_width = [];
  for(var i=0; i<list.length; i++){
    var img_height = that.data.list.list[i].height;
    var img_width = that.data.list.list[i].width;
    images_width.push(images_height / (img_height / img_width));
    that.setData({
      images_width: images_width,
    })
  }
}
