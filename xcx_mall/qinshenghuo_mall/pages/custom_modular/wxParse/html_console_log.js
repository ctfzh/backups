//富文本输出日志管理
var printType = false;//true 打印输出日志
function myconsole(string) {
  if (printType) {
    console.log(string);
  }
}

//建立调用
module.exports = {
  myconsole: myconsole,
  printType: printType,
}