/*
* 渠道管理
* */

$(function () {
    $(".js-del").click(function () {
       layer.confirm('删除后将不能继续识别该渠道数据！',{
           title:'删除渠道'
       },function () {
           //确定方法
       })
    });
});