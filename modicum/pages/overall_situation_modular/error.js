// 错误提示


//全局通用js
var Currency = require('../JS/tool/currency.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    error: Number,
    error_text: String,
    retry_an: Number,
    log: Number,
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
    retry: function () {
      //刷新页面
      this.triggerEvent('retry');
    },
    log: function(){
      Currency.log_in();
    },
    //获取地理位置
    setting: function(){
       wx.showLoading({
          title: '加载中',
       })
    }

  }
})
