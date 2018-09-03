//全局工具js

//网络请求
var Request = require("../request/request.js")
//数据接口地址
var Server = require('../request/server_address.js');
// 引用日志输出
var Output = require('../tool/output.js');
//引入签名加密商户号
var Sign = require('../tool/sign.js');

//全局存储openid
function getOpenid() {
  try {
    var openid = wx.getStorageSync('openid')
    if (openid) {
      return openid;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

//全局存储unionid
function getUnionid() {
  try {
    var unionid = wx.getStorageSync('unionid')
    if (unionid) {
      return unionid;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

//全局存储userInfo
function getuserInfo() {
  try {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      return userInfo;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}





//建立调用
module.exports = {
  //全局存储openid
  getOpenid: getOpenid,
  //全局存储unionid
  getUnionid: getUnionid,
  //全局存储userInfo
  getuserInfo: getuserInfo,
}