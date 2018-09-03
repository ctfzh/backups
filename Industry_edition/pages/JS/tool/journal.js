// 控制台日志输出JS
var printType = true;//true  false 打印输出日志
function myconsole(string) {
  if (printType) {
    console.log(string);
  }
}
 

//建立调用
module.exports = {
  myconsole: myconsole,
 }