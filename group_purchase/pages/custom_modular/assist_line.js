//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 辅助线JS
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
    border_style:'',
  },
  /*
  *组件生命周期函数，在组件布局完成后执行
  */
  ready: function(){
    //辅助线 1:实线，2：虚线，3：点线
    var style = this.data.list.borderStyle;
    if (style){
      var border_style ='';
      if (style == 2) {
        border_style = "dashed";
      } else if (style == 3) {
        border_style = "dotted";
      } else {
        border_style = "solid";
      }
      this.setData({
        border_style: border_style
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
