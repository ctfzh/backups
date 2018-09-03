//引入组件通用js
var myBehavior = require('../custom_modular/behaviors.js');

// 门店组件js
Component({

  //引入组件通用js
  behaviors: [myBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
    lng: String,
    lat: String,
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
    // 拨打电话
    call: function(e){
      // 获取自定义参数（页面元素自定义参数）
      var phone = e.currentTarget.dataset.call;
      if (phone){
        wx.makePhoneCall({
          phoneNumber: phone,
        })
      }
    },
    // 查看更多门店
    see_more: function(){
      var lng = this.data.lng;
      var lat = this.data.lat;
      if (lng && lat){
        wx.navigateTo({
          url: '/pages/store_info_list/store_info_list?lng=' + lng + '&lat=' + lat,
        })
      }else{
        wx.navigateTo({
          url: '/pages/store_info_list/store_info_list',
        })
      }
    },
    //查看门店地址
    address: function (e) {
      // 门店经度
      var lng = e.currentTarget.dataset.lng;
      // 门店维度
      var lat = e.currentTarget.dataset.lat;
      //分店名称
      var branch_name = this.data.list.store.branch_name
      if (branch_name){
        branch_name = "(" + branch_name + ")";
      }
      //名称
      var name = this.data.list.store.name + branch_name;
      //详细地址
      var address = this.data.list.store.address;
      wx.openLocation({
        latitude: lat,
        longitude: lng,
        name:name,
        address: address,
        scale: 15
      })
    }
  }
})
