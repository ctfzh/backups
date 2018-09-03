//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 转译富文本显示组件JS
//在使用的View中引入WxParse模块
var WxParse = require('../custom_modular/wxParse/wxParse.js');

Component({

  //引入组件通用js
  behaviors: [myBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    text: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 
   */
  attached:function(){
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
    if (this.data.list) {
      if (this.data.list.text){
        WxParse.wxParse('article', 'html', this.data.list.text, this, 0);
      }
    } else if (this.data.text){
      WxParse.wxParse('article', 'html', this.data.text, this, 0);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
