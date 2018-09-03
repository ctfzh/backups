//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 优惠券JS
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
    // //分享回调
    _share: function (e) {
      var detail = e.currentTarget.dataset.discount;
      var myEventDetail = { detail } // detail对象，提供给事件监听函数
      this.triggerEvent('share', myEventDetail)
    },
    //领取回调
    _receive: function (e) {
      var detail = e.currentTarget.dataset.discount;
      var myEventDetail = { detail } // detail对象，提供给事件监听函数
      this.triggerEvent('receive', myEventDetail)
    },
  }
})
