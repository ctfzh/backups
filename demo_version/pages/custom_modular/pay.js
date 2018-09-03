//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 买单组件JS
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
    _payFor() {
      //触发回调
      this.triggerEvent("payFor");
    },
  }
})
