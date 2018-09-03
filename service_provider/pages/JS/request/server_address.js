//服务器地址JS
/**===================================================  服务器地址  start   ====================================================== */

//服务器环境 1、测试环境   2、验收环境   3、正式环境
var ceshi_service = 1;

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



//建立调用
module.exports = {
  //版本控制
  GET_EDITION: GET_EDITION,
}

