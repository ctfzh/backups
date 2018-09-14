// 网络请求管理
var utils = require('utils.js');
var MyHttp = require('httpurl.js');

//不带code msg的接口请求工具
function request_data(url, data, success, fail, complete) {
  utils.myconsole("网络请求的地址：" + url);
  utils.myconsole("传过来的参数：");
  utils.myconsole(data);
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'GET',
    data: data,
    //请求成功
    success: function (res) {
      if (res.data.errCode == 0) {
        success(res.data.data);
      } else if (res.data.errCode == 10002) {
        //储存token
				try {
					wx.setStorageSync('token', '')
        } catch (e) {
			}
			fail(10002);//登录失效
      } else if (res.data.errCode == 310001) {
        //不是分销商
        fail(1);
      } else if (res.data.errCode == 310006){
        //分销功能已关闭
        fail(2);
      } else if (res.data.errCode == 310007) {
        //分销申请功能已关闭
        fail(3);
      } else {
			fail(res.data.errMsg ? res.data.errMsg : null);
      }
    },
    //请求失败
    fail: function (res) {
		 fail(404);
	  },
	  //请求结束
	  complete: function (res) {
		  complete(res);
	  }
  });
};


//带code msg的接口请求工具
function request_data_new(url, data, success, message, fail, complete) {
  utils.myconsole("网络请求的地址：" + url);
  utils.myconsole("传过来的参数：");
  utils.myconsole(data);
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'GET',
    data: data,
    //请求成功
    success: function (res) {
      if (res.data.errCode == 0) {
        success(res.data.data);
      } else if (res.data.errCode == 10002) {
        //储存token
        try {
          wx.setStorageSync('token', '')
        } catch (e) {

			}
			fail(10002);//登录失效
      } else {
        message(res.data.errCode, res.data.errMsg);
      }
    },
    //请求失败
	  fail: function (res) {
		  fail(404);
	  },
	  //请求结束
	  complete: function (res) {
		  complete(res);
	  }
  });
};


function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
};
/**
  * =========================图片上传工具=====================
  *
  * imgPath:图片的路径
  * folder:上传图片的目录
  * fileName：图片对应的key file
  * success:成功的回调
  * faill:失败的回调
  */
function uploadImg(that, folder, imgPath, fileName, success, fail) {

  wx.showLoading({
    title: '加载中...',
    mask: true,
  })

  wx.uploadFile({
    url: MyHttp.UPLOADINGIMGURL(),
    filePath: imgPath,
    name: fileName,
    formData: {
      'folder': folder
    },
    success: function (res) {
      wx.hideLoading();
      utils.myconsole("上传成功返回的数据：");
      utils.myconsole(res);
      success(JSON.parse(res.data));
    },
    fail: function (res) {
      fail(res);
      wx.hideLoading();
    }
  })


}


//建立调用
module.exports = {
  request_data: request_data,
  request_data_new: request_data_new,
  uploadImg: uploadImg,
}