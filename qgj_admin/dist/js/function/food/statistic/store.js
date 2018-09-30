/**
 * 门店统计
 */

$(function () {
    //时间
    util.daterangepicker("time", false);
    //昨日
    $(".yesterdayMoment").click(function(){
        $("#time").val(util.yesterday());
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
    });
    //7日
    $("#sevenMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(6))
    });
    //30日
    $("#thirtyMoment").click(function(){
        $(this).addClass("btn-primary").siblings().removeClass("btn-primary");
        $("#time").val(util.getDayRange(29))
    });
});