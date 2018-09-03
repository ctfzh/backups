//服务器地址JS
/**===================================================  服务器地址  start   ====================================================== */

//服务器环境 1、测试环境   2、验收环境   3、正式环境
var ceshi_service = 1;

// 服务器地址
function serviceUrl() {
  if (ceshi_service == 1) {
    //测试地址
     // return 'https://hdapitest.alittle-tea.com/';
    return 'https://apitest.qinguanjia.com/';  
  } else if (ceshi_service == 2) {
    //验收地址
    return 'https://apimaster.qinguanjia.com/';
  } else if (ceshi_service == 3) {
    //正式地址
    return 'https://api.qinguanjia.com/';
  }
}

//聊天服务器地址
function chatBaseUrl() {
  if (ceshi_service == 1) {
    //测试地址
    return 'wss://chattest1.qinguanjia.com';
  } else if (ceshi_service == 2) {
    //验收地址
    return 'wss://chattest1.qinguanjia.com';
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

/**===================================================  服务器地址  end   ====================================================== */

//版本控制
function GET_EDITION() {
  return serviceUrl() + 'sh/umerchant/merchant/getinfo';
}

//获取openId
function OPENID() {
  return serviceUrl() + 'u/umember/wechat/decrypt-data';
}

//微信手机号授权
function PHONE_REGISTER() {
	return serviceUrl() + 'u/umember/register/wechatmobileregister';
}

//商品数据
function GET_GOOODS() {
  return serviceUrl() + 'cy/ugoods/goods/list';
}

//商品规格
function GETSKU() {
  return serviceUrl() + 'cy/ugoods/goods/category-list';
}

//计算金额
function COUNT_ORFER_MONEY() {
  return serviceUrl() + 'cy/uorder/order/count-order-money';
}

//商品列表门店信息
function GOODS_STORE_DEAIL() {
  return serviceUrl() + 'cy/ustore/store/detail';
}

//新增收货地址
function ADDADDRESSGET() {
  return serviceUrl() + 'u/umember/takeaway-address/add';
}
//收货地址列表
function ADDADDRESSLIST() {
  return serviceUrl() + 'u/umember/takeaway-address/list';
}

//收货地址详情
function ADDRESSDETAIL() {
  return serviceUrl() + 'u/umember/takeaway-address/detail';
}

// 编辑收货地址
function EDITADDRESS() {
  return serviceUrl() + 'u/umember/takeaway-address/edit';
}
// 删除收货地址
function DELETEADDRESS() {
  return serviceUrl() + 'u/umember/takeaway-address/delete';
}

//获取会员信息
function USER_HOME() {
  return serviceUrl() + 'u/umember/member/info';
}
//获取订单列表
function GET_ORDER_LIST() {
  return serviceUrl() + 'cy/uorder/order/list';
}
//获取订单详情
function GET_ORDER_DETAIL() {
  return serviceUrl() + 'cy/uorder/order/detail';
}

//门店列表
function STORE_LIST() {
  return serviceUrl() + 'cy/ustore/store/list';
}

//提交订单
function ADD_ORDER() {
  return serviceUrl() + 'cy/uorder/order/add';
}

//微信支付
function PAYMENTSUCCESS() {
  return serviceUrl() + 'cy/uorder/pay/wechatpay';
}

//评价
function COMMENT_ADD() {
  return serviceUrl() + 'cy/ucomment/comment/add';
}

//时间段
function TIME_SELECT() {
  return serviceUrl() + 'cy/ustore/set/time-select';
}

//手机号注册
function GET_CODE() {
	return serviceUrl() + 'u/umember/register/get-message-code';
}

// 首页数据
function GETHOME() {
  return serviceUrl() + 'cy/uhome/indexpage/detail';
}

// 发送验证码
function PHONE_CODE() {
	return serviceUrl() + 'u/umember/register/mobileregister';
}

// 取消订单
function CANCELORDER() {
  return serviceUrl() +'cy/uorder/order/cancel';
}
// 配送员位置
function CORPOSITION() {
  return serviceUrl() +'cy/uorder/order/courierposition';
}
// 订单追踪
function ORDERLOG() {
  return serviceUrl() +'cy/uorder/order/orderlog';
}

// openid获取统计
function NEWMEMBER() {
   return serviceUrl() + 'cy/uhome/visit/newmember';
}

// 页面浏览统计
function VISIT() {
   return serviceUrl() + 'cy/uhome/visit/visit';
}

//使用须知
function INSTRUCTIONS() {
	return serviceUrl() + 'cy/uset/instructions/detail';
}

//地址详情接口
function GETADDRESS() {
	return serviceUrl() + 'cy/ustore/store/getaddress';
}

//点餐模式
function GETMERCHANTSET() {
	return serviceUrl() + 'cy/uset/set/get-merchant-set';
}

//校验桌台id
function CHRCK_VALID() {
	return serviceUrl() + 'cy/shstore/table/check-valid';
}



//建立调用
module.exports = {
  //版本控制
  GET_EDITION: GET_EDITION,
  //获取openId
  OPENID: OPENID,
  // 微信手机号授权
  PHONE_REGISTER,
  //商品数据
  GET_GOOODS: GET_GOOODS,
  //商品规格
  GETSKU: GETSKU,
  // 计算金额
  COUNT_ORFER_MONEY: COUNT_ORFER_MONEY,
  // 商品列表门店信息
  GOODS_STORE_DEAIL: GOODS_STORE_DEAIL,
  // 新增收货地址
  ADDADDRESSGET: ADDADDRESSGET,
  //收货地址列表
  ADDADDRESSLIST: ADDADDRESSLIST,
  //收货地址详情
  ADDRESSDETAIL: ADDRESSDETAIL,
  // 编辑收货地址
  EDITADDRESS: EDITADDRESS,
  // 删除收货地址
  DELETEADDRESS: DELETEADDRESS,
  //获取会员信息
  USER_HOME: USER_HOME,
  //获取订单列表
  GET_ORDER_LIST: GET_ORDER_LIST,
  //获取订单详情
  GET_ORDER_DETAIL: GET_ORDER_DETAIL,
  //门店列表
  STORE_LIST: STORE_LIST,
  //提交订单
  ADD_ORDER: ADD_ORDER,
  //微信支付
  PAYMENTSUCCESS: PAYMENTSUCCESS,
  //评价
  COMMENT_ADD: COMMENT_ADD,
  // 时间段
  TIME_SELECT: TIME_SELECT,
  //手机号注册
  GET_CODE: GET_CODE,
  //获取首页数据
  GETHOME: GETHOME,
  //发送验证码
  PHONE_CODE: PHONE_CODE,
  // 取消订单
  CANCELORDER: CANCELORDER,
  // 配送员位置
  CORPOSITION: CORPOSITION,
  // 订单追踪
  ORDERLOG: ORDERLOG,
//   openid获取统计
  NEWMEMBER: NEWMEMBER,
//   页面浏览统计
  VISIT: VISIT,
  //使用须知
  INSTRUCTIONS: INSTRUCTIONS,
  //地址详情接口
  GETADDRESS: GETADDRESS,
  //点餐模式
	GETMERCHANTSET: GETMERCHANTSET,
	// 校验桌台id
	CHRCK_VALID: CHRCK_VALID,
}

