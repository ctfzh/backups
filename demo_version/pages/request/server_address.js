//服务器地址JS
/**===================================================  服务器地址  start   ====================================================== */

//服务器环境 1、测试环境   2、验收环境   3、正式环境
var ceshi_service = 3;

// 服务器地址
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


//商场服务器地址
// function baseUrl() {
//   if (ceshi_service == 1) {
//     //测试地址
//     return 'https://mallapitest.qinguanjia.com/';
//   } else if (ceshi_service == 2) {
//     //验收地址
//     return 'https://mallapimaster.qinguanjia.com/';
//   } else if (ceshi_service == 3) {
//     //正式地址
//     return 'https://mallapi.qinguanjia.com/';
//   }
// }


// //登录服务器地址
// function loginBaseUrl() {
//   if (ceshi_service == 1) {
//     //测试地址
//     return 'https://uapitest.qinguanjia.com/';
//   } else if (ceshi_service == 2) {
//     //验收地址 
//     return 'https://uapimaster.qinguanjia.com/';
//   } else if (ceshi_service == 3) {
//     //正式地址
//     return 'https://uapi.qinguanjia.com/u/';
//   }
// }

//获取省市区服务器地址
// function cityBaseUrl() {
//   if (ceshi_service == 1) {
//     //测试地址
//     return 'https://shapitest.qinguanjia.com/';
//   } else if (ceshi_service == 2) {
//     //验收地址
//     return 'https://shapimaster.qinguanjia.com/';
//   } else if (ceshi_service == 3) {
//     //正式地址
//     return 'https://shapi.qinguanjia.com/';
//   }
// }

//首页和分组页面服务器地址
// function homeBaseUrl() {
//   if (ceshi_service == 1) {
//     //测试地址
//     return 'https://xcxapitest.qinguanjia.com/';
//   } else if (ceshi_service == 2) {
//     //验收地址
//     return 'https://xcxapimaster.qinguanjia.com/';
//   } else if (ceshi_service == 3) {
//     //正式地址
//     return 'https://xcxapi.qinguanjia.com/';
//   }
// }

//聊天服务器地址
function chatBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'wss://chattest.qinguanjia.com';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'wss://chattest.qinguanjia.com';
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

//上传图片服务器地址
function uploadImgBaseUrl() {
	if (ceshi_service == 1) {
		//测试地址
		return 'https://uploadtest.qinguanjia.com/wapUpload.php';
	} else if (ceshi_service == 2) {
		//验收地址
		return 'https://uploadmaster.qinguanjia.com/wapUpload.php';
	} else if (ceshi_service == 3) {
		//正式地址
		return 'https://upload.qinguanjia.com/wapUpload.php';
	}
}

/**===================================================  服务器地址  end   ====================================================== */


//上传图片的地址
function UPLOADINGIMGURL() {
	return uploadImgBaseUrl();
}

//版本控制
function GET_EDITION() {
  return serviceUrl() + 'sh/umerchant/merchant/getinfo';
}

//首页接口地址
function GETPAGEINFO() {
  return serviceUrl() + 'xcx/uxcx/page/getpageinfo';
}

//门店列表
function GETSTORELIST() {
  return serviceUrl() + 'xcx/uxcx/page/getstorelist';
}

//相册类型
function GETTABLBUMTYPE() {
  return serviceUrl() + 'xcx/uxcx/page/getalbumtype';
}

//相册列表
function GETALBUMLIST() {
  return serviceUrl() + 'xcx/uxcx/page/getalbumlist';
}

//优惠页
function GETDWTAIL() {
  return serviceUrl() + 'xcx/uxcx/discount/detail';
}

//获取openId
function OPENID() {
  return serviceUrl() + 'u/umember/wechat/decrypt-data';
}

//openid登录
function OPENID_LOGIN() {
  return serviceUrl() + 'u/umember/login/wechatlogin';
}

//openid注册
function REGISTER() {
  return serviceUrl() + 'u/umember/register/wechatregister';
}

//获取我的会员信息
function USER_HOME() {
  return serviceUrl() + 'u/base/home/index';
}

//获取个人资料
function USER_PREFECT() {
  return serviceUrl() + 'u/umember/member/editinfo';
}

//修改个人资料
function EDIT_USER_PREFECT() {
  return serviceUrl() + 'u/umember/member/saveinfo';
}

//获取验证码
function GET_CODE() {
  return serviceUrl() + 'u/base/register/get-code';
}

//储值活动
function GET_STORED() {
  return serviceUrl() + 'yx/urecharge/activity/index';
}

//获取买单页会员信息
function GET_MEMBERINFO() {
  return serviceUrl() + 'syt/utrade/member/get-member-info';
}

//创建订单
function GET_ADDORDER() {
  return serviceUrl() + 'syt/utrade/order/add';
}

//计算优惠
function GET_NEDPAY() {
  return serviceUrl() + 'syt/utrade/member/count-need-pay';
}

//取消订单
function CANCELORDER() {
  return serviceUrl() + 'syt/utrade/order/cancel';
}

//用户订单列表
function ORDERLIST() {
  return serviceUrl() + 'data/ufinance/order/order-list';
}

//用户订单详情
function ORDERDETAIL() {
  return serviceUrl() + 'data/ufinance/order/order-detail';
}

//创建储值订单
function ADDRECHARGEORDER() {
  return serviceUrl() + 'syt/utrade/recharge/add';
}

//储值码兑换
function GET_RECHARGECODE() {
  return serviceUrl() + 'syt/utrade/recharge/use-recharge-code';
}

//用户储值订单列表
function RECHARGEORDERLIST() {
  return serviceUrl() + 'data/recharge/order-list';
}

//获取储值余额
function GETPAYMEMBER() {
  return serviceUrl() + 'mall/utrade/pay/member';
}

//优惠页门店列表
function GETSWITCHSTORE() {
  return serviceUrl() + 'sh/umerchant/store/getmarketingstore';
}

//优惠页门店列表详情
function GETSWITCHSTOREDTAIL() {
  return serviceUrl() + 'sh/umerchant/store/getmarketingstoredetail';
}

//会员信息
function GETMEMBERINFO() {
  return serviceUrl() + 'u/umember/member/info';
}

// //创建裂变券
// function GETADDFISSION() {
//   return serviceUrl() + 'yx/uactivity/share/add';
// }

//裂变券详情
function GETFISSION() {
  return serviceUrl() + 'yx/uactivity/share/detail';
}

//优惠券领取
function GETCARDIGN() {
  return serviceUrl() + 'u/umember/wechat/cardsign';
}

//用户储值订单列表
function RECHARGEORDERLIST() {
  return serviceUrl() + 'data/recharge/order-list';
}

//获取储值余额详情
function GETPAYMEMBER() {
  return serviceUrl() + 'mall/utrade/pay/member';
}

//小程序优惠券列表
function GETCOUPONLIST() {
  return serviceUrl() + 'yx/ucoupon/coupon/list';
}

//余额明细
function BALANCEDETAIL() {
  return serviceUrl() + 'yx/urecharge/recharge/list';
}

//异业联盟券
function GETOTHERCOUPON() {
  return serviceUrl() + 'xcx/uxcx/diffindustry/getcoupon';
}


//微信支付
function PAYMENTSUCCESS() {
  return serviceUrl() + 'xcx/uxcx/pay/pay';
}

// //异业领取
// function DIFFERENT() {
//   return loginBaseUrl() + 'u/coupon/get-coupon';
// }

//储值支付
function SETPAYMEMBER() {
  return payBaseUrl() + 'gateway';
}

//储值微信支付
function RECMENTSUCCESS() {
  return serviceUrl() + 'xcx/uxcx/pay/rechargepay';
}

//访问量统计
function GETVISIT() {
  return serviceUrl() + 'xcx/uxcx/visit/add';
}
//优惠券详情
function COUPONDETAIL() {
  return serviceUrl() + 'yx/ucoupon/coupon/detail';
}

//新人领券
function NEWPEOPLEGIFT() {
  return serviceUrl() + 'xcx/uxcx/newmember/getcoupon';
}
// 预约  
function APPOINTMENT() {
   return serviceUrl() + 'xcx/uxcx/reserve/add-reservation';
}
// 会员开卡
function GETMCARD() {
   return serviceUrl() + 'yx/ucard/card/cardurl';
}
// 会员激活
function CARDACTIVE() {
   return serviceUrl() + 'yx/ucard/card/cardactive';
}

//聊天服务器地址
function CHATURL() {
   return chatBaseUrl();
}

//聊天用户信息
function CHAT() {
   return serviceUrl() + 'u/base/util/chat';
}

//预约页面数据
function ACTIVITY() {
   return serviceUrl() + 'xcx/uxcx/reserve/activity';
}

//预约提交
function ACTIVITY_ADD() {
   return serviceUrl() + 'xcx/uxcx/reserve/add';
}

//预约列表
function RECORD() {
	return serviceUrl() + 'xcx/uxcx/reserve/record';
}

//预约详情
function DETAILRECORD() {
	return serviceUrl() + 'xcx/uxcx/reserve/detailrecord';
}

// 注册方式
function REGISTERRULE() {
	return serviceUrl() + 'sh/umerchant/merchant/registerrule';
}

//微信手机号授权
function PHONE_REGISTER() {
	return serviceUrl() + 'u/umember/register/wechatmobileregister';
}

//手机号注册
function GET_CODE() {
	return serviceUrl() + 'u/umember/register/get-message-code';
}

// 发送验证码
function PHONE_CODE() {
	return serviceUrl() + 'u/umember/register/mobileregister';
}

// 会员卡激活方式
function ACTIVETYPE() {
	return serviceUrl() + 'yx/ucard/card/activetype';
}

//建立调用
module.exports = {
	//会员卡激活方式
	ACTIVETYPE: ACTIVETYPE,	
	//发送验证码
	PHONE_CODE: PHONE_CODE,
	//手机号注册
	GET_CODE: GET_CODE,
  // 微信手机号授权
	PHONE_REGISTER: PHONE_REGISTER,
// 注册方式
	REGISTERRULE: REGISTERRULE,
	// 上传图片
	UPLOADINGIMGURL: UPLOADINGIMGURL,
  //首页地址
  GETPAGEINFO: GETPAGEINFO,
  //门店列表地址
  GETSTORELIST: GETSTORELIST,
  //相册类型
  GETTABLBUMTYPE: GETTABLBUMTYPE,
  //相册列表
  GETALBUMLIST: GETALBUMLIST,
  //获取openId
  OPENID: OPENID,
  //openid登录
  OPENID_LOGIN: OPENID_LOGIN,
  //openid注册
  REGISTER: REGISTER,
  //获取会员信息
  USER_HOME: USER_HOME,
  //获取个人资料
  USER_PREFECT: USER_PREFECT,
  //修改个人资料
  EDIT_USER_PREFECT: EDIT_USER_PREFECT,
  //获取验证码
  GET_CODE: GET_CODE,
  //优惠页
  GETDWTAIL: GETDWTAIL,
  //储值
  GET_STORED: GET_STORED,
  //获取买单页会员信息
  GET_MEMBERINFO: GET_MEMBERINFO,
  //创建订单
  GET_ADDORDER: GET_ADDORDER,
  //计算优惠
  GET_NEDPAY: GET_NEDPAY,
  //储值卡兑换
  GET_RECHARGECODE: GET_RECHARGECODE,
  //消费记录列表
  ORDERLIST: ORDERLIST,
  //取消订单
  CANCELORDER: CANCELORDER,
  //用户订单详情
  ORDERDETAIL: ORDERDETAIL,
  //创建储值订单
  ADDRECHARGEORDER: ADDRECHARGEORDER,
  //用户储值订单列表
  RECHARGEORDERLIST: RECHARGEORDERLIST,
  //版本控制
  GET_EDITION: GET_EDITION,
  //获取用户储值余额
  GETPAYMEMBER: GETPAYMEMBER,
  //优惠页门店列表
  GETSWITCHSTORE: GETSWITCHSTORE,
  //优惠页门店列表详情
  GETSWITCHSTOREDTAIL: GETSWITCHSTOREDTAIL,
  //会员信息
  GETMEMBERINFO: GETMEMBERINFO,
  // //创建裂变券
  // GETADDFISSION: GETADDFISSION,
  //裂变券详情
  GETFISSION: GETFISSION,
  //优惠券领取
  GETCARDIGN: GETCARDIGN,
  //获取用户储值余额
  GETPAYMEMBER: GETPAYMEMBER,
  //小程序优惠券列表
  GETCOUPONLIST: GETCOUPONLIST,
  //余额明细
  BALANCEDETAIL: BALANCEDETAIL,
  //异业联盟券
  GETOTHERCOUPON: GETOTHERCOUPON,
  //储值支付
  SETPAYMEMBER: SETPAYMEMBER,
  //微信支付
  PAYMENTSUCCESS: PAYMENTSUCCESS,
  //异业领取
  // DIFFERENT: DIFFERENT,
  //储值微信支付
  RECMENTSUCCESS: RECMENTSUCCESS,
  //统计访问量
  GETVISIT: GETVISIT,
  // 优惠券详情
  COUPONDETAIL: COUPONDETAIL,
  //新人礼包
  NEWPEOPLEGIFT: NEWPEOPLEGIFT,
  // 预约
  APPOINTMENT: APPOINTMENT,
  //会员开卡
  GETMCARD: GETMCARD,
//   会员卡激活
  CARDACTIVE: CARDACTIVE,
//   聊天服务器地址
  CHATURL: CHATURL,
//   聊天用户信息
  CHAT: CHAT,
//   预约页面数据、
  ACTIVITY: ACTIVITY,
   // 预约提交
  ACTIVITY_ADD: ACTIVITY_ADD,
//   预约列表
  RECORD: RECORD,
//   预约详情
  DETAILRECORD: DETAILRECORD,
}