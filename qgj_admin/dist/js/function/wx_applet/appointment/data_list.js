/**
 * 预约活动--数据列表
 */

$(function () {
    //时间
    util.daterangepicker("time", false);

    //确定
    $("#time").on('apply.daterangepicker',function(){
        console.log(1)
    });
    //取消
    $("#time").on('cancel.daterangepicker',function(){
        console.log(2)
    });
    //清除
    $("#time").on('clean.daterangepicker',function(){
        console.log(3)
    });
});