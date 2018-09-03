//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

var interval; //计算器
// 公告组件js
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
    marqueePace: 1.2,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 120,
    size: 14,
    interval: 20 // 时间间隔
  },


  /**
   * 生命周期函数--载入页面
   */
  attached: function () {

    var that = this; 

    clearInterval(interval);

    var length = that.data.list.text.length * that.data.size;//文字长度

    var marquee_box = wx.getSystemInfoSync().windowWidth - 55;// .marquee_box宽度

    that.setData({
      marqueeDistance : 0,
      length: length,
      marquee_box: marquee_box
    });

    scrolltxt(that);// 第一个字消失后立即从右边出现
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

function scrolltxt(that) {
  var length = that.data.length;//滚动文字的宽度
  var marquee_box = that.data.marquee_box;//.marquee_box宽度
  if (length > marquee_box) {
    interval = setInterval(function () {
      var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
      var crentleft = that.data.marqueeDistance;
      if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
        that.setData({
          marqueeDistance: crentleft + that.data.marqueePace
        })
      }else {
        that.setData({
          marqueeDistance: 0 // 直接重新滚动
        });
        //停止计算器
        clearInterval(interval);
        //重新滚动
        scrolltxt(that);
      }
    }, that.data.interval);
  }
  else {
    that.setData({ marquee_margin: "10000" });//只显示一条不滚动右边间距加大，防止重复显示
  }
}