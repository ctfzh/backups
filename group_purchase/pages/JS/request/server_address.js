//服务器地址JS
/**===================================================  服务器地址  start   ====================================================== */

//服务器环境 1、测试环境   2、验收环境   3、正式环境
var ceshi_service = 3;

// 服务器地址
function serviceUrl() {
  if (ceshi_service == 1) {
    //测试地址
     return 'https://hdapitest.alittle-tea.com/';
  } else if (ceshi_service == 2) {
    //验收地址
	  return 'https://hdapimaster.alittle-tea.com/';
  } else if (ceshi_service == 3) {
    //正式地址
	  return 'https://hdapi.alittle-tea.com/';
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


//建立调用
module.exports = {
  //版本控制
  GET_EDITION: GET_EDITION,
  //获取openId
  OPENID: OPENID,
  // 微信手机号授权
  PHONE_REGISTER,
}

