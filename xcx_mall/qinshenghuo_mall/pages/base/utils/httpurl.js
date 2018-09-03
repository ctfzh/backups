var md5 = require('md5.js')
var utils = require('utils.js')

/**===================================================  服务器地址  start   ====================================================== */

//服务器环境 1、测试环境   2、验收环境   3、正式环境
var ceshi_service = 1;
//商场服务器地址
function baseUrl() {
  if (ceshi_service==1) {
    //测试地址
    return 'https://mallapitest.qinguanjia.com/';
  } else if (ceshi_service==2) {
    //验收地址
    return 'https://mallapimaster.qinguanjia.com/';
  } else if (ceshi_service==3) {
    //正式地址
    return 'https://mallapi.qinguanjia.com/';
  }
}


//登录服务器地址
function loginBaseUrl() {
  if (ceshi_service==1) {
    //测试地址
    return 'https://uapitest.qinguanjia.com/';
  } else if (ceshi_service==2) {
    //验收地址
    return 'https://uapimaster.qinguanjia.com/';
  } else if (ceshi_service==3) {
    //正式地址
    return 'https://uapi.qinguanjia.com/';
  }
}

//获取省市区服务器地址
function cityBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'https://shapitest.qinguanjia.com/';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'https://shapimaster.qinguanjia.com/';
  } else if (ceshi_service == 3) {
    //正式地址
    return 'https://shapi.qinguanjia.com/';
  }
}

//上传图片服务器地址
function uploadImgBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'https://uploadtest.qinguanjia.com/wapUpload.php';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'https://uploadmaster.qinguanjia.com/wapUpload.php';
  } else if (ceshi_service ==3) {
    //正式地址
    return 'https://upload.qinguanjia.com/wapUpload.php';
  }
}

//首页和分组页面服务器地址
function homeBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'https://xcxapitest.qinguanjia.com/';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'https://xcxapimaster.qinguanjia.com/';
  } else if (ceshi_service == 3) {
    //正式地址
    return 'https://xcxapi.qinguanjia.com/';
  }
}

//聊天服务器地址
function chatBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'wss://chattest.qinguanjia.com';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'wss://chatmaster.qinguanjia.com';
  } else if (ceshi_service == 3) {
    //正式地址
    return 'wss://chat.qinguanjia.com';
  }
}

//储值支付服务器地址
function payBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'https://payapitest.qinguanjia.com/';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'https://payapimaster.qinguanjia.com/';
  } else if (ceshi_service == 3) {
    //正式地址
    return 'https://payapi.qinguanjia.com/';
  }
}

//支付业务域名
function payWebView() {
	if (ceshi_service == 1) {
		//测试地址
		return 'https://syttest.qinguanjia.com/cashier/jspay/wechatapp';
	} else if (ceshi_service == 2) {
		//验收地址
		return 'https://sytmaster.qinguanjia.com/cashier/jspay/wechatapp';
	} else if (ceshi_service == 3) {
		//正式地址
		return 'https://syt.qinguanjia.com/cashier/jspay/wechatapp';
	}
}

// 集合域名地址
function serviceUrl() {
	if (ceshi_service == 1) {
		//测试地址
		return 'https://apitest.qinguanjia.com/';
	} else if (ceshi_service == 2) {
		//验收地址
		return 'https://apimaster.qinguanjia.com/';
	} else if (ceshi_service == 3) {
		//正式地址
		return 'https://api.qinguanjia.com/';
	}
}


/**===================================================  服务器地址  end   ====================================================== */


//上传图片的地址
function UPLOADINGIMGURL() {
  return uploadImgBaseUrl();
}

//聊天服务器地址
function CHATURL() {
  return chatBaseUrl();
}



//商品搜索列表
function GOODS_SEARCH_LIST() {
  return baseUrl() + 'umall/goods/searchlist';
}
//商品列表
function GOODS_LIST() {
	return baseUrl() + 'umall/goods/list';
}
//获取商品属性接口
function GETPROPERTY() {
	return umall / goods / getproperty() + 'umall/goods/getproperty';
}

//获取商品sku
function GETSKU() {
  return baseUrl() + 'umall/goods/getsku';
}

//添加到购物车
function ADDSHOPPING() {
  return baseUrl() + 'utrade/cart/add';
}

//获取购买商品优惠活动
function GETDISCOUNT() {
	return baseUrl() + 'utrade/order/getmarketinginfo';
}



//获取验证码
function GET_CODE() {
  return loginBaseUrl() + 'base/register/get-code';
}

//登录
function LOGIN() {
  return loginBaseUrl() + 'base/register/wechatappregister';
}

//获取openId
function OPENID() {
  return loginBaseUrl() + 'umember/wechat/decrypt-data';
}

//openid登录
function OPENID_LOGIN() {
  return loginBaseUrl() + 'umember/login/wechatlogin';
}

//openid注册
function REGISTER() {
  return loginBaseUrl() + 'umember/register/wechatregister';
}

//获取会员信息
function USER_HOME() {
  return loginBaseUrl() + 'base/home/index';
}

//获取个人资料
function USER_PREFECT() {
  return loginBaseUrl() + 'umember/member/editinfo';
}

//修改个人资料
function EDIT_USER_PREFECT() {
  return loginBaseUrl() + 'umember/member/saveinfo';
}

//关注我们二维码
function E_INFO() {
	return loginBaseUrl() + 'base/merchant/info';
}
//获取商品的详情
function GOODS_DETAIL() {
  return baseUrl() + 'umall/goods/detail';
}

//获取购物车列表
function GET_CART_LIST() {
  return baseUrl() + 'utrade/cart/list';
}

//修改购物车
function SET_CART_EDIT() {
  return baseUrl() + 'utrade/cart/edit';
}

//删除购物车
function SET_CART_DELETE() {
  return baseUrl() + 'utrade/cart/delete';
}

//获取普通商品限购
function GET_GOODS_LIMIT() {
	return baseUrl() + 'umall/goods/getgoodslimit';
}
//聊天用户信息
function CHAT() {
  return loginBaseUrl() + 'base/util/chat';
}

//获取团详情
function GROUPINFO() {
  return baseUrl() + 'uorder/groupbuy/groupinfo';
}

//获取拼团列表数据
function GROUPLIST() {
  return baseUrl() + 'uorder/groupbuy/grouplist';
}


//============================================= 订单相关接口 =================================
//积分商城下单信息
function UGETORDERGETGOODS() {
	return baseUrl() + 'uintegralmall/order/getgoods';
}
//积分商城下订单
function ADDORDER() {
	return baseUrl() + 'uintegralmall/order/addorder';
}

//获取下单信息
function GETORDERGETGOODS() {
  return baseUrl() + 'utrade/order/getgoods';
}

//下订单
function ORDERADD() {
  return baseUrl() + 'utrade/order/orderadd';
}

//获取储值余额
function GETPAYMEMBER() {
  return baseUrl() + 'utrade/pay/member';
}

//储值支付
function SETPAYMEMBER() {
  return payBaseUrl() + 'gateway';
}

//获取订单详情
function PAYMENTUCCESS() {
	return baseUrl() + 'utrade/order/orderview';
}


//订单列表
function ORDERLIST() {
  return baseUrl() + 'uorder/order/list';
}

//订单详情
function ORDERDETAIL() {
  return baseUrl() + 'uorder/order/view';
}


//取消订单
function CANCELORDER() {
  return baseUrl() + 'uorder/order/cancel';
}

//确认收货
function CRECEIPTORDER() {
  return baseUrl() + 'uorder/order/receipt';
}
//获取收货地址列表
function ADDRESSLIST() {
  return baseUrl() + 'uset/address/list';
}
//编辑收货地址
function ADDRESSEDIT() {
  return baseUrl() + 'uset/address/edit';
}
//添加收货地址
function ADDRESSADD() {
  return baseUrl() + 'uset/address/add';
}

//获取商家配送方式
function GETMERCHANTEXPRESS() {
  return baseUrl() + 'utrade/order/getmerchantexpress';
}

//删除收货地址
function ADDRESSDELETE() {
  return baseUrl() + 'uset/address/delete';
}
//获取省市区
function GET_ADDRESS_CODE() {
  return cityBaseUrl() + 'base/util/get-address';
}
//============================================= 退款相关接口 =================================

//获取退款详情
function REFUNDDETAIL() {
  return baseUrl() + 'uorder/refund/refunddetail';
}

//提交退款申请
function REFUNDAPPLY() {
  return baseUrl() + 'uorder/refund/refundapply';
}

//取消退款申请
function REFUNDCANCEL() {
  return baseUrl() + 'uorder/refund/refundcancel';
}

//填写物流信息
function REFUNDSENDGOODS() {
  return baseUrl() + 'uorder/refund/refundsendgoods';
}

//协商记录
function REFUNDRECORD() {
  return baseUrl() + 'uorder/refund/refundrecord';
}


//============================================= 首页和分组接口 =================================


//首页接口
function HOMEDATA(){
  return homeBaseUrl() + 'umall/home/index';
}

//分组页接口
function GROUPDATA() {
  return homeBaseUrl() + 'umall/home/group';
}

//积分商城首页接口
function POINTDATA() {
	return homeBaseUrl() + 'umall/home/integralgroup';
}
//积分商品详情
function POINTDETAIL(){
	return baseUrl() + 'uintegralmall/goods/detail';
}

//拼团商品详情
function GROUPDETAIL() {
	return baseUrl() + 'umall/goods/groupdetail';
}

//二维码生成接口
function CREATEUNLIMIT() {
  return homeBaseUrl() + 'shapp/qrcode/createunlimit';
}
//============================================= 支付接口 =================================

//微信支付接口
function PAYMENTSUCCESS() {
	return baseUrl() + 'utrade/pay/wechatapp';
}
//获取生成openid的参数
function GETAPPAUTHINFO() {
  return baseUrl() + 'umall/wechatpay/get-app-authinfo';
}

//优惠券领取
function GETCARDIGN() {
  return loginBaseUrl() + 'umember/wechat/cardsign';
}

//============================================= 分销接口 =================================
//佣金明细
function GETCOMMISSIONDETAIL() {
  return baseUrl() + 'udistr/commission/list';
}
//推广统计
function GETSPREADSTATISTICS() {
  return baseUrl() + 'udistr/statistics/statistics';
}
//分销规则
function GETDISTRIBUTIONRULE() {
  return baseUrl() + 'udistr/set/getrulepage';
}


//获取提现记录
function GETWITHDRAWRECORD() {
  return baseUrl() + 'udistr/withdraw/list';
}
//提现申请
function GETWITHDRAWCASH() {
  return baseUrl() + 'udistr/withdraw/apply';
}

//分销商信息
function GETDISTRIBUTION() {
  return baseUrl() + 'udistr/distributor/info';
}

//推广商品列表
function GETSPREADGOODS() {
  return baseUrl() + 'udistr/goods/list';
}
//获取商户结算方式
function GETPAYMETHOD() {
  return baseUrl() + 'udistr/set/settlementchannel';
}

//获取商户分销设置
function GETDISTRIBUTIONSET() {
  return baseUrl() + 'udistr/set/info';
}

//获取分销招募页
function GETRECRUITPAGE() {
  return baseUrl() + 'udistr/set/getrecruit';
}

//分销申请
function DISTRIBUTORAPPLY() {
  return baseUrl() + 'udistr/distributor/apply';
}

function GET_EDITION() {
  return cityBaseUrl() + 'umerchant/merchant/getinfo';
}


//储值活动
function GET_STORED() {
	return serviceUrl() + 'yx/urecharge/activity/index';
}

//创建储值订单
function ADDRECHARGEORDER() {
	return serviceUrl() + 'syt/utrade/recharge/add';
}

//储值微信支付
function RECMENTSUCCESS() {
	return serviceUrl() + 'xcx/uxcx/pay/rechargepay';
}

//余额明细
function BALANCEDETAIL() {
	return serviceUrl() + 'yx/urecharge/recharge/list';
}

//储值码兑换
function GET_RECHARGECODE() {
	return serviceUrl() + 'syt/utrade/recharge/use-recharge-code';
}

// 注册方式
function REGISTERRULE() {
	return serviceUrl() + 'sh/umerchant/merchant/registerrule';
}

// 发送验证码
function PHONE_CODE() {
	return serviceUrl() + 'u/umember/register/mobileregister';
}

//微信手机号授权
function PHONE_REGISTER() {
	return serviceUrl() + 'u/umember/register/wechatmobileregister';
}

//小程序优惠券列表
function GETCOUPONLIST() {
	return serviceUrl() + 'yx/ucoupon/coupon/list';
}

//建立调用
module.exports = {
	//小程序优惠券列表
	GETCOUPONLIST: GETCOUPONLIST,
//微信手机号授权
	PHONE_REGISTER: PHONE_REGISTER,
// 发送验证码
	PHONE_CODE: PHONE_CODE,
// 注册方式
	REGISTERRULE: REGISTERRULE,
	//储值卡兑换
	GET_RECHARGECODE: GET_RECHARGECODE,
	// 余额明细
	BALANCEDETAIL: BALANCEDETAIL,
	// 储值微信支付
	RECMENTSUCCESS: RECMENTSUCCESS,
	// 创建储值订单
	ADDRECHARGEORDER: ADDRECHARGEORDER,
	//储值活动
	GET_STORED: GET_STORED,
  GOODS_LIST: GOODS_LIST,
  GETPROPERTY: GETPROPERTY,
  GETSKU: GETSKU,
  GET_CODE: GET_CODE,
  ADDSHOPPING: ADDSHOPPING,
  LOGIN: LOGIN,
  ORDERLIST: ORDERLIST,
  GOODS_DETAIL: GOODS_DETAIL,
  GET_CART_LIST: GET_CART_LIST,
  SET_CART_EDIT: SET_CART_EDIT,
  SET_CART_DELETE: SET_CART_DELETE,
  GETORDERGETGOODS: GETORDERGETGOODS,
  ADDRESSLIST: ADDRESSLIST,
  ADDRESSEDIT: ADDRESSEDIT,
  ADDRESSADD: ADDRESSADD,
  ADDRESSDELETE: ADDRESSDELETE,
  GET_ADDRESS_CODE: GET_ADDRESS_CODE,
  GETMERCHANTEXPRESS: GETMERCHANTEXPRESS,
  ORDERADD: ORDERADD,
  GETPAYMEMBER: GETPAYMEMBER,
  SETPAYMEMBER: SETPAYMEMBER,
  PAYMENTUCCESS: PAYMENTUCCESS,
  CANCELORDER: CANCELORDER,
  CRECEIPTORDER: CRECEIPTORDER,
  ORDERDETAIL: ORDERDETAIL,
  USER_HOME: USER_HOME,
  USER_PREFECT: USER_PREFECT,
  EDIT_USER_PREFECT: EDIT_USER_PREFECT,
  REFUNDDETAIL: REFUNDDETAIL,
  REFUNDAPPLY: REFUNDAPPLY,
  REFUNDCANCEL: REFUNDCANCEL,
  REFUNDSENDGOODS: REFUNDSENDGOODS,
  REFUNDRECORD: REFUNDRECORD,
  UPLOADINGIMGURL: UPLOADINGIMGURL,
  HOMEDATA: HOMEDATA,
  GROUPDATA: GROUPDATA,
  PAYMENTSUCCESS: PAYMENTSUCCESS,
  GETAPPAUTHINFO: GETAPPAUTHINFO,
	POINTDATA: POINTDATA,
	POINTDETAIL: POINTDETAIL,
	ADDORDER: ADDORDER,
	UGETORDERGETGOODS: UGETORDERGETGOODS,
	GET_GOODS_LIMIT: GET_GOODS_LIMIT,
	OPENID: OPENID,
	OPENID_LOGIN: OPENID_LOGIN,
	REGISTER: REGISTER,
	GOODS_SEARCH_LIST: GOODS_SEARCH_LIST,
  CHAT: CHAT,
  CHATURL: CHATURL,
	E_INFO: E_INFO,
	GETDISCOUNT: GETDISCOUNT,
	GROUPDETAIL: GROUPDETAIL,
  GROUPINFO: GROUPINFO,
  GROUPLIST: GROUPLIST,
  CREATEUNLIMIT: CREATEUNLIMIT,
  GETCARDIGN: GETCARDIGN,
  //佣金明细
  GETCOMMISSIONDETAIL: GETCOMMISSIONDETAIL,
  //推广统计
  GETSPREADSTATISTICS: GETSPREADSTATISTICS,
  //分销规则
  GETDISTRIBUTIONRULE: GETDISTRIBUTIONRULE,
  //获取提现记录
  GETWITHDRAWRECORD: GETWITHDRAWRECORD,
  //提现申请
  GETWITHDRAWCASH: GETWITHDRAWCASH,
  //分销商信息
  GETDISTRIBUTION: GETDISTRIBUTION,
  //推广商品列表
  GETSPREADGOODS: GETSPREADGOODS,
  //获取商户结算方式
  GETPAYMETHOD: GETPAYMETHOD,
  //获取商户分销设置
  GETDISTRIBUTIONSET: GETDISTRIBUTIONSET,
  //获取分销招募页
  GETRECRUITPAGE: GETRECRUITPAGE,
  //分销申请
  DISTRIBUTORAPPLY: DISTRIBUTORAPPLY,
  //获取小程序头像
  GET_EDITION: GET_EDITION,
//   支付业务域名
  payWebView: payWebView,
}