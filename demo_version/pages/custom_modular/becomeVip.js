//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 开卡组件JS
Component({

  //引入组件通用js
  behaviors: [myBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    become: Number,
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
    _open_member() {
      var detail = this.data.list;
      //触发回调
      this.triggerEvent("open_member", detail);
    },
  }
})
