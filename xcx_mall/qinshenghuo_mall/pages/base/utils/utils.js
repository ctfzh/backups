// 工具方法
//输入日志
var printType = true;//true false 打印输出日志
function myconsole(string) {
  if (printType) {
    console.log(string);
  }
}


//单击事件控制器 防止多次触发
var time = 0;
function MyOnclick(success) {
  //判断计时器是否处于关闭状态
  if (time == 0) {
    time = 1; //设定间隔时间（秒）


    //启动计时器，倒计时time秒后自动关闭计时器。
    var index = setInterval(function () {
      time--;
      if (time == 0) {
        clearInterval(index);
      }
    }, 1000);
    success();
    myconsole("触发点击事件");
    // alert('按钮事件被触发');
  } else {
    // alert('目前按钮事件不允许被触发');
    myconsole("不允许触发点击事件");
  }
}

function imageSheet(that, success, fail) {
  wx.showActionSheet({
    itemList: ['拍照', '相册'],
    success: function (res) {
      myconsole(res.tapIndex)
      var sourceType = [];
      if (res.tapIndex == 0) {
        sourceType[0] = 'camera';
      }
      if (res.tapIndex == 1) {
        sourceType[0] = 'album';
      }
      myconsole("选中的内容：" + res.tapIndex)
      wx.chooseImage({
        count: 1, // 默认9
        sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          myconsole('传过来的图片地址：' + res.tempFilePaths);
          success(res.tempFilePaths);
        }
      })
    },
    fail: function (res) {
      myconsole(res.errMsg);
      fail(res.errMsg);
    }
  })
}



//建立调用
module.exports = {
  myconsole: myconsole,
  printType: printType,
  MyOnclick: MyOnclick,
  imageSheet: imageSheet,
}