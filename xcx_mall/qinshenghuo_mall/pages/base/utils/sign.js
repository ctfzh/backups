var md5 = require('md5.js')
var utils = require('utils.js')

//==========================生成签名的方法（key固定）========================================================================

function sign(arr) {
  var key = {
    'key': 'c92f365233d1c553385341f4ba342cc5',
  }
  //将key添加进去
  // arr.push(key);
  arr = Object.assign(arr, key);
  //进行排序
  var signArr = objKeySort(arr);
  var sign = '';
  //组装签名
  var i = 0;
  for (var Key in signArr) {
    if (i > 0) {
      sign = sign + '&';
    }
    sign = sign + Key + '=' + signArr[Key];
    i++;
  }
  i = 0;

  utils.myconsole('参与签名的参数：' + sign);
  //MD5加密
  var signstring = md5.md5(sign).toUpperCase();

  utils.myconsole('签名：sign=' + signstring);
  return signstring;
}


//排序的函数 根据对象集中的key进行排序
function objKeySort(obj) {
  var newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj;//返回排好序的新对象
}

// 获取商户id  17163168 测试商户奥斯卡   12196236  测试菠萝家 12196236 正式菠萝家   a0000001
function getMchid() {
  //先获取商户id
//   try {
//     var merchant_no = wx.getStorageSync('merchant_no')
//     if (merchant_no) {
//       return merchant_no;
//     } else {
//       return '';
//     }
//   } catch (e) {
//     return '';
//   }
    return '17163168';
}

//从自定义文件中获取商户号
function getExtMchid(success, fail) {
  success();
//   try {
//     var merchant_no = wx.getStorageSync('merchant_no')
//     if (merchant_no) {
//       success();
//     } else {
//       if (wx.getExtConfig) {
//         wx.getExtConfig({
//           success: function (res) {
//             utils.myconsole('获取自定义信息：')
//             utils.myconsole(res)
//             //获取商户id
//             utils.myconsole('获取商户id：')
//             utils.myconsole(res.extConfig.merchant_no);

//             if (res.extConfig.merchant_no){
//               //储存商户id
//               try {
//                 wx.setStorageSync('merchant_no', res.extConfig.merchant_no)
//               } catch (e) {
//               }
//               success();
//             }else{
//               fail();
//             }
            
//           }
//         })
//       } else {
//         wx.showModal({
//           title: '提示',
//           content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
//         })
//         fail();
//       }
//     }
//   } catch (e) {
//     fail();
//   }
}



// 获取token
function getToken(go) {
  try {
    var token = wx.getStorageSync('token')
    if (token) {
      return token;
    } else {
        return '';
    }
  } catch (e) {
    return '';
  }
}


//建立调用
module.exports = {
  sign: sign,
  getMchid: getMchid,
  getToken: getToken,
  getExtMchid: getExtMchid,
}